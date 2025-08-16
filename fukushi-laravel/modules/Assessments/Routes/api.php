<?php

use Modules\Assessments\Controllers\AssessmentsController;

Route::middleware('auth:api')->prefix('assessments')->group(function () {
    Route::get('/index/{id}', [AssessmentsController::class, 'index']);
    Route::get('/{id}', [AssessmentsController::class, 'show']);
    Route::post('/store', [AssessmentsController::class, 'store']);
    Route::put('/update/{id}', [AssessmentsController::class, 'update']);
    Route::delete('/destroy/{id}', [AssessmentsController::class, 'destroy']);
});