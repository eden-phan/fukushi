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
import { DeleteIncidentDialog } from "./dialog-incident";
import { IncidentProps } from "@/@types/incident";
import { getNearMissesTypeLabel } from "@/lib/utils";

type ListIncidentProps = {
  data: PaginatedResponse<IncidentProps> | undefined;
  onRefresh: () => void;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEditChange: (item: IncidentProps) => void;
};

export default function ListIncident({
  data,
  onRefresh,
  loading,
  currentPage,
  onPageChange,
  onEditChange,
}: ListIncidentProps) {
  const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IncidentProps>();

  const handleOpenDelDialog = (item: IncidentProps) => {
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
            <UITableHead>報告タイトル</UITableHead>
            <UITableHead>発生日時</UITableHead>
            <UITableHead>発生場所</UITableHead>
            <UITableHead>報告者</UITableHead>
            <UITableHead>作成日</UITableHead>
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
            data?.data.map((item: IncidentProps) => (
              <UITableRow key={item.id}>
                <UITableCell>
                  {getNearMissesTypeLabel(item.incident_type)}
                </UITableCell>
                <UITableCell>{item.incident_date}</UITableCell>
                <UITableCell>{item.location}</UITableCell>
                <UITableCell>
                  {item.reporter?.staff_profile?.fullname}
                </UITableCell>
                <UITableCell>{item.report_date}</UITableCell>
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

      <DeleteIncidentDialog
        open={isOpenDelDialog}
        onOpenChange={setIsOpenDelDialog}
        incident={selectedItem}
        onRefresh={onRefresh}
      />
    </div>
  );
}
