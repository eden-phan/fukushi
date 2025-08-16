"use client";

import { HeadingPage } from "@/components/ui/heading-page";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import { IDailyReportProps, IFetchParams } from "@/@types/daily-report";
import { FilterDailyReport } from "./components/page/filter-daily-report";
import { ListDailyReport } from "./components/page/list-daily-report";


export default function DailyReport() {
  const [data, setData] = useState<PaginatedResponse<IDailyReportProps>>();
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shiftType, setShiftType] = useState("all");

  const fetchData = useCallback(
    async (page: number, search: string, shift_type = "all") => {
      setLoading(true);
      try {
        const params: IFetchParams = {
          keyword: search,
          page,
        };

        if (shift_type !== "all") {
          params.work_shift = shift_type;
        }

        const response = await http.get("/daily-reports/index", { params });
        setData(response.data.data);
      } catch {

      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(1, "", "all");
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page, keyword, shiftType);
  };

  const handleReset = () => {
    setKeyword("");
    setShiftType("all");
    setCurrentPage(1);
    fetchData(1, "", "all");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, keyword, shiftType);
  };

  return (
    <>
      <HeadingPage title="業務日報一覧" />
      <div className="mt-6 flex items-center gap-3">
        <FilterDailyReport
          keyword={keyword}
          onKeywordChange={setKeyword}
          shiftType={shiftType}
          onShiftTypeChange={setShiftType}
          onReset={handleReset}
          onSearch={handleSearch}
        />
      </div>

      <div className="mt-6">
        <ListDailyReport
          data={data}
          loading={loading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
