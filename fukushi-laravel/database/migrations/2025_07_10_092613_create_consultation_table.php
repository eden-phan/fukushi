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
        if (!Schema::hasTable('consultations')) {
            Schema::create('consultations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('facility_id')->nullable()->constrained('facilities')->onDelete('cascade');

                // Basic information
                $table->date('date')->nullable();
                $table->string('furigana')->nullable();
                $table->string('full_name')->nullable();
                $table->string('method')->nullable();
                $table->string('transit_agency')->nullable();
                $table->foreignId('staff_id')->nullable()->constrained('users')->onDelete('cascade');
                $table->smallInteger('gender')->nullable();

                // User information
                $table->string('disability_certificate_type')->nullable();
                $table->smallInteger('disability_category')->nullable();
                $table->smallInteger('disability_level')->nullable();
                $table->date('dob')->nullable();
                $table->string('postal_code')->nullable();
                $table->string('prefecture')->nullable();
                $table->string('district')->nullable();
                $table->string('address')->nullable();
                $table->string('telephone')->nullable();
                $table->string('fax')->nullable();
                $table->string('disability_name')->nullable();

                // Consultation information
                $table->string('consultant_name')->nullable();
                $table->string('consultant_relationship')->nullable();
                $table->string('consultant_postal_code')->nullable();
                $table->string('consultant_prefecture')->nullable();
                $table->string('consultant_district')->nullable();
                $table->string('consultant_street')->nullable();
                $table->string('consultant_telephone')->nullable();
                $table->string('consultant_fax')->nullable();

                // Other contact information
                $table->string('other_contact_fullname')->nullable();
                $table->string('other_contact_address')->nullable();
                $table->string('other_contact_telephone')->nullable();
                $table->string('other_contact_fax')->nullable();

                // Consultation content
                $table->string('consultation_content')->nullable();
                $table->string('current_services')->nullable();
                $table->smallInteger('desired_use_status')->nullable();
                $table->date('desired_admission_date')->nullable();
                $table->string('note')->nullable();
                $table->smallInteger('response_status')->nullable();
                $table->foreignId('referral_facility_id')->nullable()->constrained('facilities')->onDelete('cascade');
                $table->date('home_visit_schedule')->nullable();
                $table->date('next_visit_schedule')->nullable();

                // Accept status
                $table->smallInteger('accept_status')->default(1);

                // Create record information
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
        Schema::dropIfExists('consultations');
    }
};
