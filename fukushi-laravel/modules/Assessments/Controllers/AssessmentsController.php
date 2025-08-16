<?php

namespace Modules\Assessments\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Modules\Assessments\Repositories\AssessmentRepository;
use Modules\Assessments\Requests\CreateAssessmentRequest;
use Modules\Assessments\Requests\UpdateAssessmentRequest;

class AssessmentsController extends Controller
{
    protected $assessmentRepository;

    public function __construct(AssessmentRepository $assessmentRepository)
    {
        $this->assessmentRepository = $assessmentRepository;
    }

    public function index($id)
    {
        $item = $this->assessmentRepository->getListAssessments(
            $id,
            request()->get('per_page', 10),
            request()->get('page', 1),
            request()->get('year')
        );
        return ApiResponse::success($item);
    }

    public function show($id)
    {
        $assessment = $this->assessmentRepository->getAssessment($id);
        if (!$assessment) {
            return ApiResponse::error('Assessment not found', 404);
        }
        return ApiResponse::success($assessment);
    }

    public function store(CreateAssessmentRequest $request)
    {
        $assessment = $this->assessmentRepository->createAssessment($request->validated());
        return ApiResponse::success($assessment, 'Assessment created successfully', 201);
    }

    public function update(UpdateAssessmentRequest $request, $id)
    {
        $assessment = $this->assessmentRepository->updateAssessment($id, $request->validated());
        if (!$assessment) {
            return ApiResponse::error('Assessment not found', 404);
        }
        return ApiResponse::success($assessment, 'Assessment updated successfully');
    }

    public function destroy($id)
    {
        $result = $this->assessmentRepository->deleteAssessment($id);
        if (!$result) {
            return ApiResponse::error('Assessment not found', 404);
        }
        return ApiResponse::success(null, 'Assessment deleted successfully');
    }

    public function deleteMedicalHistory($assessmentId, $historyId)
    {
        $assessment = $this->assessmentRepository->getAssessment($assessmentId);
        if (!$assessment) {
            return ApiResponse::error('Assessment not found', 404);
        }

        $result = $this->assessmentRepository->deleteMedicalDisabilityHistory(
            $historyId, 
            $assessment->service_user_id
        );

        if (!$result) {
            return ApiResponse::error('Medical disability history not found', 404);
        }

        return ApiResponse::success(null, 'Medical disability history deleted successfully');
    }
}