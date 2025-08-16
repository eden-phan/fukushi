"use client";

import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UISubmitButton, UICancelButton } from "@/components/customs/ui-button";
import { Textarea } from "@/components/ui/textarea";
import http from "@/services/http";
import { useEffect } from "react";
import { toast } from "sonner";
import { createSuccessToast, updateSuccessToast } from "@/lib/message";
import { useRouter } from "next/navigation";
import { RequiredCharacter } from "@/components/customs/required-character";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jpPrefectures } from "@/lib/constant";
import {
  facilityTypeOptions,
  facilityServiceTypeOptions,
  facilityStatusOptions,
} from "@/lib/selections";
import { FacilityProps } from "@/@types/facility";
import { UIPostalCodeInput } from "@/components/customs/ui-input";

const formSchema = z.object({
  name: z.string().nonempty("このフィールドは必須です。"),
  service_type: z.string().nonempty("このフィールドは必須です。"),
  facility_type: z.string().nonempty("このフィールドは必須です。"),
  postal_code: z
    .string()
    .nonempty("このフィールドは空白のままにできません")
    .regex(/^\d{7}$/, "郵便番号は7桁の数字で入力してください。"),
  prefecture: z.string().nonempty("このフィールドは必須です。"),
  district: z.string().nonempty("このフィールドは必須です。"),
  address: z.string().nonempty("このフィールドは必須です。"),
  status: z.string().nonempty("このフィールドは必須です。"),
  description: z.string().nonempty("このフィールドは必須です。"),
});

type FormFacilityProps = {
  data?: FacilityProps | undefined;
};

export default function FormFacility({ data }: FormFacilityProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      service_type: "",
      facility_type: "",
      postal_code: "",
      prefecture: "",
      district: "",
      address: "",
      status: "",
      description: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: data ? data.name : "",
      service_type: data ? data.service_type : "",
      facility_type: data ? data.facility_type : "",
      postal_code: data ? data.postal_code : "",
      prefecture: data ? data.prefecture : "",
      district: data ? data.district : "",
      address: data ? data.address : "",
      status: data ? String(data.status) : "",
      description: data ? data.description : "",
    });
  }, [data, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const requestData = {
      ...submitData,
    };

    const message = data ? updateSuccessToast : createSuccessToast;

    const method = data ? http.put : http.post;
    const url = data ? `facility/${data.id}` : "facility";

    if (!data) form.reset();

    await method(url, requestData);
    router.back();
    toast.success(message);
  }

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              <UICancelButton>キャンセル</UICancelButton>
              <UISubmitButton>登録する</UISubmitButton>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    事業所名
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="スマイル福祉センター" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    事業種別
                    <RequiredCharacter />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={
                      field.value !== undefined
                        ? String(field.value)
                        : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilityServiceTypeOptions.map((type, index) => {
                        return (
                          <SelectItem key={index} value={String(type.value)}>
                            {type.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facility_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    事業種別
                    <RequiredCharacter />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={
                      field.value !== undefined
                        ? String(field.value)
                        : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilityTypeOptions.map((facility, index) => {
                        return (
                          <SelectItem
                            key={index}
                            value={String(facility.value)}
                          >
                            {facility.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem className="w-1/5">
                    <FormLabel>
                      郵便番号
                      <RequiredCharacter />
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <span>〒</span>
                      <FormControl>
                        <UIPostalCodeInput {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prefecture"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={
                        field.value !== undefined
                          ? String(field.value)
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder="割り当てられた施設を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jpPrefectures.length > 0 ? (
                          jpPrefectures.map((prefecture, index) => {
                            return (
                              <SelectItem
                                key={index}
                                value={String(prefecture.prefecture_kana)}
                              >
                                {prefecture.prefecture_kana}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <SelectItem disabled={true} value="no-data">
                            Prefectures are not available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Input placeholder="渋谷区" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="例: 神宮前5丁目 47-10 OD表参道ビル4階"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ステータス
                    <RequiredCharacter />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={
                      field.value !== undefined
                        ? String(field.value)
                        : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilityStatusOptions.map((status, index) => {
                        return (
                          <SelectItem key={index} value={String(status.value)}>
                            {status.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    事業所名
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="" id="message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
