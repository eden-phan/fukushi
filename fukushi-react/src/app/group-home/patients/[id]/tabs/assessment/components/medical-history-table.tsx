"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import type { UseFormReturn } from "react-hook-form"
import type { FormAssessmentData, MedicalDisabilityHistoryProps } from "@/@types/assessment"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ja } from "date-fns/locale"

interface MedicalHistoryItem {
  date: string
  event: string
}

interface MedicalHistoryTableProps {
  form: UseFormReturn<FormAssessmentData, unknown, FormAssessmentData>
  initialData?: MedicalDisabilityHistoryProps[]
}

const MedicalHistoryTable: React.FC<MedicalHistoryTableProps> = ({ form, initialData }) => {
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>(() => {
        if (initialData?.length) {
            return initialData.map((item) => ({
                date: item.date ? format(new Date(item.date), "yyyy-MM-dd") : "",
                event: item.detail || "",
            }))
        }

        const existingData = form.getValues("medical_history")
        if (existingData && typeof existingData === "string") {
            try {
                const parsed = JSON.parse(existingData)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((item) => ({
                        date: item.date || "",
                        event: item.event || "",
                    }))
                }
            } catch {
                return [{ date: "", event: "" }]
            }
        }
        return [{ date: "", event: "" }]
    })

    const [validationErrors, setValidationErrors] = useState<string[]>([])

    useEffect(() => {
        if (initialData?.length) {
            const mappedData = initialData.map((item) => ({
                date: item.date ? format(new Date(item.date), "yyyy-MM-dd") : "",
                event: item.detail || "",
            }))
            setMedicalHistory(mappedData)
            form.setValue("medical_history", JSON.stringify(mappedData))
        }
    }, [initialData, form])

    const validateMedicalHistory = (history: MedicalHistoryItem[]): string[] => {
        const errors: string[] = []
        const seenErrors = new Set<string>()
        history.forEach((item, index) => {
            const hasDate = item.date && item.date.trim() !== ""
            const hasEvent = item.event && item.event.trim() !== ""

            if (hasDate && !hasEvent) {
                const errorMsg = `行 ${index + 1}: 日付が入力されている場合は事項も入力してください`
                if (!seenErrors.has(errorMsg)) {
                    errors.push(errorMsg)
                    seenErrors.add(errorMsg)
                }
            }
            if (!hasDate && hasEvent) {
                const errorMsg = `行 ${index + 1}: 事項が入力されている場合は日付も入力してください`
                if (!seenErrors.has(errorMsg)) {
                    errors.push(errorMsg)
                    seenErrors.add(errorMsg)
                }
            }
        })

        return errors
    }

    const updateFormValue = (newHistory: MedicalHistoryItem[]) => {
        setMedicalHistory(newHistory)
        form.setValue("medical_history", JSON.stringify(newHistory))

        const errors = validateMedicalHistory(newHistory)
        setValidationErrors(errors)

        if (errors.length === 0) {
            form.clearErrors("medical_history")
        } else {
            form.setError("medical_history", {
                type: "manual",
                message: errors[0]
            })
        }
    }

    const handleDateChange = (index: number, date: Date | undefined) => {
        const newHistory = [...medicalHistory]
        newHistory[index] = {
            ...newHistory[index],
            date: date ? format(date, "yyyy-MM-dd") : "",
        }
        updateFormValue(newHistory)
    }

    const handleEventChange = (index: number, event: string) => {
        const newHistory = [...medicalHistory]
        newHistory[index] = { ...newHistory[index], event }
        updateFormValue(newHistory)
    }

    const addNewRow = () => {
        updateFormValue([...medicalHistory, { date: "", event: "" }])
    }

    return (
        <div className="mt-[15px]">
            <div className="font-bold text-base mb-4">病歴・障害歴</div>
            <FormField
                control={form.control}
                name="medical_history"
                render={() => (
                    <FormItem>
                        <FormControl>
                            <Table className="border border-[#8B8484] rounded-[5px]">
                                <TableHeader>
                                    <TableRow className="bg-gray-100">
                                        <TableHead className="border-r border-[#8B8484] text-center font-bold p-2 w-1/3">年月</TableHead>
                                        <TableHead className="text-center font-bold p-2">事項</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medicalHistory.map((item, index) => (
                                        <TableRow key={index} className="border-t border-[#8B8484]">
                                            <TableCell className="border-r border-[#8B8484] p-0">
                                                <FormItem className="m-0">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "w-full h-[40px] pl-3 text-left font-normal border-none rounded-none focus:ring-0 shadow-none",
                                                                        !item.date && "text-muted-foreground",
                                                                    )}
                                                                >
                                                                    {item.date ? (
                                                                        format(new Date(item.date), "yyyy年MM月dd日 (EEEE)", { locale: ja })
                                                                    ) : (
                                                                        <span>日付を選択</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={item.date ? new Date(item.date) : undefined}
                                                                onSelect={(date) => handleDateChange(index, date)}
                                                                captionLayout="label"
                                                                locale={ja}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormItem>
                                            </TableCell>
                                            <TableCell className="p-0">
                                                <Input
                                                    className="w-full min-h-fit border-none rounded-none focus:ring-0 focus-visible:ring-0 shadow-none"
                                                    value={item.event}
                                                    onChange={(e) => handleEventChange(index, e.target.value)}
                                                    placeholder="事項を入力してください"
                                                    maxLength={500}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {validationErrors.length > 1 && (
                <div className="mt-2 space-y-1">
                    {validationErrors.slice(1).map((error, index) => (
                        <div key={index} className="text-sm text-red-500">
                            {error}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-2 flex justify-end">
                <Button type="button" variant="ghost" className="text-[#1F84F8] text-xs font-bold" onClick={addNewRow}>
                    ＋ 新規作成
                </Button>
            </div>
        </div>
    )
}

export default MedicalHistoryTable
