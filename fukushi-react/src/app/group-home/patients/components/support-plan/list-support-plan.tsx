"use client";
import React, { useCallback, useEffect, useState } from 'react'
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
  UITableCaption,
} from "@/components/customs/ui-table"
import { formatDate, getSupportPlanRateLabel, getSupportPlanStatusLabel } from '@/lib/utils'
import http from '@/services/http'
import { useParams } from 'next/navigation';
import PaginationComponent from '@/components/ui/pagination-component';
import { UISkeleton } from '@/components/customs/ui-skeleton';
import { Button } from '@/components/ui/button';
import { UIDeleteDialog } from '@/components/customs/delete-dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
// import Link from 'next/link';

type Props = {
  handleEditItem: (id: string) => void;
}

const ListSupportPlan = ({ handleEditItem }: Props) => {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<PaginatedResponse<supportPlanProps>>()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [year, setYear] = useState<string>("");
  const fetchData = useCallback(async (page: number, yearParam?: string) => {
    setLoading(true);
    try {
      const response = await http.get(`/support-plan/index/${id}`, {
        params: {
          year: yearParam || "",
          page,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch facility", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData(currentPage, year);
  }, [currentPage, year, fetchData]);

  const handleRefresh = () => {
    fetchData(currentPage, year);
  };

  const handleReset = () => {
    setYear("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
      <>
          <div className="relative bottom-8 flex items-center gap-3 w-1/2">
              <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-32 rounded-[50px] bg-white border border-gray-300 px-3 py-2">
                      <SelectValue placeholder="年を選択" />
                  </SelectTrigger>
                  <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => 2020 + i).map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                              {y}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white" onClick={handleReset}>
                  リセット
              </Button>
          </div>
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
                          <UITableHead>計画作成日</UITableHead>
                          <UITableHead>評価済み</UITableHead>
                          <UITableHead>状態</UITableHead>
                          <UITableHead>担当職員</UITableHead>
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
                      ) : Array.isArray(data?.data) && data.data.length > 0 ? (
                          data.data.map((item) => (
                              <UITableRow key={item.id}>
                                  <UITableCell className="truncate">{formatDate(item.created_at)}</UITableCell>
                                  <UITableCell
                                      className={
                                          Number(item?.is_assessed) % 2 === 0 ? "text-green-lime" : "text-red-bright"
                                      }
                                  >
                                      {getSupportPlanRateLabel(item.is_assessed)}
                                  </UITableCell>
                                  <UITableCell
                                      className={Number(item?.status) % 2 === 0 ? "text-green-lime" : "text-red-bright"}
                                  >
                                      {getSupportPlanStatusLabel(item.status)}
                                  </UITableCell>
                                  <UITableCell className="truncate">{item.profile.fullname}</UITableCell>
                                  <UITableCell className="truncate">
                                      <div className="flex items-center gap-2">
                                          {/* <Link className="text-blue-bright" href={`/group-home/deposit/${item.id}`}>
                      詳細
                      </Link> */}
                                          <Button
                                              className="text-blue-400"
                                              variant="ellipsis"
                                              onClick={() => handleEditItem(item.id)}
                                          >
                                              無効化
                                          </Button>
                                          <UIDeleteDialog
                                              api={`/support-plan/destroy/${item.id}`}
                                              onDeleted={handleRefresh}
                                          />
                                      </div>
                                  </UITableCell>
                              </UITableRow>
                          ))
                      ) : (
                          <UITableRow>
                              <UITableCell colSpan={6} className="text-center text-gray-500">
                                  データが見つかりません。
                              </UITableCell>
                          </UITableRow>
                      )}
                  </UITableBody>
              </UITable>

              <PaginationComponent
                  currentPage={currentPage}
                  totalPages={data?.last_page || 1}
                  onPageChange={handlePageChange}
              />
          </div>
      </>
  )
}

export default ListSupportPlan