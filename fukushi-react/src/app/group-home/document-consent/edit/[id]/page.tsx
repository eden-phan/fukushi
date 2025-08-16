"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormDocumentConsent from "../../components/forms/form-document-consent";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import http from "@/services/http";

export default function EditDocumentConsent() {
  const params = useParams();
  const id = params?.id as string;

  const [documentConsent, setDocumentConsent] =
    useState<DocumentConsentProps>();

  const fetchDocumentConsent = useCallback(async () => {
    try {
      const response = await http.get(`/document-consent/${id}`);
      setDocumentConsent(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Document Consent:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchDocumentConsent();
  }, [id, fetchDocumentConsent]);

  return (
    <>
      <HeadingPage title="情報編集" />
      <FormDocumentConsent data={documentConsent} />
    </>
  );
}
