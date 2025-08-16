<?php

namespace Modules\Document\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\Document\Repositories\DocumentFinancialPolicyRepository;
use Modules\Document\Requests\DocumentFinancialPolicyRequests\CreateDocumentFinancialPolicyRequests;
use Modules\Document\Requests\DocumentFinancialPolicyRequests\UpdateDocumentFinancialPolicyRequests;

class DocumentFinancialPolicyController extends Controller
{
    protected $documentFinancialPolicyRepository;

    public function __construct(DocumentFinancialPolicyRepository $documentFinancialPolicyRepository)
    {
        $this->documentFinancialPolicyRepository = $documentFinancialPolicyRepository;
    }

    public function index()
    {
        try {
            $documentFinancialPolicy = $this->documentFinancialPolicyRepository->getDocumentFinancialPolicy();
            return ApiResponse::success($documentFinancialPolicy);
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

    public function store(CreateDocumentFinancialPolicyRequests $request)
    {
        try {
            $data = $request->validated();

            $documentFinancialPolicy = $this->documentFinancialPolicyRepository->createDocumentFinancialPolicy($data);

            return ApiResponse::success($documentFinancialPolicy, 'Document Financial Policy created successfully.', 201);
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

    public function update(UpdateDocumentFinancialPolicyRequests $request, $id)
    {
        try {
            $data = $request->validated();

            $documentFinancialPolicy = $this->documentFinancialPolicyRepository->updateDocumentFinancialPolicy($id, $data);

            if (!$documentFinancialPolicy) {
                return ApiResponse::error('Document Financial Policy not found.', 404);
            }

            return ApiResponse::success($documentFinancialPolicy, 'Document Financial Policy updated successfully.');
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
