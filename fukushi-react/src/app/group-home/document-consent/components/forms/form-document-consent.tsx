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
import { documentConsentStatusOptions } from "@/lib/selections";
import { toast } from "sonner";
import { RequiredCharacter } from "@/components/customs/required-character";
import { createSuccessToast, updateSuccessToast } from "@/lib/message";
import { UIFileUpload } from "@/components/customs/ui-file-upload";

type FormDocumentConsentProps = {
  data?: DocumentConsentProps | undefined;
};

const formSchema = z.object({
  service_user_id: z.string().nonempty("このフィールドは必須です。"),
  family_member_id: z.string().nonempty("このフィールドは必須です。"),
  status: z.string().nonempty("このフィールドは必須です。"),
  document_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  file: z.number().nullable().optional(),
});

export default function FormDocumentConsent({
  data,
}: FormDocumentConsentProps) {
  const [userOptions, setUserOptions] = useState<
    UserOptionDocumentConsentProps[]
  >([]);

  const [familyMemberOptions, setFamilyMemberOptions] = useState<
    FamilyOptionDocumentConsentProps[]
  >([]);

  const fetchUserOptions = useCallback(async () => {
    try {
      const response = await http.get(`/service-user/profile`);
      setUserOptions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch User options", error);
      setUserOptions([]);
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
        console.error("Failed to fetch Family member options", error);
        setFamilyMemberOptions([]);
      }
    },
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_user_id: "",
      family_member_id: "",
      status: "",
      document_date: undefined,
      file: null,
    },
  });

  useEffect(() => {
    const initForm = async () => {
      await fetchUserOptions();
      if (data) {
        await fetchFamilyMemberOptions(+data.service_user_id);
        setTimeout(() => {
          form.reset({
            document_date: new Date(data.document_date),
            service_user_id: String(data.service_user_id),
            family_member_id: String(data.family_member_id),
            status: String(data.status),
            file: data.file || null,
          });
        }, 0);
      }
    };
    initForm();
  }, [data, fetchUserOptions, fetchFamilyMemberOptions, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const payloadData = {
      ...submitData,
      service_user_id: Number(submitData.service_user_id),
      family_member_id: Number(submitData.family_member_id),
      status: Number(submitData.status),
      document_date: format(submitData.document_date, "yyyy-MM-dd"),
      file: submitData.file || null,
    };

    const message = data ? updateSuccessToast : createSuccessToast;
    const method = data ? http.put : http.post;
    const url = data ? `document-consent/${data.id}` : "document-consent";

    await method(url, payloadData);

    if (!data) {
      form.reset();
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
                          <SelectValue placeholder="患者を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userOptions.length > 0 ? (
                          userOptions.map(
                            (user: UserOptionDocumentConsentProps) => {
                              return (
                                <SelectItem
                                  key={user.service_user_id}
                                  value={String(user.service_user_id)}
                                >
                                  {user.profile_name}
                                </SelectItem>
                              );
                            }
                          )
                        ) : (
                          <SelectItem disabled={true} value="no-data">
                            利用者が見つかりません
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
                name="document_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      同意日
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
                name="family_member_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      代理人氏名
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
                          <SelectValue placeholder="代理人を選択" />
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentConsentStatusOptions.map((status) => {
                          return (
                            <SelectItem
                              key={status.value}
                              value={String(status.value)}
                            >
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
          </form>
        </Form>
      </div>
    </div>
  );
}
