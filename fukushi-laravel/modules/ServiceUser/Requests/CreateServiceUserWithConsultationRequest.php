<?php

namespace Modules\ServiceUser\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateServiceUserWithConsultationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consultation_id' => 'nullable',
            'certificate_number' => 'nullable',
            'created_by' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'consultation_id.required' => 'Trường bắt buộc',
            'certificate_number.required' => 'Trường bắt buộc',
            'created_by.required' => 'Trường bắt buộc',
        ];
    }
}
