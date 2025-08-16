<?php

namespace Modules\Manager\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Manager\Models\Manager;
use Modules\FacilityUser\Models\FacilityUser;
use Modules\Profile\Models\Profile;
use Illuminate\Support\Facades\Hash;

class ManagerRepository extends BaseRepository
{
    protected $userModel;

    protected $facilityUserModel;

    protected $profileModel;

    public function __construct(Manager $userModel, FacilityUser $facilityUserModel, Profile $profileModel)
    {
        $this->userModel = $userModel;
        $this->facilityUserModel = $facilityUserModel;
        $this->profileModel = $profileModel;
    }

    public function getModel()
    {
        return Manager::class;
    }

    public function checkExistedEmail(string $email, ?int $id = null): bool
    {
        if ($id) {
            $manager = $this->userModel->find($id);
            if ($manager && $manager->email === $email) {
                return false;
            }
        }
        return $this->userModel->where('email', $email)->exists();
    }

    public function updateManager($id, array $data)
    {
        $facilityUser = $this->facilityUserModel->find($id);
        $user = $this->userModel->find($facilityUser->user_id);
        $profile = $this->profileModel
            ->where('user_id', $user->id)
            ->where('user_type', 'user')
            ->first();

        $facilityUser->update([
            'facility_id' => $data['facility']['facility_id'],
        ]);

        $userUpdateData = [
            'email' => $data['user']['email'],
            'status' => $data['user']['status'],
        ];

        if (!empty($data['user']['password'])) {
            $userUpdateData['password'] = Hash::make($data['user']['password']);
        }

        $user->update($userUpdateData);

        $profile->update([
            'fullname' => $data['profile']['fullname'],
            'prefecture' => $data['profile']['prefecture'],
            'district' => $data['profile']['district'],
            'address' => $data['profile']['address'],
            'postal_code' => $data['profile']['postal_code'],
            'phone_number' => $data['profile']['phone_number'],
        ]);

        return $profile;
    }

    public function findManagerByFacilityUserId($id, $with = ['user.profile', 'facility', 'role'])
    {
        $facility = $this->facilityUserModel->with($with)->find($id);

        if (!$facility) return null;

        return $facility;
    }

    public function getAllManager(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['user.profile', 'facility', 'role']
    ) {
        $query = $this->facilityUserModel
            ->with($with)
            ->where('role_id', 2);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user.profile', function ($sub) use ($search) {
                    $sub->where('fullname', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%")
                        ->orWhere('phone_number', 'like', "%$search%");
                })->orWhereHas('user', function ($sub) use ($search) {
                    $sub->where('email', 'like', "%$search%");
                });
            });
        }

        if (!empty($filters['status'])) {
            $query->whereHas('user', function ($q) use ($filters) {
                $q->where('status', $filters['status']);
            });
        }

        if (!empty($filters['facility'])) {
            $query->whereHas('facility', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['facility'] . '%');
            });
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

    public function createManager(array $data)
    {
        $user = $this->userModel->create([
            'email' => $data['user']['email'],
            'password' => Hash::make($data['user']['password']),
            'status' => $data['user']['status'],
        ]);

        $profile = $this->profileModel->create([
            'user_type' => 'user',
            'user_id' => $user->id,
            'fullname' => $data['profile']['fullname'],
            'prefecture' => $data['profile']['prefecture'],
            'district' => $data['profile']['district'],
            'address' => $data['profile']['address'],
            'postal_code' => $data['profile']['postal_code'],
            'phone_number' => $data['profile']['phone_number'],
        ]);

        $this->facilityUserModel->create([
            'facility_id' => $data['facility']['facility_id'],
            'user_id' => $user->id,
            'role_id' => 2,
            'facility_role' => 'manager',
        ]);

        return $profile;
    }

    public function deleteManager($userId)
    {

        $facilityUser = $this->facilityUserModel
            ->where('user_id', $userId)
            ->where('role_id', 2)
            ->first();

        if (!$facilityUser) return false;

        $facilityUser->delete();

        return true;
    }
}
