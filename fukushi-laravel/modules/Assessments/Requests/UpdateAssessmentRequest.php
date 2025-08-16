<?php

namespace Modules\Assessments\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reception_number' => 'nullable|string|max:20',
            'service_user_id' => 'nullable|exists:service_users,id',
            'staff_id' => 'nullable|exists:users,id',
            'home_visit_dates' => 'nullable|array',
            'outpatient_visit_dates' => 'nullable|array',
            'phone_contact_dates' => 'nullable|array',
            'life_history' => 'nullable|string',
            'physical_disability_type' => 'nullable|string|max:10',
            'physical_disability_grade' => 'nullable|string|max:10',
            'intellectual_disability_code' => 'nullable|string|max:10',
            'mental_disability_grade' => 'nullable|string|max:10',
            'has_no_certificate' => 'nullable|boolean',
            'has_basic_disability_pension' => 'nullable|boolean',
            'basic_disability_grade' => 'nullable|string|max:10',
            'has_welfare_disability_pension' => 'nullable|boolean',
            'welfare_disability_grade' => 'nullable|string|max:10',
            'has_national_pension' => 'nullable|boolean',
            'has_other_pension' => 'nullable|boolean',
            'other_pension_details' => 'nullable|string|max:255',
            'receives_welfare' => 'nullable|boolean',
            'disability_support_level' => 'nullable|string|max:10',
            'medical_info' => 'nullable|string',
            'medication_detail' => 'nullable|string',
            'insurance_type' => 'nullable|string|max:20',
            'insured_person_relation' => 'nullable|string|max:20',
            'pension_type' => 'nullable|string|max:255',
            'pension_other_detail' => 'nullable|string|max:255',
            'current_assistive_device' => 'nullable|string',
            'daily_routine_self' => 'nullable|string',
            'daily_routine_caregiver' => 'nullable|string',
            'desired_life_user' => 'nullable|string',
            'desired_life_family' => 'nullable|string',
            'other_information' => 'nullable|string',
            'house_owned' => 'nullable|boolean',
            'house_type_other' => 'nullable|string',
            'note' => 'nullable|string',
            'living_domains' => 'nullable|array',
            'living_domains.*.id' => 'nullable|exists:living_domain_assessments,id',
            'living_domains.*.key' => 'required|string|max:255',
            'living_domains.*.current_status' => 'nullable|string',
            'living_domains.*.user_wish' => 'nullable|string',
            'living_domains.*.support_needed' => 'nullable|string',
            'living_domains.*.environment_limitations_notes' => 'nullable|string',
            'living_domains.*.abilities_limitations_notes' => 'nullable|string',
            'living_domains.*.preference' => 'nullable|string', 
            'medical_disability_history' => 'nullable|array',
            'medical_disability_history.*.id' => 'nullable|exists:medical_disability_history,id',
            'medical_disability_history.*.date' => 'required|date',
            'medical_disability_history.*.detail' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'service_user_id.exists' => '指定されたサービスユーザーは存在しません。',
            'staff_id.exists' => '指定されたスタッフは存在しません。',
            'living_domains.*.key.required' => '生活領域のキーは必須です。',
            'living_domains.*.id.exists' => '指定された生活領域は存在しません。',
            'medical_disability_history.*.id.exists' => '指定された医療障害履歴は存在しません。',
            'medical_disability_history.*.date.required' => '医療障害履歴の日付は必須です。',
            'medical_disability_history.*.date.date' => '医療障害履歴の日付は有効な日付形式である必要があります。',
            'medical_disability_history.*.detail.required' => '医療障害履歴の詳細は必須です。',
        ];
    }
}