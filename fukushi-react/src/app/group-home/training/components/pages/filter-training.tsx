"use client"

import { Button } from "@/components/ui/button"
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useRef, useState } from "react"

type FilterTrainingProps = {
    onFilterChange: (filters: { keyword?: string; startDate?: Date; endDate?: Date }) => void
}

export default function FilterTraining({ onFilterChange }: FilterTrainingProps) {
    const [keyword, setKeyword] = useState("")
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const initialMountRef = useRef(true)

    useEffect(() => {
        if (initialMountRef.current) {
            initialMountRef.current = false
            return
        }

        const timer = setTimeout(
            () => {
                const startDate = dateRange?.from
                const endDate = dateRange?.to
                onFilterChange({ keyword, startDate, endDate })
            },
            500
        )

        return () => clearTimeout(timer)
    }, [keyword, dateRange, onFilterChange])

    const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
        setDateRange(range)
    }, [])

    return (
        <>
            <Input
                placeholder="キーワードを入力"
                className="w-64 bg-white"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <DateRangePicker
                onDateChange={handleDateRangeChange}
                value={dateRange}
                placeholder="期間を選択"
                width="w-80"
            />
            <Button
                variant="gray"
                onClick={() => {
                    setKeyword("")
                    setDateRange(undefined)
                }}
            >
                リセット
            </Button>
        </>
    )
}
