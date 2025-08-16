<?php

namespace Modules\Document\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Document\Models\Document;
use Illuminate\Support\Facades\DB;
use Modules\DocumentMetadata\Models\DocumentMetadata;

class DocumentFinancialPolicyRepository extends BaseRepository
{
    protected $documentMetadataModel;

    public function __construct(Document $model, DocumentMetadata $documentMetadataModel)
    {
        $this->_model = $model;
        $this->documentMetadataModel = $documentMetadataModel;
    }

    public function getModel()
    {
        return Document::class;
    }

    public function createDocumentFinancialPolicy(array $data)
    {
        return DB::transaction(function () use ($data) {
            $documentFinancialPolicy = $this->_model->create([
                'document_type' => 'financial_management_policie'
            ]);

            $this->documentMetadataModel->create([
                'document_id' => $documentFinancialPolicy->id,
                'key' => 'content',
                'value' => $data['content'],
            ]);

            return $documentFinancialPolicy;
        });
    }

    public function updateDocumentFinancialPolicy($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $documentFinancialPolicy = $this->_model->find($id);

            if (!$documentFinancialPolicy) {
                return null;
            }

            $documentFinancialPolicy->update();

            $documentMetadata = $this->documentMetadataModel
                ->where('document_id', $documentFinancialPolicy->id)
                ->first();

            $documentMetadata->update([
                'value' => $data['content'],
            ]);

            return $documentMetadata;
        });
    }

    public function getDocumentFinancialPolicy(
        $with = ['documentMetadataFirst']
    ) {
        $document = $this->_model
            ->with($with)
            ->where('document_type', 'financial_management_policie')
            ->first();

        if (!$document || !$document->documentMetadataFirst) {
            return null;
        }

        $key = $document->documentMetadataFirst->key;
        $value = $document->documentMetadataFirst->value;

        return (object)[
            'document_id' => $document->id,
            $key => $value,
        ];
    }
}
