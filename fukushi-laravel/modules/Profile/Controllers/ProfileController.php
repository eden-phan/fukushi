<?php

namespace Modules\Profile\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Modules\Profile\Repositories\ProfileRepository;
use Modules\Profile\Requests\CreateProfileRequest;
use Modules\Profile\Requests\EditProfileRequest;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;


class ProfileController extends Controller
{
    protected $profileRepository;

    public function __construct(ProfileRepository $profileRepository)
    {
        $this->profileRepository = $profileRepository;
    }

    public function me()
    {
        $user = auth()->user();
        if (!$user) {
            return ApiResponse::error('Không tìm thấy user', 404);
        }
        $user = $this->profileRepository->findById($user->id);
        return response()->json($user);
    }

    public function show($id)
    {

        $user = $this->profileRepository->findById($id);
        return response()->json($user);
    }

    public function index()
    {
        $users = $this->profileRepository->getAll(
            perPage: request()->get('per_page', 10),
            page: request()->get('page', 1),
            sortBy: request()->get('sortBy', 'created_at'),
            sortDirection: request()->get('sortDirection', 'desc'),
            search: request()->get('keyword'),
            status: request()->get('status'),
            type: request()->get('type'),
            with: ['profile'],
        );
        return ApiResponse::success($users);
    }

    public function getUserOptions()
    {
        try {
            $userOptions = $this->profileRepository->getUserOptions();
            return ApiResponse::success($userOptions);
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }
            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }

    public function getPatientOptions()
    {
        try {
            $patientOptions = $this->profileRepository->getPatientOptions();
            return ApiResponse::success($patientOptions);
        } catch (\Exception $e) {
            $statusCode = 500;
            if ($e instanceof HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            }
            return ApiResponse::error(
                message: $e->getMessage(),
                code: $statusCode
            );
        }
    }

    public function create(CreateProfileRequest $request)
    {
        $validated = $request->validated();
        $profile = $this->profileRepository->createUserWithProfile($validated);

        return ApiResponse::success([
            'profile' => $profile,
        ], 'Tạo tài khoản và profile thành công');
    }


    public function update(EditProfileRequest $request, $id)
    {
        $data = $request->all();
        $user = $this->profileRepository->updateUserWithProfile($id, $data);

        if (!$user) {
            return ApiResponse::error('Không tìm thấy user', 404);
        }

        return ApiResponse::success([
            'user' => $user,
        ], 'Update Success');
    }

    public function destroy($id)
    {
        $result = $this->profileRepository->destroyUserAndProfile($id);
        if (!$result) {
            return ApiResponse::error('Không tìm thấy user', 404);
        }
        return ApiResponse::success(null, 'Xóa user và profile thành công');
    }

    public function checkEmail(Request $request)
    {
        $email = $request->query('param');
        $id = $request->query('id');

        $exists = $this->profileRepository->isEmailExists($email,  $id);

        return ApiResponse::success(['exists' => $exists]);
    }
}
