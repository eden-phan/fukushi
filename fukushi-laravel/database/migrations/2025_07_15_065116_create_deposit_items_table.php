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
        if (!Schema::hasTable('deposit_items')) {
            Schema::create('deposit_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('form_id')->nullable();
                $table->string('name')->nullable();
                $table->integer('amount')->nullable();
                $table->date('deposit_date')->nullable();
                $table->string('return_address')->nullable();
                $table->text('note')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deposit_items');
    }
};
