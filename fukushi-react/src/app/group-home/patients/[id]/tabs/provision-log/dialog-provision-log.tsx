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
import { ServiceProvisionLogProps } from "@/@types/service-provision-log";

interface DeleteProvisionLogDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  provisionLog: ServiceProvisionLogProps | undefined;
  onRefresh: () => void;
}

export function DeleteProvisionLogDialog({
  open,
  onOpenChange,
  provisionLog,
  onRefresh,
}: DeleteProvisionLogDialogProps) {
  const handleDelete = async () => {
    if (!provisionLog) return;
    try {
      await http.delete(`/service-provision-log/${provisionLog.id}`);
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
