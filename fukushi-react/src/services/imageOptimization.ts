import imageCompression from 'browser-image-compression'

export interface OptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
  quality: number
  skipOptimization?: boolean
}

export interface OptimizationResult {
  optimizedFile: File
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  wasOptimized: boolean
}

export class ImageOptimizationService {
  private static defaultOptions: OptimizationOptions = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.8
  }

  static async optimizeImage(
    file: File, 
    options: Partial<OptimizationOptions> = {},
    onProgress?: (progress: number) => void
  ): Promise<OptimizationResult> {
    const originalSize = file.size
    const mergedOptions = { ...this.defaultOptions, ...options }

    // Skip optimization for non-images or if explicitly disabled
    if (!file.type.startsWith('image/') || mergedOptions.skipOptimization) {
      return {
        optimizedFile: file,
        originalSize,
        optimizedSize: originalSize,
        compressionRatio: 1,
        wasOptimized: false
      }
    }

    // Skip optimization for small files (less than 500KB)
    if (originalSize < 500 * 1024) {
      return {
        optimizedFile: file,
        originalSize,
        optimizedSize: originalSize,
        compressionRatio: 1,
        wasOptimized: false
      }
    }

    try {
      const compressionOptions = {
        maxSizeMB: mergedOptions.maxSizeMB,
        maxWidthOrHeight: mergedOptions.maxWidthOrHeight,
        useWebWorker: mergedOptions.useWebWorker,
        fileType: this.getOptimalFileType(file),
        onProgress: (progress: number) => {
          onProgress?.(progress)
        }
      }

      const optimizedFile = await imageCompression(file, compressionOptions)
      const optimizedSize = optimizedFile.size
      const compressionRatio = originalSize / optimizedSize

      // If compression didn't help much (less than 10% reduction), use original
      if (compressionRatio < 1.1) {
        return {
          optimizedFile: file,
          originalSize,
          optimizedSize: originalSize,
          compressionRatio: 1,
          wasOptimized: false
        }
      }

      return {
        optimizedFile,
        originalSize,
        optimizedSize,
        compressionRatio,
        wasOptimized: true
      }
    } catch (error) {
      console.warn('Image optimization failed, using original file:', error)
      return {
        optimizedFile: file,
        originalSize,
        optimizedSize: originalSize,
        compressionRatio: 1,
        wasOptimized: false
      }
    }
  }

  private static getOptimalFileType(file: File): string {
    // Convert PNG to JPEG if no transparency is likely needed (for common use cases)
    // This is a heuristic - for precise transparency detection, we'd need to analyze the image
    if (file.type === 'image/png' && file.size > 1024 * 1024) {
      return 'image/jpeg'
    }

    // Keep WebP as WebP (excellent compression)
    if (file.type === 'image/webp') {
      return 'image/webp'
    }

    // Default to JPEG for most cases (best compression)
    if (file.type.startsWith('image/')) {
      return 'image/jpeg'
    }

    return file.type
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  static getCompressionSavings(original: number, optimized: number): string {
    const savings = original - optimized
    const percentage = Math.round((savings / original) * 100)
    return `${this.formatFileSize(savings)} (${percentage}%)`
  }
}

export default ImageOptimizationService