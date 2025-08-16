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
        if (!Schema::hasTable('service_user_family_member')) {
            Schema::create('service_user_family_member', function (Blueprint $table) {
                $table->id();
                $table->foreignId('consultation_id')->nullable()->constrained('consultations')->onDelete('cascade');
                $table->foreignId('service_user_id')->nullable()->constrained('service_users')->onDelete('cascade');
                $table->foreignId('family_member_id')->nullable()->constrained('family_members')->onDelete('cascade');
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
        Schema::dropIfExists('service_user_family_member');
    }
};
