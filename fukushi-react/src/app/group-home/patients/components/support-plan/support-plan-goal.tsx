'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Control } from 'react-hook-form'
import { TextArea } from '@/components/ui/text-area'
import { SupportPlanFormType } from './support-plan-add-form'

type SupportCategoryItem = {
  id: string
  label: string
}

type Props = {
  domain: {
    key: keyof Pick<SupportPlanFormType, "daily_life" | "health" | "leisure" | "community_life" | "other_support">;
    label: string
  }
  domainItems: SupportCategoryItem[]
  control: Control<SupportPlanFormType>
}

const SupportPlanGoal= ({ domain, domainItems, control }: Props) => {
  return (
    <div className="border-2 p-4 flex flex-col gap-3">
      <Label className="font-bold">{domain.label}</Label>

      <FormField
        control={control}
        name={`${domain.key}.support_category`}
        render={() => (
          <FormItem className="flex flex-row gap-8 flex-wrap">
            {domainItems.map((item) => (
              <FormField
                key={item.id}
                control={control}
                name={`${domain.key}.support_category`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(field.value?.filter((v: string) => v !== item.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${domain.key}.goal`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>支 援 目 標</FormLabel>
            <FormControl>
              <TextArea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${domain.key}.support_content`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>支 援 内 容</FormLabel>
            <FormControl>
              <TextArea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name={`${domain.key}.progress_first_term`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>目標達成状況（前期）</FormLabel>
              <FormControl>
                <TextArea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${domain.key}.progress_second_term`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>目標達成状況（後期）</FormLabel>
              <FormControl>
                <TextArea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default SupportPlanGoal
