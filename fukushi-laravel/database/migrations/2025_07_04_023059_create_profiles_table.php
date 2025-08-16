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
        if (!Schema::hasTable('profiles')) {
            Schema::create('profiles', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('user_type')->nullable();
                $table->string('fullname')->nullable();
                $table->string('furigana')->nullable();
                $table->date('dob')->nullable();
                $table->string('phone_number')->nullable();
                $table->integer('avatar')->nullable();
                $table->boolean('gender')->nullable();
                $table->string('district')->nullable();
                $table->string('prefecture')->nullable();
                $table->string('address')->nullable();
                $table->integer('company')->nullable();
                $table->integer('status')->nullable();
                $table->string('postal_code')->nullable();
                $table->string('family_name')->nullable();
                $table->string('relationship')->nullable();
                $table->string('family_phone')->nullable();
                $table->integer('file')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
