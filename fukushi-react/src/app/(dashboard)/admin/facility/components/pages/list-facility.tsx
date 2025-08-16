"use client";

import { useState } from "react";
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
  UITableCaption,
} from "@/components/customs/ui-table";
import { DeleteFacilityDialog } from "../dialogs/delete-facility-dialog";
import { UISkeleton } from "@/components/customs/ui-skeleton";
import UIPagination from "@/components/customs/ui-pagination";
import { UIRemoveButton, UIUpdateButton } from "@/components/customs/ui-button";
import { getFacilityTypeLabel } from "@/lib/utils";
import { formatJapaneseDate } from "@/lib/format";
import { FacilityProps } from "@/@types/facility";

type ListFacilityProps = {
  data: PaginatedResponse<FacilityProps> | undefined;
  onRefresh: () => void;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function ListFacility({
  data,
  onRefresh,
  loading,
  currentPage,
  onPageChange,
}: ListFacilityProps) {
  const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FacilityProps>();

  const handleOpenDelDialog = (item: FacilityProps) => {
    setSelectedItem(item);
    setIsOpenDelDialog(true);
  };

  return (
    <div className=" p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <UITable>
        <UITableCaption>
          <div className="flex">
            {data && data.data.length > 0 && (
              <p className="text-neutral">
                {data?.total || 0} 件中 {data?.from || 0} から {data?.to || 0}{" "}
                まで表示
              </p>
            )}
          </div>
        </UITableCaption>
        <UITableHeader>
          <UITableRow>
            <UITableHead>ID</UITableHead>
            <UITableHead>事業所名</UITableHead>
            <UITableHead>事業種別</UITableHead>
            <UITableHead>作成日</UITableHead>
            <UITableHead>ステータス</UITableHead>
            <UITableHead></UITableHead>
          </UITableRow>
        </UITableHeader>
        <UITableBody>
          {loading ? (
            <>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <UITableRow key={rowIndex}>
                  {Array.from({ length: 4 }).map((_, cellIndex) => (
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
                colSpan={4}
                className="p-0 pt-9 text-gray-400 text-center"
              >
                データなし
              </UITableCell>
            </UITableRow>
          ) : (
            data?.data.map((item: FacilityProps) => (
              <UITableRow key={item.id}>
                <UITableCell>{item.id}</UITableCell>
                <UITableCell>{item.name}</UITableCell>
                <UITableCell>
                  {getFacilityTypeLabel(item.facility_type)}
                </UITableCell>
                <UITableCell>{formatJapaneseDate(item.created_at)}</UITableCell>
                <UITableCell>
                  <div className="flex items-center gap-3">
                    <UIUpdateButton url={`/admin/facility/edit/${item.id}`}>
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

      <DeleteFacilityDialog
        open={isOpenDelDialog}
        onOpenChange={setIsOpenDelDialog}
        facility={selectedItem}
        onRefresh={onRefresh}
      />
    </div>
  );
}
