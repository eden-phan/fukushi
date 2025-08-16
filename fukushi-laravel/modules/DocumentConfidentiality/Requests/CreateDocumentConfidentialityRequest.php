<?php

namespace Modules\DocumentConfidentiality\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDocumentConfidentialityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'staff_id' => 'required|integer|exists:users,id',
            'document_date' => 'required|date_format:Y-m-d',
            'file' => 'nullable|integer|exists:medias,id',
        ];
    }

    public function messages(): array
    {
        return [
            'staff_id.required' => 'The staff_id field is required.',
            'staff_id.integer' => 'The staff_id must be an integer.',
            'staff_id.exists' => 'The specified staff_id does not exist in users.',

            'document_date.required'     => 'The document_date field is required.',
            'document_date.date_format'  => 'The document_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'file.integer' => 'The file must be an integer.',
            'file.exists' => 'The specified file does not exist.',
        ];
    }
}
