<?php

namespace Modules\ServiceProvisionLog\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\ServiceProvisionLog\Models\ServiceProvisionLog;

class ServiceProvisionLogRepository extends BaseRepository
{
    public function __construct(ServiceProvisionLog $model)
    {
        $this->_model = $model;
    }

    public function getModel()
    {
        return ServiceProvisionLog::class;
    }

    public function updateServiceProvisionLog($id, array $data)
    {
        $documentPayment = $this->_model->find($id);
        if (!$documentPayment) return null;
        $documentPayment->update($data);
        return $documentPayment->fresh();
    }

    public function createServiceProvisionLog(array $data)
    {
        $data['created_by'] = auth()->id();
        $serviceProvisionLog = $this->_model->create($data);
        return $serviceProvisionLog;
    }

    public function getAllServiceProvisionLog(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['staff.staffProfile', 'serviceUser']
    ) {
        $query = $this->_model->with($with);

        if ($search) {
            $query->whereHas('staff.staffProfile', function ($subQuery) use ($search) {
                $subQuery->where('fullname', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            if (!empty($filters['year'])) {
                $query->whereYear('date', $filters['year']);
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

    public function deleteServiceProvisionLog($id)
    {
        $serviceProvisionLog = $this->_model->find($id);
        if (!$serviceProvisionLog) return false;
        $serviceProvisionLog->delete();
        return true;
    }
}
