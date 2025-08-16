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
        if (!Schema::hasTable('deposits')) {
            Schema::create('deposits', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('service_user_id')->nullable();
                $table->unsignedBigInteger('staff_id')->nullable();
                $table->date('pickup_date')->nullable();
                $table->date('return_date')->nullable();
                $table->unsignedBigInteger('facility_id')->nullable();
                $table->integer('status')->nullable();
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
        Schema::dropIfExists('deposits');
    }
};
