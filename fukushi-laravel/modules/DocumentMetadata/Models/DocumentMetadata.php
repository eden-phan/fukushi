<?php

namespace Modules\DocumentMetadata\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Document\Models\Document;

class DocumentMetadata extends Model
{

    protected $table = 'document_metadata';

    protected $fillable = ['key', 'value', 'document_id'];


    protected $guarded = [];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
