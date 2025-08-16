<?php
namespace Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function rules(): array
    {
        return ['email' => 'required|email|exists:users,email'];
    }

    public function authorize(): bool
    {
        return true;
    }
}
