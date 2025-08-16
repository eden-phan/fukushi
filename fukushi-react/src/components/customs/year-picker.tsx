"use client"

import * as React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type YearPickerProps = {
    value?: number
    defaultValue?: number
    onChange?: (year: number) => void
    startYear?: number
    endYear?: number
    className?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    sortOrder?: "asc" | "desc"
    textColor?: string
}

export function YearPicker({
    value,
    defaultValue,
    onChange,
    startYear = 2000,
    endYear = new Date().getFullYear() + 10,
    className,
    leftIcon,
    rightIcon,
    sortOrder = "desc",
    textColor = "#1F84F8",
}: YearPickerProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedYear, setSelectedYear] = React.useState<number | undefined>(value ?? defaultValue)

    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedYear(value)
        }
    }, [value])

    const handleYearSelect = (year: number) => {
        setSelectedYear(year)
        onChange?.(year)
        setOpen(false)
    }

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const [triggerWidth, setTriggerWidth] = React.useState<number>(0)

    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedYear(value)
        }
    }, [value])

    React.useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth)
        }
    }, [open])

    let years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
    if (sortOrder === "desc") years = years.reverse()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    className={cn("w-fit justify-between", className)}
                >
                    {leftIcon}
                    <span className={cn("text-sm", textColor)}>
                        {selectedYear ?? "年"}
                    </span>
                    {rightIcon}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                style={{ width: triggerWidth }}
                className="max-h-64 overflow-y-auto p-0"
            >
                <div className="flex flex-col">
                    {years.map((year) => (
                        <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={cn(
                                "text-left px-4 py-1 hover:bg-muted w-full text-sm",
                                year === selectedYear && "bg-blue-600 text-white font-semibold"
                            )}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
