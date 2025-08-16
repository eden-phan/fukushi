<?php

namespace Modules\ServiceUser\Repositories;


use Modules\Core\Repositories\BaseRepository;
use Modules\ServiceUser\Models\ServiceUser;
use Modules\ServiceUserFamilyMember\Models\ServiceUserFamilyMember;
use Modules\Consultation\Models\Consultation;

class ServiceUserRepository extends BaseRepository
{
    protected $model;

    protected $serviceUserFamilyMember;

    public function __construct(ServiceUser $model, ServiceUserFamilyMember $serviceUserFamilyMember)
    {
        $this->model = $model;
        $this->serviceUserFamilyMember = $serviceUserFamilyMember;
    }

    public function getModel()
    {
        return ServiceUser::class;
    }

    public function getAllFamilyMemberWithServiceUserId($serviceUserId)
    {
        return $this->serviceUserFamilyMember::where('service_user_id', $serviceUserId)
            ->join('family_members', 'service_user_family_member.family_member_id', '=', 'family_members.id')
            ->select([
                'family_members.id as family_member_id',
                'family_members.name as family_member_name'
            ])
            ->get()
            ->toArray();
    }

    public function getAllProfileWithServiceUser()
    {
        return ServiceUser::with('profile')
            ->get()
            ->map(function ($serviceUser) {
                return [
                    'service_user_id' => $serviceUser->id,
                    'profile_name' => optional($serviceUser->profile)->fullname,
                ];
            })
            ->toArray();
    }

    public function getAll(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $status = null,
        $facility = null,
        $with = [],
    ) {
        $query = ServiceUser::with([
            'profile' => function ($q) {
                $q->where('user_type', 'service_user');
            }
        ])->whereHas('profile', function ($q) {
            $q->where('user_type', 'service_user');
        });

        if (!empty(trim($search))) {
            $query->whereHas('profile', function ($q) use ($search) {
                $q->where('user_type', 'service_user')
                    ->where(function ($q) use ($search) {
                        $q->where('fullname', 'like', "%{$search}%")
                            ->orWhere('furigana', 'like', "%{$search}%");
                    });
            });
        }

        if (!empty(trim($status))) {
            $query->whereHas('profile', function ($q) use ($status) {
                $q->where('user_type', 'service_user')
                    ->where('status', $status);
            });
        }

        if (!empty(trim($facility))) {
            $query->whereHas('profile', function ($q) use ($facility) {
                $q->where('user_type', 'service_user')
                    ->where('company', $facility);
            });
        }

        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function findById($id)
    {
        return ServiceUser::with([
            'profile' => function ($q) {
                $q->where('user_type', 'service_user');
            }
        ])
            ->find($id);
    }

    public function updatePatient($id, $data)
{
    $patient = $this->model->with([
        'profile' => function ($q) {
            $q->where('user_type', 'service_user');
        }
    ])
    ->find($id);

    $patient->profile->update([
        'fullname' => $data['fullname'],
        'furigana' => $data['furigana'],
        'dob' => $data['dob'],
        'gender' => $data['gender'],
        'status' => $data['status'],
        'prefecture' => $data['prefecture'],
        'district' => $data['district'],
        'address' => $data['address'],
        'file' => $data['file'],
    ]);

    return $patient;
}


    public function createServiceUserWithConsultation(array $data)
    {
        $consultationId = $data['consultation_id'];

        $consultation = Consultation::findOrFail($consultationId);

        $alreadyLinked = ServiceUserFamilyMember::where('consultation_id', $consultationId)
            ->whereNotNull('service_user_id')
            ->exists();

        if ($alreadyLinked) {
            return null;
        }

        $serviceUser = $this->model->create([
            'certificate_number' => $data['certificate_number'],
            'facility_id' => $consultation->facility_id,
            'created_by' => $data['created_by'],
        ]);

        $linkExists = ServiceUserFamilyMember::where('consultation_id', $consultationId)->exists();

        if ($linkExists) {
            ServiceUserFamilyMember::where('consultation_id', $consultationId)
                ->update(['service_user_id' => $serviceUser->id]);
        } else {
            ServiceUserFamilyMember::create([
                'consultation_id' => $consultationId,
                'service_user_id' => $serviceUser->id,
            ]);
        }

        return $serviceUser;
    }
}
