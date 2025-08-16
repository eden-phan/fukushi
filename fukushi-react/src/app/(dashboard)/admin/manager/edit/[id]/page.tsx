"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormManager from "../../components/forms/form-manager";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import http from "@/services/http";
import { ManagerProps } from "@/@types/manager";

export default function EditManager() {
  const params = useParams();
  const id = params?.id as string;

  const [manager, setManager] = useState<ManagerProps>();

  const fetchManager = useCallback(async () => {
    try {
      const response = await http.get(`/manager/${id}`);
      setManager(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Manager:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchManager();
  }, [id, fetchManager]);

  return (
    <>
      <HeadingPage title="管理者情報の編集" />
      <FormManager data={manager} />
    </>
  );
}
