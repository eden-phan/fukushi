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
        if (!Schema::hasTable('facilities')) {
            Schema::create('facilities', function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable();
                $table->string('service_type')->nullable();
                $table->string('facility_type')->nullable();
                $table->string('postal_code')->nullable();
                $table->string('prefecture')->nullable();
                $table->string('district')->nullable();
                $table->string('address')->nullable();
                $table->smallInteger('status')->nullable();
                $table->string('description')->nullable();
                $table->softDeletes(); 
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
