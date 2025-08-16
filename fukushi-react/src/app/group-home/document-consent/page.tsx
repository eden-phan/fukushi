"use client";

import { HeadingPage } from "@/components/ui/heading-page";
import FilterDocumentConsent from "./components/pages/filter-document-consent";
import ListDocumentConsent from "./components/pages/list-document-consent";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import { UIAddButton } from "@/components/customs/ui-button";
import { DateRange } from "react-day-picker";
import { getFormattedDateRange } from "@/lib/format";

export default function DocumentConsent() {
  const [data, setData] = useState<PaginatedResponse<DocumentConsentProps>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [debounced, setDebounced] = useState(keyword);
  const [status, setStatus] = useState<string>("");

  const fetchData = useCallback(
    async (
      page: number,
      search?: string,
      date_from?: string,
      date_to?: string,
      status?: string
    ) => {
      setLoading(true);
      try {
        const response = await http.get(`/document-consent`, {
          params: {
            search: search || "",
            page,
            date_from,
            date_to,
            status,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch document consent", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpenCalendar) {
      const { date_from, date_to } = getFormattedDateRange(date);
      fetchData(currentPage, debounced, date_from, date_to, status);
    }
  }, [isOpenCalendar, debounced, currentPage, date, fetchData, status]);

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

  return (
    <>
      <HeadingPage title="事業所一覧" />
      <div className="mt-6 flex items-center gap-3">
        <FilterDocumentConsent
          keyword={keyword}
          onKeywordChange={setKeyword}
          date={date}
          onDateChange={setDate}
          openCalendar={isOpenCalendar}
          onOpenCalendar={setIsOpenCalendar}
          status={status}
          onStatusChange={setStatus}
        />
        <UIAddButton url="/group-home/document-consent/add" className="ml-auto">
          同意書 一覧
        </UIAddButton>
      </div>

      <div className="mt-6">
        <ListDocumentConsent
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
