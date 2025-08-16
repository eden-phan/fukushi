<?php

namespace Modules\Assessments\Repositories;

use Illuminate\Support\Facades\DB;
use Modules\Assessments\Model\Assessments;
use Modules\Assessments\Model\LivingDomainAssessment;
use Modules\Assessments\Model\MedicalDisabilityHistory;
use Modules\Core\Repositories\BaseRepository;

class AssessmentRepository extends BaseRepository
{
    protected $model;
    protected $livingDomainAssessment;
    protected $medicalDisabilityHistory;

    public function __construct(
        Assessments $model,
        LivingDomainAssessment $livingDomainAssessment,
        MedicalDisabilityHistory $medicalDisabilityHistory
    ) {
        $this->model = $model;
        $this->livingDomainAssessment = $livingDomainAssessment;
        $this->medicalDisabilityHistory = $medicalDisabilityHistory;
    }

    public function getModel()
    {
        return Assessments::class;
    }

    public function getListAssessments($id, $perPage = 10, $page = 1, $year = null)
    {
        $query = $this->model->with([
            'serviceUser.profile',
            'serviceUser.medicalDisabilityHistory' => function($q) {
                $q->orderBy('date', 'desc');
            },
            'livingDomains'
        ])
            ->where('service_user_id', $id)
            ->orderBy('created_at', 'desc');

        if ($year) {
            $query->whereYear('created_at', $year);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function getAssessment($id)
    {
        return $this->model->with([
            'serviceUser.profile',
            'serviceUser.medicalDisabilityHistory' => function($q) {
                $q->orderBy('date', 'desc');
            },
            'livingDomains',
            'staff',
            'creator'
        ])->find($id);
    }

    public function createAssessment(array $data)
    {
        $livingDomains = $data['living_domains'] ?? [];
        $medicalDisabilityHistory = $data['medical_disability_history'] ?? [];
        unset($data['living_domains'], $data['medical_disability_history']);

        DB::beginTransaction();
        try {
            $data['created_by'] = auth()->id();
            $assessment = $this->model->create($data);

            if (!empty($livingDomains)) {
                foreach ($livingDomains as $domain) {
                    $domain['assessment_id'] = $assessment->id;
                    $this->livingDomainAssessment->create($domain);
                }
            }

            if (!empty($medicalDisabilityHistory)) {
                foreach ($medicalDisabilityHistory as $history) {
                    $history['service_user_id'] = $assessment->service_user_id;
                    $this->medicalDisabilityHistory->create($history);
                }
            }

            DB::commit();
            return $this->getAssessment($assessment->id);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateAssessment($id, array $data)
    {
        $assessment = $this->model->find($id);
        if (!$assessment) {
            return null;
        }

        $livingDomains = $data['living_domains'] ?? [];
        $medicalDisabilityHistory = $data['medical_disability_history'] ?? [];
        unset($data['living_domains'], $data['medical_disability_history']);

        DB::beginTransaction();
        try {
            $assessment->update($data);

            if (!empty($livingDomains)) {
                foreach ($livingDomains as $domain) {
                    if (isset($domain['id']) && !empty($domain['id'])) {
                        $domainModel = $this->livingDomainAssessment->find($domain['id']);
                        if ($domainModel && $domainModel->assessment_id == $assessment->id) {
                            $domainModel->update($domain);
                        }
                    } else {
                        $domain['assessment_id'] = $assessment->id;
                        $this->livingDomainAssessment->create($domain);
                    }
                }
            }

            if (!empty($medicalDisabilityHistory)) {
                $submittedIds = [];
                foreach ($medicalDisabilityHistory as $history) {
                    if (isset($history['id']) && !empty($history['id']) && is_numeric($history['id'])) {
                        $submittedIds[] = (int)$history['id'];
                    }
                }

                $existingRecords = $this->medicalDisabilityHistory
                    ->where('service_user_id', $assessment->service_user_id)
                    ->get()
                    ->keyBy('id');

                $recordsToDelete = $existingRecords->whereNotIn('id', $submittedIds);
                foreach ($recordsToDelete as $record) {
                    $record->delete();
                }

                foreach ($medicalDisabilityHistory as $history) {
                    if (isset($history['id']) && !empty($history['id']) && is_numeric($history['id'])) {
                        $historyId = (int)$history['id'];
                        if ($existingRecords->has($historyId)) {
                            $existingRecord = $existingRecords->get($historyId);
                            $existingRecord->update([
                                'date' => $history['date'],
                                'detail' => $history['detail']
                            ]);
                        }
                    } else {
                        $this->medicalDisabilityHistory->create([
                            'service_user_id' => $assessment->service_user_id,
                            'date' => $history['date'],
                            'detail' => $history['detail']
                        ]);
                    }
                }
            }

            DB::commit();
            return $this->getAssessment($assessment->id);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteAssessment($id)
    {
        $assessment = $this->model->find($id);
        if (!$assessment) {
            return false;
        }

        DB::beginTransaction();
        try {
            $this->livingDomainAssessment->where('assessment_id', $id)->delete();
                        
            $assessment->delete();
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteMedicalDisabilityHistory($historyId, $serviceUserId)
    {
        return $this->medicalDisabilityHistory
            ->where('id', $historyId)
            ->where('service_user_id', $serviceUserId)
            ->delete();
    }
}