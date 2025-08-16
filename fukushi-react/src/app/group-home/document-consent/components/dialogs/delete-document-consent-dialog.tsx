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

interface DeleteDocumentConsentDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  documentConsent: DocumentConsentProps | undefined;
  onRefresh: () => void;
}

export function DeleteDocumentConsentDialog({
  open,
  onOpenChange,
  documentConsent,
  onRefresh,
}: DeleteDocumentConsentDialogProps) {
  const handleDelete = async () => {
    if (!documentConsent) return;
    try {
      await http.delete(`/document-consent/${documentConsent.id}`);
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
      <AlertDialogContent className="!max-w-[20vw] flex flex-col items-center text-center">
        <AlertDialogHeader className="w-full flex flex-col items-center">
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription className="text-foreground text-center">
            この事業所を削除してもよろしいですか？
            <br />
            削除されたデータは元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-auto min-w-[100px]">
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-auto min-w-[100px] bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            はい
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
