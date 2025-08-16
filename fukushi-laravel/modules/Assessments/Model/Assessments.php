<?php

namespace Modules\Assessments\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\ServiceUser\Models\ServiceUser;
use App\Models\User;

class Assessments extends Model
{
    use HasFactory;

    protected $fillable = [
        'reception_number',
        'service_user_id',
        'staff_id',
        'home_visit_dates',
        'outpatient_visit_dates',
        'phone_contact_dates',
        'life_history',
        'physical_disability_type',
        'physical_disability_grade',
        'intellectual_disability_code',
        'mental_disability_grade',
        'has_no_certificate',
        'has_basic_disability_pension',
        'basic_disability_grade',
        'has_welfare_disability_pension',
        'welfare_disability_grade',
        'has_national_pension',
        'has_other_pension',
        'other_pension_details',
        'receives_welfare',
        'disability_support_level',
        'medical_info',
        'medication_detail',
        'insurance_type',
        'insured_person_relation',
        'insurance_symbol',
        'pension_type',
        'pension_other_detail',
        'current_assistive_device',
        'daily_routine_self',
        'daily_routine_caregiver',
        'desired_life_user',
        'desired_life_family',
        'other_information',
        'house_owned',
        'house_type_other',
        'note',
        'created_by',
    ];

    protected $casts = [
        'home_visit_dates' => 'array',
        'outpatient_visit_dates' => 'array',
        'phone_contact_dates' => 'array',
        'has_no_certificate' => 'boolean',
        'has_basic_disability_pension' => 'boolean',
        'has_welfare_disability_pension' => 'boolean',
        'has_national_pension' => 'boolean',
        'has_other_pension' => 'boolean',
        'receives_welfare' => 'boolean',
        'house_owned' => 'boolean',
    ];

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class);
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function livingDomains()
    {
        return $this->hasMany(LivingDomainAssessment::class, 'assessment_id');
    }
}