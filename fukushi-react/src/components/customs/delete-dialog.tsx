"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import http from "@/services/http";
import { toast } from "sonner";

type Props = {
    api: string;
    onDeleted: () => void;
    className?: string;
};

export function UIDeleteDialog({ api, onDeleted, className }: Props) {
    const handleDelete = async () => {
        try {
            await http.delete(api);
            toast.success("削除に成功しました");
            onDeleted();
        } catch (error) {
            console.error(error);
            toast.error("削除に失敗しました");
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="text-red-400" variant="ellipsis">削除</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={className}>
                <AlertDialogHeader>
                    <AlertDialogTitle></AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        このレコードを削除してもよろしいですか？<br/>
                        この操作は取り消せません
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex !justify-center">
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>削除</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
