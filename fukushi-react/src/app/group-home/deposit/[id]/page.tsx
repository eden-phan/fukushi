"use client";
import { HeadingPage } from '@/components/ui/heading-page'
import React, { useCallback, useEffect, useState } from 'react'
import ListDepositItem from '../components/list-deposit-item'
import http from '@/services/http'
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<PaginatedResponse<DepositItemProps>>();
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debounced, setDebounced] = useState(keyword);

  const fetchData = useCallback(async (page: number, search?: string) => {
    setLoading(true);
    try {
      const response = await http.get(`/deposit/item/${id}`, {
        params: {
          keyword: search || "",
          page,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch facility", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebounced(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchData(currentPage, debounced);
  }, [currentPage, debounced, fetchData]);

  const handleRefresh = () => {
    fetchData(currentPage, keyword);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <>
      <HeadingPage title="新規追加" />
      <div className="mt-6">
        <div className="flex items-center gap-3 absolute">
          <Input
            placeholder="キーワードを入力"
            className="w-64 bg-white"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <ListDepositItem
          data={data}
          onRefresh={handleRefresh}
          loading={loading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default Page