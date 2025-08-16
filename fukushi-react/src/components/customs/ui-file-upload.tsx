"use client"

import { Upload, X, Eye, FileText, Image as ImageIcon, Zap } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mediaService, type Media } from "@/services/media"
import { ImageOptimizationService, type OptimizationResult } from "@/services/imageOptimization"
import Image from "next/image"

interface UIFileUploadProps {
    className?: string
    onFileUpload: (mediaId: number | null) => void
    onError?: (error: string) => void
    mediaId?: string | number | null
    maxFileSize?: number
    acceptedFileTypes?: string[]
    showPreview?: boolean
    isPreview?: boolean
}

export function UIFileUpload({
    className = "",
    onFileUpload,
    onError,
    mediaId,
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    acceptedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    showPreview = true,
    isPreview = false,
}: UIFileUploadProps) {
    const [uploadedFile, setUploadedFile] = useState<string | null>(null)
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
    const [fileType, setFileType] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentMediaId, setCurrentMediaId] = useState<number | null>(null)
    const [isOptimizing, setIsOptimizing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load existing media when mediaId prop changes
    useEffect(() => {
        const loadMedia = async () => {
            if (mediaId && mediaId !== currentMediaId) {
                try {
                    const media = await mediaService.getById(mediaId)
                    setUploadedFile(media.path)
                    setUploadedFileName(media.filename)
                    setFileType(media.media_type)
                    setCurrentMediaId(media.id)
                } catch (error) {
                    console.error("Failed to load media:", error)
                }
            } else if (!mediaId) {
                // Clear state when no mediaId
                setUploadedFile(null)
                setUploadedFileName(null)
                setFileType(null)
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
                const errorMsg = `ファイルサイズが大きすぎます。最大 ${Math.round(maxFileSize / 1024 / 1024)}MB まで`
                onError?.(errorMsg)
                toast.error(errorMsg)
                return
            }

            if (!acceptedFileTypes.includes(file.type)) {
                const errorMsg = "サポートされていないファイル形式です"
                onError?.(errorMsg)
                toast.error(errorMsg)
                return
            }

            let finalFile = file
            let optimizationData: OptimizationResult | null = null

            // Optimize image if it's an image file
            if (file.type.startsWith("image/")) {
                setIsOptimizing(true)

                try {
                    optimizationData = await ImageOptimizationService.optimizeImage(file, {})

                    finalFile = optimizationData.optimizedFile
                } catch (error) {
                    console.warn("Optimization failed, using original file:", error)
                } finally {
                    setIsOptimizing(false)
                }
            }

            setIsLoading(true)

            try {
                const media: Media = await mediaService.uploadToS3(finalFile)

                setUploadedFile(media.path)
                setUploadedFileName(media.filename)
                setFileType(media.media_type)
                setCurrentMediaId(media.id)

                onFileUpload(media.id)
                toast.success("ファイルのアップロードが完了しました")
            } catch (error: unknown) {
                console.error("Upload failed:", error)
                const errorMsg = "ファイルのアップロードに失敗しました"
                onError?.(errorMsg)
                toast.error(errorMsg)
            } finally {
                setIsLoading(false)
            }
        },
        [onFileUpload, onError, maxFileSize, acceptedFileTypes]
    )

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
        event.target.value = ""
    }

    const handleRemoveFile = useCallback(async () => {
        try {
            if (currentMediaId) {
                await mediaService.delete(currentMediaId)
            }
            setUploadedFile(null)
            setUploadedFileName(null)
            setFileType(null)
            setCurrentMediaId(null)
            onFileUpload(null)
            toast.success("ファイルを削除しました")
        } catch (error) {
            console.error("Failed to delete media:", error)
            toast.error("ファイルの削除に失敗しました")
        }
    }, [onFileUpload, currentMediaId])

    const getFileIcon = (type: string | null) => {
        switch (type) {
            case "image":
                return <ImageIcon className="h-4 w-4" />
            case "pdf":
                return <FileText className="h-4 w-4 text-red-500" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    const openFileInNewTab = () => {
        if (uploadedFile) {
            window.open(uploadedFile, "_blank")
        }
    }

    const renderUploadButton = () => (
        <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isOptimizing}
            variant="outline"
            className={cn("h-10", (isLoading || isOptimizing) && "opacity-50 cursor-not-allowed")}
        >
            {isOptimizing ? (
                <>
                    <Zap className="h-4 w-4 animate-pulse mr-2" />
                    画像最適化中...
                </>
            ) : (
                <>
                    <Upload className="h-4 w-4 mr-2" />
                    {isLoading ? "アップロード中..." : "ファイル選択"}
                </>
            )}
        </Button>
    )

    return (
        <FormItem className={cn("space-y-3", className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFileTypes.join(",")}
                onChange={handleFileInputChange}
                className="hidden"
                multiple={false}
            />

            {/* Upload Section */}
            {!uploadedFile && !isPreview && (
                <div className="flex items-center gap-3">
                    {renderUploadButton()}
                    <div className="text-xs text-muted-foreground">
                        最大 {Math.round(maxFileSize / (1024 * 1024))}MB
                    </div>
                </div>
            )}

            {/* File Preview/Info */}
            {uploadedFile && (
                <div className="space-y-3 border border-border rounded-md bg-muted/30">
                    {/* File Info Bar */}
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            {getFileIcon(fileType)}
                            <span className="text-sm font-medium truncate">
                                {uploadedFileName || "アップロード済みファイル"}
                            </span>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">✓ 完了</span>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={openFileInNewTab}
                                className="h-8 w-8 p-0"
                                title="ファイルを表示"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            {!isPreview && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveFile}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    title="ファイルを削除"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Image Preview */}
                    {showPreview && fileType === "image" && (
                        <div className="overflow-hidden">
                            <Image src={uploadedFile} alt="Preview" className="w-full h-auto max-h-48 object-contain" />
                        </div>
                    )}
                </div>
            )}
        </FormItem>
    )
}

export default UIFileUpload