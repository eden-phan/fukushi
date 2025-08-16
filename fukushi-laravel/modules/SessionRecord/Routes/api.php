<?php

use Illuminate\Support\Facades\Route;
use Modules\SessionRecord\Controllers\SessionController;

Route::middleware('auth:api')->prefix('session')->group(function () {
    Route::get('/index', [SessionController::class, 'index']);
    Route::get('/{id}', [SessionController::class, 'show']);
    Route::post('/store', [SessionController::class, 'store']);
    Route::put('/update/{id}', [SessionController::class, 'update']);
    Route::delete('/destroy/{id}', [SessionController::class, 'destroy']);
});
