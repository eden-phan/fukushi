<?php

use Illuminate\Support\Facades\Route;
use Modules\Profile\Controllers\ProfileController;



Route::middleware('auth:api')->prefix('profile')->group(function () {
    Route::get('/me', [ProfileController::class, 'me']);
    Route::get('/', [ProfileController::class, 'index']);
    Route::get('/patient-options', [ProfileController::class, 'getPatientOptions']);
    Route::get('/user-options', [ProfileController::class, 'getUserOptions']);
    Route::get('/check-email', [ProfileController::class, 'checkEmail']);
    Route::get('/{id}', [ProfileController::class, 'show']);
    Route::post('/', [ProfileController::class, 'create']);
    Route::put('/{id}', [ProfileController::class, 'update']);
    Route::delete('/{id}', [ProfileController::class, 'destroy']);
});
