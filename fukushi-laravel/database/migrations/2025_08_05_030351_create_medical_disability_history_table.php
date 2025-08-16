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
        Schema::create('medical_disability_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_user_id');
            $table->date('date');
            $table->text('detail');
            $table->timestamps();

            $table->foreign('service_user_id')->references('id')->on('service_users')->onDelete('cascade');
            $table->index(['service_user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_disability_history');
    }
};
