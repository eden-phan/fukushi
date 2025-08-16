"use client";

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
import { IDailyReportProps, IListDailyReportProps } from "@/@types/daily-report";
import { formatJapaneseDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  getDayOfWeek,
  getOvernightHospitalInfo,
  getRecorderName,
  getShiftType,
  getUserCount
} from "@/lib/daily-report";
import Link from "next/link";

const TABLE_HEADERS = [
  "日付",
  "曜日",
  "記録者",
  "シフト区分",
  "利用者数",
  "外泊/入院",
  ""
];

const SKELETON_ROWS = 10;

function SkeletonRow() {
  return (
    <UITableRow>
      {Array.from({ length: TABLE_HEADERS.length }).map((_, index) => (
        <UITableCell key={index}>
          <UISkeleton />
        </UITableCell>
      ))}
    </UITableRow>
  );
}

function EmptyDataRow() {
  return (
    <UITableRow className="hover:bg-transparent">
      <UITableCell
        colSpan={TABLE_HEADERS.length}
        className="p-0 pt-9 text-gray-400 text-center"
      >
        データなし
      </UITableCell>
    </UITableRow>
  );
}

function DataRow({ item }: { item: IDailyReportProps }) {
  const formatDate = (date: string) =>
    formatJapaneseDate(date).replace(/年|月/g, '/').replace(/日/, '');

  return (
    <UITableRow key={item.id}>
      <UITableCell>{formatDate(item.entry_date)}</UITableCell>
      <UITableCell className="text-[#333333] text-xs leading-[130%] font-normal">
        {getDayOfWeek(item.entry_date)}
      </UITableCell>
      <UITableCell className="text-[#333333] text-xs leading-[130%] font-normal">
        {getRecorderName(item)}
      </UITableCell>
      <UITableCell className="text-[#333333] text-xs leading-[130%] font-normal">
        {getShiftType(item)}
      </UITableCell>
      <UITableCell className="text-[#333333] text-xs leading-[130%] font-normal">
        {getUserCount(item)}
      </UITableCell>
      <UITableCell className="text-[#333333] text-xs leading-[130%] font-normal">
        {getOvernightHospitalInfo(item)}
      </UITableCell>
      <UITableCell>
        <div className="flex gap-2">
          <Link href={`/admin/daily-report/edit/${item.id}`}>
            <Button
              variant="noneOutline"
              className="text-[#385CFF] text-xs leading-[130%] font-normal"
            >
              編集
            </Button>
          </Link>
        </div>
      </UITableCell>
    </UITableRow>
  );
}

export function ListDailyReport({
  data,
  loading,
  currentPage,
  onPageChange,
}: IListDailyReportProps) {
  const renderTableBody = () => {
    if (loading) {
      return Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (!data?.data.length) {
      return <EmptyDataRow />;
    }

    return data.data.map((item) => <DataRow key={item.id} item={item} />);
  };

  return (
    <div className="p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <UITable>
        <UITableCaption>
          <div className="flex">
            {data && data.data.length > 0 && (
              <p className="text-neutral">
                {data.total} 件中 {data.from} から {data.to} まで表示
              </p>
            )}
          </div>
        </UITableCaption>

        <UITableHeader>
          <UITableRow>
            {TABLE_HEADERS.map((header) => (
              <UITableHead
                key={header}
                className="text-[#A5A5A5] text-sm leading-[130%] font-normal"
              >
                {header}
              </UITableHead>
            ))}
          </UITableRow>
        </UITableHeader>

        <UITableBody>{renderTableBody()}</UITableBody>
      </UITable>

      {data && data.last_page > 1 && (
        <div className="mt-4">
          <UIPagination
            currentPage={currentPage}
            lastPage={data.last_page}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
