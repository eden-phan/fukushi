"use client";

import { ManagerProps } from "@/@types/manager";
import { HeadingPage } from "@/components/ui/heading-page";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import { UIAddButton } from "@/components/customs/ui-button";
import ListManager from "./components/pages/list-manager";
import FilterManager from "./components/pages/filter-manager";

export default function Manager() {
  const [data, setData] = useState<PaginatedResponse<ManagerProps>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [debounced, setDebounced] = useState(keyword);
  const [status, setStatus] = useState<string>("");
  const [facilityFilter, setFacilityFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(
    async (
      page: number,
      search?: string,
      status?: number,
      facility?: string
    ) => {
      setLoading(true);
      try {
        const response = await http.get(`/manager`, {
          params: {
            page,
            search: search || "",
            status,
            facility,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch manager", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchData(currentPage, debounced, +status, facilityFilter);
  }, [fetchData, debounced, status, facilityFilter, currentPage]);

  const handleRefresh = () => {
    fetchData(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <HeadingPage title="サービス管理責任者一覧" />

      <div className="mt-6 flex items-center gap-3">
        <FilterManager
          keyword={keyword}
          onKeywordChange={setKeyword}
          status={status}
          onStatusChange={setStatus}
          facilityFilter={facilityFilter}
          onFacilityFilterChange={setFacilityFilter}
        />
        <UIAddButton url="/admin/manager/add" className="ml-auto">
          新規追加
        </UIAddButton>
      </div>

      <div className="mt-6">
        <ListManager
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
