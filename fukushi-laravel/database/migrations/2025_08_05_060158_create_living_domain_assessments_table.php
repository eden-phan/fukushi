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
        Schema::create('living_domain_assessments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('assessment_id')->nullable();
            $table->string('key', 255)->nullable();
            $table->text('current_status')->nullable();
            $table->text('preference')->nullable();
            $table->text('support_needed')->nullable();
            $table->text('environment_limitations_notes')->nullable();
            $table->text('abilities_limitations_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('living_domain_assessments');
    }
};
