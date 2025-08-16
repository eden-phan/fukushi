<?php

namespace Modules\Document\Requests\DocumentPayment;

use Illuminate\Foundation\Http\FormRequest;

class CreateDocumentPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            /** Document */
            'document.staff_id' => 'required|integer|exists:users,id',
            'document.document_date' => 'required|date_format:Y-m-d',
            'document.created_by' => 'required|integer|exists:users,id',
            'document.file' => 'nullable|integer|exists:medias,id',

            /** Document Metadata */
            'document_metadata.payment_date' => 'required|date_format:Y-m-d',
            'document_metadata.payment_place' => 'required|string',
            'document_metadata.payment_purpose' => 'required|string',
            'document_metadata.payment_amount' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            /** Document */
            'document.staff_id.required'        => 'The staff_id field is required.',
            'document.staff_id.integer'         => 'The staff_id must be an integer.',
            'document.staff_id.exists'          => 'The specified staff_id user does not exist.',

            'document.document_date.required'     => 'The document_date field is required.',
            'document.document_date.date_format'  => 'The document_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'document.created_by.required'        => 'The created_by field is required.',
            'document.created_by.integer'         => 'The created_by must be an integer.',
            'document.created_by.exists'          => 'The specified created_by user does not exist.',

            'document.file.integer'               => 'The file must be an integer.',
            'document.file.exists'                => 'The specified file does not exist.',

            /** Document Metadata */
            'document_metadata.payment_date.required'     => 'The payment_date field is required.',
            'document_metadata.payment_date.date_format'  => 'The payment_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'document_metadata.payment_place.required'   => 'The payment place is required.',
            'document_metadata.payment_place.string'     => 'The payment place must be a string.',

            'document_metadata.payment_purpose.required' => 'The payment purpose is required.',
            'document_metadata.payment_purpose.string'   => 'The payment purpose must be a string.',

            'document_metadata.payment_amount.required'  => 'The payment amount is required.',
            'document_metadata.payment_amount.string'    => 'The payment amount must be a string.',
        ];
    }
}
