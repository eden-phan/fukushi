<?php

namespace Modules\DailyReport\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Modules\DailyReport\Repositories\DailyReportRepository;
use Modules\DailyReport\Requests\CreateDailyReportRequest;
use Modules\DailyReport\Requests\UpdateDailyReportRequest;

class DailyReportController extends Controller
{
    protected $dailyReportRepository;

    public function __construct(DailyReportRepository $dailyReportRepository)
    {
        $this->dailyReportRepository = $dailyReportRepository;
    }

    public function index(Request $request)
    {
        $filters = [
            'keyword' => $request->input('keyword'),
            'work_shift' => $request->input('work_shift'),
            'entry_date_from' => $request->input('entry_date_from'),
            'entry_date_to' => $request->input('entry_date_to'),
        ];

        $dailyReports = $this->dailyReportRepository->getListDailyReports(
            $request->get('per_page', 10),
            $request->get('page', 1),
            $filters
        );

        return ApiResponse::success($dailyReports);
    }

    public function show($id)
    {
        $dailyReport = $this->dailyReportRepository->getDailyReport($id);
        if (!$dailyReport) {
            return ApiResponse::error('Daily report not found', 404);
        }
        return ApiResponse::success($dailyReport);
    }

    public function store(CreateDailyReportRequest $request)
    {
        Log::info('Creating daily report', ['data' => $request->validated()]);
        $dailyReport = $this->dailyReportRepository->createDailyReport($request->validated());
        return ApiResponse::success($dailyReport, 'Daily report created successfully', 201);
    }

    public function update(UpdateDailyReportRequest $request, $id)
    {
        $dailyReport = $this->dailyReportRepository->updateDailyReport($id, $request->validated());
        if (!$dailyReport) {
            return ApiResponse::error('Daily report not found', 404);
        }
        return ApiResponse::success($dailyReport, 'Daily report updated successfully');
    }

    public function destroy($id)
    {
        $result = $this->dailyReportRepository->deleteDailyReport($id);
        if (!$result) {
            return ApiResponse::error('Daily report not found', 404);
        }
        return ApiResponse::success(null, 'Daily report deleted successfully');
    }
}