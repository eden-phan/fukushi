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
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('day_shift_staff_id')->nullable();
            $table->unsignedBigInteger('night_shift_staff_id')->nullable();
            $table->date('entry_date');
            $table->text('support_content')->nullable();
            $table->text('work_details')->nullable();
            $table->text('note')->nullable();
            $table->text('night_shift_note')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('day_shift_staff_id')
                ->references('id')->on('users')->onDelete('set null');

            $table->foreign('night_shift_staff_id')
                ->references('id')->on('users')->onDelete('set null');

            $table->foreign('created_by')
                ->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
