<?php

namespace Modules\SessionRecord\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Signature\Models\Signature;
use Modules\SessionRecord\Models\SessionParticipant;

class SessionRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'record_type', // e.g., 'meeting', 'training'
        'theme',
        'date',
        'start_time',
        'end_time',
        'location',
        'content',
        'feedback'
    ];


    public function participants()
    {
        return $this->hasMany(SessionParticipant::class, 'session_record_id');
    }

    public function signatures()
    {
        return $this->hasMany(Signature::class, 'document_id')->where('document_type', 'session_record');
    }
}
