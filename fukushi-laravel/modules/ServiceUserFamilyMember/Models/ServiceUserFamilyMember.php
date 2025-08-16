<?php

namespace Modules\ServiceUserFamilyMember\Models;

use Modules\Consultation\Models\Consultation;
use Modules\ServiceUser\Models\ServiceUser;
use Modules\FamilyMember\Models\FamilyMember;
use Illuminate\Database\Eloquent\Model;

class ServiceUserFamilyMember extends Model
{

    protected $table = 'service_user_family_member';

    protected $guarded = [];

    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class);
    }

    public function familyMember()
    {
        return $this->belongsTo(FamilyMember::class);
    }
}
