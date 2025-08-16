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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->string('reception_number', 20)->nullable();
            $table->unsignedBigInteger('service_user_id')->nullable();
            $table->unsignedBigInteger('staff_id')->nullable();
            $table->json('home_visit_dates')->nullable();
            $table->json('outpatient_visit_dates')->nullable();
            $table->json('phone_contact_dates')->nullable();
            $table->text('life_history')->nullable();
            $table->string('physical_disability_type', 10)->nullable();
            $table->string('physical_disability_grade', 10)->nullable();
            $table->string('intellectual_disability_code', 10)->nullable();
            $table->string('mental_disability_grade', 10)->nullable();
            $table->boolean('has_no_certificate')->nullable();
            $table->boolean('has_basic_disability_pension')->nullable();
            $table->string('basic_disability_grade', 10)->nullable();
            $table->boolean('has_welfare_disability_pension')->nullable();
            $table->string('welfare_disability_grade', 10)->nullable();
            $table->boolean('has_national_pension')->nullable();
            $table->boolean('has_other_pension')->nullable();
            $table->string('other_pension_details', 255)->nullable();
            $table->boolean('receives_welfare')->nullable();
            $table->string('disability_support_level', 10)->nullable();
            $table->text('medical_info')->nullable();
            $table->text('medication_detail')->nullable();
            $table->string('insurance_type', 20)->nullable();
            $table->string('insured_person_relation', 20)->nullable();
            $table->text('insurance_symbol')->nullable();
            $table->string('pension_type', 255)->nullable();
            $table->string('pension_other_detail', 255)->nullable();
            $table->text('current_assistive_device')->nullable();
            $table->text('daily_routine_self')->nullable();
            $table->text('daily_routine_caregiver')->nullable();
            $table->text('desired_life_user')->nullable();
            $table->text('desired_life_family')->nullable();
            $table->text('other_information')->nullable();
            $table->boolean('house_owned')->nullable();
            $table->text('house_type_other')->nullable();
            $table->text('note')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
