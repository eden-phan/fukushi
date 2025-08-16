"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
  UITableCaption,
} from "@/components/customs/ui-table";
import { cn, formatPhoneJP, getEmployeeTypeLabel, getStaffReasonColor, getStaffReasonLabel } from "@/lib/utils";
import { DeleteStaffDialog } from "../dialogs/delete-staff-dialog";
import Link from "next/link";
import { UISkeleton } from "@/components/customs/ui-skeleton";
import { Permission } from "@/components/auth/Permission";

type Props = {
  staff: PaginatedResponse<StaffProps> | undefined;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  currentPage: number;
};

export default function ListStaff({
  staff,
  loading,
  onPageChange,
  onRefresh,
  currentPage,
}: Props) {
  const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<StaffProps | null>(null);

  const handleDelete = (item: StaffProps) => {
    setSelectedItem(item);
    setIsOpenDelDialog(true);
  };


  const generatePageNumbers = () => {
    if (!staff) return [];

    const { current_page, last_page } = staff;
    const pages = [];
    const delta = 2;

    for (
      let i = Math.max(1, current_page - delta);
      i <= Math.min(last_page, current_page + delta);
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className=" p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <UITable>
        <UITableCaption>
          <div className="flex">
            <p className="text-neutral">
              {staff?.total || 0} 件中 {staff?.from || 0} から {staff?.to || 0}{" "}
              まで表示
            </p>
          </div>
        </UITableCaption>
        <UITableHeader>
          <UITableRow>
            <UITableHead>スタッフID</UITableHead>
            <UITableHead>氏名</UITableHead>
            <UITableHead>メールアドレス</UITableHead>
            {/* <UITableHead>所属事業所</UITableHead> */}
            <UITableHead>電話番号</UITableHead>
            <UITableHead>雇用形態</UITableHead>
            <UITableHead>ステータス</UITableHead>
            <UITableHead></UITableHead>
          </UITableRow>
        </UITableHeader>
        <UITableBody>
          {loading ? (
            Array.from({ length: 10 }).map((_, rowIndex) => (
              <UITableRow key={rowIndex}>
                {Array.from({ length: 8 }).map((_, cellIndex) => (
                  <UITableCell key={cellIndex}>
                    <UISkeleton />
                  </UITableCell>
                ))}
              </UITableRow>
            ))
          ) : Array.isArray(staff?.data) && staff.data.length > 0 ? (
            staff.data.map((item) => (
              <UITableRow key={item?.id}>
                <UITableCell>{item?.id}</UITableCell>
                <UITableCell>{item?.profile?.fullname}</UITableCell>
                <UITableCell>{item?.email}</UITableCell>
                <UITableCell>{formatPhoneJP(item?.profile?.phone_number)}</UITableCell>
                <UITableCell
                  className={
                    item.profile?.status % 2 === 0
                      ? "text-green-lime"
                      : "text-yellow-300"
                  }
                >
                  {getEmployeeTypeLabel(item?.employment_type)}
                </UITableCell>
                <UITableCell
                  className={`text-[${getStaffReasonColor(item.profile?.status)}]`}
                >
                  {getStaffReasonLabel(item.profile?.status)}
                </UITableCell>
                <UITableCell>
                  <div className="flex items-center gap-3">

                    <Link href={`/group-home/staff/${item?.id}`}>
                      <Button
                        variant="ghost"
                        className="text-blue-bright hover:text-blue-700"
                      >
                        詳細
                      </Button>
                    </Link>

                    <Permission role={["admin", "manager"]}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="tight" variant="ellipsis">
                            <Ellipsis size={16} strokeWidth={1} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link href={`/group-home/staff/edit/${item.id}`}>無効化</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={cn(
                              "text-destructive",
                              "hover:!bg-destructive/10 hover:!text-destructive"
                            )}
                            onClick={() => handleDelete(item)}
                          >
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Permission>
                  </div>
                </UITableCell>
              </UITableRow>
            ))
          ) : (
            <UITableRow>
              <UITableCell className="text-center" colSpan={7}>
                データがありません
              </UITableCell>
            </UITableRow>
          )}
        </UITableBody>

      </UITable>

      {
        staff && staff.last_page > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    icon={<ChevronsLeft />}
                    className={cn(
                      "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                      currentPage === 1 && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() =>
                      currentPage > 1 && onPageChange(currentPage - 1)
                    }
                  />
                </PaginationItem>

                {generatePageNumbers().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      className={cn(
                        "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                        page === currentPage &&
                        "bg-sky-500 hover:bg-sky-600 text-white hover:text-white"
                      )}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {staff.last_page > 5 && currentPage < staff.last_page - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    className={cn(
                      "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                      currentPage === staff.last_page &&
                      "opacity-50 cursor-not-allowed"
                    )}
                    icon={<ChevronsRight />}
                    onClick={() =>
                      currentPage < staff.last_page &&
                      onPageChange(currentPage + 1)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )
      }

      <DeleteStaffDialog
        open={isOpenDelDialog}
        onOpenChange={setIsOpenDelDialog}
        item={selectedItem}
        onSuccess={onRefresh}
      />
    </div >
  );
}
