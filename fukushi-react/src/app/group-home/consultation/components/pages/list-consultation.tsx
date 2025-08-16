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
import { DeleteConsultationDialog } from "../dialogs/delete-consultation";
import UIPagination from "@/components/customs/ui-pagination";
import {
  getConsultationAcceptStatusLabel,
  getConsultationAcceptStatusClass,
  getDesiredUseStatusLabel,
  getDesiredUseStatusColorClass,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import http from "@/services/http";
import {
  acceptConsultationSuccessToast,
  rejectConsultationSuccessToast,
} from "@/lib/message";
import { toast } from "sonner";
import { ConsultationAcceptStatusEnum, DesiredUseStatusEnum } from "@/lib/enum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";

type ListConsultationProps = {
  data: PaginatedResponse<ConsultationProps> | undefined;
  onRefresh: () => void;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function ListConsultation({
  data,
  onRefresh,
  loading,
  currentPage,
  onPageChange,
}: ListConsultationProps) {
  const router = useRouter();

  const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ConsultationProps>();

  const handleOpenDelDialog = (item: ConsultationProps) => {
    setSelectedItem(item);
    setIsOpenDelDialog(true);
  };

  const handleAcceptConsultation = async (id: number) => {
    await http.put(`consultation/accept-consultation/${id}`);
    toast.success(acceptConsultationSuccessToast);
    onRefresh();
  };

  const handleRejectConsultation = async (id: number) => {
    await http.put(`consultation/reject-consultation/${id}`);
    toast.success(rejectConsultationSuccessToast);
    onRefresh();
  };

  const goToEdit = (id: number) => {
    router.push(`/group-home/consultation/edit/${id}`);
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
            <UITableHead>相談受付ID</UITableHead>
            <UITableHead>氏名</UITableHead>
            <UITableHead>事業所名</UITableHead>
            <UITableHead>希望事業所</UITableHead>
            <UITableHead>電話番号</UITableHead>
            <UITableHead>受付日</UITableHead>
            <UITableHead>希望ステータス</UITableHead>
            <UITableHead>対応ステータス</UITableHead>
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
            data?.data.map((item: ConsultationProps) => (
              <UITableRow key={item.id}>
                <UITableCell>{item.id}</UITableCell>
                <UITableCell>{item.full_name}</UITableCell>
                <UITableCell>{item.facility.name}</UITableCell>
                <UITableCell>
                  {item.referral_facility ? item.referral_facility.name : ""}
                </UITableCell>
                <UITableCell>{item.telephone}</UITableCell>
                <UITableCell>{item.date}</UITableCell>
                <UITableCell
                  className={getDesiredUseStatusColorClass(
                    item.desired_use_status
                  )}
                >
                  {getDesiredUseStatusLabel(item.desired_use_status)}
                </UITableCell>
                <UITableCell
                  className={getConsultationAcceptStatusClass(
                    item.accept_status
                  )}
                >
                  {getConsultationAcceptStatusLabel(item.accept_status)}
                </UITableCell>
                <UITableCell>
                  {item.accept_status !==
                    ConsultationAcceptStatusEnum.Accepted && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={"tight"}
                          variant={"noneOutline"}
                          className=""
                        >
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.accept_status !==
                          ConsultationAcceptStatusEnum.Accepted && (
                          <>
                            <DropdownMenuItem onClick={() => goToEdit(item.id)}>
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDelDialog(item)}
                            >
                              削除
                            </DropdownMenuItem>
                          </>
                        )}
                        {item.desired_use_status ===
                          DesiredUseStatusEnum.Ready &&
                          item.accept_status !==
                            ConsultationAcceptStatusEnum.Accepted &&
                          item.accept_status !==
                            ConsultationAcceptStatusEnum.Rejected && (
                            <DropdownMenuItem
                              onClick={() => {
                                handleAcceptConsultation(item.id);
                              }}
                            >
                              承認
                            </DropdownMenuItem>
                          )}
                        {item.accept_status ===
                          ConsultationAcceptStatusEnum.Pending &&
                          item.desired_use_status ===
                            DesiredUseStatusEnum.Ready && (
                            <DropdownMenuItem
                              onClick={() => {
                                handleRejectConsultation(item.id);
                              }}
                            >
                              却下
                            </DropdownMenuItem>
                          )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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

      <DeleteConsultationDialog
        open={isOpenDelDialog}
        onOpenChange={setIsOpenDelDialog}
        consultation={selectedItem}
        onRefresh={onRefresh}
      />
    </div>
  );
}
