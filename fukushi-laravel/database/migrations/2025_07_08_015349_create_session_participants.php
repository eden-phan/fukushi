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
        if (!Schema::hasTable('session_participants')) {
            Schema::create('session_participants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("session_record_id")->nullable();
            $table->unsignedBigInteger("user_id")->nullable();
            $table->string("status")->nullable(); // e.g., 'attending', 'absent', 'cancelled'
            $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_participants');
    }
};
