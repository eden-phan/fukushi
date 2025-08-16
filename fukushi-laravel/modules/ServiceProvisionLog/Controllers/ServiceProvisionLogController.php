<?php

namespace Modules\ServiceProvisionLog\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\ServiceProvisionLog\Repositories\ServiceProvisionLogRepository;
use Modules\ServiceProvisionLog\Requests\CreateServiceProvisionLogRequest;
use Modules\ServiceProvisionLog\Requests\UpdateServiceProvisionLogRequest;

class ServiceProvisionLogController extends Controller
{
    protected $serviceProvisionLogRepository;

    public function __construct(ServiceProvisionLogRepository $serviceProvisionLogRepository)
    {
        $this->serviceProvisionLogRepository = $serviceProvisionLogRepository;
    }

    public function update(UpdateServiceProvisionLogRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $serviceProvisionLog = $this->serviceProvisionLogRepository->updateServiceProvisionLog($id, $data);

            if (!$serviceProvisionLog) {
                return ApiResponse::error('Service Provision Log not found.', 404);
            }

            return ApiResponse::success($serviceProvisionLog, 'Service Provision Log updated successfully.');
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

    public function store(CreateServiceProvisionLogRequest $request)
    {
        try {
            $data = $request->validated();
            $serviceProvisionLog = $this->serviceProvisionLogRepository->createServiceProvisionLog($data);
            return ApiResponse::success($serviceProvisionLog, 'Service Provision Log created successfully.', 201);
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
                'year' => request()->input('year'),
            ];

            $serviceProvisionLogs = $this->serviceProvisionLogRepository->getAllServiceProvisionLog(
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );
            return ApiResponse::success($serviceProvisionLogs);
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
            $deleted = $this->serviceProvisionLogRepository->deleteServiceProvisionLog($id);

            if (!$deleted) {
                return ApiResponse::error('ServiceProvisionLog not found.', 404);
            }

            return ApiResponse::success(null, 'ServiceProvisionLog deleted successfully.');
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
