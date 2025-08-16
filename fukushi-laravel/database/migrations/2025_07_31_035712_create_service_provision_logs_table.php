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
        if (!Schema::hasTable('service_provision_logs')) {
            Schema::create('service_provision_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('staff_id')->nullable()->constrained('users')->onDelete('cascade');
                $table->foreignId('service_user_id')->nullable()->constrained('service_users')->onDelete('cascade');
                $table->date('date')->nullable();
                $table->string('meal_provided')->nullable();    //json 朝,昼,夜
                $table->string('medication')->nullable();
                $table->time('wake_up_time')->nullable();
                $table->time('bed_time')->nullable();
                $table->boolean('daytime_activity')->nullable();
                $table->string('daytime_activity_content')->nullable();
                $table->string('condition')->nullable();
                $table->string('overnight_stay')->nullable();
                $table->string('hospital_facility')->nullable();
                $table->string('other_note')->nullable();
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
        Schema::dropIfExists('service_provision_logs');
    }
};
