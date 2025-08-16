<?php

namespace Modules\Incident\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Incident\Repositories\IncidentRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\Incident\Requests\CreateIncidentRequest;
use Modules\Incident\Requests\UpdateIncidentRequest;

class IncidentController extends Controller
{
    protected $incidentRepository;

    public function __construct(IncidentRepository $incidentRepository)
    {
        $this->incidentRepository = $incidentRepository;
    }

    public function show($id)
    {
        try {
            $incident = $this->incidentRepository->findIncidentById($id);
            if (!$incident) {
                return ApiResponse::error('Incident not found.', 404);
            }
            return ApiResponse::success($incident);
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

    public function update(UpdateIncidentRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $incident = $this->incidentRepository->updateIncident($id, $data);

            if (!$incident) {
                return ApiResponse::error('Incident not found.', 404);
            }

            return ApiResponse::success($incident, 'Incident updated successfully.');
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

    public function store(CreateIncidentRequest $request)
    {
        try {
            $data = $request->validated();

            $incident = $this->incidentRepository->createIncident($data);

            return ApiResponse::success($incident, 'Incident created successfully.', 201);
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

            $incidents = $this->incidentRepository->getAllIncident(
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );
            return ApiResponse::success($incidents);
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
            $deleted = $this->incidentRepository->deleteIncident($id);

            if (!$deleted) return ApiResponse::error('Incident not found.', 404);

            return ApiResponse::success(null, 'Incident deleted successfully.');
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
