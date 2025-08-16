<?php

namespace Modules\FamilyMember\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateFamilyMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consultation_id' => 'nullable',
            'family_members' => 'nullable|array',
            'family_members.*.id' => 'nullable',
            'family_members.*.name' => 'nullable',
            'family_members.*.age' => 'nullable',
            'family_members.*.relationship' => 'nullable',
            'family_members.*.occupation' => 'nullable',
            'family_members.*.living_status' => 'nullable',
            'family_members.*.note' => 'nullable',
            'family_members.*.created_by' => 'nullable',
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
