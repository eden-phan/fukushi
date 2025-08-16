"use client";

import * as React from "react";
import { HeadingPage } from "@/components/ui/heading-page";
import FormStaff from "../../components/forms/form-staff";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import http from "@/services/http";
import { withAuth } from "@/components/auth/withAuth";

function EditStaff() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<StaffProps>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchStaff = async () => {
      try {
        setLoading(true)
        const response = await http.get(`/profile/${id}`);
        setData(response.data);
        setLoading(false)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
      }
    };

    fetchStaff();
  }, [id]);

  return (
    <>
      <HeadingPage title="編集スタッフ" />
      <FormStaff staffData={data} loading={loading} />
    </>
  );
}

export default withAuth(EditStaff, ["admin", "manager"]);
