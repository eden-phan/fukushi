<?php

namespace Modules\Facility\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'          => 'required|string|max:255',
            'service_type'  => 'required|string',
            'facility_type' => 'required|string',
            'postal_code' => 'required|string',
            'prefecture' => 'required|string',
            'district' => 'required|string',
            'address' => 'required|string',
            'status' => 'required|integer',
            'description'   => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'        => 'The name field is required.',
            'name.string'          => 'The name must be a string.',
            'name.max'             => 'The name may not be greater than 255 characters.',

            'service_type.required' => 'The service_type field is required.',
            'service_type.string'   => 'The service_type must be a string.',

            'facility_type.required' => 'The facility_type field is required.',
            'facility_type.string'   => 'The facility_type must be a string.',

            'postal_code.required' => 'The postal_code field is required.',
            'postal_code.string'   => 'The postal_code must be a string.',

            'prefecture.required' => 'The prefecture field is required.',
            'prefecture.string'   => 'The prefecture must be a string.',

            'district.required' => 'The district field is required.',
            'district.string'   => 'The district must be a string.',

            'address.required' => 'The address field is required.',
            'address.string'   => 'The address must be a string.',

            'status.required' => 'The status field is required.',
            'status.integer'   => 'The status must be a valid number.',

            'description.required' => 'The description field is required.',
            'description.string'   => 'The description must be a string.',
        ];
    }
}
