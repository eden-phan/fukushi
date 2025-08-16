<?php
namespace Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Request;
use Modules\Auth\Requests\LoginRequest;
use Modules\Auth\Requests\RefreshTokenRequest;
use Modules\Auth\Requests\RegisterRequest;
use Modules\Auth\Services\AuthService;
use App\Helpers\ApiResponse;

class AuthController extends Controller
{
    protected $service;

    public function __construct(AuthService $service)
    {
        $this->service = $service;
    }

    public function login(LoginRequest $request)
    {
        return $this->service->login($request->validated());
    }

    public function refreshToken(RefreshTokenRequest $request){
        return $this->service->refreshToken($request->validated());
    }

    public function me()
    {
        return ApiResponse::success([
            'user' => auth()->user(),
            'roles' => auth()->user()->getRoleNames(),
            'permissions' => auth()->user()->getAllPermissions()->pluck('name')
        ]);
    }

    public function logout()
    {
        auth()->logout();
        return ApiResponse::success(null, 'Logged out');
    }
}
