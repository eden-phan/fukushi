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
        if (!Schema::hasTable('support_plan_details')) {
            Schema::create('support_plan_details', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('support_plan_id')->nullable();
                $table->time('activity_time')->nullable();
                $table->string('activity_name')->nullable();
                $table->text('description')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_plan_details');
    }
};
