<?php
namespace Modules\Media\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model {

    protected $table = 'medias';
    protected $fillable = [
        'filename',
        'media_type',
        'vendor',
        'ext',
        'path',
        's3_key',
        'size',
        'created_by',
    ];

    public static function allowedMimeTypes() {
        return [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/webp',
        ];
    }

    public function scopeExt($query, $ext){
        return $query->where('ext', $ext);
    }

    public function scopeMediaType($query, $mediaType){
        return $query->where('media_type', $mediaType);
    }

    protected static function booted(){
        static::deleted(function ($model) {
            # delete file in storage || aws
        });

        static::updated(function ($model) {
            # delete old file if $model->file updated
        });
    }
}
