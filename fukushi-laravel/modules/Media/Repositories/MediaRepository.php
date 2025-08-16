<?php

namespace Modules\Media\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Media\Models\Media;
use Illuminate\Http\UploadedFile;

class MediaRepository extends BaseRepository
{

    CONST STORAGE_PATH = 'storage' . DIRECTORY_SEPARATOR;

    public function getModel()
    {
        return Media::class;
    }

    public function storeMedia($file){

        if (!$file instanceof UploadedFile || !$file->isValid()) {
            throw new \InvalidArgumentException('Invalid file!');
        }
        #media type
        $mediaType = $file->getClientMimeType();

        if (!in_array($mediaType, Media::allowedMimeTypes())) {
            throw new \InvalidArgumentException('Only allow formats: PDF, Word, or image');
        }
        $attributes = [];
        #file name
        $filename = $file->getClientOriginalName();
        #ext
        $ext = $file->getClientOriginalExtension();
        #vendor
        $vendor = '';
        #path: storage/app/public/uploads || public/uploads/
        $path = static::STORAGE_PATH . $file->store('uploads', 'public');
        #size
        $size = $file->getSize();
        #create by
        $createdBy = auth()->id();

        $attributes = [
            'filename'    => $filename,
            'ext'         => $ext,
            'vendor'      => $vendor,
            'path'        => $path,
            'size'        => $size,
            'created_by'  => $createdBy,
            'media_type'  => $mediaType,
        ];

        return $this->_model->create($attributes);
    }

    public function storeS3Media($file)
    {
        if (!$file instanceof UploadedFile || !$file->isValid()) {
            throw new \InvalidArgumentException('Invalid file!');
        }

        $mediaType = $file->getClientMimeType();

        if (!in_array($mediaType, Media::allowedMimeTypes())) {
            throw new \InvalidArgumentException('Only allow formats: PDF, Word, or image');
        }

        $s3Service = new \Modules\Media\Services\S3Service();
        $uploadResult = $s3Service->uploadFile($file);

        if (!$uploadResult['success']) {
            throw new \Exception('Failed to upload file to S3: ' . $uploadResult['error']);
        }

        $attributes = [
            'filename' => $uploadResult['original_name'],
            'media_type' => $this->determineMediaTypeFromMime($mediaType),
            'vendor' => 's3',
            'ext' => $uploadResult['extension'],
            'path' => $uploadResult['url'],
            's3_key' => $uploadResult['key'], // Store S3 key for deletion
            'size' => $uploadResult['size'],
            'created_by' => auth()->id(),
        ];

        return $this->_model->create($attributes);
    }

    private function determineMediaTypeFromMime($mimeType)
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }
        
        if ($mimeType === 'application/pdf') {
            return 'document';
        }
        
        if (in_array($mimeType, [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ])) {
            return 'document';
        }
        
        return 'other';
    }

    public function find($id)
    {
        $media = parent::find($id);
        
        if ($media && $media->vendor === 's3' && $media->s3_key) {
            // Generate fresh signed URL for S3 files
            $s3Service = new \Modules\Media\Services\S3Service();
            $media->path = $s3Service->getSignedUrl($media->s3_key);
        }
        
        return $media;
    }
}
