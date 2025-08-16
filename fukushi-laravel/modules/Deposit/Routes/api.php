<?php

use Illuminate\Support\Facades\Route;
use Modules\Deposit\Controllers\DepositController;

Route::middleware('auth:api')->prefix('deposit')->group(function () {
    Route::get('/', [DepositController::class, 'index']);
    Route::get('/item/{id}', [DepositController::class, 'getListDepositItemsById']);
    Route::delete('deposit-items/{id}', [DepositController::class, 'deleteDepositItem']);
    Route::post('create/{form_id}', [DepositController::class, 'createDepositItem']);
    Route::put('deposit-items/{id}', [DepositController::class, 'updateDepositItem']);
    Route::get('item-detail/{id}', [DepositController::class, 'getDepositDetailItem']);
});
