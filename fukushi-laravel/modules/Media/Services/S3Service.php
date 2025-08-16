<?php

namespace Modules\Media\Services;

use Aws\S3\S3Client;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class S3Service
{
    protected S3Client $s3Client;
    protected string $bucket;

    public function __construct()
    {
        $this->s3Client = new S3Client([
            'version' => 'latest',
            'region'  => config('filesystems.disks.s3.region'),
            'credentials' => [
                'key'    => config('filesystems.disks.s3.key'),
                'secret' => config('filesystems.disks.s3.secret'),
            ],
        ]);

        $this->bucket = config('filesystems.disks.s3.bucket');
    }

    public function uploadFile(UploadedFile $file, string $folder = 'uploads'): array
    {
        $filename = $this->generateUniqueFilename($file);
        $key = "{$folder}/{$filename}";

        try {
            $result = $this->s3Client->putObject([
                'Bucket' => $this->bucket,
                'Key'    => $key,
                'Body'   => fopen($file->getRealPath(), 'r'),
                'ContentType' => $file->getMimeType(),
            ]);

            return [
                'success' => true,
                'url' => $this->getSignedUrl($key),
                'key' => $key,
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function deleteFile(string $key): bool
    {
        try {
            $this->s3Client->deleteObject([
                'Bucket' => $this->bucket,
                'Key'    => $key,
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    protected function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $basename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $sanitizedName = Str::slug($basename);

        return $sanitizedName . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    public function getFileUrl(string $key): string
    {
        return $this->getSignedUrl($key);
    }

    public function getSignedUrl(string $key, int $expiresIn = 3600): string
    {
        $command = $this->s3Client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $key,
        ]);

        $request = $this->s3Client->createPresignedRequest($command, "+{$expiresIn} seconds");

        return (string) $request->getUri();
    }
}
