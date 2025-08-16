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
        if (!Schema::hasTable('session_records')) {
            Schema::create('session_records', function (Blueprint $table) {
            $table->id();
            $table->string("record_type")->nullable();
            $table->string("theme")->nullable();
            $table->date("date")->nullable();
                $table->time("start_time")->nullable();
                $table->time("end_time")->nullable();
            $table->string("location")->nullable();
            $table->text("content")->nullable();
            $table->text("feedback")->nullable();
            $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_records');
    }
};
