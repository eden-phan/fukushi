<?php
namespace Modules\Auth\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Helpers\ApiResponse;
use Illuminate\Support\Str;
use Modules\Auth\Models\RefreshToken;

class AuthService
{
    public function login(array $data): \Illuminate\Http\JsonResponse
    {
        if (!$token = Auth::guard('api')->attempt($data)) {
            return ApiResponse::error('Unauthorized', 401);
        }

        $user = auth()->user();
        $refreshToken = $this->generateRefreshToken($user);

        // Get user role
        $role = $user->getRoleNames()->first();

        $facility = null;

        // Try to get from relationship if exists
        if ($user->facilityUser) {
            $facility = $user->facilityUser->facility_id;
        }

        return ApiResponse::success([
            'token' => $token,
            'refresh_token' => $refreshToken,
            'user' => $user,
            'role' => $role,
            'facility' => $facility
        ]);
    }

    protected function generateRefreshToken(User $user)
    {
        $token = Str::random(64);

        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        return $token;
    }

    public function refreshToken(array $data): \Illuminate\Http\JsonResponse
    {
        $rawToken = $data['refresh_token'] ?? null;
        $hashed = hash('sha256', $rawToken);

        $stored = RefreshToken::where('token', $hashed)
            ->where('expires_at', '>', now())
            ->first();

        if (!$stored) {
            return ApiResponse::error('Refresh token invalid or expired', 401);
        }

        $user = $stored->user;
        $newAccessToken = Auth::guard()->login($user);

        return ApiResponse::success([
            'token' => $newAccessToken,
        ]);
    }
}
