<?php

namespace Modules\Document\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Document\Repositories\DocumentPaymentRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\Document\Requests\DocumentPayment\CreateDocumentPaymentRequest;
use Modules\Document\Requests\DocumentPayment\UpdateDocumentPaymentRequest;

class DocumentPaymentController extends Controller
{
    protected $documentPaymentRepository;

    public function __construct(DocumentPaymentRepository $documentPaymentRepository)
    {
        $this->documentPaymentRepository = $documentPaymentRepository;
    }

    public function update(UpdateDocumentPaymentRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $documentPayment = $this->documentPaymentRepository->updateDocumentPayment($id, $data);

            if (!$documentPayment) {
                return ApiResponse::error('Document Payment not found.', 404);
            }

            return ApiResponse::success($documentPayment, 'Document Payment updated successfully.');
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
            $documentConsent = $this->documentPaymentRepository->findDocumentPaymentById($id);
            if (!$documentConsent) {
                return ApiResponse::error('Document Payment not found.', 404);
            }
            return ApiResponse::success($documentConsent);
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

    public function store(CreateDocumentPaymentRequest $request)
    {
        try {
            $data = $request->validated();

            $documentPayment = $this->documentPaymentRepository->createDocumentPayment($data);

            return ApiResponse::success($documentPayment, 'Document Payment created successfully.', 201);
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
                'date_from' => request()->input('date_from'),
                'date_to' => request()->input('date_to'),
            ];

            $documentPayments = $this->documentPaymentRepository->getAllDocumentPayment(
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );
            return ApiResponse::success($documentPayments);
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
            $deleted = $this->documentPaymentRepository->deleteDocumentPayment($id);

            if (!$deleted) {
                return ApiResponse::error('Document Payment not found.', 404);
            }

            return ApiResponse::success(null, 'Document Payment deleted successfully.');
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
