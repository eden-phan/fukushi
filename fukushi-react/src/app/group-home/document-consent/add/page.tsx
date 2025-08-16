"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormDocumentConsent from "../components/forms/form-document-consent";

export default function AddDocumentConsent() {
  return (
    <>
      <HeadingPage title="新規追加" />
      <FormDocumentConsent />
    </>
  );
}
