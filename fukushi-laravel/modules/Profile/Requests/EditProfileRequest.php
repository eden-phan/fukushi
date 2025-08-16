<?php

namespace Modules\Profile\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditProfileRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            //user
            'employment_type' => 'required| string',
            'email' => 'nullable',
            'password' => 'nullable|string',
            //profile
            'avatar' => 'nullable',
            'fullname' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'phone_number' => 'nullable|string|max:20',
            'gender' => 'nullable',
            'district' => 'nullable|string|max:255',
            'prefecture' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'prefecture' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'family_name' => 'nullable',
            'relationship' => 'nullable',
            'family_phone' => 'nullable',
             'work_type' => 'nullable',
            'work_shift' => 'nullable',
            'start_date' => 'nullable'
        ];
    }
} 