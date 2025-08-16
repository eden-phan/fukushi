<?php

namespace Modules\Manager\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Manager\Repositories\ManagerRepository;
use Modules\Manager\Requests\CreateManagerRequest;
use Modules\Manager\Requests\UpdateManagerRequest;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ManagerController extends Controller
{
    protected $managerRepository;

    public function __construct(ManagerRepository $managerRepository)
    {
        $this->managerRepository = $managerRepository;
    }

    public function checkExistedEmail()
    {
        try {
            $email = request()->input('email');
            $id = request()->input('id');
            $exists = $this->managerRepository->checkExistedEmail($email, $id);
            return ApiResponse::success($exists);
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }

            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }

    public function update(UpdateManagerRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $manager = $this->managerRepository->updateManager($id, $data);

            if (!$manager) {
                return ApiResponse::error('Manager not found.', 404);
            }

            return ApiResponse::success($manager, 'Manager updated successfully.');
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }

            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }

    public function show($id)
    {
        try {
            $manager = $this->managerRepository->findManagerByFacilityUserId($id);
            if (!$manager) {
                return ApiResponse::error('Manager not found.', 404);
            }
            return ApiResponse::success($manager);
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }
            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }

    public function index()
    {
        try {
            $filters = [
                'status' => request()->input('status'),
                'facility' => request()->input('facility')
            ];
            $managers = $this->managerRepository->getAllManager(
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );
            return ApiResponse::success($managers);
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }
            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }

    public function store(CreateManagerRequest $request)
    {
        try {
            $data = $request->validated();

            $manager = $this->managerRepository->createManager($data);

            return ApiResponse::success($manager, 'Manager created successfully.', 201);
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }

            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = $this->managerRepository->deleteManager($id);

            if (!$deleted) {
                return ApiResponse::error('Manager not found.', 404);
            }

            return ApiResponse::success(null, 'Manager deleted successfully.');
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }

            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }
}
