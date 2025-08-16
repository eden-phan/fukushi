<?php

namespace Modules\SessionRecord\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSessionRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'record_type' => 'required|string|max:255',
            'theme' => 'required|string|max:255',
            'date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'location' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'feedback' => 'nullable|string',
            'signature' => 'nullable|array',
            'signature.admin_signature' => 'nullable|string|max:6',
            'signature.child_support_manager_signature' => 'nullable|string|max:6',
            'signature.recorder_signature' => 'nullable|string|max:6',
        ];
    }

    public function messages(): array
    {
        return [
            'record_type.required' => '記録タイプは必須です。',
            'record_type.string' => '記録タイプは文字列でなければなりません。',
            'record_type.max' => '記録タイプは255文字以内でなければなりません。',

            'theme.required' => 'テーマは必須です。',
            'theme.string' => 'テーマは文字列でなければなりません。',
            'theme.max' => 'テーマは255文字以内でなければなりません。',

            'date.required' => '日付は必須です。',
            'date.date_format' => '日付は Y-m-d 形式でなければなりません。',

            'start_time.required' => '開始時刻は必須です。',
            'start_time.date_format' => '開始時刻は H:i 形式でなければなりません。',

            'end_time.required' => '終了時刻は必須です。',
            'end_time.date_format' => '終了時刻は H:i 形式でなければなりません。',

            'location.string' => '場所は文字列でなければなりません。',
            'location.max' => '場所は255文字以内でなければなりません。',

            'content.string' => '内容は文字列でなければなりません。',

            'feedback.string' => 'フィードバックは文字列でなければなりません。',

            'admin_signature.required' => '管理者署名は必須です。',

            'child_support_manager_signature.required' => '管理者署名は必須です。',

            'recorder_signature.required' => '管理者署名は必須です。',
        ];
    }
}
