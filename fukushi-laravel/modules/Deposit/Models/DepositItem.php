<?php

namespace Modules\Deposit\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepositItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'name',
        'amount',
        'deposit_date',
        'return_address',
        'note'
    ];

    public function deposit()
    {
        return $this->belongsTo(Deposit::class, 'form_id');
    }
}