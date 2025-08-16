<?php

namespace Modules\DailyReport\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDailyReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entry_date' => 'required|date',
            'day_shift_staff_id' => 'nullable|exists:users,id',
            'night_shift_staff_id' => 'nullable|exists:users,id',
            'support_content' => 'nullable|string',
            'work_details' => 'nullable|string',
            'note' => 'nullable|string',
            'night_shift_note' => 'nullable|string',

            'daily_report_staffs' => 'nullable|array',
            'daily_report_staffs.*.staff_id' => 'required|exists:users,id',
            'daily_report_staffs.*.work_content' => 'nullable|string',
            'daily_report_staffs.*.shift_type' => 'required|in:day_shift,night_shift',
            'daily_report_staffs.*.shift_hours' => 'nullable|array',

            'daily_report_service_users' => 'nullable|array',
            'daily_report_service_users.*.service_user_id' => 'required|exists:service_users,id',
            'daily_report_service_users.*.overnight_stay' => 'nullable|boolean',
            'daily_report_service_users.*.hospitalized' => 'nullable|boolean',

            'signatures' => 'nullable|array',
            'signatures.*.signature_type' => 'required|in:admin,service_manager,life_support_staff_1,life_support_staff_2,life_support_staff_3,caregiver_1,caregiver_2,caregiver_3,caregiver_4',
            'signatures.*.signature_value' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'entry_date.required' => '記録日は必須です。',
            'entry_date.date' => '記録日は有効な日付でなければなりません。',
            'day_shift_staff_id.exists' => '指定された日勤スタッフが存在しません。',
            'night_shift_staff_id.exists' => '指定された夜勤スタッフが存在しません。',

            'daily_report_staffs.*.staff_id.required' => 'スタッフIDは必須です。',
            'daily_report_staffs.*.staff_id.exists' => '指定されたスタッフが存在しません。',
            'daily_report_staffs.*.shift_type.required' => '勤務シフトは必須です。',
            'daily_report_staffs.*.shift_type.in' => '勤務シフトは day_shift または night_shift でなければなりません。',

            'daily_report_service_users.*.service_user_id.required' => 'サービス利用者IDは必須です。',
            'daily_report_service_users.*.service_user_id.exists' => '指定されたサービス利用者が存在しません。',
            'daily_report_service_users.*.overnight_stay.boolean' => '宿泊情報はtrue/falseで指定してください。',
            'daily_report_service_users.*.hospitalized.boolean' => '入院情報はtrue/falseで指定してください。',

            'signatures.*.signature_type.required' => '署名タイプは必須です。',
            'signatures.*.signature_type.in' => '署名タイプは admin, service_manager, life_support_staff, caregiver のいずれかでなければなりません。',
            'signatures.*.signature_value.required' => '署名値は必須です。',
        ];
    }
}