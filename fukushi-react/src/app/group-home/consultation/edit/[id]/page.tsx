"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormConsultation from "../../components/forms/form-consultation";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import http from "@/services/http";

export default function EditConsultation() {
  const params = useParams();
  const id = params?.id as string;

  const [consultation, setConsultation] = useState<ConsultationProps>();

  const fetchConsultation = useCallback(async () => {
    try {
      const response = await http.get(`/consultation/${id}`);
      setConsultation(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu consultation:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchConsultation();
  }, [id, fetchConsultation]);

  return (
    <>
      <HeadingPage title="編集" />
      <FormConsultation data={consultation} />
    </>
  );
}
