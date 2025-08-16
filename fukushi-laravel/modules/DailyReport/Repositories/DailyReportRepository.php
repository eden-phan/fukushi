<?php

namespace Modules\DailyReport\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Core\Repositories\BaseRepository;
use Modules\DailyReport\Model\DailyReport;
use Modules\DailyReport\Model\DailyReportStaffs;
use Modules\DailyReport\Model\DailyReportServiceUsers;
use Modules\Signature\Repositories\SignatureRepository;

class DailyReportRepository extends BaseRepository
{
    protected $model;
    protected $dailyReportStaff;
    protected $dailyReportServiceUser;
    protected $signatureRepository;

    public function __construct(
        DailyReport $model,
        DailyReportStaffs $dailyReportStaff,
        DailyReportServiceUsers $dailyReportServiceUser,
        SignatureRepository $signatureRepository
    ) {
        $this->model = $model;
        $this->dailyReportStaff = $dailyReportStaff;
        $this->dailyReportServiceUser = $dailyReportServiceUser;
        $this->signatureRepository = $signatureRepository;
    }

    public function getModel()
    {
        return DailyReport::class;
    }

    public function getListDailyReports($perPage = 10, $page = 1, $filters = [])
    {
        $query = $this->model->with([
            'dayShiftStaff.profile:user_id,fullname',
            'nightShiftStaff.profile:user_id,fullname',
            'dailyReportStaffs',
            'dailyReportStaffs.staff.profile:user_id,fullname',
            'dailyReportServiceUsers',
            'dailyReportServiceUsers.serviceUser.profile:user_id,fullname',
            'signatures'
        ]);

        if (!empty($filters['keyword'])) {
            $keyword = '%' . $filters['keyword'] . '%';
            $query->where(function ($q) use ($keyword) {
                $q->where('support_content', 'LIKE', $keyword)
                    ->orWhere('work_details', 'LIKE', $keyword)
                    ->orWhere('note', 'LIKE', $keyword);
            });
        }

        if (!empty($filters['work_shift'])) {
            if ($filters['work_shift'] === 'day_shift') {
                $query->whereNotNull('day_shift_staff_id');
            } elseif ($filters['work_shift'] === 'night_shift') {
                $query->whereNotNull('night_shift_staff_id');
            } elseif ($filters['work_shift'] === 'both') {
                $query->whereNotNull('day_shift_staff_id')->whereNotNull('night_shift_staff_id');
            }
        }

        if (!empty($filters['entry_date_from'])) {
            $query->whereDate('entry_date', '>=', $filters['entry_date_from']);
        }
        if (!empty($filters['entry_date_to'])) {
            $query->whereDate('entry_date', '<=', $filters['entry_date_to']);
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function getDailyReport($id)
    {
        return $this->model->with([
            'dayShiftStaff.profile:user_id,fullname',
            'nightShiftStaff.profile:user_id,fullname',
            'dailyReportStaffs',
            'dailyReportStaffs.staff.profile:user_id,fullname',
            'dailyReportServiceUsers',
            'dailyReportServiceUsers.serviceUser.profile:user_id,fullname',
            'signatures'
        ])->find($id);
    }

    public function createDailyReport(array $data)
    {
        Log::info('Creating daily report', ['data' => $data]);
        $dailyReportStaffs = $data['daily_report_staffs'] ?? [];
        $dailyReportServiceUsers = $data['daily_report_service_users'] ?? [];
        $signatures = $data['signatures'] ?? [];
        unset($data['daily_report_staffs'], $data['daily_report_service_users'], $data['signatures']);

        DB::beginTransaction();
        try {
            $data['created_by'] = auth()->id();
            $dailyReport = $this->model->create($data);

            if (!empty($dailyReportStaffs)) {
                foreach ($dailyReportStaffs as $staffEntry) {
                    $staffEntry['daily_report_id'] = $dailyReport->id;
                    $staffEntry['created_by'] = $data['created_by'];
                    $this->dailyReportStaff->create($staffEntry);
                }
            }

            if (!empty($dailyReportServiceUsers)) {
                foreach ($dailyReportServiceUsers as $serviceUserEntry) {
                    $serviceUserEntry['daily_report_id'] = $dailyReport->id;
                    $serviceUserEntry['created_by'] = $data['created_by'];
                    $this->dailyReportServiceUser->create($serviceUserEntry);
                }
            }

            if (!empty($signatures)) {
                foreach ($signatures as $signature) {
                    $this->signatureRepository->create([
                        'document_id' => $dailyReport->id,
                        'document_type' => 'daily_report',
                        'signature_type' => $signature['signature_type'],
                        'signature_value' => $signature['signature_value'],
                        'signed_at' => now(),
                        'signed_by' => auth()->id(),
                    ]);
                }
            }

            DB::commit();
            return $this->getDailyReport($dailyReport->id);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateDailyReport($id, array $data)
    {
        $dailyReport = $this->model->find($id);
        if (!$dailyReport) {
            return null;
        }

        $dailyReportStaffs = $data['daily_report_staffs'] ?? [];
        $dailyReportServiceUsers = $data['daily_report_service_users'] ?? [];
        $signatures = $data['signatures'] ?? [];
        unset($data['daily_report_staffs'], $data['daily_report_service_users'], $data['signatures']);

        DB::beginTransaction();
        try {
            $dailyReport->update($data);

            if (!empty($dailyReportStaffs)) {
                $submittedStaffIds = [];
                foreach ($dailyReportStaffs as $staffEntry) {
                    if (isset($staffEntry['id']) && !empty($staffEntry['id']) && is_numeric($staffEntry['id'])) {
                        $submittedStaffIds[] = (int) $staffEntry['id'];
                    }
                }

                $existingStaffRecords = $this->dailyReportStaff
                    ->where('daily_report_id', $dailyReport->id)
                    ->get()
                    ->keyBy('id');

                $staffRecordsToDelete = $existingStaffRecords->whereNotIn('id', $submittedStaffIds);
                foreach ($staffRecordsToDelete as $record) {
                    $record->delete();
                }

                foreach ($dailyReportStaffs as $staffEntry) {
                    if (isset($staffEntry['id']) && !empty($staffEntry['id']) && is_numeric($staffEntry['id'])) {
                        $staffEntryId = (int) $staffEntry['id'];
                        if ($existingStaffRecords->has($staffEntryId)) {
                            $existingRecord = $existingStaffRecords->get($staffEntryId);
                            $existingRecord->update([
                                'staff_id' => $staffEntry['staff_id'],
                                'work_content' => $staffEntry['work_content'] ?? null,
                                'shift_type' => $staffEntry['shift_type'],
                                'shift_hours' => $staffEntry['shift_hours'] ?? null,
                            ]);
                        }
                    } else {
                        $this->dailyReportStaff->create([
                            'daily_report_id' => $dailyReport->id,
                            'staff_id' => $staffEntry['staff_id'],
                            'work_content' => $staffEntry['work_content'] ?? null,
                            'shift_type' => $staffEntry['shift_type'],
                            'shift_hours' => $staffEntry['shift_hours'] ?? null,
                            'created_by' => auth()->id(),
                        ]);
                    }
                }
            }

            if (!empty($dailyReportServiceUsers)) {
                $submittedServiceUserIds = [];
                foreach ($dailyReportServiceUsers as $serviceUserEntry) {
                    if (isset($serviceUserEntry['id']) && !empty($serviceUserEntry['id']) && is_numeric($serviceUserEntry['id'])) {
                        $submittedServiceUserIds[] = (int) $serviceUserEntry['id'];
                    }
                }

                $existingServiceUserRecords = $this->dailyReportServiceUser
                    ->where('daily_report_id', $dailyReport->id)
                    ->get()
                    ->keyBy('id');

                $serviceUserRecordsToDelete = $existingServiceUserRecords->whereNotIn('id', $submittedServiceUserIds);
                foreach ($serviceUserRecordsToDelete as $record) {
                    $record->delete();
                }

                foreach ($dailyReportServiceUsers as $serviceUserEntry) {
                    if (isset($serviceUserEntry['id']) && !empty($serviceUserEntry['id']) && is_numeric($serviceUserEntry['id'])) {
                        $serviceUserEntryId = (int) $serviceUserEntry['id'];
                        if ($existingServiceUserRecords->has($serviceUserEntryId)) {
                            $existingRecord = $existingServiceUserRecords->get($serviceUserEntryId);
                            $existingRecord->update([
                                'service_user_id' => $serviceUserEntry['service_user_id'],
                                'overnight_stay' => $serviceUserEntry['overnight_stay'] ?? null,
                                'hospitalized' => $serviceUserEntry['hospitalized'] ?? null,
                            ]);
                        }
                    } else {
                        $this->dailyReportServiceUser->create([
                            'daily_report_id' => $dailyReport->id,
                            'service_user_id' => $serviceUserEntry['service_user_id'],
                            'overnight_stay' => $serviceUserEntry['overnight_stay'] ?? null,
                            'hospitalized' => $serviceUserEntry['hospitalized'] ?? null,
                            'created_by' => auth()->id(),
                        ]);
                    }
                }
            }

            if (!empty($signatures)) {
                $this->signatureRepository->deleteByDocument($id, 'daily_report');

                foreach ($signatures as $signature) {
                    $this->signatureRepository->create([
                        'document_id' => $id,
                        'document_type' => 'daily_report',
                        'signature_type' => $signature['signature_type'],
                        'signature_value' => $signature['signature_value'],
                        'signed_at' => now(),
                        'signed_by' => auth()->id(),
                    ]);
                }
            }

            DB::commit();
            return $this->getDailyReport($dailyReport->id);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteDailyReport($id)
    {
        $dailyReport = $this->model->find($id);
        if (!$dailyReport) {
            return false;
        }

        DB::beginTransaction();
        try {
            $this->dailyReportStaff->where('daily_report_id', $id)->delete();
            $this->dailyReportServiceUser->where('daily_report_id', $id)->delete();
            $this->signatureRepository->deleteByDocument($id, 'daily_report');

            $dailyReport->delete();
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}