<?php

namespace Modules\DocumentConfidentiality\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\DocumentConfidentiality\Models\DocumentConfidentiality;

class DocumentConfidentialityRepository extends BaseRepository
{
    protected $model;

    public function __construct(DocumentConfidentiality $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return DocumentConfidentiality::class;
    }

    public function findDocumentConfidentialityWithStaffId($staffId, $with = [])
    {
        $documentConfidentiality = $this->model
            ->with($with)
            ->where('staff_id', $staffId)
            ->where('document_type', 'confidentiality_agreements')
            ->first();

        if (!$documentConfidentiality) return null;

        return $documentConfidentiality;
    }

    public function createDocumentConfidentiality(array $data)
    {
        $data['document_type'] = 'confidentiality_agreements';
        $data['created_by'] = auth()->id();
        $documentConfidentiality = $this->model->create($data);

        return $documentConfidentiality;
    }

    public function updateDocumentConfidentiality($id, array $data)
    {

        $documentConfidentiality = $this->model->find($id);

        if (!$documentConfidentiality) return null;

        $documentConfidentiality->update($data);

        return $documentConfidentiality;
    }
}
