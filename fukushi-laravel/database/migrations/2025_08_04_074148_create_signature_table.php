<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('signatures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('document_id');
            $table->string('document_type'); // e.g., 'session_record', 'other'
            $table->string('signature_type'); // e.g., 'admin', 'child_support_manager', 'recorder'
            $table->string('signature_value'); // e.g., base64 encoded signature image
            $table->timestamp('signed_at')->nullable(); // When the signature was made
            $table->unsignedBigInteger('signed_by')->nullable(); // User ID of the person
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signatures');
    }
};
