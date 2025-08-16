"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { FormControl } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"

export function DatePicker({ value, onChange }: { value: Date | null; onChange: (date: Date | null) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        className={cn("pl-3 text-left font-normal", !value && "text-muted-foreground")}
                    >
                        {value
                            ? format(value, "PPP", {
                                  locale: ja,
                              })
                            : "日付を選択してください"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
                <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={(date) => onChange(date ?? null)}
                    locale={ja}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
