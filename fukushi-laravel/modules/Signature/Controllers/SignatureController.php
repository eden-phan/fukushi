<?php

namespace Modules\SessionRecord\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\SessionRecord\Repositories\SessionRepository;
use Modules\Signature\Repositories\SignatureRepository;

class SignatureController extends Controller
{
    protected $signatureRepository;

    public function __construct(SignatureRepository $signatureRepository)
    {
        $this->signatureRepository = $signatureRepository;
    }

    public function store($request)
    {
        $signature = $this->signatureRepository->create($request);

        return ApiResponse::success($signature, 'Signature created successfully', 201);
    }

    public function update($signature_id, $request)
    {
        $signature = $this->signatureRepository->update($signature_id, $request);
        if (!$signature) {
            return ApiResponse::error('Signature not found', 404);
        }
        return ApiResponse::success($signature, 'Signature updated successfully');
    }

    public function destroy($id)
    {
        $result = $this->signatureRepository->delete($id);
        if (!$result) {
            return ApiResponse::error('Signature not found', 404);
        }
        return ApiResponse::success(null, 'Signature deleted successfully');
    }
}
