"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RequiredCharacter } from "@/components/customs/required-character";
import { UISubmitButton, UIReturnButton } from "@/components/customs/ui-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ja } from "date-fns/locale";
import http from "@/services/http";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserOptionProps } from "@/@types/user";
import { getNearMissesTypeOptions } from "@/lib/selections";
import { createSuccessToast, updateSuccessToast } from "@/lib/message";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { IncidentProps } from "@/@types/incident";
import { Textarea } from "@/components/ui/textarea";

type FormIncidentProps = {
  data?: IncidentProps | undefined;
  onBackToList: () => void;
};

const formSchema = z.object({
  reporter_id: z.string().nonempty("このフィールドは必須です。"),
  report_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  incident_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  location: z.string().nonempty("このフィールドは必須です。"),
  incident_type: z.string().nonempty("このフィールドは必須です。"),
  incident_detail: z.string().nonempty("このフィールドは必須です。"),
  response: z.string().nonempty("このフィールドは必須です。"),
  prevent_plan: z.string().nonempty("このフィールドは必須です。"),
});

const FormIncident = ({ data, onBackToList }: FormIncidentProps) => {
  const params = useParams();
  const id = params.id;
  const [userOptions, setUserOptions] = useState<UserOptionProps[]>([]);

  const fetchUserOptions = useCallback(async () => {
    try {
      const response = await http.get(`/profile/user-options`);
      setUserOptions(response.data.data);
    } catch (error) {
      console.log("Fail to fetch user option", error);
      setUserOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchUserOptions();
  }, [fetchUserOptions]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reporter_id: "",
      report_date: undefined,
      incident_date: undefined,
      location: "",
      incident_type: "",
      incident_detail: "",
      response: "",
      prevent_plan: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        reporter_id: String(data.reporter_id),
        report_date: new Date(data.report_date),
        incident_date: new Date(data.incident_date),
        location: String(data.location),
        incident_type: String(data.incident_type),
        incident_detail: String(data.incident_detail),
        response: String(data.response),
        prevent_plan: String(data.prevent_plan),
      });
    }
  }, [data, userOptions, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const payload = {
      ...submitData,
      service_user_id: Number(id),
      reporter_id: submitData.reporter_id
        ? Number(submitData.reporter_id)
        : null,
      report_date: submitData.report_date
        ? format(submitData.report_date, "yyyy-MM-dd")
        : null,
      incident_date: submitData.incident_date
        ? format(submitData.incident_date, "yyyy-MM-dd HH:mm:ss")
        : null,
    };

    const message = data ? updateSuccessToast : createSuccessToast;
    const method = data ? http.put : http.post;
    const url = data ? `incident/${data.id}` : "incident";
    await method(url, payload);

    if (!data) form.reset();

    onBackToList();
    toast.success(message);
  }

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              <UIReturnButton onClick={onBackToList}>キャンセル</UIReturnButton>
              <UISubmitButton>登録する</UISubmitButton>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="reporter_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        報告者
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
                            <SelectValue placeholder="ご利用者を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userOptions.length > 0 ? (
                            userOptions.map((option, index) => {
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
                              Users are not available
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
                  name="report_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        記入年月日
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
                                <span>日付を選択してください</span>
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
                  name="incident_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        発生日時
                        <RequiredCharacter />
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP p", {
                                    locale: ja,
                                  })
                                : "日時を選択してください"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="flex flex-col gap-2 w-auto p-2"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              // giữ lại giờ cũ nếu đã có
                              const old = field.value ?? new Date();
                              date.setHours(
                                old.getHours(),
                                old.getMinutes(),
                                old.getSeconds()
                              );
                              field.onChange(date);
                            }}
                            locale={ja}
                            initialFocus
                          />
                          <Input
                            type="time"
                            step={60}
                            className="w-full"
                            value={
                              field.value
                                ? format(field.value, "HH:mm")
                                : "00:00"
                            }
                            onChange={(e) => {
                              const [h, m] = e.target.value
                                .split(":")
                                .map(Number);
                              const date = field.value
                                ? new Date(field.value)
                                : new Date();
                              date.setHours(h, m);
                              field.onChange(date);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      発生場所
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="発生場所を入力してください"
                        id="message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="incident_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        ヒヤリハットの種類
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
                            <SelectValue placeholder="	種類を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getNearMissesTypeOptions.map((type, index) => {
                            return (
                              <SelectItem
                                key={index}
                                value={String(type.value)}
                              >
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
              </div>
              <FormField
                control={form.control}
                name="incident_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      事象の内容
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="事象の内容を入力してください"
                        id="message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ヒヤリ・ハット時の対応
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="対応内容を入力してください"
                        id="message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prevent_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      再発防止策
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="再発防止策を入力してください"
                        id="message"
                        {...field}
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
};

export default FormIncident;
