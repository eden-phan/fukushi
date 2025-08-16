<?php

namespace Modules\Document\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Document\Repositories\DocumentReceiveMoneyRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\Document\Requests\DocumentReceiveMoneyRequests\CreateDocumentReceiveMoneyRequest;
use Modules\Document\Requests\DocumentReceiveMoneyRequests\UpdateDocumentReceiveMoneyRequest;

class DocumentReceiveMoneyController extends Controller
{
    protected $documentReceiveMoneyRepository;

    public function __construct(DocumentReceiveMoneyRepository $documentReceiveMoneyRepository)
    {
        $this->documentReceiveMoneyRepository = $documentReceiveMoneyRepository;
    }

    public function destroy($id)
    {
        try {
            $deleted = $this->documentReceiveMoneyRepository->deleteDocumentReceiveMoney($id);

            if (!$deleted) return ApiResponse::error('Document Receive Money not found.', 404);

            return ApiResponse::success(null, 'Document Receive Money deleted successfully.');
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

    public function update(UpdateDocumentReceiveMoneyRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $documentReceiveMoney = $this->documentReceiveMoneyRepository->updateDocumentReceiveMoney($id, $data);

            if (!$documentReceiveMoney) {
                return ApiResponse::error('Document Receive Money not found.', 404);
            }

            return ApiResponse::success($documentReceiveMoney, 'Document Receive Money updated successfully.');
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
            $documentReceiveMoney = $this->documentReceiveMoneyRepository->findDocumentReceiveMoneyById($id);
            if (!$documentReceiveMoney) {
                return ApiResponse::error('Document Receive Money not found.', 404);
            }
            return ApiResponse::success($documentReceiveMoney);
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

    public function store(CreateDocumentReceiveMoneyRequest $request)
    {
        try {
            $data = $request->validated();

            $documentReceiveMoney = $this->documentReceiveMoneyRepository->createDocumentReceiveMoney($data);

            return ApiResponse::success($documentReceiveMoney, 'Document Receive Money created successfully.', 201);
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

    public function getPatientOptions()
    {
        try {
            $patientOptions = $this->documentReceiveMoneyRepository->getPatientOptions();
            return ApiResponse::success($patientOptions);
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
                'status' => request()->input('status'),
            ];

            $documentReceiveMoneys = $this->documentReceiveMoneyRepository->getAllDocumentReceiveMoney(
                perPage: request()->get('perPage', 10),
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: $filters,
            );

            return ApiResponse::success($documentReceiveMoneys);
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
