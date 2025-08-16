<?php

namespace Modules\Document\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'created_by' => 'string|max:255',
            'document_type' => 'string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|string|max:255',
            'file' => 'nullable',
            'permanent_contract' => 'nullable'

        ];
    }
} 