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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import http from "@/services/http";
import { deleteSuccessToast } from "@/lib/message";
import { DocumentReceiveMoneyProps } from "@/@types/document-receive-money";

interface DeleteDocumentReceiveMoneyDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  documentReceiveMoney: DocumentReceiveMoneyProps | undefined;
  onRefresh: () => void;
}

export function DeleteDocumentReceiveMoneyDialog({
  open,
  onOpenChange,
  documentReceiveMoney,
  onRefresh,
}: DeleteDocumentReceiveMoneyDialogProps) {
  const handleDelete = async () => {
    if (!documentReceiveMoney) return;
    try {
      await http.delete(`/document-receive-money/${documentReceiveMoney.id}`);
      toast.success(deleteSuccessToast);
      onRefresh();
      onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "研修ノートの削除に失敗しました";
      toast.error(errorMessage);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription className="text-foreground">
            この事業所を削除してもよろしいですか？削除されたデータは元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            はい
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
