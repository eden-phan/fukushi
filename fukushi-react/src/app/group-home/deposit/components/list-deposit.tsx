import React from 'react'
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
  UITableCaption,
} from "@/components/customs/ui-table"
import Link from 'next/link'
import UIPagination from '@/components/ui/pagination-component'
import { getDepositStatusLabel } from '@/lib/utils'
import { DepositStatusEnum } from '@/lib/enum'

type Props = {
  deposits: PaginatedResponse<DepositProps> | undefined
  loading: boolean
  onPageChange: (page: number) => void
  currentPage: number
}

const ListDeposit = ({ deposits, loading, onPageChange, currentPage }: Props) => {

  if (loading) {
    return (
      <div className="p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          <span className="ml-2 text-gray-600">読み込み中...</span>
        </div>
      </div>
    )
  }
  return (
    <div className="p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <UITable>
        <UITableCaption>
          <div className="flex">
            <p className="text-neutral">
              {deposits?.total || 0} 件中 {deposits?.from || 0} から {deposits?.to || 0} まで表示
            </p>
          </div>
        </UITableCaption>
        <UITableHeader>
          <UITableRow>
            <UITableHead>利用者氏名</UITableHead>
            <UITableHead>数量</UITableHead>
            <UITableHead>預かり日</UITableHead>
            <UITableHead>返却日</UITableHead>
            <UITableHead>担当者</UITableHead>
            <UITableHead>ステータス</UITableHead>
            <UITableHead></UITableHead>
          </UITableRow>
        </UITableHeader>
        <UITableBody>
          {Array.isArray(deposits?.data) && deposits?.data?.map(item => (
            <UITableRow key={item.id}>
              <UITableCell className="truncate">{item?.service_user?.profile.fullname}</UITableCell>
              <UITableCell className="truncate">{item?.total_amount}</UITableCell>
              <UITableCell>{item.pickup_date}</UITableCell>
              <UITableCell>{item.return_date}</UITableCell>
              <UITableCell className="truncate">{item.user.name}</UITableCell>
              {/* <UITableCell className="truncate">{getDepositStatusLabel(item.status)}</UITableCell> */}
              <UITableCell className="truncate">
                <span
                  className={` ${item.status === DepositStatusEnum.Deposit 
                    ? 'text-green-500' 
                    : 'text-yellow-500'
                    }`}
                >
                  {getDepositStatusLabel(item.status)}
                </span>
              </UITableCell>
              <UITableCell className="truncate">
                <Link className="text-blue-bright" href={`/group-home/deposit/${item.id}`}>
                  詳細
                </Link>
              </UITableCell>
            </UITableRow>
          ))}

        </UITableBody>
      </UITable>

      <UIPagination
        currentPage={currentPage}
        totalPages={deposits?.last_page || 1}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default ListDeposit