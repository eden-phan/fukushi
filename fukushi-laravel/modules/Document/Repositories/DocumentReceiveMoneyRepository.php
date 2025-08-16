<?php

namespace Modules\Document\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Document\Models\Document;
use Modules\DocumentMetadata\Models\DocumentMetadata;
use Modules\Profile\Models\Profile;
use Modules\ServiceUser\Models\ServiceUser;
use Illuminate\Support\Facades\DB;


class DocumentReceiveMoneyRepository extends BaseRepository
{
    protected $documentMetadataModel;

    protected $profileModel;

    protected $serviceUserModel;

    public function __construct(
        Document $model,
        DocumentMetadata $documentMetadataModel,
        Profile $profileModel,
        ServiceUser $serviceUserModel,
    ) {
        $this->_model = $model;
        $this->documentMetadataModel = $documentMetadataModel;
        $this->profileModel = $profileModel;
        $this->serviceUserModel = $serviceUserModel;
    }

    public function getModel()
    {
        return Document::class;
    }

    public function getAllDocumentReceiveMoney(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['serviceUser.serviceUserProfile', 'creator', 'documentMetadata']
    ) {
        $query = $this->_model->with($with);
        $query->where('document_type', 'money_receipt_authorization');

        if ($search) {
            $query->whereHas('serviceUser.serviceUserProfile', function ($q) use ($search) {
                $q->where('fullname', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            $query->whereHas('documentMetadata', function ($q) use ($filters) {
                $q->where('key', 'service_provision_date');

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

    public function deleteDocumentReceiveMoney($id)
    {
        $documentReceiveMoney = $this->_model->find($id);

        if (!$documentReceiveMoney) return false;

        $documentReceiveMoney->delete();

        return true;
    }

    public function updateDocumentReceiveMoney($id, array $data)
    {
        $documentReceiveMoney = $this->_model->find($id);

        if (!$documentReceiveMoney) return null;

        $documentData = $data['document'] ?? [];
        $metadataData = $data['document_metadata'] ?? [];

        return DB::transaction(function () use ($documentReceiveMoney, $documentData, $metadataData) {
            /** Update Document */
            $documentReceiveMoney->update($documentData);

            /** Update Document Metadata */
            foreach ($metadataData as $key => $value) {
                $this->documentMetadataModel->updateOrCreate(
                    [
                        'document_id' => $documentReceiveMoney->id,
                        'key'         => $key,
                    ],
                    [
                        'value'       => $value,
                    ]
                );
            }

            return $documentReceiveMoney->fresh();
        });
    }

    public function findDocumentReceiveMoneyById($id, $with = ['documentMetadata'])
    {
        $documentReceiveMoney = $this->_model->with($with)->find($id);

        if (!$documentReceiveMoney) return null;

        $data = $documentReceiveMoney->toArray();

        if (!empty($data['document_metadata'])) {
            foreach ($data['document_metadata'] as $meta) {
                $data[$meta['key']] = $meta['value'];
            }
        }

        unset($data['document_metadata']);

        return $data;
    }

    public function createDocumentReceiveMoney(array $data)
    {
        $documentData = $data['document'] ?? [];
        $metadataData = $data['document_metadata'] ?? [];

        return DB::transaction(function () use ($documentData, $metadataData) {
            /** Create Document */
            $documentData['document_type'] = 'money_receipt_authorization';
            $documentData['created_by'] = auth()->id();
            $documentReceiveMoney = $this->_model->create($documentData);

            /** Create Document Metadata */
            foreach ($metadataData as $key => $value) {
                $this->documentMetadataModel->create([
                    'document_id' => $documentReceiveMoney->id,
                    'key'         => $key,
                    'value'       => $value,
                ]);
            }

            return $documentReceiveMoney;
        });
    }

    public function getPatientOptions()
    {
        return $this->profileModel
            ->where('user_type', 'service_user')
            ->with('serviceUser')
            ->get()
            ->map(function ($profile) {
                return [
                    'user_id' => $profile->user_id,
                    'fullname' => $profile->fullname,
                    'certificate_number' => optional($profile->serviceUser)->certificate_number,
                ];
            })
            ->values();
    }
}
