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
import http from "@/services/http";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManagerProps } from "@/@types/manager";
import { createSuccessToast, updateSuccessToast } from "@/lib/message";
import { toast } from "sonner";
import { RequiredCharacter } from "@/components/customs/required-character";
import { managerStatusOptions } from "@/lib/selections";
import { useRouter } from "next/navigation";
import { jpPrefectures } from "@/lib/constant";
import { FacilityProps } from "@/@types/facility";
import {
  UIPostalCodeInput,
  UITelephoneInput,
} from "@/components/customs/ui-input";

type FormManagerProps = {
  data?: ManagerProps | undefined;
};

export default function FormManager({ data }: FormManagerProps) {
  const router = useRouter();
  console.log(data);

  const [facilities, setFacilities] = useState<FacilityProps[]>([]);

  const formSchema = z
    .object({
      // user
      email: z
        .string()
        .nonempty("このフィールドは必須です。")
        .email("正しいメールアドレス形式で入力してください。"),
      password: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!data && !val) return false;
            if (val === undefined || val === "") return true;
            return (
              val.length >= 8 &&
              /[a-z]/.test(val) &&
              /[A-Z]/.test(val) &&
              /\d/.test(val) &&
              /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]/.test(val)
            );
          },
          {
            message: "パスワードが無効です。正しい形式で入力してください。",
          }
        ),
      confirmPassword: z.string().optional(),
      status: z.string().nonempty("ステータスを選択してください"),
      // profile
      fullname: z.string().nonempty("名前を入力してください."),
      prefecture: z.string().nonempty("このフィールドは必須です。"),
      district: z.string().nonempty("このフィールドは必須です。"),
      address: z.string().optional(),
      postal_code: z
        .string()
        .nonempty("このフィールドは空白のままにできません")
        .regex(/^\d{7}$/, "郵便番号は7桁の数字で入力してください。"),
      phone_number: z
        .string()
        .nonempty("有効な電話番号を入力してください。")
        .regex(/^\d{10,11}$/, "有効な電話番号を入力してください。"),
      facility_id: z.string().nonempty("管理場所を入力してください。"),
    })
    .superRefine(async (dataForm, ctx) => {
      const isValidEmail =
        dataForm.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email);
      if (isValidEmail) {
        try {
          const checkEmail = await http.get("/manager/check-email", {
            params: { email: dataForm.email, id: data && data.user_id },
          });

          if (checkEmail.data.data === true) {
            ctx.addIssue({
              path: ["email"],
              code: z.ZodIssueCode.custom,
              message: "このメールアドレスは既に使用されています。",
            });
          }
        } catch (error) {
          console.error("Check email failed", error);
        }
      }

      // Nếu password hoặc confirmPassword được nhập, thì phải khớp
      const password = dataForm.password ?? "";
      const confirmPassword = dataForm.confirmPassword ?? "";
      const hasPassword = password !== "";
      const hasConfirm = confirmPassword !== "";

      if ((hasPassword || hasConfirm) && password !== confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: z.ZodIssueCode.custom,
          message: "確認用パスワードが一致しません",
        });
      }
    });

  useEffect(() => {
    fetchFacilities();
  }, [data]);

  const fetchFacilities = async () => {
    try {
      const response = await http.get(`/facility`, {
        params: {
          getAll: true,
        },
      });
      setFacilities(response.data.data);
    } catch (error) {
      console.log("Fail to fetch facilities", error);
      setFacilities([]);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //user
      email: "",
      password: "",
      confirmPassword: "",
      status: "",
      //profile
      fullname: "",
      prefecture: "",
      district: "",
      address: "",
      postal_code: "",
      phone_number: "",

      //facility
      facility_id: "",
    },
  });

  useEffect(() => {
    form.reset({
      //user
      email: data ? data.user.email : "",
      password: "",
      confirmPassword: "",
      status: data ? String(data.user.status) : "",
      //profile
      fullname: data ? data.user.profile.fullname : "",
      prefecture: data ? data.user.profile.prefecture : "",
      district: data ? data.user.profile.district : "",
      address: data ? data.user.profile.address : "",
      postal_code: data ? data.user.profile.postal_code : "",
      phone_number: data ? data.user.profile.phone_number : "",

      //facility
      facility_id: data ? String(data.facility.id) : "",
    });
  }, [data, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const {
      email,
      password,
      fullname,
      prefecture,
      district,
      address,
      postal_code,
      phone_number,
      status,
      facility_id,
    } = submitData;
    const payloadData = {
      user: {
        email,
        password,
        status: status ? Number(status) : null,
      },
      profile: {
        fullname,
        prefecture,
        district,
        address,
        postal_code,
        phone_number,
      },
      facility: {
        facility_id: facility_id ? Number(facility_id) : null,
      },
    };

    const message = data ? updateSuccessToast : createSuccessToast;
    const method = data ? http.put : http.post;
    const url = data ? `manager/${data.id}` : "manager";
    await method(url, payloadData);

    if (!data) form.reset();
    toast.success(message);
    router.back();
  }

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              <UICancelButton className="w-[120px]">キャンセル</UICancelButton>
              <UISubmitButton className="w-[120px]">登録する</UISubmitButton>
            </div>

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    氏名
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="例: 佐藤 美咲" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      メールアドレス
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: sample@sample.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      電話番号
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <UITelephoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    パスワード
                    {data ? <></> : <RequiredCharacter />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="8文字以上、かつ、大文字・小文字・数字・記号のうち2種類以上を半角英数"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    パスワード確認
                    {data ? <></> : <RequiredCharacter />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="確認のためもう一度入力してください"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="都道府県を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jpPrefectures.length > 0 ? (
                            jpPrefectures.map((prefecture, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={String(prefecture.prefecture_kanji)}
                                >
                                  {prefecture.prefecture_kanji}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="渋谷区" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <FormField
                control={form.control}
                name="facility_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      所属事業所
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
                          <SelectValue placeholder="割り当てられた施設を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.length > 0 ? (
                          facilities.map((facility) => {
                            return (
                              <SelectItem
                                key={facility.id}
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
                          <SelectValue placeholder="「ステータスを選択」" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {managerStatusOptions.map((status) => {
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
