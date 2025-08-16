<?php
namespace Modules\Auth\Controllers;

use Modules\Auth\Requests\ForgotPasswordRequest;
use Modules\Auth\Requests\ResetPasswordRequest;
use Modules\Auth\Services\ForgotPasswordService;
use App\Helpers\ApiResponse;

class ForgotPasswordController
{
    protected ForgotPasswordService $service;

    public function __construct(ForgotPasswordService $service)
    {
        $this->service = $service;
    }

    public function sendResetLink(ForgotPasswordRequest $request)
    {
        return $this->service->sendResetLink($request->validated());
    }

    public function reset(ResetPasswordRequest $request)
    {
        return $this->service->resetPassword($request->validated());
    }
}
