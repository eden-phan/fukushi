<?php

namespace Modules\Document\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDocumentConsentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_user_id'   => 'required|integer|exists:service_users,id',
            'family_member_id'  => 'required|integer|exists:family_members,id',
            'status'            => 'required|integer',
            'document_date'     => 'required|date_format:Y-m-d',
            'file' => 'nullable|integer|exists:medias,id',
        ];
    }

    public function messages(): array
    {
        return [
            'service_user_id.required'   => 'The service_user_id field is required.',
            'service_user_id.integer'    => 'The service_user_id must be an integer.',
            'service_user_id.exists'     => 'The specified service_user_id does not exist.',

            'family_member_id.required'  => 'The family_member_id field is required.',
            'family_member_id.integer'   => 'The family_member_id must be an integer.',
            'family_member_id.exists'    => 'The specified family_member_id does not exist.',

            'status.required'            => 'The status field is required.',
            'status.integer'             => 'The status must be an integer.',

            'document_date.required'     => 'The document_date field is required.',
            'document_date.date_format'  => 'The document_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'file.integer'               => 'The file must be an integer.',
            'file.exists'                => 'The specified file does not exist.',
        ];
    }
}
