<?php
namespace Modules\Auth\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Helpers\ApiResponse;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class ForgotPasswordService
{
    public function sendResetLink(array $data) : \Illuminate\Http\JsonResponse
    {
        $user = User::query()->where('email', $data['email'])->first();
        if (!$user) {
            return ApiResponse::error('電子メールが存在しません', 404);
        }

        // Create token
        $token = JWTAuth::customClaims([
            'reset_password' => true,
            'exp' => Carbon::now()->addMinutes((int)config('jwt.refresh_ttl'))->timestamp,
        ])->fromUser($user);

        $resetLink = config('app.fe_url') . "/reset-password?token=$token&email=$user->email";

        // Send email
        Mail::send('emails.forgot-password', ['resetLink' => $resetLink], function ($message) use ($user) {
            $message->to($user->email)->subject('Forgot Password');
        });

        // Return response
        return ApiResponse::success(null, '30分以内にメールに記載されたURLを<br>クリックし、会員登録を完了させてください。');
    }

    public function resetPassword(array $data) : \Illuminate\Http\JsonResponse
    {
        try {
            // Decode token to get user
            $payload = JWTAuth::setToken($data['token'])->getPayload();

            // check token reset password
            if (!$payload->get('reset_password')) {
                return ApiResponse::error('無効なトークン');
            }

            $user = JWTAuth::setToken($data['token'])->authenticate();

            if (!$user) {
                return ApiResponse::error('このメールアドレスは登録されていません');
            }

            // Update new password
            $user->password = Hash::make($data['password']);
            $user->save();

            // Invalidate the token
            JWTAuth::invalidate($data['token']);

            return ApiResponse::success(null, 'パスワードが更新されました');

        } catch (JWTException $e) {
            return ApiResponse::error('無効なトークン');
        }
    }
}
