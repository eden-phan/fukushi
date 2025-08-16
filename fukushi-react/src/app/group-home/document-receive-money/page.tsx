"use client";
import { HeadingPage } from "@/components/ui/heading-page";
import { UIAddButton } from "@/components/customs/ui-button";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import { DateRange } from "react-day-picker";
import { getFormattedDateRange } from "@/lib/format";
import ListDocumentReceiveMoney from "./components/pages/list-document-receive-money";
import FilterDocumentReceiveMoney from "./components/pages/filter-document-receive-money";
import { DocumentReceiveMoneyProps } from "@/@types/document-receive-money";

export default function DocumentReceiveMoney() {
  const [data, setData] =
    useState<PaginatedResponse<DocumentReceiveMoneyProps>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debounced, setDebounced] = useState(keyword);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);

  const fetchData = useCallback(
    async (
      page: number,
      search?: string,
      date_from?: string,
      date_to?: string
    ) => {
      setLoading(true);
      try {
        const response = await http.get(`/document-receive-money`, {
          params: {
            search: search || "",
            page,
            date_from,
            date_to,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch document receive money", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpenCalendar) {
      const { date_from, date_to } = getFormattedDateRange(date);
      fetchData(currentPage, debounced, date_from, date_to);
    }
  }, [debounced, currentPage, fetchData, isOpenCalendar, date]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebounced(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleRefresh = () => {
    fetchData(currentPage, debounced);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <HeadingPage title="法定受領代理通知" />
      <div className="mt-6 flex items-center gap-3">
        <FilterDocumentReceiveMoney
          keyword={keyword}
          onKeywordChange={setKeyword}
          date={date}
          onDateChange={setDate}
          openCalendar={isOpenCalendar}
          onOpenCalendar={setIsOpenCalendar}
        />
        <UIAddButton
          url="/group-home/document-receive-money/add"
          className="ml-auto"
        >
          新規追加
        </UIAddButton>
      </div>

      <div className="mt-6">
        <ListDocumentReceiveMoney
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
