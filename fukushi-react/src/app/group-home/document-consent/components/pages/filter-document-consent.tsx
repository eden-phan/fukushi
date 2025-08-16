"use client";

import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/customs/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { documentConsentStatusOptions } from "@/lib/selections";

type FilterDocumentConsentProps = {
  keyword: string;
  onKeywordChange: (search: string) => void;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  openCalendar: boolean;
  onOpenCalendar: (value: boolean) => void;
  status: string;
  onStatusChange: (status: string) => void;
};

export default function FilterDocumentConsent({
  keyword,
  onKeywordChange,
  date,
  onDateChange,
  openCalendar,
  onOpenCalendar,
  status,
  onStatusChange,
}: FilterDocumentConsentProps) {
  return (
    <>
      <DateRangePicker
        date={date}
        onChange={onDateChange}
        open={openCalendar}
        onOpenChange={onOpenCalendar}
      />
      <Input
        placeholder="キーワードを入力"
        className="w-64 rounded-[50px] bg-white"
        value={keyword}
        onChange={(e) => {
          onKeywordChange(e.target.value);
        }}
      />
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px] bg-white rounded-[50px]">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          {documentConsentStatusOptions.map((status) => {
            return (
              <SelectItem key={status.value} value={String(status.value)}>
                {status.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
