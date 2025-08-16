<?php

namespace App\Repositories;

use Modules\Core\Repositories\BaseRepository;
use App\Models\User;

class UserRepository extends BaseRepository
{

    protected $model;
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return User::class;
    }

    public function getAllUser(
        $getAll = false,
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = []
    ) {
        $query = $this->model->with($with);

        if ($getAll) return $query->orderBy($sortBy, $sortDirection)->get();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            foreach ($filters as $field => $value) {
                $query->where($field, $value);
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

    public function getAllStaff(
        $with = ['profile']
    ) {
        $query = $this->model
            ->with($with)
            ->whereHas('profile', function ($q) {
                $q->where('user_type', 'user');
            })
            ->get();

        return $query;
    }
}
