"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormDocumentPayment from "../components/forms/form-document-payment";

export default function AddDocumentPayment() {
  return (
    <>
      <HeadingPage title="新規追加" />
      <FormDocumentPayment />
    </>
  );
}
