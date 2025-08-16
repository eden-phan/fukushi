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
        if (!Schema::hasTable('support_plan_reviews')) {
            Schema::create('support_plan_reviews', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('support_plan_id');
                $table->date('meeting_date');
                $table->text('content');
                $table->text('opinion');
                $table->text('change');
                $table->unsignedBigInteger('created_by');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_plan_reviews');
    }
};
