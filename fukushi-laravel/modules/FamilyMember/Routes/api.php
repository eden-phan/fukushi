<?php

use Illuminate\Support\Facades\Route;
use Modules\FamilyMember\Controllers\FamilyMemberController;

Route::middleware('auth:api')->prefix('family-member')->group(function () {
    Route::get('/', [FamilyMemberController::class, 'index']);
    Route::get('/{id}', [FamilyMemberController::class, 'show']);
    Route::get('/consultation/{id}', [FamilyMemberController::class, 'getByConsultation']);
    Route::post('/', [FamilyMemberController::class, 'store']);
    Route::put('/{id}', [FamilyMemberController::class, 'update']);
    Route::delete('/{id}', [FamilyMemberController::class, 'destroy']);
});
