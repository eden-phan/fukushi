"use client"

import React from "react"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { UseFormReturn } from "react-hook-form"
import type { FormAssessmentData } from "@/@types/assessment"
import { handleTextareaChange } from "@/lib/assessment"

interface LivingDomainItem {
  key: string
  label: string
}

interface LivingDomainTableProps {
  form: UseFormReturn<FormAssessmentData, unknown, FormAssessmentData>
  sectionNumber: number
  sectionTitle: string
  domains: LivingDomainItem[]
  startIndex: number
}

const LivingDomainTable: React.FC<LivingDomainTableProps> = ({
  form,
  sectionNumber,
  sectionTitle,
  domains,
  startIndex,
}) => {
  return (
    <div className="mt-[20px]">
      <div className="mb-2 flex items-center">
        <span className="text-base mr-2">{sectionNumber}</span>
        <span className="text-base font-normal">{sectionTitle}</span>
      </div>
      <div className="overflow-x-auto rounded-[5px] overflow-hidden border border-[#D9D9D9]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#F0F0F0]">
              <TableHead rowSpan={2} className="border-r border-[#D9D9D9] text-center font-bold p-2 w-[160px]">
                項　目
              </TableHead>
              <TableHead colSpan={3} className="border-r border-[#D9D9D9] text-center font-bold p-2">
                チェック内容
              </TableHead>
              <TableHead rowSpan={2} className="border-r border-[#D9D9D9] text-center font-bold p-2 w-[180px]">
                本人の能力と制限
                <br />
                気づいたこと
              </TableHead>
              <TableHead rowSpan={2} className="text-center font-bold p-2 w-[180px]">
                本人の環境と制限
                <br />
                気づいたこと
              </TableHead>
            </TableRow>

            <TableRow className="bg-[#F0F0F0]">
              <TableHead className="border-r border-[#D9D9D9] text-center font-bold p-2 w-[120px]">実　態</TableHead>
              <TableHead className="border-r border-[#D9D9D9] text-center font-bold p-2 w-[120px]">希望</TableHead>
              <TableHead className="border-r border-[#D9D9D9] text-center font-bold p-2 w-[120px]">
                援助の要・不要
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain, idx) => {
              const actualIndex = startIndex + idx
              return (
                <TableRow key={domain.key} className="border-t border-[#D9D9D9]">
                  <TableCell className="border-r border-[#D9D9D9] p-2 text-left align-middle bg-white">
                    {domain.label.split("<br/>").map((line, i) => (
                      <React.Fragment key={i}>
                        {line.trim()}
                        {i < domain.label.split("<br/>").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </TableCell>
                  <TableCell className="border-r border-[#D9D9D9] p-0 bg-white align-top">
                    <FormField
                      control={form.control}
                      name={`living_domains.${actualIndex}.current_status`}
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormControl className="h-full">
                            <Textarea
                              className="w-full h-full p-0 m-0 border-none rounded-none resize-none focus:ring-0 focus-visible:ring-0 focus:border-none shadow-none leading-[1]"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(handleTextareaChange(e.target.value, 1000))}
                              maxLength={1000}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="border-r border-[#D9D9D9] p-0 bg-white align-top">
                    <FormField
                      control={form.control}
                      name={`living_domains.${actualIndex}.preference`}
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormControl className="h-full">
                            <Textarea
                              className="w-full h-full p-0 m-0 border-none rounded-none resize-none focus:ring-0 focus-visible:ring-0 focus:border-none shadow-none leading-[1]"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(handleTextareaChange(e.target.value, 1000))}
                              maxLength={1000}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="border-r border-[#D9D9D9] p-0 bg-white align-top">
                    <FormField
                      control={form.control}
                      name={`living_domains.${actualIndex}.needs_support`}
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormControl className="h-full">
                            <Textarea
                              className="w-full h-full p-0 m-0 border-none rounded-none resize-none focus:ring-0 focus-visible:ring-0 focus:border-none shadow-none leading-[1]"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(handleTextareaChange(e.target.value, 1000))}
                              maxLength={1000}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="border-r border-[#D9D9D9] p-0 bg-white align-top">
                    <FormField
                      control={form.control}
                      name={`living_domains.${actualIndex}.abilities_limitations_notes`}
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormControl className="h-full">
                            <Textarea
                              className="w-full h-full p-0 m-0 border-none rounded-none resize-none focus:ring-0 focus-visible:ring-0 focus:border-none shadow-none leading-[1]"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(handleTextareaChange(e.target.value, 1000))}
                              maxLength={1000}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="p-0 bg-white align-top h-[120px]">
                    <FormField
                      control={form.control}
                      name={`living_domains.${actualIndex}.environment_limitations_notes`}
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormControl className="h-full">
                            <Textarea
                              className="w-full h-full p-0 m-0 border-none rounded-none resize-none focus:ring-0 focus-visible:ring-0 focus:border-none shadow-none leading-[1]"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(handleTextareaChange(e.target.value, 1000))}
                              maxLength={1000}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default LivingDomainTable
