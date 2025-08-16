<?php

namespace Modules\SupportPlan\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Modules\SupportPlan\Repositories\SupportPlanRepository;
use Illuminate\Http\Request;

class SupportPlanController extends Controller
{
    protected $supportPlanRepository;

    public function __construct(SupportPlanRepository $supportPlanRepository)
    {
        $this->supportPlanRepository = $supportPlanRepository;
    }

    public function index($id)
    {
        $item = $this->supportPlanRepository->getListSupportPlanById(
            $id,
            request()->get('per_page', 10),
            request()->get('page', 1),
            request()->get('year')
        );
        return ApiResponse::success($item);
    }

    public function createSupportPlanByPatientId($id, Request $request)
    {
        $validated = $request->validate([
            'community_life' => 'nullable|array',
            'daily_life' => 'nullable|array',
            'health' => 'nullable|array',
            'leisure' => 'nullable|array',
            'other_support' => 'nullable|array',
            'user_family_intention' => 'nullable|string',
            'yearly_support_goal' => 'nullable|string',
            'staff_id' => 'nullable|integer',
            'status' => 'nullable|integer',
            'is_assessed' => 'nullable|integer',
            // validate support_details
            'support_details' => 'nullable|array',
            'support_details.*.time' => 'nullable|string',
            'support_details.*.item' => 'nullable|string',
            'support_details.*.detail' => 'nullable|string',
        ]);
        try {
            $supportPlan = $this->supportPlanRepository->createSupportPlanByPatientId($id, $validated);
            return ApiResponse::success($supportPlan, 'Tạo kế hoạch hỗ trợ thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function updateSupportPlanById($id, Request $request)
    {
        $data = $request->all();

        $supportPlan = $this->supportPlanRepository->updateSupportPlanById($id, $data);

        return response()->json([
            'message' => 'Cập nhật kế hoạch hỗ trợ thành công.',
            'data' => $supportPlan
        ]);
    }


    public function getSupportPlanItemById($id)
    {
        $data = $this->supportPlanRepository->getSupportPlanItemById($id);
        return ApiResponse::success(($data));
    }

    public function deleteSupportPlan($id)
    {
         $this->supportPlanRepository->deleteSupportPlan($id);
        return ApiResponse::success('Deleted successfully.');

    }
}
