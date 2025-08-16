<?php

namespace Modules\Document\Requests\DocumentFinancialPolicyRequests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentFinancialPolicyRequests extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'content.required'   => 'The content place is required.',
            'content.string'     => 'The content place must be a string.',
        ];
    }
}
