"use client";

import { HeadingPage } from "@/components/ui/heading-page";
import FilterFacility from "./components/pages/filter-facility";
import ListFacility from "./components/pages/list-facility";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import { UIAddButton } from "@/components/customs/ui-button";
import { FacilityProps } from "@/@types/facility";

export default function Facility() {
  const [data, setData] = useState<PaginatedResponse<FacilityProps>>();
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debounced, setDebounced] = useState(keyword);
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const fetchData = useCallback(
    async (
      page: number,
      search: string,
      status: string,
      facility_type?: string
    ) => {
      setLoading(true);
      try {
        const response = await http.get(`/facility`, {
          params: {
            search: search || "",
            page,
            status: String(status) ? +status : "",
            facility_type,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch facility", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebounced(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchData(currentPage, debounced, status, facilityTypeFilter);
  }, [currentPage, debounced, fetchData, status, facilityTypeFilter]);

  const handleRefresh = () => {
    fetchData(currentPage, debounced, status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <HeadingPage title="事業所一覧" />
      <div className="mt-6 flex items-center gap-3">
        <FilterFacility
          keyword={keyword}
          onKeywordChange={setKeyword}
          status={status}
          onStatusChange={setStatus}
          facilityTypeFilter={facilityTypeFilter}
          onFacilityTypeFilterChange={setFacilityTypeFilter}
        />
        <UIAddButton url="/admin/facility/add" className="ml-auto">
          新規追加
        </UIAddButton>
      </div>

      <div className="mt-6">
        <ListFacility
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
