"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormManager from "../components/forms/form-manager";

export default function AddManager() {
  return (
    <>
      <HeadingPage title="レジスター管理" />
      <FormManager />
    </>
  );
}
