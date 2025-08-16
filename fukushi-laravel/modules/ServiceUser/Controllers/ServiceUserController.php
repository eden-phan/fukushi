<?php

namespace Modules\ServiceUser\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\ServiceUser\Repositories\ServiceUserRepository;
use Modules\ServiceUser\Requests\CreateServiceUserWithConsultationRequest;
use Modules\ServiceUser\Requests\ServiceUserIdRequest;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ServiceUserController extends Controller
{
    protected $serviceUserRepository;

    public function __construct(ServiceUserRepository $serviceUserRepository)
    {
        $this->serviceUserRepository = $serviceUserRepository;
    }

    public function getAllFamilyMemberWithServiceUserId(ServiceUserIdRequest $request)
    {
        $serviceUserId = $request->query('service_user_id');

        if (!$serviceUserId) {
            return ApiResponse::error();
        }

        try {
            $data = $this->serviceUserRepository->getAllFamilyMemberWithServiceUserId($serviceUserId);
            return ApiResponse::success($data);
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

    public function getAllProfileWithServiceUser()
    {
        try {
            $data = $this->serviceUserRepository->getAllProfileWithServiceUser();
            return ApiResponse::success($data);
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

    public function index()
    {
        $users = $this->serviceUserRepository->getAll(
            perPage: request()->get('per_page', 10),
            page: request()->get('page', 1),
            sortBy: request()->get('sortBy', 'created_at'),
            sortDirection: request()->get('sortDirection', 'desc'),
            search: request()->get('keyword'),
            facility: request()->get('facility'),
            status: request()->get('status'),
            with: [
                'profile'
            ],
        );
        return ApiResponse::success($users);
    }

    public function update($id,Request $data){
        $patient = $this->serviceUserRepository->updatePatient($id, $data);
        return ApiResponse::success($patient);
    }


    public function show($id)
    {
        $users = $this->serviceUserRepository->findById($id);
        return ApiResponse::success($users);
    }


    public function storeWithConsultation(CreateServiceUserWithConsultationRequest $request)
    {
        try {
            $data = $request->validated();

            $serviceUser = $this->serviceUserRepository->createServiceUserWithConsultation($data);

            return ApiResponse::success($serviceUser, 'Service User created successfully.', 201);
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
}
