<?php

namespace Modules\Signature\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Document\Models\Document;
use Modules\SessionRecord\Models\SessionRecord;

class Signature extends Model
{
    use HasFactory;

    protected $table = 'signatures';

    protected $fillable = [
        'document_id',
        'document_type',
        'signature_type',
        'signature_value',
        'signed_at',
        'signed_by',
    ];

    // public function document()
    // {
    //     return $this->belongsTo(Document::class, 'document_id');
    // }

    public function sessionRecord()
    {
        return $this->belongsTo(SessionRecord::class, 'document_id');
    }
}
