<?php

use Illuminate\Support\Facades\Route;
use Modules\ServiceUser\Controllers\ServiceUserController;

Route::middleware('auth:api')->prefix('service-user')->group(function () {
    Route::get('/index', [ServiceUserController::class, 'index']);
    Route::get('/profile', [ServiceUserController::class, 'getAllProfileWithServiceUser']);
    Route::get('/family-member', [ServiceUserController::class, 'getAllFamilyMemberWithServiceUserId']);
    Route::get('/{id}', [ServiceUserController::class, 'show']);
    Route::put('/{id}', [ServiceUserController::class, 'update']);
    Route::post('/consultation', [ServiceUserController::class, 'storeWithConsultation']);
});
