<?php

namespace Modules\Manager\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\FacilityUser\Models\FacilityUser;
use Modules\Profile\Models\Profile;

class Manager extends Model
{
    protected $table = 'users';

    protected $guarded = [];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function facilityUsers()
    {
        return $this->hasOne(FacilityUser::class)->where('role_id', 2);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
}
