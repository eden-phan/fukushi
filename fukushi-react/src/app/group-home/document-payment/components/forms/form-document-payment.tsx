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
import { UserProps } from "@/@types/user";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/components/app-provider";
import { updateSuccessToast, createSuccessToast } from "@/lib/message";
import { toast } from "sonner";
import { DocumentPaymentProps } from "@/@types/documentPayment";
import { UIFileUpload } from "@/components/customs/ui-file-upload";

type FormDocumentPaymentProps = {
  data?: DocumentPaymentProps | undefined;
};

const formSchema = z.object({
  document_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  staff_id: z.string().nonempty("このフィールドは必須です。"),
  payment_date: z.date({
    required_error: "このフィールドは必須です。",
    invalid_type_error: "この項目は無効です",
  }),
  payment_place: z.string().nonempty("このフィールドは必須です。"),
  payment_purpose: z.string().nonempty("このフィールドは必須です。"),
  payment_amount: z.string().nonempty("このフィールドは必須です。"),
  file: z.number().nullable().optional(),
});

export default function FormDocumentPayment({
  data,
}: FormDocumentPaymentProps) {
  const { userContext } = useAppContext();

  const [users, setUsers] = useState<UserProps[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await http.get(`/user/staff`);
      setUsers(response.data.data);
    } catch (error) {
      console.log("Fail to fetch staff", error);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [data, fetchUsers]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_date: undefined,
      staff_id: "",
      payment_date: undefined,
      payment_place: "",
      payment_purpose: "",
      payment_amount: "0",
      file: null,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        document_date: new Date(data.document_date),
        staff_id: String(data.staff_id),
        payment_date: new Date(data.document_date),
        payment_place: String(data.payment_place),
        payment_purpose: String(data.payment_purpose),
        payment_amount: String(data.payment_amount),
        file: data.file || null,
      });
    }
  }, [data, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const document = {
      document_date: submitData.document_date
        ? format(submitData.document_date, "yyyy-MM-dd")
        : null,
      staff_id: submitData.staff_id ? Number(submitData.staff_id) : null,
      created_by: userContext ? userContext.id : null,
      file: submitData.file || null,
    };

    const document_metadata = {
      payment_date: submitData.payment_date
        ? format(submitData.payment_date, "yyyy-MM-dd")
        : null,
      payment_place: submitData.payment_place ? submitData.payment_place : "",
      payment_purpose: submitData.payment_purpose
        ? submitData.payment_purpose
        : "",
      payment_amount: submitData.payment_amount
        ? String(submitData.payment_amount)
        : 0,
    };

    const payload = {
      document,
      document_metadata,
    };

    const message = data ? updateSuccessToast : createSuccessToast;
    const method = data ? http.put : http.post;
    const url = data ? `document-payment/${data.id}` : "document-payment";

    await method(url, payload);

    if (!data) form.reset();

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

                <FormField
                  control={form.control}
                  name="staff_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        出納管理責任者氏名
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
                            <SelectValue placeholder="出納管理責任者を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.length > 0 ? (
                            users.map((user) => {
                              return (
                                <SelectItem
                                  key={user.id}
                                  value={String(user.id)}
                                >
                                  {user.profile.fullname}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <SelectItem disabled={true} value="no-data">
                              Staffs are not available
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
                  name="payment_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        支払日
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

              <FormField
                control={form.control}
                name="payment_place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      支払場所
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="支払場所を入力してください"
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
                  name="payment_purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        支払目的
                        <RequiredCharacter />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="支払目的を入力してください"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        支払金額
                        <RequiredCharacter />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="支払金額を入力してください"
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
