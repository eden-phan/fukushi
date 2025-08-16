<?php

use Illuminate\Support\Facades\Route;
use Modules\Incident\Controllers\IncidentController;

Route::middleware('auth:api')->prefix('incident')->group(function () {
    Route::get('/', [IncidentController::class, 'index']);
    Route::get('/{id}', [IncidentController::class, 'show']);
    Route::post('/', [IncidentController::class, 'store']);
    Route::put('/{id}', [IncidentController::class, 'update']);
    Route::delete('/{id}', [IncidentController::class, 'destroy']);
});
