"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { ja } from "date-fns/locale";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function DateRangePicker({
  date,
  onChange,
  open,
  onOpenChange,
}: DateRangePickerProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[320px] justify-start text-left font-normal min-w-0",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy年MM月dd日", { locale: ja })} -{" "}
                  {format(date.to, "yyyy年MM月dd日", { locale: ja })}
                </>
              ) : (
                format(date.from, "yyyy年MM月dd日", { locale: ja })
              )
            ) : (
              "日付範囲を選択"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onChange}
          numberOfMonths={2}
          locale={ja}
        />
      </PopoverContent>
    </Popover>
  );
}
