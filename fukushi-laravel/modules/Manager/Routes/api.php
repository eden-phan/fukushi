<?php

use Illuminate\Support\Facades\Route;
use Modules\Manager\Controllers\ManagerController;

Route::middleware('auth:api')->prefix('manager')->group(function () {
    Route::get('/', [ManagerController::class, 'index']);
    Route::get('/check-email', [ManagerController::class, 'checkExistedEmail']);
    Route::get('/{id}', [ManagerController::class, 'show']);
    Route::post('/', [ManagerController::class, 'store']);
    Route::put('/{id}', [ManagerController::class, 'update']);
    Route::delete('/{id}', [ManagerController::class, 'destroy']);
});
