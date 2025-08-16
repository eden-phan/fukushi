<?php

namespace Modules\SessionRecord\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Modules\SessionRecord\Models\SessionRecord;
use Modules\SessionRecord\Repositories\SessionRepository;
use Modules\SessionRecord\Requests\CreateSessionRecordRequest;
use Modules\SessionRecord\Requests\UpdateSessionRecordRequest;
use Modules\Signature\Repositories\SignatureRepository;

class SessionController extends Controller
{
    protected $sessionRepository;
    protected $signatureRepository;

    public function __construct(SessionRepository $sessionRepository, SignatureRepository $signatureRepository)
    {
        $this->sessionRepository = $sessionRepository;
        $this->signatureRepository = $signatureRepository;
    }

    public function index()
    {
        $sessions = $this->sessionRepository->getAll(
            record_type: request()->get('record_type'),
            page: request()->get('page', 1),
            sortBy: request()->get('sortBy', 'created_at'),
            sortDirection: request()->get('sortDirection', 'desc'),
            keyword: request()->get('keyword'),
            startDate: request()->get('startDate'),
            endDate: request()->get('endDate'),
        );
        return ApiResponse::success($sessions);
    }

    public function show($id)
    {
        $session = $this->sessionRepository->getSession($id);

        if (!$session) {
            return ApiResponse::error('Session not found', 404);
        }

        // Get signatures for this session
        $signatures = $this->signatureRepository->getSignatureByDocument($id, 'session_record');

        // Transform signatures into the format expected by frontend
        $signatureData = [];
        foreach ($signatures as $signature) {
            $signatureData[$signature->signature_type] = $signature->signature_value;
        }

        // Add signature data to session
        $session->signature = $signatureData;

        return ApiResponse::success($session);
    }

    public function store(CreateSessionRecordRequest $request)
    {
        $session = $this->sessionRepository->createSession($request->validated());

        // Process signatures if provided
        $signatures = $request->input('signature', []);
        if (!empty($signatures)) {
            $this->processSignatures($session->id, 'session_record', $signatures);
        }

        return ApiResponse::success($session, 'Session created successfully', 201);
    }

    public function update(UpdateSessionRecordRequest $request, $id)
    {
        $session = $this->sessionRepository->updateSession($id, $request->validated());
        if (!$session) {
            return ApiResponse::error('Session not found', 404);
        }

        // Process signatures if provided
        $signatures = $request->input('signature', []);
        if (!empty($signatures)) {
            // Delete existing signatures for this session
            $this->signatureRepository->deleteByDocument($id, 'session_record');
            // Create new signatures
            $this->processSignatures($id, 'session_record', $signatures);
        }

        return ApiResponse::success($session, 'Session updated successfully');
    }

    public function destroy($id)
    {
        $result = $this->sessionRepository->deleteSession($id);
        if (!$result) {
            return ApiResponse::error('Session not found', 404);
        }

        // Also delete related signatures
        $this->signatureRepository->deleteByDocument($id, 'session_record');

        return ApiResponse::success(null, 'Session deleted successfully');
    }

    /**
     * Process signature data from frontend
     */
    private function processSignatures($documentId, $documentType, $signatures)
    {
        foreach ($signatures as $signatureType => $signatureValue) {
            if (!empty($signatureValue)) {
                $this->signatureRepository->create([
                    'document_id' => $documentId,
                    'document_type' => $documentType,
                    'signature_type' => $signatureType,
                    'signature_value' => $signatureValue,
                    'signed_at' => now(),
                    'signed_by' => auth()->id(),
                ]);
            }
        }
    }
}
