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
        if (!Schema::hasTable('documents')) {
            Schema::create('documents', function (Blueprint $table) {
                $table->id();
                $table->foreignId('service_user_id')->nullable()->constrained('service_users')->onDelete('cascade');
                $table->foreignId('staff_id')->nullable()->constrained('users')->onDelete('cascade');
                $table->date('document_date')->nullable();
                $table->string('document_type')->nullable();
                $table->integer('status')->nullable();
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->unsignedBigInteger("file")->nullable();
                $table->foreign('file')->references('id')->on('medias')->onDelete('set null');
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('cascade');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
