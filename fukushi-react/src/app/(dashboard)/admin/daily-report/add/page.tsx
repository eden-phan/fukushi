"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormDailyReport from "../components/form/form-daily-report";

export default function AddDailyReport() {
  return (
    <>
      <HeadingPage title="業務日報 新規作成" />
      <FormDailyReport />
    </>
  );
}