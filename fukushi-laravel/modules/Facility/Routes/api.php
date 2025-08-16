<?php

use Illuminate\Support\Facades\Route;
use Modules\Facility\Controllers\FacilityController;

Route::middleware('auth:api')->prefix('facility')->group(function () {
    Route::get('/', [FacilityController::class, 'index']);
    Route::get('/{id}', [FacilityController::class, 'show']);
    Route::post('/', [FacilityController::class, 'store']);
    Route::put('/{id}', [FacilityController::class, 'update']);
    Route::delete('/{id}', [FacilityController::class, 'destroy']);
});
