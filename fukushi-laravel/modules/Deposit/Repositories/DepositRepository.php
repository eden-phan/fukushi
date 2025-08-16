<?php

namespace Modules\Deposit\Repositories;


use Modules\Core\Repositories\BaseRepository;
use Modules\Deposit\Models\Deposit;
use Modules\Deposit\Models\DepositItem;

class DepositRepository extends BaseRepository
{
    protected $model;
    public function __construct(Deposit $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return Deposit::class;
    }

    public function getAll(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $keyword = null,
    ) {
        $query = $this->model
            ->with(['user', 'serviceUser.profile', 'depositItem'])
            ->withSum('depositItem as total_amount', 'amount');

        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->whereHas('user', function ($q2) use ($keyword) {
                    $q2->where('name', 'LIKE', '%' . $keyword . '%');
                })
                    ->orWhereHas('serviceUser.profile', function ($q2) use ($keyword) {
                        $q2->where('fullname', 'LIKE', '%' . $keyword . '%');
                    });
            });
        }

        return $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getDepositById(
        $id,
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $keyword = null,
    ) {
        $query = $this->model->with('depositItem')->find($id);

        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->whereHas('user', function ($q2) use ($keyword) {
                    $q2->where('name', 'LIKE', '%' . $keyword . '%');
                })
                    ->orWhereHas('serviceUser.profile', function ($q2) use ($keyword) {
                        $q2->where('fullname', 'LIKE', '%' . $keyword . '%');
                    });
            });
        }

        return $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getDepositItemsByDepositId($depositId, $perPage = 10, $page = 1, $keyword = null)
    {
        $deposit = $this->model->find($depositId);

        if (!$deposit) {
            return null;
        }

        $query = $deposit->depositItem();

        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('return_address', 'LIKE', '%' . $keyword . '%');
            });
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function deleteDepositItemById($id)
    {
        $depositItem = DepositItem::find($id);
        if (!$depositItem) {
            return false;
        }
        return $depositItem->delete();
    }

    public function createDepositItem($data)
    {
        return DepositItem::create($data);
    }

    public function getDepositDetailItem($id)
    {
        return DepositItem::findOrFail($id);
    }

    public function updateDepositItem($id, $data)
    {
        $depositItem = DepositItem::find($id);
        if (!$depositItem) {
            return false;
        }
        $depositItem->update($data);
        return $depositItem;
    }
}
