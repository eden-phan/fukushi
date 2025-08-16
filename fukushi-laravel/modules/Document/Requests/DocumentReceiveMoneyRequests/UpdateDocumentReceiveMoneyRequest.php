<?php

namespace Modules\Document\Requests\DocumentReceiveMoneyRequests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentReceiveMoneyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            /** Document */
            'document.service_user_id' => 'required|integer|exists:service_users,id',
            'document.document_date' => 'required|date_format:Y-m-d',
            'document.file' => 'nullable|integer|exists:medias,id',

            /** Document Metadata */
            'document_metadata.family_member_id' => 'required|string',
            'document_metadata.service_provision_date' => 'required|date_format:Y-m-d',
            'document_metadata.facility_id' => 'required|string',
            'document_metadata.receipt_date' => 'required|date_format:Y-m-d',
            'document_metadata.receive_amount' => 'required|string',
            'document_metadata.total_cost' => 'required|string',
            'document_metadata.user_charge' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            /** Document */
            'document.service_user_id.required'        => 'The service_user_id field is required.',
            'document.service_user_id.integer'         => 'The service_user_id must be an integer.',
            'document.service_user_id.exists'          => 'The specified service_user_id in service_users does not exist.',

            'document.document_date.required'     => 'The document_date field is required.',
            'document.document_date.date_format'  => 'The document_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'document.file.integer'               => 'The file must be an integer.',
            'document.file.exists'                => 'The specified file does not exist.',

            /** Document Metadata */
            'document_metadata.family_member_id.required'   => 'The family_member_id is required.',
            'document_metadata.family_member_id.string'     => 'The family_member_id must be a string.',

            'document_metadata.service_provision_date.required'     => 'The service_provision_date field is required.',
            'document_metadata.service_provision_date.date_format'  => 'The service_provision_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'document_metadata.facility_id.required'   => 'The facility_id is required.',
            'document_metadata.facility_id.string'     => 'The facility_id must be a string.',

            'document_metadata.receipt_date.required'     => 'The receipt_date field is required.',
            'document_metadata.receipt_date.date_format'  => 'The receipt_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'document_metadata.receive_amount.required'   => 'The receive_amount is required.',
            'document_metadata.receive_amount.string'     => 'The receive_amount must be a string.',

            'document_metadata.total_cost.required'   => 'The total_cost is required.',
            'document_metadata.total_cost.string'     => 'The total_cost must be a string.',

            'document_metadata.user_charge.required'   => 'The user_charge is required.',
            'document_metadata.user_charge.string'     => 'The user_charge must be a string.',
        ];
    }
}
