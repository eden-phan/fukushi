<?php

namespace Modules\Manager\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateManagerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 'user.name' => 'nullable',
            'user.email' => 'nullable',
            'user.password' => 'nullable',
            'user.status' => 'nullable',

            'profile.fullname' => 'nullable',
            // 'profile.dob' => 'nullable',
            // 'profile.gender' => 'nullable',
            'profile.prefecture' => 'nullable',
            'profile.district' => 'nullable',
            'profile.address' => 'nullable',
            'profile.postal_code' => 'nullable',
            'profile.phone_number' => 'nullable',
            // 'profile.avatar' => 'nullable',
            'profile.status' => 'nullable',

            'facility.facility_id' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
