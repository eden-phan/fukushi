<?php

namespace Modules\FamilyMember\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Modules\FamilyMember\Repositories\FamilyMemberRepository;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Modules\FamilyMember\Requests\CreateFamilyMemberRequest;
use Modules\FamilyMember\Requests\UpdateFamilyMemberRequest;
use Modules\Consultation\Models\Consultation;

class FamilyMemberController extends Controller
{
    protected $familyMemberRepository;

    public function __construct(FamilyMemberRepository $familyMemberRepository)
    {
        $this->familyMemberRepository = $familyMemberRepository;
    }

    public function getByConsultation($consultationId)
    {
        try {
            $members = $this->familyMemberRepository->getAllFamilyMemberByConsultationId($consultationId);
            return ApiResponse::success($members);
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
        try {
            $familyMembers = $this->familyMemberRepository->getAllFamilyMember(
                getAll: filter_var(request()->get('getAll', false), FILTER_VALIDATE_BOOLEAN),
                page: request()->get('page', 1),
                sortBy: request()->get('sortBy', 'created_at'),
                sortDirection: request()->get('sortDirection', 'desc'),
                search: request()->get('search'),
                filters: request()->get('filters', []),
            );
            return ApiResponse::success($familyMembers);
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

    public function show($id)
    {
        try {
            $familyMembers = $this->familyMemberRepository->findFamilyMemberById($id);
            if (!$familyMembers) {
                return ApiResponse::error('Family Member not found.', 404);
            }
            return ApiResponse::success($familyMembers);
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

    public function store(CreateFamilyMemberRequest $request)
    {
        try {
            $data = $request->validated();

            $consultationId = $data['consultation_id'];
            $familyMembersData = $data['family_members'] ?? [];

            $this->familyMemberRepository->createFamilyMembersWithConsultation(
                consultationId: $consultationId,
                familyMembersData: $familyMembersData
            );

            return ApiResponse::success(null, 'Family Members processed successfully.', 201);
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

    public function update(UpdateFamilyMemberRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $familyMember = $this->familyMemberRepository->updateFamilyMember($id, $data);

            if (!$familyMember) {
                return ApiResponse::error('Family Member not found.', 404);
            }

            return ApiResponse::success($familyMember, 'Family Member updated successfully.');
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

    public function destroy($id)
    {
        try {
            $deleted = $this->familyMemberRepository->deleteFamilyMember($id);

            if (!$deleted) {
                return ApiResponse::error('Family Member not found.', 404);
            }

            return ApiResponse::success(null, 'Family Member deleted successfully.');
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
