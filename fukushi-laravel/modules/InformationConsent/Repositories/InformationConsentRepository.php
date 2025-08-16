<?php

namespace Modules\InformationConsent\Repositories;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Core\Repositories\BaseRepository;
use Modules\Document\Models\Document;

class InformationConsentRepository extends BaseRepository
{
    protected $model;

    public function __construct(Document $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return Document::class;
    }

    public function updateInformationConsentById($data, $documentId)
{
    DB::beginTransaction();
    try {
        $document = $this->model->find($documentId);

        if (!$document) {
            throw new \Exception("Document not found.");
        }

        $document->update([
            'start_date' => Carbon::parse($data['start_date'])->toDateString(),
            'end_date' => Carbon::parse($data['end_date'])->toDateString(),
            'staff_id' => $data['staff_id'],
            'file' => $data['file']
        ]);

        if (!empty($data['family_name'])) {
            $document->documentMetadata()->updateOrCreate(
                ['key' => 'family_name'],
                ['value' => $data['family_name']]
            );
        }

        DB::commit();
        return $document;
    } catch (Exception $e) {
        DB::rollBack();
        throw $e;
    }
}


    public function createInformationConsentById($data, $id)
    {
        DB::beginTransaction();
        try {
            $document = $this->model->create([
                'start_date' => Carbon::parse($data['start_date'])->toDateString(),
                'end_date' => Carbon::parse($data['end_date'])->toDateString(),
                'staff_id' => $data['staff_id'],
                'service_user_id' => $id,
                'document_type' => 'information_consent_form',
                'file' => $data['file']
            ]);

            if (!empty($data['family_name'])) {
                $document->documentMetadata()->create([
                    'key' => 'family_name',
                    'value' => $data['family_name'],
                ]);
            }

            DB::commit();
            return $document;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getInformationConsentById($id)
    {
        $document = $this->model
        ->where('service_user_id', $id)
        ->with('documentMetadata')
        ->with('staff.profile')
        ->first();
        return $document;
    }
}
