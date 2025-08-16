<?php

use Illuminate\Support\Facades\Route;
use Modules\SupportPlan\Controllers\SupportPlanController;

Route::middleware('auth:api')->prefix('support-plan')->group(function () {
    Route::get('/index/{id}', [SupportPlanController::class, 'index']);
    Route::get('/detail/{id}', [SupportPlanController::class, 'getSupportPlanItemById']);
    Route::post('/create/{id}', [SupportPlanController::class, 'createSupportPlanByPatientId']);
    Route::put('/edit/{id}', [SupportPlanController::class, 'updateSupportPlanById']);
    Route::delete('/destroy/{id}', [SupportPlanController::class, 'deleteSupportPlan']);


});
