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
        if (!Schema::hasTable('support_plans')) {
            Schema::create('support_plans', function (Blueprint $table) {
                $table->id();
                $table->string('plan_type')->nullable();
                $table->unsignedBigInteger('service_user_id')->nullable();
                $table->unsignedBigInteger('staff_id')->nullable();
                $table->string('service_type')->nullable();
                $table->text('user_family_intention')->nullable();
                $table->text('yearly_support_goal')->nullable();
                $table->integer('status')->nullable();
                $table->integer('is_assessed')->nullable();
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
        Schema::dropIfExists('support_plans');
    }
};
