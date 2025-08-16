<?php

namespace Modules\Media\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Media\Repositories\MediaRepository;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
    protected MediaRepository $mediaRepository;

    public function __construct(MediaRepository $mediaRepository)
    {
        $this->mediaRepository = $mediaRepository;
    }

    /**
     * Store file upload to S3
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png,webp|max:10240', // Max 10MB
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validation failed', 422);
        }

        try {
            $file = $request->file('file');
            $media = $this->mediaRepository->storeS3Media($file);

            return ApiResponse::success($media, 'File uploaded to S3 successfully', 201);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to upload file to S3: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get media by ID
     */
    public function show($id)
    {
        $media = $this->mediaRepository->find($id);

        if (!$media) {
            return ApiResponse::error('Media not found', 404);
        }

        return ApiResponse::success($media, 'Media retrieved successfully', 200);
    }

    /**
     * Delete media
     */
    public function destroy($id)
    {
        try {
            $media = $this->mediaRepository->find($id);

            if (!$media) {
                return ApiResponse::error('Media not found', 404);
            }

            // Check if user has permission to delete (owner or admin)
            $user = auth()->user();
            if ($media->created_by !== $user->id && !$user->hasRole('admin')) {
                return ApiResponse::error('Unauthorized to delete this media', 403);
            }

            // Delete from S3 if it's an S3 file
            if ($media->vendor === 's3' && $media->s3_key) {
                $s3Service = new \Modules\Media\Services\S3Service();
                $s3Service->deleteFile($media->s3_key);
            }

            $this->mediaRepository->delete($id);

            return ApiResponse::success(null, 'Media deleted successfully', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to delete media: ' . $e->getMessage(), 500);
        }
    }
}
