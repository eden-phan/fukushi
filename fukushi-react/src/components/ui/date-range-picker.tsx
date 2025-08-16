"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
    className?: string
    onDateChange?: (date: DateRange | undefined) => void
    value?: DateRange | undefined
    placeholder?: string
    width?: string
    disabled?: boolean
}

function DateRangePicker({
    className,
    onDateChange,
    value,
    placeholder = "日付範囲を選択",
    width = "w-80",
    disabled = false,
}: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(value)

    React.useEffect(() => {
        setDateRange(value)
    }, [value])

    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        setDateRange(selectedDate)
        if (onDateChange) {
            onDateChange(selectedDate)
        }
    }

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return placeholder
        if (!range.to) return format(range.from, "yyyy年MM月dd日", { locale: ja })
        return `${format(range.from, "yyyy年MM月dd日", { locale: ja })} - ${format(range.to, "yyyy年MM月dd日", {
            locale: ja,
        })}`
    }

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date-range"
                        disabled={disabled}
                        className={cn(
                            width,
                            "justify-between bg-white min-w-0",
                            "rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            className
                        )}
                    >
                        <span className="text-muted-foreground truncate flex-1 text-left">{formatDateRange(dateRange)}</span>
                        <ChevronDownIcon className="ml-2 flex-shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        captionLayout="dropdown"
                        onSelect={handleDateSelect}
                        numberOfMonths={1}
                        locale={ja}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export { DateRangePicker }
export type { DateRangePickerProps }
export type { DateRange }
