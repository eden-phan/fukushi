<?php
use Illuminate\Support\Facades\Route;
use Modules\Media\Controllers\MediaController;

Route::middleware('auth:api')->prefix('media')->group(function () {
    Route::post('/', [MediaController::class, 'store']);
    Route::get('/{id}', [MediaController::class, 'show']);
    Route::delete('/{id}', [MediaController::class, 'destroy']);
});