<?php

namespace Modules\Facility\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Facility\Repositories\FacilityRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

use Modules\Facility\Requests\CreateFacilityRequest;
use Modules\Facility\Requests\UpdateFacilityRequest;


class FacilityController extends Controller
{
    protected $facilityRepository;

    public function __construct(FacilityRepository $facilityRepository)
    {
        $this->facilityRepository = $facilityRepository;
    }

    public function index()
    {
        try {
            $filters = [
                'facility_type' => request()->input('facility_type'),
                'status' => request()->input('status'),
            ];
            $facilities = $this->facilityRepository->getAllFacility(
                getAll: filter_var(request()->get('getAll', false), FILTER_VALIDATE_BOOLEAN),
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );
            return ApiResponse::success($facilities);
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
            $facility = $this->facilityRepository->findFacilityById($id);
            if (!$facility) {
                return ApiResponse::error('Facility not found.', 404);
            }
            return ApiResponse::success($facility);
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

    public function store(CreateFacilityRequest $request)
    {
        try {
            $data = $request->validated();

            $facility = $this->facilityRepository->createFacility($data);

            return ApiResponse::success($facility, 'Facility created successfully.', 201);
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

    public function update(UpdateFacilityRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $facility = $this->facilityRepository->updateFacility($id, $data);

            if (!$facility) {
                return ApiResponse::error('Facility not found.', 404);
            }

            return ApiResponse::success($facility, 'Facility updated successfully.');
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
            $deleted = $this->facilityRepository->deleteFacility($id);

            if (!$deleted) {
                return ApiResponse::error('Facility not found.', 404);
            }

            return ApiResponse::success(null, 'Facility deleted successfully.');
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
