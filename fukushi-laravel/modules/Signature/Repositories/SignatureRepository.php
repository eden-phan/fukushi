<?php

namespace Modules\Signature\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Signature\Models\Signature;

class SignatureRepository extends BaseRepository
{

    protected $model;
    public function __construct(Signature $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return $this->model;
    }

    /**
     * Get a session by ID with participants
     */
    public function getSignatureByDocument($documentId, $documentType)
    {
        $query = $this->model->where('document_id', $documentId)
            ->where('document_type', $documentType);
        return $query->with('sessionRecord')->get();
    }

    /**
     * Create a new session
     */
    public function create($request)
    {
        $signature = new $this->model;
        $signature->document_id = $request['document_id'];
        $signature->document_type = $request['document_type'];
        $signature->signature_type = $request['signature_type'];
        $signature->signature_value = $request['signature_value'];
        $signature->signed_at = $request['signed_at'] ?? now();
        $signature->signed_by = $request['signed_by'] ?? auth()->id();
        $signature->save();
        return $signature;
    }

    /**
     * Update an existing session
     */
    public function update($signatureId, $request)
    {
        $signature = $this->model->find($signatureId);
        if (!$signature) {
            return null;
        }

        $signature->document_id = $request['document_id'];
        $signature->document_type = $request['document_type'];
        $signature->signature_type = $request['signature_type'];
        $signature->signature_value = $request['signature_value'];
        $signature->signed_at = $request['signed_at'] ?? now();
        $signature->signed_by = $request['signed_by'] ?? auth()->id();
        $signature->save();

        return $signature;
    }

    /**
     * Delete a session
     */
    public function delete($signatureId)
    {
        $signature = $this->model->find($signatureId);
        if (!$signature) {
            return null;
        }

        $signature->delete();
        return true;
    }

    /**
     * Delete signatures by document
     */
    public function deleteByDocument($documentId, $documentType)
    {
        return $this->model->where('document_id', $documentId)
            ->where('document_type', $documentType)
            ->delete();
    }
}
