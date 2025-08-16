"use client";

import { HeadingPage } from "@/components/ui/heading-page";
import { useCallback, useEffect, useState } from "react";
import http from "@/services/http";
import { UICreateButton } from "@/components/customs/ui-button";
import { ServiceProvisionLogProps } from "@/@types/service-provision-log";
import FormProvisionLog from "./form-provision-log";
import ListProvisionLog from "./list-provision-log";
import FilterProvisionLog from "./filter-provision-log";

const TabProvisionLog = () => {
  const [data, setData] =
    useState<PaginatedResponse<ServiceProvisionLogProps>>();
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ServiceProvisionLogProps>();
  const [keyword, setKeyword] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [debounced, setDebounced] = useState(keyword);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAdd = () => {
    setIsAdd(true);
  };

  const handleEdit = (item: ServiceProvisionLogProps) => {
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
        const response = await http.get(`/service-provision-log`, {
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
    console.log("object");
    setIsAdd(false);
    setSelectedItem(undefined);
    fetchData(currentPage, debounced, year);
  };

  const headerTitle = isAdd
    ? "サービス提供記録 作成"
    : selectedItem
    ? "編集"
    : "ヒヤリハット報告書 一覧";

  return (
    <>
      <HeadingPage title={headerTitle} />
      {isAdd === true || selectedItem !== undefined ? (
        <>
          <FormProvisionLog
            onBackToList={handleBackToList}
            data={selectedItem}
          />
        </>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-3">
            <FilterProvisionLog
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
            <ListProvisionLog
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

export default TabProvisionLog;
