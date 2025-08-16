<?php

namespace Modules\ServiceUser\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceUserIdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_user_id' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
