"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormConsultation from "../components/forms/form-consultation";

export default function AddFacility() {
  return (
    <>
      <HeadingPage title="新規作成" />
      <FormConsultation />
    </>
  );
}
