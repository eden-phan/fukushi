<?php

use Illuminate\Support\Facades\Route;
use Modules\ServiceProvisionLog\Controllers\ServiceProvisionLogController;

Route::middleware('auth:api')->prefix('service-provision-log')->group(function () {
    Route::get('/', [ServiceProvisionLogController::class, 'index']);
    Route::get('/{id}', [ServiceProvisionLogController::class, 'show']);
    Route::post('/', [ServiceProvisionLogController::class, 'store']);
    Route::put('/{id}', [ServiceProvisionLogController::class, 'update']);
    Route::delete('/{id}', [ServiceProvisionLogController::class, 'destroy']);
});
