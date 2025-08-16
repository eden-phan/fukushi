<?php

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;

class SupportPlanReviewController extends Controller
{
    protected $supportPlanReviewRepository;

    public function __construct(SupportPlanReviewRepository $supportPlanReviewRepository)
    {
        $this->supportPlanReviewRepository = $supportPlanReviewRepository;
    }

    public function index()
    {
        $item = $this->supportPlanReviewRepository->getAll();
        return ApiResponse::success($item);
    }
}
