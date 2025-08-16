<?php

use Modules\DailyReport\Controllers\DailyReportController;

Route::middleware('auth:api')->prefix('daily-reports')->group(function () {
    Route::get('/index', [DailyReportController::class, 'index']);
    Route::get('/{id}', [DailyReportController::class, 'show']);
    Route::post('/store', [DailyReportController::class, 'store']);
    Route::put('/update/{id}', [DailyReportController::class, 'update']);
    Route::delete('/destroy/{id}', [DailyReportController::class, 'destroy']);
});