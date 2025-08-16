<?php

namespace Modules\Incident\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Incident\Models\Incident;
use Illuminate\Support\Facades\Auth;

class IncidentRepository extends BaseRepository
{
    public function __construct(Incident $model)
    {
        $this->_model = $model;
    }

    public function getModel()
    {
        return Incident::class;
    }

    public function findIncidentById($id, $with = ['reporter'])
    {
        $incident = $this->_model->with($with)->find($id);

        if (!$incident) return null;

        return $incident;
    }

    public function deleteIncident($id)
    {
        $incident = $this->_model->find($id);

        if (!$incident) return false;

        $incident->delete();
        return true;
    }

    public function updateIncident($id, array $data)
    {
        $incident = $this->_model->find($id);

        if (!$incident) return null;

        $incident->update($data);
        return $incident;
    }


    public function createIncident(array $data)
    {
        $data['created_by'] = auth()->id();
        $incident = $this->_model->create($data);
        return $incident;
    }

    public function getAllIncident(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['reporter.staffProfile', 'serviceUser.serviceUserProfile']
    ) {
        $query = $this->_model->with($with);

        if ($search) {
            $query->whereHas('reporter.staffProfile', function ($subQuery) use ($search) {
                $subQuery->where('fullname', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            if (!empty($filters['year'])) {
                $query->whereYear('incident_date', $filters['year']);
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
}
