<?php

namespace Modules\DocumentConfidentiality\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentConfidentialityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_date' => 'required|date_format:Y-m-d',
            'file' => 'nullable|integer|exists:medias,id',
        ];
    }

    public function messages(): array
    {
        return [
            'document_date.required'     => 'The document_date field is required.',
            'document_date.date_format'  => 'The document_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'file.integer' => 'The file must be an integer.',
            'file.exists' => 'The specified file does not exist.',
        ];
    }
}
