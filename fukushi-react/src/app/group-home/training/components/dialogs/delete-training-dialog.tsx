"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useState } from "react"
import http from "@/services/http"
import { TrainingProps } from "@/@types/training"

interface DeleteTrainingDialogProps {
    open: boolean
    onOpenChange: (isOpen: boolean) => void
    item: TrainingProps | null
    onSuccess: () => void
}

export function DeleteTrainingDialog({ open, onOpenChange, item, onSuccess }: DeleteTrainingDialogProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!item) return

        setLoading(true)
        try {
            await http.delete(`/session/destroy/${item.id}`)
            toast.success("研修記録を削除しました")
            onSuccess()
            onOpenChange(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "研修記録の削除に失敗しました"
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle></AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        この研修記録を削除してもよろしいですか？<br/>
                        削除されたデータは元に戻せません。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!justify-center">
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-600 w-[104px]" 
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "削除中..." : "削除"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
