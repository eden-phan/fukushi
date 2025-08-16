"use client";

import { HeadingPage } from "@/components/ui/heading-page";
import IncidentForm from "./form-incident";
import FilterIncident from "./filter-incident";
import ListIncident from "./list-incident";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import { UICreateButton } from "@/components/customs/ui-button";
import { IncidentProps } from "@/@types/incident";

const TabIncident = () => {
  const [data, setData] = useState<PaginatedResponse<IncidentProps>>();
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IncidentProps>();
  const [keyword, setKeyword] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [debounced, setDebounced] = useState(keyword);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAdd = () => {
    setIsAdd(true);
  };

  const handleEdit = (item: IncidentProps) => {
    setSelectedItem(item);
  };

  const handleRefresh = () => {
    fetchData(currentPage, keyword, year);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchData = useCallback(
    async (page: number, search?: string, year?: string) => {
      setLoading(true);
      try {
        const response = await http.get(`/incident`, {
          params: {
            page,
            search: search || "",
            year,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch incident", error);
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
    fetchData(currentPage, debounced, year);
  }, [debounced, currentPage, fetchData, year]);

  const handleBackToList = () => {
    setIsAdd(false);
    setSelectedItem(undefined);
    fetchData(currentPage, debounced, year);
  };

  const headerTitle = isAdd
    ? "新規追加"
    : selectedItem
    ? "編集"
    : "ヒヤリハット報告書 一覧";

  return (
    <>
      <HeadingPage title={headerTitle} />
      {isAdd === true || selectedItem !== undefined ? (
        <>
          <IncidentForm onBackToList={handleBackToList} data={selectedItem} />
        </>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-3">
            <FilterIncident
              keyword={keyword}
              onKeywordChange={setKeyword}
              year={year}
              onYearChange={setYear}
            />
            <UICreateButton className="ml-auto" onClick={handleAdd}>
              新規追加
            </UICreateButton>
          </div>

          <div className="mt-6">
            <ListIncident
              data={data}
              onRefresh={handleRefresh}
              loading={loading}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onEditChange={handleEdit}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TabIncident;
