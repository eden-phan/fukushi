<?php

namespace Modules\Document\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Document\Repositories\DocumentConsentRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\Document\Requests\CreateDocumentConsentRequest;
use Modules\Document\Requests\UpdateDocumentConsentRequest;

class DocumentConsentController extends Controller
{
    protected $documentConsentRepository;

    public function __construct(DocumentConsentRepository $documentConsentRepository)
    {
        $this->documentConsentRepository = $documentConsentRepository;
    }

    public function destroy($id)
    {
        try {
            $deleted = $this->documentConsentRepository->deleteDocumentConsent($id);

            if (!$deleted) {
                return ApiResponse::error('Document Consent not found.', 404);
            }

            return ApiResponse::success(null, 'Document Consent deleted successfully.');
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

    public function getAllWithServiceUser()
    {
        try {
            $filters = [
                'date_from' => request()->input('date_from'),
                'date_to' => request()->input('date_to'),
                'status' => request()->input('status'),
            ];

            $documentConsents = $this->documentConsentRepository->getAllDocumentConsentWithServiceUser(
                perPage: request()->get('perPage', 10),
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );

            return ApiResponse::success($documentConsents);
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
                'date_to' => request()->input('date_to')
            ];

            $documentConsents = $this->documentConsentRepository->getAllDocumentConsent(
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );
            return ApiResponse::success($documentConsents);
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

    public function store(CreateDocumentConsentRequest $request)
    {
        try {
            $data = $request->validated();

            $documentConsent = $this->documentConsentRepository->createDocumentConsent($data);

            return ApiResponse::success($documentConsent, 'Document Consent created successfully.', 201);
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

    public function update(UpdateDocumentConsentRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $documentConsent = $this->documentConsentRepository->updateDocumentConsent($id, $data);

            if (!$documentConsent) {
                return ApiResponse::error('Document Consent not found.', 404);
            }

            return ApiResponse::success($documentConsent, 'Document Consent updated successfully.');
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
            $documentConsent = $this->documentConsentRepository->findDocumentConsentId($id);
            if (!$documentConsent) {
                return ApiResponse::error('Document Consent not found.', 404);
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
}
