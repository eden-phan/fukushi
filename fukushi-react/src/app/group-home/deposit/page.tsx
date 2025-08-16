"use client";
import { HeadingPage } from '@/components/ui/heading-page'
import { Input } from '@/components/ui/input';
import React, { useCallback, useEffect, useState } from 'react'
import ListDeposit from './components/list-deposit';
import http from '@/services/http';
import { DateRange, DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';

const Page = () => {
  const [deposits, setDeposits] = useState();
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilter] = useState<{
    keyword?: string
    startDate?: Date
    endDate?: Date
  }>({})

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setFilter((prev) => ({
      ...prev,
      startDate: range?.from,
      endDate: range?.to,
    }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      keyword: debouncedKeyword || undefined,
    }));
  }, [debouncedKeyword]);

  const fetchData = useCallback(
    async (page: number = currentPage) => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        queryParams.append("page", page.toString())
        queryParams.append("sortBy", "created_at")
        queryParams.append("sortDirection", "desc")
        if (filters.keyword) queryParams.append("keyword", filters.keyword)
        if (filters.startDate) {
          const year = filters.startDate.getFullYear()
          const month = String(filters.startDate.getMonth() + 1).padStart(2, "0")
          const day = String(filters.startDate.getDate()).padStart(2, "0")
          queryParams.append("startDate", `${year}-${month}-${day}`)
        }
        if (filters.endDate) {
          const year = filters.endDate.getFullYear()
          const month = String(filters.endDate.getMonth() + 1).padStart(2, "0")
          const day = String(filters.endDate.getDate()).padStart(2, "0")
          queryParams.append("endDate", `${year}-${month}-${day}`)
        }

        const response = await http.get(`/deposit?${queryParams.toString()}`)
        setDeposits(response.data.data);
      } catch (error) {
        console.error("Failed to fetch training data:", error)
      } finally {
        setLoading(false)
      }
    },
    [currentPage, filters]
  )

    useEffect(() => {
    if (currentPage === 1) {
      fetchData(1)
    }
  }, [ currentPage, fetchData])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchData(page)
  }

  // Hàm reset
  const handleReset = () => {
    setKeyword("");
    setDateRange(undefined);
    setFilter({});
  };

  return (
    <>
      <HeadingPage title="法定受領代理通知" />
      <div className="mt-6 flex items-center gap-3">
        <Input
          placeholder="キーワードを入力"
          className="w-64 bg-white"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <DateRangePicker onDateChange={handleDateRangeChange} value={dateRange} placeholder="期間を選択" />
        <Button
          variant="outline"
          className="bg-white"
          onClick={handleReset}
        >
          リセット
        </Button>
      </div>
      <div className="mt-6">
        <ListDeposit
          loading={loading}
          deposits={deposits}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default Page