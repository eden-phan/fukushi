"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Clock } from 'lucide-react'

interface TimeRangePickerProps {
  startTime?: string
  endTime?: string
  onStartTimeChange?: (time: string) => void
  onEndTimeChange?: (time: string) => void
  className?: string
  disabled?: boolean
}

export function TimeRangePicker({
  startTime = "",
  endTime = "",
  onStartTimeChange,
  onEndTimeChange,
  className,
  disabled = false,
}: TimeRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempStart, setTempStart] = React.useState(startTime)
  const [tempEnd, setTempEnd] = React.useState(endTime)

  React.useEffect(() => {
    setTempStart(startTime)
    setTempEnd(endTime)
  }, [startTime, endTime])

  const handleConfirm = () => {
    onStartTimeChange?.(tempStart)
    onEndTimeChange?.(tempEnd)
    setOpen(false)
  }

  const displayText = startTime && endTime ? `${startTime} - ${endTime}` : "時間を選択"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full h-[54px] justify-between text-left font-normal border-none rounded-none shadow-none px-3",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <span className="text-sm">{displayText}</span>
          <Clock className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">開始時間</label>
            <Input
              type="time"
              value={tempStart}
              onChange={(e) => setTempStart(e.target.value)}
              className="w-[120px] h-8"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">終了時間</label>
            <Input
              type="time"
              value={tempEnd}
              onChange={(e) => setTempEnd(e.target.value)}
              className="w-[120px] h-8"
            />
          </div>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="mt-5 bg-blue-600 hover:bg-blue-700"
          >
            確定
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
