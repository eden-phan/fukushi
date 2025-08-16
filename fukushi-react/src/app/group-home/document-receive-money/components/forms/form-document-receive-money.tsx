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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UISubmitButton, UICancelButton } from "@/components/customs/ui-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import http from "@/services/http";
import { useEffect, useState, useCallback } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { RequiredCharacter } from "@/components/customs/required-character";
import { Input } from "@/components/ui/input";
import { updateSuccessToast, createSuccessToast } from "@/lib/message";
import { toast } from "sonner";
import { DocumentReceiveMoneyProps } from "@/@types/document-receive-money";
import { ServiceUserOptionProps } from "@/@types/service-user";
import { UIFileUpload } from "@/components/customs/ui-file-upload";
import { FacilityProps } from "@/@types/facility";

type FormDocumentReceiveMoneyProps = {
  data?: DocumentReceiveMoneyProps | undefined;
};

const formSchema = z.object({
  /**Document */
  document_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  service_user_id: z.string().nonempty("このフィールドは必須です。"),
  file: z.number().nullable().optional(),

  /**Document_metadata */
  family_member_id: z.string().nonempty("このフィールドは必須です。"),
  service_provision_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  facility_id: z.string().nonempty("このフィールドは必須です。"),
  receipt_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  receive_amount: z.string().nonempty("このフィールドは必須です。"),
  total_cost: z.string().nonempty("このフィールドは必須です。"),
  user_charge: z.string().nonempty("このフィールドは必須です。"),
});

export default function FormDocumentReceiveMoney({
  data,
}: FormDocumentReceiveMoneyProps) {
  const [serviceUserOptions, setServiceUserOptions] = useState<
    ServiceUserOptionProps[]
  >([]);

  const [selectedServiceUserOption, setSelectedServiceUserOption] =
    useState<ServiceUserOptionProps>();

  const [familyMemberOptions, setFamilyMemberOptions] = useState<
    FamilyOptionDocumentConsentProps[]
  >([]);

  const [facilities, setFacilities] = useState<FacilityProps[]>([]);

  const fetchFacilities = useCallback(async () => {
    try {
      const response = await http.get(`/facility`, {
        params: {
          getAll: true,
        },
      });
      setFacilities(response.data.data);
    } catch (error) {
      console.error("Failed to fetch Facilities", error);
      setFacilities([]);
    }
  }, []);

  const fetchFamilyMemberOptions = useCallback(
    async (service_user_id: number) => {
      try {
        const response = await http.get(`/service-user/family-member`, {
          params: {
            service_user_id,
          },
        });
        setFamilyMemberOptions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch User options", error);
        setFamilyMemberOptions([]);
      }
    },
    []
  );

  const fetchServiceUserOptions = useCallback(async () => {
    try {
      const response = await http.get(
        `/document-receive-money/patient-options`
      );
      setServiceUserOptions(response.data.data);
    } catch (error) {
      console.log("Fail to fetch service user option", error);
      setServiceUserOptions([]);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      /**Document */
      service_user_id: "",
      family_member_id: "",
      document_date: undefined,
      file: null,

      /**Document meta_data */
      service_provision_date: undefined,
      receipt_date: undefined,
      facility_id: "",
      receive_amount: "",
      total_cost: "",
      user_charge: "",
    },
  });

  useEffect(() => {
    const initForm = async () => {
      await fetchServiceUserOptions();
      await fetchFacilities();
      if (data) {
        await fetchFamilyMemberOptions(+data.service_user_id);

        setTimeout(() => {
          form.reset({
            /**Document */
            document_date: new Date(data.document_date),
            service_user_id: String(data.service_user_id),
            file: data.file || null,

            /**Document metadata */
            family_member_id: String(data.family_member_id),
            service_provision_date: new Date(data.service_provision_date),
            facility_id: String(data.family_member_id),
            receipt_date: new Date(data.receipt_date),
            receive_amount: String(data.receive_amount),
            total_cost: String(data.total_cost),
            user_charge: String(data.user_charge),
          });
        }, 0);
      }
    };
    initForm();
  }, [
    data,
    fetchServiceUserOptions,
    fetchFamilyMemberOptions,
    fetchFacilities,
    form,
  ]);

  useEffect(() => {
    if (!data || serviceUserOptions.length === 0) return;

    const matchedOption = serviceUserOptions.find(
      (option) => String(option.user_id) === String(data.service_user_id)
    );

    if (matchedOption) {
      setSelectedServiceUserOption(matchedOption);
    }
  }, [data, serviceUserOptions]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const document = {
      document_date: submitData.document_date
        ? format(submitData.document_date, "yyyy-MM-dd")
        : null,
      service_user_id: submitData.service_user_id
        ? Number(submitData.service_user_id)
        : null,
      file: submitData.file || null,
    };

    const document_metadata = {
      family_member_id: submitData.family_member_id,
      service_provision_date: submitData.service_provision_date
        ? format(submitData.service_provision_date, "yyyy-MM-dd")
        : null,
      facility_id: submitData.facility_id,
      receipt_date: submitData.receipt_date
        ? format(submitData.receipt_date, "yyyy-MM-dd")
        : null,
      receive_amount: submitData.receive_amount
        ? String(submitData.receive_amount)
        : "0",
      total_cost: submitData.total_cost ? String(submitData.total_cost) : "0",
      user_charge: submitData.user_charge
        ? String(submitData.user_charge)
        : "0",
    };

    const payload = {
      document,
      document_metadata,
    };

    const message = data ? updateSuccessToast : createSuccessToast;
    const method = data ? http.put : http.post;
    const url = data
      ? `document-receive-money/${data.id}`
      : "document-receive-money";

    await method(url, payload);

    if (!data) {
      form.reset();
      setSelectedServiceUserOption(undefined);
    }

    toast.success(message);
  }

  const serviceUserId = form.watch("service_user_id");

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              <UICancelButton>キャンセル</UICancelButton>
              <UISubmitButton>登録する</UISubmitButton>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="document_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        請求書作成日
                        <RequiredCharacter />
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ja })
                              ) : (
                                <span>日付を選択</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={field.onChange}
                            captionLayout="label"
                            locale={ja}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="service_user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        利用者氏名
                        <RequiredCharacter />
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const matchedOption = serviceUserOptions.find(
                            (option) => String(option.user_id) === value
                          );
                          if (matchedOption) {
                            setSelectedServiceUserOption(matchedOption);
                          }
                          fetchFamilyMemberOptions(+value);
                        }}
                        value={
                          field.value !== undefined
                            ? String(field.value)
                            : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="利用者を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceUserOptions.length > 0 ? (
                            serviceUserOptions.map((option, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={String(option.user_id)}
                                >
                                  {option.fullname}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <SelectItem disabled={true} value="no-data">
                              Patients are not available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>
                    利用者ID
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      value={
                        selectedServiceUserOption?.certificate_number || ""
                      }
                      placeholder=""
                    />
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name="family_member_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        担当者
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
                          <SelectTrigger
                            className="w-full"
                            disabled={!serviceUserId}
                          >
                            <SelectValue placeholder="家族を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {familyMemberOptions.length > 0 ? (
                            familyMemberOptions.map(
                              (user: FamilyOptionDocumentConsentProps) => {
                                return (
                                  <SelectItem
                                    key={user.family_member_id}
                                    value={String(user.family_member_id)}
                                  >
                                    {user.family_member_name}
                                  </SelectItem>
                                );
                              }
                            )
                          ) : (
                            <SelectItem disabled={true} value="no-data">
                              家族が見つかりません
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="service_provision_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        サービス提供年月
                        <RequiredCharacter />
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ja })
                              ) : (
                                <span>日付を選択</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={field.onChange}
                            captionLayout="label"
                            locale={ja}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facility_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        サービス内容
                        <RequiredCharacter />
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={
                          field.value !== undefined
                            ? String(field.value)
                            : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="施設を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {facilities.length > 0 ? (
                            facilities.map((facility, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={String(facility.id)}
                                >
                                  {facility.name}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <SelectItem disabled={true} value="no-data">
                              Facilities are not available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="receipt_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        受領日
                        <RequiredCharacter />
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ja })
                              ) : (
                                <span>日付を選択</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={field.onChange}
                            captionLayout="label"
                            locale={ja}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receive_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        代理受領金額
                        <RequiredCharacter />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="金額を入力してください"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <div className="pb-2">
                  <span className="font-semibold">代理受領額の内訳</span>
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="total_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            サービスに要した 費用の全体の額 (A)
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="金額を入力してください"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="user_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            利用者負担額 (B)
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="金額を入力してください"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>
                        訓練等給付費等 代理受領額 (A)－（B）{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder=""
                          value={
                            Number(form.watch("total_cost") || 0) -
                            Number(form.watch("user_charge") || 0)
                          }
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>添付ファイル</FormLabel>
                        <FormControl>
                          <UIFileUpload
                            onFileUpload={(mediaId) => {
                              field.onChange(mediaId);
                            }}
                            onError={(error) => {
                              toast.error(error);
                            }}
                            mediaId={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
