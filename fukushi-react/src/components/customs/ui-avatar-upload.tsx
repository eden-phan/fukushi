"use client"

import { CloudUpload, X, Eye, Zap } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mediaService, type Media } from "@/services/media"
import { ImageOptimizationService, type OptimizationResult } from "@/services/imageOptimization"
import Image from "next/image"

interface UIAvatarUploadProps {
    className?: string
    onAvatarUpload: (mediaId: number | null) => void
    onError?: (error: string) => void
    mediaId?: string | number | null
    maxFileSize?: number
    isPreview?: boolean
    size?: number
}

export function UIAvatarUpload({
    className = "",
    onAvatarUpload,
    onError,
    mediaId,
    maxFileSize = 5 * 1024 * 1024, // 5MB default for avatars
    isPreview = false,
    size = 200,
}: UIAvatarUploadProps) {
    const [uploadedFile, setUploadedFile] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentMediaId, setCurrentMediaId] = useState<number | null>(null)
    const [isOptimizing, setIsOptimizing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Only accept image files for avatars
    const acceptedImageTypes = useMemo(() => ["image/jpeg", "image/png", "image/webp"], [])

    // Load existing media when mediaId prop changes
    useEffect(() => {
        const loadMedia = async () => {
            if (mediaId && mediaId !== currentMediaId) {
                try {
                    const media = await mediaService.getById(mediaId)
                    setUploadedFile(media.path)
                    setCurrentMediaId(media.id)
                } catch (error) {
                    console.error("Failed to load media:", error)
                }
            } else if (!mediaId) {
                // Clear state when no mediaId
                setUploadedFile(null)
                setCurrentMediaId(null)
            }
        }

        loadMedia()
    }, [mediaId, currentMediaId])

    useEffect(() => {
        const handleFocus = () => {
            document.body.style.overflow = ""
        }
        window.addEventListener("focus", handleFocus)
        return () => {
            window.removeEventListener("focus", handleFocus)
        }
    }, [])

    const handleFileSelect = useCallback(
        async (file: File) => {
            if (file.size > maxFileSize) {
                const errorMsg = `画像サイズが大きすぎます。最大 ${Math.round(maxFileSize / 1024 / 1024)}MB まで`
                onError?.(errorMsg)
                toast.error(errorMsg)
                return
            }

            if (!acceptedImageTypes.includes(file.type)) {
                const errorMsg = "サポートされていない画像形式です。JPEG、PNG、WebP のみ対応しています"
                onError?.(errorMsg)
                toast.error(errorMsg)
                return
            }

            let finalFile = file
            let optimizationData: OptimizationResult | null = null

            // Always optimize image for avatars
            setIsOptimizing(true)

            try {
                optimizationData = await ImageOptimizationService.optimizeImage(
                    file,
                    {
                        maxWidth: size * 2, // 2x for retina displays
                        maxHeight: size * 2,
                        quality: 0.9,
                    },
                    () => {} // No progress callback needed for avatars
                )

                finalFile = optimizationData.optimizedFile
            } catch (error) {
                console.warn("Optimization failed, using original file:", error)
            } finally {
                setIsOptimizing(false)
            }

            setIsLoading(true)

            try {
                const media: Media = await mediaService.uploadToS3(finalFile)

                setUploadedFile(media.path)
                setCurrentMediaId(media.id)

                onAvatarUpload(media.id)
                toast.success("アバター画像のアップロードが完了しました")
            } catch (error: unknown) {
                console.error("Upload failed:", error)
                const errorMsg = "アバター画像のアップロードに失敗しました"
                onError?.(errorMsg)
                toast.error(errorMsg)
            } finally {
                setIsLoading(false)
            }
        },
        [onAvatarUpload, onError, maxFileSize, acceptedImageTypes, size]
    )

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
        event.target.value = ""
    }

    const handleRemoveAvatar = useCallback(async () => {
        try {
            if (currentMediaId) {
                await mediaService.delete(currentMediaId)
            }
            setUploadedFile(null)
            setCurrentMediaId(null)
            onAvatarUpload(null)
            toast.success("アバター画像を削除しました")
        } catch (error) {
            console.error("Failed to delete media:", error)
            toast.error("アバター画像の削除に失敗しました")
        }
    }, [onAvatarUpload, currentMediaId])

    const openFileInNewTab = () => {
        if (uploadedFile) {
            window.open(uploadedFile, "_blank")
        }
    }

    const renderUploadButton = () => (
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isOptimizing}
            className={cn(
                `w-[${size}px] h-[${size}px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2`,
                (isLoading || isOptimizing) && "opacity-50 cursor-not-allowed"
            )}
            style={{ width: size, height: size }}
        >
            {isOptimizing ? (
                <div className="flex flex-col items-center">
                    <Zap className="h-8 w-8 text-orange-500 animate-pulse" />
                    <span className="text-xs mt-1">最適化中...</span>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                    <span className="text-xs mt-1">アップロード中...</span>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <CloudUpload size={48} />
                    <span className="text-xs mt-2">アバター画像</span>
                </div>
            )}
        </button>
    )

    const renderAvatarDisplay = () => (
        <div
            className="group relative overflow-hidden border border-border bg-muted/30 rounded-full"
            style={{ width: size, height: size }}
        >
            {/* Image Display */}
            <Image
                src={uploadedFile!}
                alt="Avatar Preview"
                className="object-cover w-full h-full"
                width={1000}
                height={1000}
            />

            {/* Hover Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={openFileInNewTab}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    title="画像を表示"
                >
                    <Eye className="h-4 w-4" />
                </Button>
                {!isPreview && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        className="h-8 w-8 p-0 text-red-300 hover:text-red-100 hover:bg-red-500/20"
                        title="アバター画像を削除"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )

    return (
        <FormItem className={cn("space-y-3", className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedImageTypes.join(",")}
                onChange={handleFileInputChange}
                className="hidden"
                multiple={false}
            />

            {/* Avatar Display */}
            <div className="flex items-center gap-3">
                {uploadedFile ? renderAvatarDisplay() : renderUploadButton()}

                {/* File size info */}
                {!uploadedFile && (
                    <div className="text-xs text-muted-foreground">
                        最大 {Math.round(maxFileSize / (1024 * 1024))}MB
                        <br />
                        JPEG, PNG, WebP
                    </div>
                )}
            </div>
        </FormItem>
    )
}

export default UIAvatarUpload
