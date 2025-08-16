<?php

namespace Modules\Profile\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProfileRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            //user
            'email' => 'email|unique:users,email',
            'employment_type' => 'required| string',
            'password' => 'required|string|min:6',
            //profile
            'avatar' => 'nullable',
            'fullname' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'phone_number' => 'nullable|string|max:20',
            'district' => 'nullable|string|max:255',
            'gender' => 'nullable',
            'prefecture' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'prefecture' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'facility_id' => 'nullable',
            'family_name' => 'nullable',
            'relationship' => 'nullable',
            'family_phone' => 'nullable',
            'work_type' => 'nullable',
            'work_shift' => 'nullable',
            'start_date' => 'nullable'
        ];
    }
} 