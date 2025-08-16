<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use App\Helpers\ApiResponse;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;


class UserController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index()
    {
        try {
            $consultations = $this->userRepository->getAllUser(
                getAll: filter_var(request()->get('getAll', false), FILTER_VALIDATE_BOOLEAN),
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: request()->get('filters', []),
            );
            return ApiResponse::success($consultations);
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

    public function getAllStaff()
    {
        try {
            $consultations = $this->userRepository->getAllStaff();
            return ApiResponse::success($consultations);
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
