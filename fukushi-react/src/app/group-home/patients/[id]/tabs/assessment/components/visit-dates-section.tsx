"use client"

import type React from "react"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { FormAssessmentData, VisitDateItem } from "@/@types/assessment"
import { validateMonthInput, validateDayInput } from "@/lib/assessment"

interface VisitDatesSectionProps {
  form: UseFormReturn<FormAssessmentData, unknown, FormAssessmentData>
  fieldName: keyof Pick<FormAssessmentData, "home_visit_dates" | "outpatient_visit_dates" | "phone_contact_dates">
  label: string
}

const VisitDatesSection: React.FC<VisitDatesSectionProps> = ({ form, fieldName, label }) => {
  const visitDates = form.watch(fieldName) || []
  const hasCheckedItems = visitDates.length > 0

  const hasInputWithoutCheckbox =
    !hasCheckedItems && form.watch(fieldName)?.some((date: VisitDateItem) => date.month || date.day)

  const firstItemIncomplete =
    hasCheckedItems &&
    visitDates[0] &&
    ((visitDates[0].month && !visitDates[0].day) || (!visitDates[0].month && visitDates[0].day))

  const updateFormValue = (newDates: VisitDateItem[]) => {
    form.setValue(fieldName, newDates)
  }

  const handleMonthChange = (index: number, month: string) => {
    if (validateMonthInput(month)) {
      const newDates = [...visitDates]
      newDates[index] = { ...newDates[index], month }
      updateFormValue(newDates)
    }
  }

  const handleDayChange = (index: number, day: string) => {
    if (validateDayInput(day)) {
      const newDates = [...visitDates]
      newDates[index] = { ...newDates[index], day }
      updateFormValue(newDates)
    }
  }

  const addNewDate = () => {
    const newDates = [...visitDates, { month: "", day: "" }]
    updateFormValue(newDates)
  }

  const removeDate = (index: number) => {
    const newDates = visitDates.filter((_, i) => i !== index)
    updateFormValue(newDates)
  }

  const toggleMainCheckbox = (checked: boolean) => {
    if (checked) {
      if (visitDates.length === 0) {
        updateFormValue([{ month: "", day: "" }])
      }
    } else {
      updateFormValue([])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FormField
          control={form.control}
          name={fieldName}
          render={() => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={hasCheckedItems}
                  onCheckedChange={toggleMainCheckbox}
                  className="border-[#000000] rounded-[2px] w-4 h-4"
                />
              </FormControl>
              <div className="flex items-center gap-1">
                <label className="text-sm font-normal">{label}</label>
                <span className="text-sm">（</span>
                <Input
                  className="w-[41px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                  placeholder=""
                  value={hasCheckedItems && visitDates[0] ? visitDates[0].month || "" : ""}
                  onChange={(e) => {
                    if (hasCheckedItems) {
                      handleMonthChange(0, e.target.value)
                    }
                  }}
                  maxLength={2}
                  disabled={!hasCheckedItems}
                />
                <span className="text-sm">月</span>
                <Input
                  className="w-[41px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                  placeholder=""
                  value={hasCheckedItems && visitDates[0] ? visitDates[0].day || "" : ""}
                  onChange={(e) => {
                    if (hasCheckedItems) {
                      handleDayChange(0, e.target.value)
                    }
                  }}
                  maxLength={2}
                  disabled={!hasCheckedItems}
                />
                <span className="text-sm">日）</span>
                {hasCheckedItems && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addNewDate}
                    className="text-black p-1 h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Validation messages */}
      {hasInputWithoutCheckbox && <div className="ml-6 text-xs text-red-500">{label}にチェックを入れてください</div>}

      {hasCheckedItems && firstItemIncomplete && (
        <div className="ml-6 text-xs text-red-500">月と日の両方を入力してください</div>
      )}

      {hasCheckedItems &&
        visitDates.slice(1).map((dateItem, index) => {
          const actualIndex = index + 1
          const isIncomplete = (dateItem.month && !dateItem.day) || (!dateItem.month && dateItem.day)

          return (
            <div key={actualIndex} className="ml-6 space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-sm">（</span>
                <Input
                  className="w-[41px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                  placeholder=""
                  value={dateItem.month || ""}
                  onChange={(e) => handleMonthChange(actualIndex, e.target.value)}
                  maxLength={2}
                />
                <span className="text-sm">月</span>
                <Input
                  className="w-[41px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                  placeholder=""
                  value={dateItem.day || ""}
                  onChange={(e) => handleDayChange(actualIndex, e.target.value)}
                  maxLength={2}
                />
                <span className="text-sm">日）</span>
                <Button type="button" variant="ghost" size="sm" onClick={addNewDate} className="text-black p-1 h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDate(actualIndex)}
                  className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              {isIncomplete && <div className="text-xs text-red-500">月と日の両方を入力してください</div>}
            </div>
          )
        })}
    </div>
  )
}

export default VisitDatesSection
