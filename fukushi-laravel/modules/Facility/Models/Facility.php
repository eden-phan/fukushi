<?php

namespace Modules\Facility\Models;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facility extends Model
{
    use HasFactory;
    use SoftDeletes; 

    const STATUS_ACTIVE = 0;
    const STATUS_INACTIVE = 1;

    protected $guarded = [];

    public function users()
    {
        return $this->belongsToMany(User::class, 'facility_user')
            ->withPivot('role_id', 'facility_role')
            ->withTimestamps();
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'facility_user')
            ->withPivot('user_id', 'facility_role')
            ->withTimestamps();
    }
}
