<?php

namespace Modules\Consultation\Models;

use Modules\ServiceUser\Models\ServiceUser;
use Modules\FamilyMember\Models\FamilyMember;
use Modules\Facility\Models\Facility;
use Modules\ServiceUserFamilyMember\Models\ServiceUserFamilyMember;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consultation extends Model
{

    protected $table = 'consultations';

    protected $guarded = [];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }

    public function referralFacility()
    {
        return $this->belongsTo(Facility::class, 'referral_facility_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pivotRecords()
    {
        return $this->hasMany(ServiceUserFamilyMember::class);
    }

    public function serviceUsers()
    {
        return $this->belongsToMany(ServiceUser::class, 'service_user_family_member')
            ->withPivot('family_member_id');
    }

    public function familyMembers()
    {
        return $this->belongsToMany(FamilyMember::class, 'service_user_family_member')
            ->withPivot('service_user_id');
    }

    const PENDING = 1;
    const ACCEPTED = 2;
    const REJECTED = 3;
}
