"use client";

import { useState } from "react";
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
} from "@/components/customs/ui-table";
import { UISkeleton } from "@/components/customs/ui-skeleton";
import { DeleteMangerDialog } from "../dialogs/delete-manager-dialog";
import { ManagerProps } from "@/@types/manager";
import { getManagerStatusLabel } from "@/lib/utils";
import { UIRemoveButton, UIUpdateButton } from "@/components/customs/ui-button";
import { format } from "date-fns";
import UIPagination from "@/components/customs/ui-pagination";

type ListManagerProps = {
  data: PaginatedResponse<ManagerProps> | undefined;
  onRefresh: () => void;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function ListManager({
  data,
  onRefresh,
  loading,
  currentPage,
  onPageChange,
}: ListManagerProps) {
  const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ManagerProps>();

  const handleOpenDelDialog = (item: ManagerProps) => {
    setSelectedItem(item);
    setIsOpenDelDialog(true);
  };

  return (
    <div className="p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <UITable>
        <UITableHeader>
          <UITableRow>
            <UITableHead>ID</UITableHead>
            <UITableHead>氏名</UITableHead>
            <UITableHead>メールアドレス</UITableHead>
            <UITableHead>電話番号</UITableHead>
            <UITableHead>作成日</UITableHead>
            <UITableHead>ステータス</UITableHead>
            <UITableHead></UITableHead>
          </UITableRow>
        </UITableHeader>
        <UITableBody>
          {loading ? (
            <>
              {Array.from({ length: 7 }).map((_, rowIndex) => (
                <UITableRow key={rowIndex}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <UITableCell key={cellIndex}>
                      <UISkeleton />
                    </UITableCell>
                  ))}
                </UITableRow>
              ))}
            </>
          ) : data?.data.length === 0 ? (
            <UITableRow className="hover:bg-transparent">
              <UITableCell
                colSpan={8}
                className="p-0 pt-9 text-gray-400 text-center"
              >
                データなし
              </UITableCell>
            </UITableRow>
          ) : (
            data?.data.map((item: ManagerProps) => (
              <UITableRow key={item.id}>
                <UITableCell>{item.user_id}</UITableCell>
                <UITableCell>{item.user.profile.fullname}</UITableCell>
                <UITableCell>{item.user.email}</UITableCell>
                <UITableCell>{item.user.profile.phone_number}</UITableCell>
                <UITableCell>
                  {format(item.created_at, "yyyy/MM/dd")}
                </UITableCell>
                <UITableCell>
                  {getManagerStatusLabel(+item.user.status)}
                </UITableCell>
                <UITableCell>
                  <div className="flex items-center gap-3">
                    <UIUpdateButton url={`/admin/manager/edit/${item.id}`}>
                      編集
                    </UIUpdateButton>
                    <UIRemoveButton onClick={() => handleOpenDelDialog(item)}>
                      削除
                    </UIRemoveButton>
                  </div>
                </UITableCell>
              </UITableRow>
            ))
          )}
        </UITableBody>
      </UITable>
      <div>
        {data && data.last_page > 1 && (
          <div className="mt-4">
            <UIPagination
              currentPage={currentPage}
              lastPage={data.last_page}
              onPageChange={onPageChange}
            ></UIPagination>
          </div>
        )}
      </div>

      <DeleteMangerDialog
        open={isOpenDelDialog}
        onOpenChange={setIsOpenDelDialog}
        manager={selectedItem}
        onRefresh={onRefresh}
      />
    </div>
  );
}
