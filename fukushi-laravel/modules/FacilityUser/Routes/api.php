<?php

use Illuminate\Support\Facades\Route;
use Modules\FacilityUser\Controllers\FacilityUserController;

Route::middleware('auth:api')->prefix('facility-user')->group(function () {
    Route::get('/', [FacilityUserController::class, 'index']);
});
