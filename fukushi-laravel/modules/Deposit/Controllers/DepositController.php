<?php

namespace Modules\Deposit\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Modules\Deposit\Repositories\DepositRepository;

class DepositController extends Controller
{
    protected $depositRepository;

    public function __construct(DepositRepository $depositRepository)
    {
        $this->depositRepository = $depositRepository;
    }

    public function index()
    {
        $deposit = $this->depositRepository->getAll(
            perPage: request()->get('per_page', 10),
            page: request()->get('page', 1),
            sortBy: request()->get('sortBy', 'created_at'),
            sortDirection: request()->get('sortDirection', 'desc'),
            keyword: request()->get('keyword'),
        );
        return ApiResponse::success($deposit);
    }

    public function getListDepositItemsById($id)
    {
        $items = $this->depositRepository->getDepositItemsByDepositId(
            $id,
            request()->get('per_page', 10),
            request()->get('page', 1),
            request()->get('keyword')
        );
        
        if (!$items) {
            return ApiResponse::error('Deposit not found', 404);
        }
        
        return ApiResponse::success($items);
    }

    public function deleteDepositItem($id)
{
    $result = $this->depositRepository->deleteDepositItemById($id);

    if (!$result) {
        return ApiResponse::error('Deposit item not found', 404);
    }

    return ApiResponse::success(null, 'Delete successful');
}

    public function createDepositItem($form_id)
    {
        $data = request()->only(['name', 'amount','deposit_date', 'return_date', 'return_address', 'note']);
        $data['form_id'] = $form_id;

        $item = $this->depositRepository->createDepositItem($data);

        if (!$item) {
            return ApiResponse::error('Create deposit item failed', 500);
        }

        return ApiResponse::success($item, 'Create successful');
    }

    public function getDepositDetailItem($id){
        $item = $this->depositRepository->getDepositDetailItem($id);

        return ApiResponse::success($item, 'Get successful');
    }

    public function updateDepositItem($id)
    {
        $data = request()->only(['name', 'amount', 'deposit_date', 'return_address', 'note']);

        $item = $this->depositRepository->updateDepositItem($id, $data);

        if (!$item) {
            return ApiResponse::error('Deposit item not found', 404);
        }

        return ApiResponse::success($item, 'Update successful');
    }
}
