"use client";

import UIResetBtn from "@/components/customs/ui-reset-btn";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterStaffProps {
  keyword: string;
  onKeywordChange: (search: string) => void;
  status?: string;
  onStatusChange: (status: string) => void;
  type?: string;
  onTypeChange: (type: string) => void;
}

export default function FilterStaff({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
}: FilterStaffProps) {
  const handleReset = () => {
    onStatusChange("")
    onTypeChange("")
    onKeywordChange("")
  }
  return (

    <>
      <Input
        placeholder="キーワードを入力"
        className="w-64 rounded-[50px] bg-white"
        value={keyword}
        onChange={(e) => {
          onKeywordChange(e.target.value);
        }}
      />
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40 rounded-[50px] bg-white">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">出産休暇</SelectItem>
          <SelectItem value="2">育児休暇</SelectItem>
          <SelectItem value="3">介護休暇</SelectItem>
          <SelectItem value="4">育児・介護時短制度</SelectItem>
          <SelectItem value="5">通常勤務</SelectItem>
          <SelectItem value="6">無効</SelectItem>
        </SelectContent>
      </Select>
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-40 rounded-[50px] bg-white">
          <SelectValue placeholder="契約タイプ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">フルタイム</SelectItem>
          <SelectItem value="0">パートタイム</SelectItem>
        </SelectContent>
      </Select>
      <UIResetBtn onReset={handleReset} />
    </>
  );
}
