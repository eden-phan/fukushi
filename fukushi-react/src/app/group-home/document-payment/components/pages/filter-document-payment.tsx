"use client";

import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/customs/date-range-picker";

type FilterDocumentPaymentProps = {
  keyword: string;
  onKeywordChange: (search: string) => void;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  openCalendar: boolean;
  onOpenCalendar: (value: boolean) => void;
};

export default function FilterDocumentPayment({
  keyword,
  onKeywordChange,
  date,
  onDateChange,
  openCalendar,
  onOpenCalendar,
}: FilterDocumentPaymentProps) {
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
    </>
  );
}
