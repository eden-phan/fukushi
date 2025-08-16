<?php

namespace Modules\Consultation\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Consultation\Models\Consultation;
use Modules\FamilyMember\Models\FamilyMember;
use Modules\ServiceUserFamilyMember\Models\ServiceUserFamilyMember;
use Modules\ServiceUser\Models\ServiceUser;
use Illuminate\Support\Arr;
use Modules\Profile\Models\Profile;
use Illuminate\Support\Facades\DB;

class ConsultationRepository extends BaseRepository
{

    protected $familyMemberModel;

    protected $serviceUserFamilyMemberModel;

    protected $serviceUserModel;

    protected $profileModel;


    public function __construct(
        Consultation $model,
        FamilyMember $familyMemberModel,
        ServiceUserFamilyMember $serviceUserFamilyMemberModel,
        ServiceUser $serviceUserModel,
        Profile $profileModel,
    ) {
        $this->_model = $model;
        $this->familyMemberModel = $familyMemberModel;
        $this->serviceUserFamilyMemberModel = $serviceUserFamilyMemberModel;
        $this->serviceUserModel = $serviceUserModel;
        $this->profileModel = $profileModel;
    }

    public function getModel()
    {
        return Consultation::class;
    }

    public function getAllConsultation(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['staff', 'creator', 'facility', 'referralFacility']
    ) {
        $query = $this->_model->with($with);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            if (!empty($filters['date_from'])) {
                $query->whereDate('date', '>=', $filters['date_from']);
            }

            if (!empty($filters['date_to'])) {
                $query->whereDate('date', '<=', $filters['date_to']);
            }

            if (!empty($filters['status'])) {
                $query->where('desired_use_status', $filters['status']);
            }

            if (!empty($filters['accept_status'])) {
                $query->where('accept_status', $filters['accept_status']);
            }

            if (!empty($filters['facility'])) {
                if (!empty($filters['facility'])) {
                    $query->whereHas('facility', function ($q) use ($filters) {
                        $q->where('name', 'like', '%' . $filters['facility'] . '%');
                    });
                }
            }
        }


        $query->orderBy($sortBy, $sortDirection);

        $result = $query->paginate($perPage, ['*'], 'page', $page)
            ->appends([
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'search' => $search,
                'filters' => $filters,
            ]);

        return $result;
    }

    public function findConsultationById($id, $with = ['staff', 'creator'])
    {
        $consultation = $this->_model->with($with)->find($id);

        if (!$consultation) {
            return null;
        }

        return $consultation;
    }


    public function rejectConsultation($id)
    {
        $consultation = $this->_model->find($id);

        if (!$consultation) return false;

        $consultation->accept_status = Consultation::REJECTED;
        $consultation->save();
        return $consultation;
    }

    public function acceptConsultation($id)
    {
        $consultation = $this->_model->find($id);

        if (!$consultation) return false;

        return DB::transaction(function () use ($consultation) {
            $consultation->accept_status = Consultation::ACCEPTED;
            $consultation->save();

            $serviceUser = $this->serviceUserModel->create([
                'facility_id' => $consultation->referral_facility_id,
                'created_by' => auth()->id(),
            ]);

            $this->profileModel->create([
                'user_id' => $serviceUser->id,
                'user_type' => 'service_user',
                'fullname' => $consultation->full_name,
                'furigana' => $consultation->furigana,
                'dob' => $consultation->dob,
                'phone_number' => $consultation->telephone,
                'postal_code' => $consultation->postal_code,
                'prefecture' => $consultation->prefecture,
                'district' => $consultation->district,
                'address' => $consultation->address,
            ]);

            $serviceUserFamilyMembers = $this->serviceUserFamilyMemberModel
                ->where('consultation_id', $consultation->id)
                ->get();

            foreach ($serviceUserFamilyMembers as $member) {
                $member->update([
                    'service_user_id' => $serviceUser->id,
                ]);
            }

            return $consultation;
        });
    }

    public function createConsultationWithFamilyMember(array $data)
    {
        $consultationData = $data['consultation'] ?? [];
        $familyMembersData = $data['family_members'] ?? [];

        /** Create consultation */
        $consultation = $this->_model->create($consultationData);

        /** Create family members and attach consultation */
        $familyMemberIds = [];
        foreach ($familyMembersData as $memberData) {
            $newFamilyMember = $this->familyMemberModel->create($memberData);
            $familyMemberIds[] = $newFamilyMember->id;
        }
        $consultation->familyMembers()->attach($familyMemberIds);

        /** Create service user*/
        // if ($consultationData['desired_use_status'] == 2) {
        //     $serviceUser = $this->serviceUserModel->create([
        //         'facility_id' => $consultationData["referral_facility_id"],
        //         'created_by' => $consultationData["created_by"],
        //     ]);

        //     $this->profileModel->create([
        //         'user_id' => $serviceUser->id,
        //         'user_type' => 'service_user',
        //         'fullname' => $consultationData["full_name"],
        //         'furigana' => $consultationData["furigana"],
        //         'dob' => $consultationData["dob"],
        //         'phone_number' => $consultationData["telephone"],
        //         'postal_code' => $consultationData["postal_code"],
        //         'prefecture' => $consultationData["prefecture"],
        //         'district' => $consultationData["district"],
        //         'address' => $consultationData["address"],
        //     ]);

        //     $serviceUserFamilyMembers = $this->serviceUserFamilyMemberModel
        //         ->where('consultation_id', $consultation->id)
        //         ->get();

        //     foreach ($serviceUserFamilyMembers as $member) {
        //         $member->update([
        //             'service_user_id' => $serviceUser->id,
        //         ]);
        //     }
        // }

        return $consultation;
    }

    public function updateConsultationWithFamilyMember($id, array $data)
    {
        $consultation = $this->_model->find($id);
        if (!$consultation) throw new \Exception("Consultation not found with ID: $id");

        /**Use for checking status when create a profile */
        // $desiredUseStatus = $consultation->desired_use_status;

        $consultationData = $data['consultation'] ?? [];
        $familyMembersData = $data['family_members'] ?? [];

        if (!$consultation) return null;

        $consultation->update($consultationData);

        $existingLinks = $this->serviceUserFamilyMemberModel
            ->where('consultation_id', $id)
            ->get();

        $serviceUserId = optional($existingLinks->first())->service_user_id;

        /**Create a profile */
        // if ($consultationData['desired_use_status'] === 2) {
        //     if ($desiredUseStatus !== $consultationData['desired_use_status']) {
        //         $serviceUser = $this->serviceUserModel->create([
        //             'facility_id' => $consultationData["referral_facility_id"],
        //             'created_by' => $consultationData["created_by"],
        //         ]);

        //         $this->profileModel->create([
        //             'user_id' => $serviceUser->id,
        //             'user_type' => 'service_user',
        //             'fullname' => $consultationData["full_name"],
        //             'furigana' => $consultationData["furigana"],
        //             'dob' => $consultationData["dob"],
        //             'phone_number' => $consultationData["telephone"],
        //             'postal_code' => $consultationData["postal_code"],
        //             'prefecture' => $consultationData["prefecture"],
        //             'district' => $consultationData["district"],
        //             'address' => $consultationData["address"],
        //         ]);

        //         $serviceUserId = $serviceUser->id;
        //     }
        // }

        $existingFamilyMemberIds = $existingLinks->pluck('family_member_id')->toArray();

        $incomingIds = collect($familyMembersData)
            ->pluck('id')
            ->toArray();

        $idsToDelete = array_diff($existingFamilyMemberIds, $incomingIds);
        if (!empty($idsToDelete)) {
            $this->serviceUserFamilyMemberModel
                ->where('consultation_id', $id)
                ->whereIn('family_member_id', $idsToDelete)
                ->delete();
        }

        $familyMemberIdsToAttach = [];

        foreach ($familyMembersData as $memberData) {
            if (isset($memberData['id']) && in_array($memberData['id'], $existingFamilyMemberIds)) {
                $this->familyMemberModel
                    ->where('id', $memberData['id'])
                    ->update($memberData);
                $familyMemberIdsToAttach[] = $memberData['id'];
            } else {
                $newMemberInputData = Arr::except($memberData, ['id']);
                $newMember = $this->familyMemberModel->create($newMemberInputData);
                $familyMemberIdsToAttach[] = $newMember->id;
            }
        }

        foreach ($familyMemberIdsToAttach as $familyMemberId) {
            $this->serviceUserFamilyMemberModel->updateOrCreate(
                [
                    'consultation_id' => $id,
                    'family_member_id' => $familyMemberId,
                ],
                [
                    'service_user_id' => $serviceUserId,
                ]
            );
        }

        return $consultation->load('familyMembers');
    }

    public function deleteConsultation($id)
    {
        $consultation = $this->_model->find($id);

        if (!$consultation) {
            return false;
        }

        $consultation->delete();

        return true;
    }
}
