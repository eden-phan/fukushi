<?php

namespace Modules\Document\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\DocumentMetadata\Models\DocumentMetadata;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\ServiceUser\Models\ServiceUser;
use Modules\Media\Models\Media;

class Document extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function documentMetadata()
    {
        return $this->hasMany(DocumentMetadata::class, 'document_id');
    }

    public function documentMetadataFirst()
    {
        return $this->hasOne(DocumentMetadata::class, 'document_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class, 'service_user_id');
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'file');
    }
}
