<?php

namespace Modules\Profile\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\ServiceUser\Models\ServiceUser;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_type',
        'fullname',
        'furigana',
        'role_id',
        'dob',
        'avatar',
        'gender',
        'address',
        'status',
        'prefecture',
        'postal_code',
        'company',
        'district',
        'phone_number',
        'email',
        'family_name',
        'relationship',
        'family_phone',
        'file',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class, 'user_id');
    }

      public function getUserDataAttribute()
    {
        if ($this->user_type === 'user') {
            return $this->user;
        }

        if ($this->user_type === 'service_user') {
            return $this->serviceUser;
        }

        return null;
    }

}
