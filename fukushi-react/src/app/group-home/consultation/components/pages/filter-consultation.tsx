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
import {
  desiredUseStatusOptions,
  consultationAcceptStatusOptions,
} from "@/lib/selections";

type FilterConsultationProps = {
  keyword: string;
  onKeywordChange: (search: string) => void;
  date: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  openCalendar: boolean;
  onOpenCalendar: (value: boolean) => void;
  status: string;
  onStatusChange: (status: string) => void;
  accpetStatus: string;
  onAccpetStatusChange: (status: string) => void;
};

export default function FilterConsultation({
  keyword,
  onKeywordChange,
  date,
  onChange,
  openCalendar,
  onOpenCalendar,
  status,
  onStatusChange,
  accpetStatus,
  onAccpetStatusChange,
}: FilterConsultationProps) {
  return (
    <>
      <DateRangePicker
        date={date}
        onChange={onChange}
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
          <SelectValue placeholder="希望ステータス" />
        </SelectTrigger>
        <SelectContent>
          {desiredUseStatusOptions.map((status) => {
            return (
              <SelectItem key={status.value} value={String(status.value)}>
                {status.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select value={accpetStatus} onValueChange={onAccpetStatusChange}>
        <SelectTrigger className="w-[180px] bg-white rounded-[50px]">
          <SelectValue placeholder="対応ステータス" />
        </SelectTrigger>
        <SelectContent>
          {consultationAcceptStatusOptions.map((acceptStatus) => {
            return (
              <SelectItem
                key={acceptStatus.value}
                value={String(acceptStatus.value)}
              >
                {acceptStatus.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
