"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from 'next/link';
import { Permission } from "@/components/auth/Permission";

export default function AddStaffBtn() {
  return (
    <Permission role={["admin", "manager"]}>
      <Button className="bg-sky-500 hover:bg-sky-600 ml-auto rounded-[4px]">
        <Link href="/group-home/staff/add" className="flex items-center gap-1">
          <Plus className="w-5 h-5 text-white" />
          新規追加
        </Link>
      </Button>
    </Permission>
  );
}
