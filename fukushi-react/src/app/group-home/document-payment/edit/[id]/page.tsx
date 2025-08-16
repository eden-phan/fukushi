"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import http from "@/services/http";
import FormDocumentPayment from "../../components/forms/form-document-payment";
import { DocumentPaymentProps } from "@/@types/documentPayment";

export default function EditDocumentPayment() {
  const params = useParams();
  const id = params?.id as string;

  const [documentPayment, setDocumentPayment] =
    useState<DocumentPaymentProps>();

  const fetchDocumentPayment = useCallback(async () => {
    try {
      const response = await http.get(`/document-payment/${id}`);
      setDocumentPayment(response.data.data);
    } catch (error) {
      console.error("fail to fetch DocumentPayment data:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchDocumentPayment();
  }, [id, fetchDocumentPayment]);

  return (
    <>
      <HeadingPage title="編集" />
      <FormDocumentPayment data={documentPayment} />
    </>
  );
}
