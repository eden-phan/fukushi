"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormFacility from "../components/forms/form-facility";

export default function AddFacility() {
  return (
    <>
      <HeadingPage title="新規追加" />
      <FormFacility />
    </>
  );
}
