<?php

namespace Modules\DocumentConfidentiality\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\DocumentConfidentiality\Repositories\DocumentConfidentialityRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\DocumentConfidentiality\Requests\CreateDocumentConfidentialityRequest;
use Modules\DocumentConfidentiality\Requests\UpdateDocumentConfidentialityRequest;

class DocumentConfidentialityController extends Controller
{
    protected $documentConfidentialityRepository;

    public function __construct(DocumentConfidentialityRepository $documentConfidentialityRepository)
    {
        $this->documentConfidentialityRepository = $documentConfidentialityRepository;
    }

    public function store(CreateDocumentConfidentialityRequest $request)
    {
        try {
            $data = $request->validated();

            $documentConfidentiality = $this->documentConfidentialityRepository->createDocumentConfidentiality($data);

            return ApiResponse::success($documentConfidentiality, 'Document Confidentiality created successfully.', 201);
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

    public function update(UpdateDocumentConfidentialityRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $documentConfidentiality = $this->documentConfidentialityRepository->updateDocumentConfidentiality($id, $data);

            if (!$documentConfidentiality) return ApiResponse::error('Document Confidentiality not found.', 404);

            return ApiResponse::success($documentConfidentiality, 'Document Confidentiality updated successfully.');
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

    public function show($staffId)
    {
        try {
            $documentConfidentiality = $this->documentConfidentialityRepository->findDocumentConfidentialityWithStaffId($staffId);
            return ApiResponse::success($documentConfidentiality);
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
