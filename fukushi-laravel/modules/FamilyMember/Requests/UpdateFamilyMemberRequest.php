<?php

namespace Modules\FamilyMember\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFamilyMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable',
            'age' => 'nullable',
            'relationship' => 'nullable',
            'occupation' => 'nullable',
            'living_status' => 'nullable',
            'note' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Trường bắt buộc',
            'age.required' => 'Trường bắt buộc',
            'relationship.required' => 'Trường bắt buộc',
            'occupation.required' => 'Trường bắt buộc',
            'living_status.required' => 'Trường bắt buộc',
            'note.required' => 'Trường bắt buộc',
            'created_by.required' => 'Trường bắt buộc',
        ];
    }
}
