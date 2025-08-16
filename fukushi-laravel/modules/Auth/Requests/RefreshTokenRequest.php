<?php
namespace Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RefreshTokenRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'refresh_token' => 'required|string'
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
