"use client"

import { HeadingPage } from "@/components/ui/heading-page"
import CustomAddBtn from "@/components/customs/add-btn"
import { useCallback, useEffect, useState } from "react"
import http from "@/services/http"
import { useParams } from "next/navigation"
import ListAssessment from "./list-assessment"
import { YearPicker } from "@/components/customs/year-picker"
import { Calendar } from "lucide-react"
import { toast } from "sonner"
import FormAssessment from "./form-assessment"
import type { AssessmentProps } from "@/@types/assessment"

const TabAssessment = () => {
  const params = useParams()
  const [data, setData] = useState<PaginatedResponse<AssessmentProps>>()
  const id = params?.id as string
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [year, setYear] = useState<number | undefined>(undefined)
  const [addItem, setAddItem] = useState(false)
  const [editId, setEditId] = useState<string | undefined>(undefined)

  const fetchData = useCallback(
    async (page = 1, yearParam?: number) => {
      setLoading(true)
      try {
        const response = await http.get(`/assessments/index/${id}`, {
          params: {
            page,
            year: yearParam || "",
          },
        })
        setData(response.data.data)
      } catch {
        toast.error("アセスメントの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    },
    [id],
  )

  const handleAddItem = () => {
    setAddItem(true)
    setEditId(undefined)
  }

  const handleBackToList = useCallback(() => {
    setAddItem(false)
    setEditId(undefined)
    fetchData(currentPage, year)
  }, [fetchData, currentPage, year])

  const handleEditItem = (itemId: string) => {
    setAddItem(true)
    setEditId(itemId)
  }

  const handleYearChange = useCallback(
    (selectedYear: number) => {
      setYear(selectedYear)
      setCurrentPage(1)
      fetchData(1, selectedYear)
    },
    [fetchData],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      fetchData(page, year)
    },
    [fetchData, year],
  )

  const handleRefresh = useCallback(() => {
    fetchData(currentPage, year)
  }, [fetchData, currentPage, year])

  useEffect(() => {
    fetchData(currentPage, year)
  }, [fetchData, currentPage, year])

  return (
    <>
      <HeadingPage title="アセスメント" />
      {addItem ? (
        <div>
          <FormAssessment editId={editId} onBackToList={handleBackToList} />
        </div>
      ) : (
        <div className="mt-[32px]">
          <div className="pb-[26px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-1/2">
              <YearPicker
                value={year}
                onChange={handleYearChange}
                startYear={new Date().getFullYear() - 100}
                endYear={new Date().getFullYear()}
                className="w-[100px] rounded-[5px] py-3 px-[15px]"
                leftIcon={<Calendar />}
                defaultValue={new Date().getFullYear()}
                textColor="text-[#1F84F8]"
              />
            </div>
            <CustomAddBtn handleAddItem={handleAddItem} />
          </div>

          <ListAssessment
            data={data}
            loading={loading}
            onPageChange={handlePageChange}
            onRefresh={handleRefresh}
            handleEditItem={handleEditItem}
          />
        </div>
      )}
    </>
  )
}

export { TabAssessment }
