"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import http from "@/services/http";
import { IDailyReportProps } from "@/@types/daily-report";
import FormDailyReport from "@/app/(dashboard)/admin/daily-report/components/form/form-daily-report";

export default function EditDailyReport() {
  const params = useParams();
  const id = params?.id as string;

  const [dailyReport, setDailyReport] = useState<IDailyReportProps>();
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState({
    dailyReport: false
  });

  const fetchDailyReport = useCallback(async () => {
    if (!id) {
      setDataLoaded(prev => ({ ...prev, dailyReport: true }));
      return;
    }

    setLoading(true);
    try {
      const response = await http.get(`/daily-reports/${id}`);
      setDailyReport(response.data.data);
      setDataLoaded(prev => ({ ...prev, dailyReport: true }));
    } catch (error) {
      console.error("Error fetching daily report:", error);
      setDataLoaded(prev => ({ ...prev, dailyReport: true }));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDailyReport();
  }, [fetchDailyReport]);

  return (
    <>
      <HeadingPage title="業務日報 編集" />
      <FormDailyReport
        data={dailyReport}
        editId={id}
        initialLoading={loading}
        dataLoaded={dataLoaded.dailyReport}
      />
    </>
  );
}
