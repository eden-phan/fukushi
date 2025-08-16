<?php



use Illuminate\Support\Facades\Route;
use Modules\InformationConsent\Controllers\InformationController;

Route::middleware('auth:api')->prefix('information-consent')->group(function () {
    Route::post('/create/{id}', [InformationController::class, 'create']);
    Route::put('/update/{id}', [InformationController::class, 'update']);
    Route::get('/{id}', [InformationController::class, 'index']);
});
