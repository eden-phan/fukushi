<?php

namespace Modules\Facility\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Facility\Models\Facility;
use App\Models\Role;

class FacilityRepository extends BaseRepository
{

    protected $model;
    public function __construct(Facility $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return Facility::class;
    }

    public function getAllFacility(
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
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            if (isset($filters['status'])) {
                $query->where('status', '=', $filters['status']);
            }
            if (isset($filters['facility_type'])) {
                $query->where('facility_type', '=', $filters['facility_type']);
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

    public function findFacilityById($id, $with = ['users'])
    {
        $facility = $this->model->with($with)->find($id);

        if (!$facility) return null;

        return $facility;
    }

    public function createFacility(array $data)
    {
        $facility = $this->model->create($data);

        return $facility;
    }

    public function updateFacility($id, array $data)
    {
        $facility = $this->model->find($id);

        if (!$facility) return null;

        $facility->update($data);
        return $facility;
    }

    public function deleteFacility($id)
    {
        $facility = $this->model->find($id);
        if (!$facility) {
            return false;
        }

        return $facility->delete();
    }

}
