<?php

namespace Modules\ServiceUser\Models;

use Modules\Assessments\Model\MedicalDisabilityHistory;
use Modules\Consultation\Models\Consultation;
use Modules\FamilyMember\Models\FamilyMember;
use Modules\ServiceUserFamilyMember\Models\ServiceUserFamilyMember;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Deposit\Models\Deposit;
use Modules\Profile\Models\Profile;
use Modules\SupportPlan\Models\SupportPlan;

class ServiceUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'facility_id',
        'created_by',
    ];

    public function serviceUserProfile()
    {
        return $this->hasOne(Profile::class, 'user_id')->where('user_type', 'service_user');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id');
    }

    public function deposit()
    {
        return $this->hasMany(Deposit::class, 'user_service_id');
    }

    public function pivotRecords()
    {
        return $this->hasMany(ServiceUserFamilyMember::class);
    }

    public function consultations()
    {
        return $this->belongsToMany(Consultation::class, 'service_user_family_member')
            ->withPivot('family_member_id');
    }

    public function familyMembers()
    {
        return $this->belongsToMany(FamilyMember::class, 'service_user_family_member')
            ->withPivot('service_user_id');
    }

    public function supportPlan()
    {
        return $this->hasOne(SupportPlan::class, 'service_user_id');
    }

    public function medicalDisabilityHistory()
    {
        return $this->hasMany(MedicalDisabilityHistory::class);
    }
}
