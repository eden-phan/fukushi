<?php

namespace Modules\Deposit\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\ServiceUser\Models\ServiceUser;

class Deposit extends Model
{
     use HasFactory;

    protected $fillable = [
        'service_user_id',
        'staff_id',
        'pickup_date',
        'return_date',
        'facility_id',
        'status',
        'created_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class, 'service_user_id');
    }

    public function depositItem()
    {
        return $this->hasMany(DepositItem::class, 'form_id');
    }
}