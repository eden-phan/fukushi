"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { FormControl } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { Input } from "../ui/input"
import { format } from "date-fns"

export function DateTimePicker({ value, onChange }: { value: Date | null; onChange: (date: Date | null) => void }) {
    const handleTimeChange = (timeValue: string) => {
        const [h, m] = timeValue.split(":").map(Number)
        const date = value ? new Date(value) : new Date()
        date.setHours(h, m)
        onChange(date)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        className={cn("pl-3 text-left font-normal", !value && "text-muted-foreground")}
                    >
                        {value
                            ? format(value, "PPP p", {
                                  locale: ja,
                              })
                            : "日時を選択してください"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 w-auto p-2" align="start">
                <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={(date) => {
                        if (!date) return
                        // giữ lại giờ cũ nếu đã có
                        const old = value ?? new Date()
                        date.setHours(old.getHours(), old.getMinutes(), old.getSeconds())
                        onChange(date)
                    }}
                    locale={ja}
                    initialFocus
                />
                <Input
                    type="time"
                    value={value ? format(value, "HH:mm") : "00:00"}
                    onChange={(e) => handleTimeChange(e.target.value)}
                />
            </PopoverContent>
        </Popover>
    )
}
