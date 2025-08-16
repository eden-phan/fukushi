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
        if (!Schema::hasTable('support_plan_goals')) {
            Schema::create('support_plan_goals', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('support_plan_id')->nullable();
                $table->string('domain')->nullable();
                $table->json('support_category')->nullable();
                $table->text('goal')->nullable();
                $table->text('support_content')->nullable();
                $table->text('progress_first_term')->nullable();
                $table->text('progress_second_term')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_plan_goals');
    }
};
