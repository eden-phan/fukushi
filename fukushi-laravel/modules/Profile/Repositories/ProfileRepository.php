<?php

namespace Modules\Profile\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Modules\Core\Repositories\BaseRepository;
use Modules\FacilityUser\Models\FacilityUser;
use Modules\Profile\Models\Profile;

class ProfileRepository extends BaseRepository
{

    public function __construct(Profile $model)
    {
        $this->_model = $model;
    }

    public function getModel()
    {
        return Profile::class;
    }

    public function getUserOptions()
    {
        return $this->_model
            ->where('user_type', 'user')
            ->with('user')
            ->get()
            ->map(function ($profile) {
                return [
                    'user_id' => $profile->user_id,
                    'fullname' => $profile->fullname,
                ];
            })
            ->values();
    }

    public function getPatientOptions()
    {
        return $this->_model
            ->where('user_type', 'service_user')
            ->with('serviceUser')
            ->get()
            ->map(function ($profile) {
                return [
                    'user_id' => $profile->user_id,
                    'fullname' => $profile->fullname,
                    'certificate_number' => optional($profile->serviceUser)->certificate_number,
                ];
            })
            ->values();
    }

    public function findByUserId($userId)
    {
        $user = User::with('profile')->find($userId);
        return $user ? $user->profile : null;
    }

    public function findById($userId)
    {
        $user = User::with([
            'profile' => function ($query) {
                $query->where('user_type', 'user');
            },
            'facilityUser.facility'

        ])->find($userId);
        return $user;
    }

    public function getAll(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $status = null,
        $type = null,
        $with = []
    ) {
        $query = User::with([
            'profile' => function ($q) {
                $q->where('user_type', 'user');
            },
            'facilityUser' => function ($q) {
                $q->where('role_id', 3);
            },
            'facilityUser.facility'
        ])
            ->whereHas('profile', function ($q) {
                $q->where('user_type', 'user');
            })
            ->whereHas('facilityUser', function ($q) {
                $q->where('role_id', 3);
            });
        if (!empty(trim($search))) {
            $query->where(function ($q) use ($search) {
                $q->Where('email', 'like', "%{$search}%")
                    ->orWhereHas('profile', function ($q) use ($search) {
                        $q->where('fullname', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%");
                    });
            });
        }

        if (isset($status) && trim($status) !== '') {
            $query->where(function ($q) use ($status) {
                $q->WhereHas('profile', function ($q) use ($status) {
                    $q->where('status', 'like', "%{$status}%");
                });
            });
        }

        if (isset($type) && trim($type) !== '') {
            $query->where(function ($q) use ($type) {
                $q->where('employment_type', 'like', "%{$type}%");
            });
        }


        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }


    public function createProfile($data)
    {
        return Profile::create($data);
    }

    public function updateUser($userId, $data)
    {
        return User::findOrFail($userId)->update($data);
    }

    public function updateProfile($profileId, $data)
    {
        return $this->update($profileId, $data);
    }

    public function destroyUserAndProfile($id)
    {
        $user = User::with('profile')->find($id);
        if (!$user) {
            return false;
        }
        if ($user->profile) {
            $user->profile->delete();
        }
        $user->delete();
        return true;
    }

    public function createUserWithProfile($validated)
    {
        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'employment_type' => $validated['employment_type'],
            'work_type' => $validated['work_type'],
        ]);

        $profileData = $validated;
        $profileData['user_type'] = 'user';
        $profileData['user_id'] = $user->id;
        unset(
            $profileData['password'],
            $profileData['email'],
            $profileData['employment_type'],
            $profileData['work_type'],
        );

        $profile = Profile::create($profileData);

        if (!empty($validated['facility_id'])) {
            FacilityUser::firstOrCreate([
                'user_id' => $user->id,
                'facility_id' => $validated['facility_id'],
                // 'facility_id' => 3,
                'role_id' => 3,
            ]);
        }

        $profile->load('user');
        return $profile;
    }

    public function updateUserWithProfile($userId, $data)
    {
        $user = User::with([
            'profile' => function ($query) {
                $query->where('user_type', 'user');
            },
        ])->find($userId);

        if (!$user) return null;

        // Cập nhật thông tin user
        $userUpdate = [];
        if (isset($data['employment_type'])) $userUpdate['employment_type'] = $data['employment_type'];
        if (isset($data['email'])) $userUpdate['email'] = $data['email'];
        if (isset($data['password'])) $userUpdate['password'] = Hash::make($data['password']);
        if (isset($data['start_date'])) $userUpdate['start_date'] = $data['start_date'];
        if (isset($data['work_type'])) $userUpdate['work_type'] = $data['work_type'];
        if (isset($data['work_shift'])) $userUpdate['work_shift'] = $data['work_shift'];

        if (!empty($userUpdate)) {
            $user->update($userUpdate);
        }

        $profileData = $data;
        unset($profileData['email'], $profileData['password'], $profileData['employment_type']);

        $profileData['user_id'] = $user->id;
        $profileData['user_type'] = 'user';

        if ($user->profile) {
            $user->profile->update($profileData);
        } else {
            $user->profile()->create($profileData);
        }

        return $user->fresh('profile');
    }


    public function isEmailExists($email, $id = null)
    {
        $query = User::where('email', $email);

        if ($id) {
            $query->where('id', '!=', $id);
        }
        return $query->exists();;
    }
}
