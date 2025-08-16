"use client";
import { HeadingPage } from '@/components/ui/heading-page'
import React, { useCallback, useEffect, useState } from 'react'
import ListPatient from './components/list-patient'
import http from '@/services/http';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PatientParams = {
  keyword: string;
  page: number;
  status?: string;
  facility?: string;
};

const Page = () => {

  const [patients, setPatients] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState<string>("");
   const [status, setStatus] = useState<string | undefined>();
  const [loading, setLoading] = useState(false)
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, status]);

  const fetchData = useCallback(async (page: number, search?: string, status?:string, facility?: string ) => {
    setLoading(true);
    try {
      const params: PatientParams = {
        keyword: search || "",
        page,
      };
      if (status && status !== "all") params.status = status;
      if (facility && facility !== "all") params.facility = facility;
      const response = await http.get(`/service-user/index`, {
        params,
      });
      setPatients(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, debouncedKeyword, status);
  }, [currentPage, debouncedKeyword, status, fetchData]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  
  return (
    <>
      <HeadingPage title="利用者一覧" />
      <div className="mt-6 flex items-center gap-3">
        <Input
        placeholder="キーワードを入力"
        className="w-64 rounded-[50px] bg-white"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
      />
        <Select 
        value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-40 rounded-[50px] bg-white">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">入居中</SelectItem>
          <SelectItem value="2">退去</SelectItem>
        </SelectContent>
      </Select>
      {/* <Select value={facility} onValueChange={setFacility}>
        <SelectTrigger className="w-40 rounded-[50px] bg-white">
          <SelectValue placeholder="事業所" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">facility1</SelectItem>
          <SelectItem value="2">facility2</SelectItem>
          <SelectItem value="3">facility3</SelectItem>
        </SelectContent>
      </Select> */}
      </div>
      <div className="mt-6">
        <ListPatient patients={patients}
        loading={loading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default Page