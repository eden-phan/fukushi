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
        if (!Schema::hasTable('incidents')) {
            Schema::create('incidents', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reporter_id')->nullable()->constrained('users')->onDelete('cascade');
                $table->foreignId('service_user_id')->nullable()->constrained('service_users')->onDelete('cascade');
                $table->date('report_date')->nullable();
                $table->dateTime('incident_date')->nullable();
                $table->string('location')->nullable();
                $table->longText('incident_type')->nullable();
                $table->string('incident_detail')->nullable();
                $table->text('response')->nullable();
                $table->text('prevent_plan')->nullable();
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
        Schema::dropIfExists('incidents');
    }
};
