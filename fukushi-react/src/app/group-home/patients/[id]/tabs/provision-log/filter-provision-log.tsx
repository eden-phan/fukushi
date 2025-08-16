"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

type FilterProvisionLogProps = {
  keyword: string;
  onKeywordChange: (search: string) => void;
  year: string;
  onYearChange: (value: string) => void;
};

export default function FilterProvisionLog({
  keyword,
  onKeywordChange,
  year,
  onYearChange,
}: FilterProvisionLogProps) {
  return (
    <>
      <Select value={year} onValueChange={onYearChange}>
        <SelectTrigger className="w-32 rounded-[50px] bg-white border border-gray-300 px-3 py-2">
          <CalendarIcon className="h-4 w-4 opacity-50" />
          <SelectValue placeholder="年を選択" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, i) => 2020 + i).map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="キーワードを入力"
        className="w-64 rounded-[50px] bg-white"
        value={keyword}
        onChange={(e) => {
          onKeywordChange(e.target.value);
        }}
      />
    </>
  );
}
