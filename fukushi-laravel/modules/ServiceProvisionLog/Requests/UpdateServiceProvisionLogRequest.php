<?php

namespace Modules\ServiceProvisionLog\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceProvisionLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'staff_id'   => 'required|integer|exists:users,id',
            'service_user_id'   => 'required|integer|exists:service_users,id',
            'date'     => 'required|date_format:Y-m-d',
            'meal_provided' => 'required|string',
            'medication' => 'required|string',
            'wake_up_time' => 'required|date_format:H:i',
            'bed_time' => 'required|date_format:H:i',
            'daytime_activity' => 'required|string',
            'daytime_activity_content' => 'nullable|string',
            'condition' => 'required|string',
            'overnight_stay' => 'required|string',
            'hospital_facility' => 'required|string',
            'other_note' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'staff_id.required'          => 'The staff_id field is required.',
            'staff_id.integer'           => 'The staff_id must be an integer.',
            'staff_id.exists'            => 'The specified staff_id does not exist users.',

            'service_user_id.required'      => 'The service_user_id field is required.',
            'service_user_id.integer'       => 'The service_user_id must be an integer.',
            'service_user_id.exists'        => 'The specified service_user_id does not exist in service_users.',

            'date.required'          => 'The date field is required.',
            'date.date_format'       => 'The date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'meal_provided.required' => 'The meal_provided is required.',
            'meal_provided.string'        => 'The meal_provided must be a string.',

            'medication.required' => 'The medication is required.',
            'medication.string'        => 'The medication must be a string.',

            'wake_up_time.required' => 'The wake up time field is required.',
            'wake_up_time.date_format' => 'The wake up time must be in the format HH:mm (e.g., 08:30).',

            'bed_time.required' => 'bed time time field is required.',
            'bed_time.date_format' => 'bed time time must be in the format HH:mm (e.g., 08:30).',

            'daytime_activity.required' => 'The daytime activity is required.',
            'daytime_activity.string'        => 'The daytime activity must be a string.',

            'condition.required' => 'The condition is required.',
            'condition.string'        => 'The condition must be a string.',

            'overnight_stay.required' => 'The overnight_stay is required.',
            'overnight_stay.string'        => 'The overnight_stay must be a string.',

            'hospital_facility.required' => 'The hospital_facility is required.',
            'hospital_facility.string'        => 'The hospital_facility must be a string.',

            'other_note.required' => 'The other_note is required.',
            'other_note.string'        => 'The other_note must be a string.',
        ];
    }
}
