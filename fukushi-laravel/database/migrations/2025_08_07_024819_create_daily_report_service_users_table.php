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
        Schema::create('daily_report_service_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('daily_report_id');
            $table->unsignedBigInteger('service_user_id');
            $table->boolean('overnight_stay')->nullable();
            $table->boolean('hospitalized')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('daily_report_id')->references('id')->on('daily_reports')->onDelete('cascade');
            $table->foreign('service_user_id')->references('id')->on('service_users')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_report_service_users');
    }
};
