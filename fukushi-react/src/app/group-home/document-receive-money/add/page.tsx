"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormDocumentReceiveMoney from "../components/forms/form-document-receive-money";

export default function AddDocumentReceiveMoney() {
  return (
    <>
      <HeadingPage title="法定受領代理通知" />
      <FormDocumentReceiveMoney />
    </>
  );
}
