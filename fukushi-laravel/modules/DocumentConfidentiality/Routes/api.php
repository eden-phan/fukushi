<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentConfidentiality\Controllers\DocumentConfidentialityController;

Route::middleware('auth:api')->prefix('document-confidentiality')->group(function () {
    Route::get('/{id}', [DocumentConfidentialityController::class, 'show']);
    Route::post('/', [DocumentConfidentialityController::class, 'store']);
    Route::put('/{id}', [DocumentConfidentialityController::class, 'update']);
});
