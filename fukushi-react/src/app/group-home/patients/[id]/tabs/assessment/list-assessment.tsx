"use client"

import type React from "react"
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
  UITableCaption,
} from "@/components/customs/ui-table"
import { formatDateSlash } from "@/lib/utils"
import PaginationComponent from "@/components/ui/pagination-component"
import { UISkeleton } from "@/components/customs/ui-skeleton"
import { Button } from "@/components/ui/button"
import { UIDeleteDialog } from "@/components/customs/delete-dialog"
import type { AssessmentProps } from "@/@types/assessment"

interface ListAssessmentProps {
  data?: PaginatedResponse<AssessmentProps>
  loading: boolean
  onPageChange: (page: number) => void
  onRefresh?: () => void
  handleEditItem: (id: string) => void
}

const getCreatorName = (assessment: AssessmentProps): string => {
  return assessment.service_user?.profile?.fullname || "-"
}

const truncateText = (text: string | undefined, maxLength = 50): string => {
  if (!text) return "-"
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

const ListAssessment: React.FC<ListAssessmentProps> = ({ data, loading, onPageChange, onRefresh, handleEditItem }) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <div className="p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <UITable>
        <UITableCaption>
          <div className="flex">
            <p className="text-neutral">
              {data?.total || 0} 件中 {data?.from || 0} から {data?.to || 0} まで表示
            </p>
          </div>
        </UITableCaption>
        <UITableHeader>
          <UITableRow>
            <UITableHead className="w-[157px] text-[#A5A5A5] text-sm font-normal leading-[130%]">
              アセスメント日
            </UITableHead>
            <UITableHead className="w-[220px] text-[#A5A5A5] text-sm font-normal leading-[130%]">作成者</UITableHead>
            <UITableHead className="text-[#A5A5A5] text-sm font-normal leading-[130%]">備考</UITableHead>
            <UITableHead className="text-[#A5A5A5] text-sm font-normal leading-[130%]"></UITableHead>
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
          ) : Array.isArray(data?.data) && data.data.length > 0 ? (
            data.data.map((item) => (
              <UITableRow key={item.id}>
                <UITableCell className="truncate text-sm font-normal leading-[130%]">
                  {formatDateSlash(item.created_at)}
                </UITableCell>
                <UITableCell className="truncate text-sm font-normal leading-[130%]">
                  {getCreatorName(item)}
                </UITableCell>
                <UITableCell className="text-sm font-normal leading-[130%]">
                  <span title={item.note || ""}>
                    {truncateText(item.note, 50)}
                  </span>
                </UITableCell>
                <UITableCell className="truncate max-w-[100px] text-sm font-normal leading-[130%] text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Button className="text-[#385CFF]" variant="ellipsis" onClick={() => handleEditItem(item.id)}>
                      編集
                    </Button>
                    <UIDeleteDialog
                      api={`/assessments/destroy/${item.id}`}
                      onDeleted={handleRefresh}
                      className="w-[400px] gap-5"
                    />
                  </div>
                </UITableCell>
              </UITableRow>
            ))
          ) : (
            <UITableRow>
              <UITableCell colSpan={4} className="text-center text-gray-500">
                データが見つかりません。
              </UITableCell>
            </UITableRow>
          )}
        </UITableBody>
      </UITable>

      <PaginationComponent
        currentPage={data?.current_page || 1}
        totalPages={data?.last_page || 1}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default ListAssessment
