<?php

namespace Modules\SessionRecord\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_record_id', // Foreign key to Session
        'user_id',           // Foreign key to User
        'status'             // e.g., 'attending', 'absent', 'cancelled'
    ];

    public function session()
    {
        return $this->belongsTo(SessionRecord::class, 'session_record_id');
    }
}
