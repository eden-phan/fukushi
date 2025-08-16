<?php

namespace Modules\Document\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Document\Models\Document;
use Modules\DocumentMetadata\Models\DocumentMetadata;
use Modules\Profile\Models\Profile;
use Illuminate\Support\Facades\DB;

class DocumentConsentRepository extends BaseRepository
{
    protected $model;

    protected $documentMetadataModel;

    protected $profileModel;

    public function __construct(Document $model, DocumentMetadata $documentMetadataModel, Profile $profileModel)
    {
        $this->model = $model;
        $this->documentMetadataModel = $documentMetadataModel;
        $this->profileModel = $profileModel;
    }

    public function getModel()
    {
        return Document::class;
    }

    public function deleteDocumentConsent($id)
    {
        $documentConsent = $this->model->find($id);

        if (!$documentConsent) {
            return false;
        }

        $documentConsent->delete();

        return true;
    }

    public function findDocumentConsentId($id, $with = ['documentMetadata'])
    {
        $documentConsent = $this->model->with($with)->find($id);

        if (!$documentConsent) return null;

        $data = $documentConsent->toArray();

        if (!empty($data['document_metadata'][0])) {
            $meta = $data['document_metadata'][0];
            $data[$meta['key']] = $meta['value'];
        }

        unset($data['document_metadata']);

        return $data;
    }

    public function createDocumentConsent(array $data)
    {
        return DB::transaction(function () use ($data) {
            $documentConsent = $this->model->create([
                'service_user_id' => $data['service_user_id'],
                'document_date' => $data['document_date'],
                'document_type' => 'payment_consent_form',
                'status' => $data['status'],
                'file' => $data['file'],
                'created_by' => auth()->id(),
            ]);

            $this->documentMetadataModel->create([
                'document_id' => $documentConsent->id,
                'data_type' => 1,
                'key' => 'family_member_id',
                'value' => $data['family_member_id'],
            ]);

            return $documentConsent;
        });
    }

    public function updateDocumentConsent($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $documentConsent = $this->model->find($id);

            if (!$documentConsent) {
                return null;
            }

            $documentConsent->update([
                'service_user_id' => $data['service_user_id'],
                'document_date' => $data['document_date'],
                'status' => $data['status'],
                'file' => $data['file'],
            ]);

            $documentMetadata = $this->documentMetadataModel
                ->where('document_id', $documentConsent->id)
                ->first();

            $documentMetadata->update([
                'value' => $data['family_member_id'],
            ]);

            return $documentConsent;
        });
    }

    public function getAllDocumentConsentWithServiceUser(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['serviceUser.profile', 'documentMetadataFirst', 'serviceUser.familyMembers']
    ) {
        $query = $this->model->with($with);
        $query->where('document_type', 'payment_consent_form');

        if ($search) {
            $query->whereHas('serviceUser.profile', function ($q) use ($search) {
                $q->where('fullname', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            if (!empty($filters['date_from'])) {
                $query->whereDate('document_date', '>=', $filters['date_from']);
            }

            if (!empty($filters['date_to'])) {
                $query->whereDate('document_date', '<=', $filters['date_to']);
            }

            foreach ($filters as $field => $value) {
                if (in_array($field, ['date_from', 'date_to']) || is_null($value)) {
                    continue;
                }

                $query->where($field, $value);
            }
        }

        $query->orderBy($sortBy, $sortDirection);

        $result = $query->paginate($perPage, ['*'], 'page', $page)
            ->appends([
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'search' => $search,
                'filters' => $filters,
            ]);


        /**Duyệt từng document để gắn matched_family_member và xoá phần không cần thiết */
        $result->getCollection()->transform(function ($doc) {
            $familyMemberId = $doc->documentMetadataFirst?->value;

            $matchedFamilyMember = $doc->serviceUser?->familyMembers
                ?->firstWhere('id', (int) $familyMemberId);

            $doc->profile = $doc->serviceUser?->profile;
            $doc->agent = $matchedFamilyMember;

            unset($doc->serviceUser);
            unset($doc->documentMetadataFirst);

            return $doc;
        });

        return $result;
    }

    public function getAllDocumentConsent(
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['staff', 'creator']
    ) {
        $query = $this->model->with($with);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('staff_id', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            if (!empty($filters['date_from'])) {
                $query->whereDate('start_date', '>=', $filters['date_from']);
            }

            if (!empty($filters['date_to'])) {
                $query->whereDate('end_date', '<=', $filters['date_to']);
            }

            foreach ($filters as $field => $value) {
                if (in_array($field, ['date_from', 'date_to']) || is_null($value)) {
                    continue;
                }

                $query->where($field, $value);
            }
        }


        $query->orderBy($sortBy, $sortDirection);

        $result = $query->paginate($perPage, ['*'], 'page', $page)
            ->appends([
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'search' => $search,
                'filters' => $filters,
            ]);

        return $result;
    }
}
