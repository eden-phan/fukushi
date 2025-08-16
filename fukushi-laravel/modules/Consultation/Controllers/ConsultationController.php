<?php

namespace Modules\Consultation\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Consultation\Repositories\ConsultationRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\Consultation\Requests\CreateConsultationFamilyMemberRequest;
use Modules\Consultation\Requests\UpdateConsultationFamilyMemberRequest;

class ConsultationController extends Controller
{
    protected $consultationRepository;

    public function __construct(ConsultationRepository $consultationRepository)
    {
        $this->consultationRepository = $consultationRepository;
    }

    public function index()
    {
        try {

            $filters = [
                'date_from' => request()->input('date_from'),
                'date_to' => request()->input('date_to'),
                'status' => request()->input('status'),
                'accept_status' => request()->input('accept_status'),
                'facility' => request()->input('facility')
            ];

            $consultations = $this->consultationRepository->getAllConsultation(
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );
            return ApiResponse::success($consultations);
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
            $consultations = $this->consultationRepository->findConsultationById($id);
            if (!$consultations) {
                return ApiResponse::error('Consultation not found.', 404);
            }
            return ApiResponse::success($consultations);
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

    public function acceptConsultation($id)
    {
        try {
            $consultation = $this->consultationRepository->acceptConsultation($id);
            if (!$consultation) return ApiResponse::error('Consultation accept fail.', 404);
            return ApiResponse::success($consultation, 'Consultation updated successfully.');
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

    public function rejectConsultation($id)
    {
        try {
            $consultation = $this->consultationRepository->rejectConsultation($id);
            if (!$consultation) return ApiResponse::error('Consultation reject fail.', 404);
            return ApiResponse::success($consultation, 'Consultation updated successfully.');
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

    public function store(CreateConsultationFamilyMemberRequest $request)
    {
        try {
            $data = $request->validated();

            $consultation = $this->consultationRepository->createConsultationWithFamilyMember($data);

            return ApiResponse::success($consultation, 'Consultation created successfully.', 201);
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

    public function update(UpdateConsultationFamilyMemberRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $consultation = $this->consultationRepository->updateConsultationWithFamilyMember($id, $data);

            if (!$consultation) {
                return ApiResponse::error('Consultation not found.', 404);
            }

            return ApiResponse::success($consultation, 'Consultation updated successfully.');
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
            $deleted = $this->consultationRepository->deleteConsultation($id);

            if (!$deleted) {
                return ApiResponse::error('Consultation not found.', 404);
            }

            return ApiResponse::success(null, 'Consultation deleted successfully.');
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
