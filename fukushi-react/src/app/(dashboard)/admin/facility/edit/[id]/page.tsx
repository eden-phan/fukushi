"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormFacility from "../../components/forms/form-facility";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import http from "@/services/http";
import { FacilityProps } from "@/@types/facility";

export default function EditFacility() {
  const params = useParams();
  const id = params?.id as string;

  const [facility, setFacility] = useState<FacilityProps>();

  const fetchFacility = useCallback(async () => {
    try {
      const response = await http.get(`/facility/${id}`);
      setFacility(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Facility:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchFacility();
  }, [id, fetchFacility]);

  return (
    <>
      <HeadingPage title="事業所 編集" />
      <FormFacility data={facility} />
    </>
  );
}
