<?php

namespace Modules\Document\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Document\Models\Document;
use Modules\DocumentMetadata\Models\DocumentMetadata;
use Illuminate\Support\Facades\DB;

class DocumentPaymentRepository extends BaseRepository
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

    public function updateDocumentPayment($id, array $data)
    {

        $documentPayment = $this->_model->find($id);

        if (!$documentPayment) {
            return null;
        }

        $documentData = $data['document'] ?? [];
        $metadataData = $data['document_metadata'] ?? [];

        return DB::transaction(function () use ($documentPayment, $documentData, $metadataData) {
            /** Update Document */
            $documentPayment->update($documentData);

            /** Update Document Metadata */
            foreach ($metadataData as $key => $value) {
                $this->documentMetadataModel->updateOrCreate(
                    [
                        'document_id' => $documentPayment->id,
                        'key'         => $key,
                    ],
                    [
                        'value'       => $value,
                    ]
                );
            }

            return $documentPayment->fresh();
        });
    }

    public function createDocumentPayment(array $data)
    {
        $documentData = $data['document'] ?? [];
        $metadataData = $data['document_metadata'] ?? [];

        return DB::transaction(function () use ($documentData, $metadataData) {
            /** Create Document */
            $documentData['document_type'] = 'expense_receipt';
            $documentPayment = $this->_model->create($documentData);

            /** Create Document Metadata */
            foreach ($metadataData as $key => $value) {
                $this->documentMetadataModel->create([
                    'document_id' => $documentPayment->id,
                    'key'         => $key,
                    'value'       => $value,
                ]);
            }

            return $documentPayment;
        });
    }

    public function findDocumentPaymentById($id, $with = ['documentMetadata'])
    {
        $documentPayment = $this->_model->with($with)->find($id);

        if (!$documentPayment) return null;

        $data = $documentPayment->toArray();

        if (!empty($data['document_metadata'])) {
            foreach ($data['document_metadata'] as $meta) {
                $data[$meta['key']] = $meta['value'];
            }
        }

        unset($data['document_metadata']);

        return $data;
    }

    public function getAllDocumentPayment(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['staff.staffProfile', 'creator', 'documentMetadata']
    ) {
        $query = $this->_model->with($with);
        $query->where('document_type', 'expense_receipt');

        if ($search) {
            $query->whereHas('staff.staffProfile', function ($q) use ($search) {
                $q->where('fullname', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            $query->whereHas('documentMetadata', function ($q) use ($filters) {
                $q->where('key', 'payment_date');

                if (!empty($filters['date_from'])) {
                    $q->whereDate('value', '>=', $filters['date_from']);
                }

                if (!empty($filters['date_to'])) {
                    $q->whereDate('value', '<=', $filters['date_to']);
                }
            });
        }

        $query->orderBy($sortBy, $sortDirection);

        $result = $query->paginate($perPage, ['*'], 'page', $page)
            ->appends([
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'search' => $search,
                'filters' => $filters,
            ]);

        $transformed = $result->getCollection()->transform(function ($item) {
            if (!empty($item->documentMetadata)) {
                foreach ($item->documentMetadata as $meta) {
                    $item->{$meta->key} = $meta->value;
                }
            }
            unset($item->documentMetadata);
            unset($item->creator);
            return $item;
        });
        $result->setCollection($transformed);

        return $result;
    }

    public function deleteDocumentPayment($id)
    {
        $documentPayment = $this->_model->find($id);

        if (!$documentPayment) {
            return false;
        }

        $documentPayment->delete();

        return true;
    }
}
