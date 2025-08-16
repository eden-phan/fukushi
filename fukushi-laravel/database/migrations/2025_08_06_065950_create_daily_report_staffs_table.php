<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_report_staffs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('daily_report_id');
            $table->unsignedBigInteger('staff_id');
            $table->text('work_content')->nullable();
            $table->enum('shift_type', ['day_shift', 'night_shift'])->nullable();
            $table->json('shift_hours')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('daily_report_id')->references('id')->on('daily_reports')->onDelete('cascade');
            $table->foreign('staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_report_staffs');
    }
};