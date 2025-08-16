<?php

namespace Modules\InformationConsent\Request;

use Illuminate\Foundation\Http\FormRequest;

class CreateInformationConsent extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => 'nullable',
            'end_date' => 'nullable',
            'staff_id' => 'nullable',
            'family_name'  => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'start_date.required' => 'Trường bắt buộc',
            'end_date.required' => 'Trường bắt buộc',
            'staff_id.required' => 'Trường bắt buộc',
            'family_name.required' => 'Trường bắt buộc',
        ];
    }
}
