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
import { UISkeleton } from "@/components/customs/ui-skeleton";
import UIPagination from "@/components/customs/ui-pagination";
import { UIRemoveButton, UIUpdateButton } from "@/components/customs/ui-button";
import { DeleteProvisionLogDialog } from "./dialog-provision-log";
import { ServiceProvisionLogProps } from "@/@types/service-provision-log";
import {
  getMealProvidedLabel,
  getMedicationProvisionLogEnumLabel,
} from "@/lib/utils";
import { formatJapaneseDate } from "@/lib/format";

type ListProvisionLogProps = {
  data: PaginatedResponse<ServiceProvisionLogProps> | undefined;
  onRefresh: () => void;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEditChange: (item: ServiceProvisionLogProps) => void;
};

export default function ListProvisionLog({
  data,
  onRefresh,
  loading,
  currentPage,
  onPageChange,
  onEditChange,
}: ListProvisionLogProps) {
  const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ServiceProvisionLogProps>();

  const handleOpenDelDialog = (item: ServiceProvisionLogProps) => {
    setSelectedItem(item);
    setIsOpenDelDialog(true);
  };

  return (
    <div className="p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
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
            <UITableHead>日付</UITableHead>
            <UITableHead>起床時刻</UITableHead>
            <UITableHead>就寝時刻</UITableHead>
            <UITableHead>食事</UITableHead>
            <UITableHead>服薬</UITableHead>
            <UITableHead>日中活動</UITableHead>
            <UITableHead>記録者</UITableHead>
            <UITableHead></UITableHead>
          </UITableRow>
        </UITableHeader>
        <UITableBody>
          {loading ? (
            <>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
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
            data?.data.map((item: ServiceProvisionLogProps) => (
              <UITableRow key={item.id}>
                <UITableCell>{formatJapaneseDate(item.date)}</UITableCell>
                <UITableCell>{item.wake_up_time?.slice(0, 5)}</UITableCell>
                <UITableCell>{item.bed_time?.slice(0, 5)}</UITableCell>
                <UITableCell>
                  {item.meal_provided
                    ?.split(",")
                    .map((v) => v.trim())
                    .map((value) => getMealProvidedLabel(value))
                    .join("、")}
                </UITableCell>
                <UITableCell>
                  {getMedicationProvisionLogEnumLabel(item.medication)}
                </UITableCell>
                <UITableCell>
                  {item.daytime_activity ? item.daytime_activity : ""}
                </UITableCell>
                <UITableCell>{item.staff?.staff_profile?.fullname}</UITableCell>
                <UITableCell>
                  <div className="flex items-center gap-3">
                    <UIUpdateButton
                      onClick={() => {
                        onEditChange(item);
                      }}
                    >
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

      <DeleteProvisionLogDialog
        open={isOpenDelDialog}
        onOpenChange={setIsOpenDelDialog}
        provisionLog={selectedItem}
        onRefresh={onRefresh}
      />
    </div>
  );
}
