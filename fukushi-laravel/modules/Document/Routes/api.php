<?php

use Illuminate\Support\Facades\Route;
use Modules\Document\Controllers\DocumentController;
use Modules\Document\Controllers\DocumentConsentController;
use Modules\Document\Controllers\DocumentReceiveMoneyController;
use Modules\Document\Controllers\DocumentPaymentController;
use Modules\Document\Controllers\DocumentFinancialPolicyController;

Route::middleware('auth:api')->prefix('document')->group(function () {
    Route::post('/{id}', [DocumentController::class, 'create']);
    Route::get('/user/{userId}', [DocumentController::class, 'getDocumentsByUserId']);
    Route::put('/{id}', [DocumentController::class, 'update']);
});

/** Document Consent */
Route::middleware('auth:api')->prefix('document-consent')->group(function () {
    Route::get('/', [DocumentConsentController::class, 'getAllWithServiceUser']);
    Route::get('/index', [DocumentConsentController::class, 'index']);
    Route::get('/{id}', [DocumentConsentController::class, 'show']);
    Route::post('/', [DocumentConsentController::class, 'store']);
    Route::put('/{id}', [DocumentConsentController::class, 'update']);
    Route::delete('/{id}', [DocumentConsentController::class, 'destroy']);
});

/** Document Receive Money */
Route::middleware('auth:api')->prefix('document-receive-money')->group(function () {
    Route::get('/', [DocumentReceiveMoneyController::class, 'index']);
    Route::get('/patient-options', [DocumentReceiveMoneyController::class, 'getPatientOptions']);
    Route::get('/{id}', [DocumentReceiveMoneyController::class, 'show']);
    Route::post('/', [DocumentReceiveMoneyController::class, 'store']);
    Route::put('/{id}', [DocumentReceiveMoneyController::class, 'update']);
    Route::delete('/{id}', [DocumentReceiveMoneyController::class, 'destroy']);
});

/** Document Payment */
Route::middleware('auth:api')->prefix('document-payment')->group(function () {
    Route::get('/', [DocumentPaymentController::class, 'index']);
    Route::get('/{id}', [DocumentPaymentController::class, 'show']);
    Route::post('/', [DocumentPaymentController::class, 'store']);
    Route::put('/{id}', [DocumentPaymentController::class, 'update']);
    Route::delete('/{id}', [DocumentPaymentController::class, 'destroy']);
});

/** Document Financial Policy */
Route::middleware('auth:api')->prefix('document-financial-policy')->group(function () {
    Route::get('/', [DocumentFinancialPolicyController::class, 'index']);
    Route::post('/', [DocumentFinancialPolicyController::class, 'store']);
    Route::put('/{id}', [DocumentFinancialPolicyController::class, 'update']);
});
