<?php

namespace Modules\FamilyMember\Models;

use App\Models\User;
use Modules\ServiceUser\Models\ServiceUser;
use Modules\Consultation\Models\Consultation;
use Modules\ServiceUserFamilyMember\Models\ServiceUserFamilyMember;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyMember extends Model
{

    protected $table = 'family_members';

    protected $guarded = [];

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

    public function consultations()
    {
        return $this->belongsToMany(Consultation::class, 'service_user_family_member')
            ->withPivot('service_user_id');
    }
}
