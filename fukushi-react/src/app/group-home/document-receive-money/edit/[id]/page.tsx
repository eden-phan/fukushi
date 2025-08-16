"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import http from "@/services/http";
import FormDocumentReceiveMoney from "../../components/forms/form-document-receive-money";
import { DocumentReceiveMoneyProps } from "@/@types/document-receive-money";

export default function EditDocumentReceiveMoney() {
  const params = useParams();
  const id = params?.id as string;

  const [documentReceiveMoney, setDocumentReceiveMoney] =
    useState<DocumentReceiveMoneyProps>();

  const fetchDocumentReceiveMoney = useCallback(async () => {
    try {
      const response = await http.get(`/document-receive-money/${id}`);
      setDocumentReceiveMoney(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Document Receive Money:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchDocumentReceiveMoney();
  }, [id, fetchDocumentReceiveMoney]);

  return (
    <>
      <HeadingPage title="法定受領代理通知" />
      <FormDocumentReceiveMoney data={documentReceiveMoney} />
    </>
  );
}
