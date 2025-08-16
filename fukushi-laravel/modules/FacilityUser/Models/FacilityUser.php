<?php

namespace Modules\FacilityUser\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Models\User;
use Modules\Facility\Models\Facility;
use App\Models\Role;

class FacilityUser extends Pivot
{
    protected $table = 'facility_user';

    protected $guarded = [];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
