<?php

namespace Modules\Document\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\Document\Repositories\DocumentRepository;
use Modules\Document\Requests\DocumentRequest;

class DocumentController extends Controller
{
    protected $documentRepository;

    public function __construct(DocumentRepository $documentRepository)
    {
        $this->documentRepository = $documentRepository;
    }

    public function create(DocumentRequest $request, $id)
    {
        $validated = $request->validated();

        $validated['created_by'] = auth()->id();
        $validated['staff_id'] = $id;
        $document = $this->documentRepository->create($validated);

        return ApiResponse::success($document, 'Tạo tài liệu thành công');
    }

    public function getDocumentsByUserId($userId)
    {
        $document = $this->documentRepository->findById($userId);
        return ApiResponse::success($document, 'Lấy tài liệu thành công');
    }

    public function update(DocumentRequest $request, $id)
    {
        $data = $request->validated();
        $document = $this->documentRepository->update($data, $id);

        return ApiResponse::success($document, 'Cập nhật tài liệu thành công');
    }
}
