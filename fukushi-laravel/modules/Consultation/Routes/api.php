<?php

use Illuminate\Support\Facades\Route;
use Modules\Consultation\Controllers\ConsultationController;

Route::middleware('auth:api')->prefix('consultation')->group(function () {
    Route::get('/', [ConsultationController::class, 'index']);
    Route::get('/{id}', [ConsultationController::class, 'show']);
    Route::post('/', [ConsultationController::class, 'store']);
    Route::put('/{id}', [ConsultationController::class, 'update']);
    Route::put('/accept-consultation/{id}', [ConsultationController::class, 'acceptConsultation']);
    Route::put('/reject-consultation/{id}', [ConsultationController::class, 'rejectConsultation']);
    Route::delete('/{id}', [ConsultationController::class, 'destroy']);
});
