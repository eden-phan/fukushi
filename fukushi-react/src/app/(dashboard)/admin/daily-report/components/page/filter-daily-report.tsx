"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, Search } from 'lucide-react';
import { IFilterDailyReportProps } from "@/@types/daily-report";
import { useRouter } from "next/navigation";

const SHIFT_TYPE_OPTIONS = [
  { value: "all", label: "シフト区分" },
  { value: "day_shift", label: "日勤" },
  { value: "night_shift", label: "夜勤" },
];

export function FilterDailyReport({
  keyword,
  onKeywordChange,
  shiftType,
  onShiftTypeChange,
  onReset,
  onSearch,
}: IFilterDailyReportProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        placeholder="キーワードを入力"
        className="w-64 rounded-[50px] bg-white"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />

      <Select value={shiftType} onValueChange={onShiftTypeChange}>
        <SelectTrigger className="min-w-[180px] bg-white rounded-[50px]">
          <SelectValue placeholder="シフト区分" />
        </SelectTrigger>
        <SelectContent>
          {SHIFT_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="noneOutline"
        className="rounded-[4px] bg-[#B5B5B5]"
        onClick={onReset}
      >
        <RefreshCcw className="w-4 h-4 mr-2" />
        リセット
      </Button>

      <Button
        className="rounded-[4px] bg-[#2E89D7]"
        onClick={onSearch}
      >
        <Search className="w-4 h-4 mr-2" />
        検索
      </Button>

      <Button
        className="rounded-[4px] bg-[#3C94DF] ml-auto justify-end"
        onClick={() => router.push("/admin/daily-report/add")}
      >
        <Plus className="w-4 h-4" />
        追加
      </Button>
    </div>
  );
}
