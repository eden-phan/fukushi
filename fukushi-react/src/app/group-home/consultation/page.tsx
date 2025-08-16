"use client";

import { HeadingPage } from "@/components/ui/heading-page";
import FilterConsultation from "./components/pages/filter-consultation";
import ListConsultation from "./components/pages/list-consultation";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import {
  UIAddButton,
  UIResetFilterButton,
} from "@/components/customs/ui-button";
import { DateRange } from "react-day-picker";
import { getFormattedDateRange } from "@/lib/format";

export default function Consultation() {
  const [data, setData] = useState<PaginatedResponse<ConsultationProps>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [debounced, setDebounced] = useState(keyword);
  const [status, setStatus] = useState<string>("");
  const [acceptStatus, setAcceptStatus] = useState<string>("");

  const fetchData = useCallback(
    async (
      page: number,
      search?: string,
      date_from?: string,
      date_to?: string,
      status?: number,
      accept_status?: number
    ) => {
      setLoading(true);
      try {
        const response = await http.get(`/consultation`, {
          params: {
            search: search || "",
            page,
            date_from,
            date_to,
            status,
            accept_status,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch consultation", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpenCalendar) {
      const { date_from, date_to } = getFormattedDateRange(date);
      fetchData(
        currentPage,
        debounced,
        date_from,
        date_to,
        +status,
        +acceptStatus
      );
    }
  }, [
    isOpenCalendar,
    debounced,
    currentPage,
    date,
    fetchData,
    status,
    acceptStatus,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebounced(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleRefresh = () => {
    fetchData(currentPage, keyword);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResetFilter = () => {
    setKeyword("");
    setCurrentPage(1);
    setDate(undefined);
    setStatus("");
    setAcceptStatus("");
  };

  return (
    <>
      <HeadingPage title="相談受付表一覧" />
      <div className="mt-6 flex items-center gap-3">
        <FilterConsultation
          keyword={keyword}
          onKeywordChange={setKeyword}
          date={date}
          onChange={setDate}
          openCalendar={isOpenCalendar}
          onOpenCalendar={setIsOpenCalendar}
          status={status}
          onStatusChange={setStatus}
          accpetStatus={acceptStatus}
          onAccpetStatusChange={setAcceptStatus}
        />

        <UIResetFilterButton onClick={handleResetFilter} />

        <UIAddButton url="/group-home/consultation/add" className="ml-auto">
          新規追加
        </UIAddButton>
      </div>

      <div className="mt-6">
        <ListConsultation
          data={data}
          onRefresh={handleRefresh}
          loading={loading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
