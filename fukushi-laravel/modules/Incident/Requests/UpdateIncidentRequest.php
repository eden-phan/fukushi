<?php

namespace Modules\Incident\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reporter_id'       => 'required|integer|exists:users,id',
            'service_user_id'   => 'required|integer|exists:service_users,id',
            'report_date'       => 'required|date_format:Y-m-d',
            'incident_date'     => 'nullable|date_format:Y-m-d H:i:s',
            'location'          => 'required|string',
            'incident_type'     => 'required|string',
            'incident_detail'   => 'required|string',
            'response'          => 'required|string',
            'prevent_plan'      => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'reporter_id.required'          => 'The reporter_id field is required.',
            'reporter_id.integer'           => 'The reporter_id must be an integer.',
            'reporter_id.exists'            => 'The specified reporter_id does not exist users.',

            'service_user_id.required'      => 'The service_user_id field is required.',
            'service_user_id.integer'       => 'The service_user_id must be an integer.',
            'service_user_id.exists'        => 'The specified service_user_id does not exist in service_users.',

            'report_date.required'          => 'The report_date field is required.',
            'report_date.date_format'       => 'The report_date must be in the format YYYY-MM-DD (e.g., 2025-01-01).',

            'incident_date.required'        => 'The incident_date field is required.',
            'incident_date.date_format'     => 'The incident_date must be in the format YYYY-MM-DD (e.g., 2025-01-01 14:00:00).',

            'location.required'             => 'The location is required.',
            'location.string'               => 'The location must be a string.',

            'incident_type.required'        => 'The incident_type is required.',
            'incident_type.string'          => 'The incident_type must be a string.',

            'incident_detail.required'      => 'The incident_detail is required.',
            'incident_detail.string'        => 'The incident_detail must be a string.',

            'response.required'             => 'The response is required.',
            'response.string'               => 'The response must be a string.',

            'prevent_plan.required'         => 'The prevent_plan is required.',
            'prevent_plan.string'           => 'The prevent_plan must be a string.',
        ];
    }
}
