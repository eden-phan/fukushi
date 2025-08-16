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
import {
  UISubmitButton,
  UIUnSubmitButton,
} from "@/components/customs/ui-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import http from "@/services/http";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { RequiredCharacter } from "@/components/customs/required-character";
import { formatPostalCode } from "@/lib/utils";
// import Image from "next/image";
import { UIAvatarUpload } from "@/components/customs/ui-avatar-upload";
import { FacilityProps } from "@/@types/facility";

type CompanyOption = { id: string; label: string };

export default function FormProfile({
  staffData,
  loading,
  setIsEditMode,
}: {
  staffData?: StaffProps;
  loading?: boolean;
  setIsEditMode: (arg0: boolean) => void;
}) {
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>();
  // const [emailError, setEmailError] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  let emailCheckTimer: ReturnType<typeof setTimeout> | null = null;
  let lastCheckedEmail = "";
  let lastResult = false;

  const getFormSchema = (isEdit: boolean) =>
    z
      .object({
        employment_type: z.string().min(1, {
          message: "スタッフの職種を選択してください。",
        }),
        password: isEdit
          ? z.string().optional()
          : z
              .string()
              .min(8, { message: "有効なパスワードを入力してください" })
              .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                "有効なパスワードを入力してください"
              ),
        confirm_password: z.string().optional(),
        email: z
          .string({
            required_error: "従業員のメールアドレスを入力してください",
          })
          .email({ message: "正しいメールアドレス形式で入力してください。" })
          .refine(
            async (val) => {
              return await debounceCheckEmail(val);
            },
            {
              message: "このメールアドレスはすでに使用されています。",
            }
          ),
        fullname: z.string().min(1, {
          message: "スタッフの氏名を入力してください",
        }),
        phone_number: z
          .string({
            required_error: "従業員の電話番号を入力してください",
          })
          .regex(/^\d{10,11}$/, {
            message: "有効な電話番号を入力してください",
          }),
        status: z.string().min(1, {
          message: "スタッフの就労状況を選択してください。",
        }),
        district: z.string().min(1, {
          message: "スタッフの市区町村を選択してください。",
        }),
        address: z.string().min(1, {
          message: "スタッフの住所を入力してください。",
        }),
        prefecture: z.string().min(1, {
          message: "スタッフの都道府県を選択してください。",
        }),
        postal_code: z
          .string({
            required_error: "郵便番号を入力してください",
          })
          .min(8, {
            message: "7文字の日本語で入力してください。",
          }),
        avatar: z.number().optional(),
      })
      .refine(
        (data) => {
          if (isEdit) {
            if (data.password || data.confirm_password) {
              return data.password === data.confirm_password;
            }
            return true;
          }
          return data.password === data.confirm_password;
        },
        {
          message: "確認用パスワードが一致していません。",
          path: ["confirm_password"],
        }
      );

  const debounceCheckEmail = (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (email === lastCheckedEmail) {
        setEmailValid(lastResult);
        resolve(lastResult);
        return;
      }

      if (emailCheckTimer) clearTimeout(emailCheckTimer);

      emailCheckTimer = setTimeout(async () => {
        try {
          const { data } = await http.get("/profile/check-email", {
            params: { param: email, id: staffData?.id },
          });

          const available = !data.data.exists;
          lastCheckedEmail = email;
          lastResult = available;

          setEmailValid(available);
          resolve(available);
        } catch (error) {
          console.error("Check email failed", error);
          setEmailValid(null);
          resolve(true);
        }
      }, 500);
    });
  };

  const isEdit = !!staffData;

  useEffect(() => {
    setCompanyLoading(true);
    http
      .get("/facility")
      .then((res) => {
        const data = res.data.data || [];
        setCompanyOptions(
          data.data.map((company: FacilityProps) => ({
            id: String(company.id),
            label: company.name,
          }))
        );
      })
      .finally(() => setCompanyLoading(false));
  }, []);
  const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
    resolver: zodResolver(getFormSchema(isEdit)),
    defaultValues: staffData
      ? {
          employment_type:
            staffData.employment_type !== undefined
              ? String(staffData.employment_type)
              : "",
          password: "",
          confirm_password: "",
          fullname: staffData.profile?.fullname || "",
          email: staffData.email || "",
          phone_number: staffData.profile?.phone_number || "",
          status:
            staffData.profile?.status !== undefined
              ? String(staffData.profile.status)
              : "",
          district: staffData.profile?.district || "",
          address: staffData.profile?.address || "",
          prefecture: staffData.profile?.prefecture || "",
          postal_code: staffData.profile?.postal_code || "",
          avatar: staffData.profile?.avatar,
        }
      : {
          employment_type: "",
          password: "",
          confirm_password: "",
          fullname: "",
          email: "",
          phone_number: "",
          status: "",
          district: "",
          address: "",
          prefecture: "",
          postal_code: "",
          avatar: null,
        },
  });

  useEffect(() => {
    if (staffData) {
      form.reset({
        employment_type:
          staffData.employment_type !== undefined
            ? String(staffData.employment_type)
            : "",
        password: "",
        confirm_password: "",
        fullname: staffData.profile?.fullname || "",
        email: staffData.email || "",
        phone_number: staffData.profile?.phone_number || "",
        status:
          staffData.profile?.status !== undefined
            ? String(staffData.profile.status)
            : "",
        district: staffData.profile?.district || "",
        address: staffData.profile?.address || "",
        prefecture: staffData.profile?.prefecture || "",
        postal_code: staffData.profile?.postal_code || "",
        avatar: staffData.profile?.avatar || "",
      });
    }
  }, [staffData, companyOptions, form]);

  function onSubmit(values: z.infer<ReturnType<typeof getFormSchema>>) {
    if (staffData && staffData.id) {
      http
        .put(`/profile/${staffData.id}`, values)
        .then(() => {
          toast.success("プロフィールを更新しました");
          setIsEditMode(false);
        })
        .catch((err) => {
          console.error("Lỗi khi cập nhật profile:", err);
        });
    } else {
      http
        .put(`/profile/${staffData?.id}`, values)
        .then(() => {
          toast.success("プロフィールを更新しました");
          setIsEditMode(false);
        })
        .catch((err) => {
          console.error("Lỗi khi tạo profile:", err);
        });
    }
  }

  if (loading || companyLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
      </div>
    );
  }

  return (
    <>
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              <UIUnSubmitButton onClick={() => setIsEditMode(false)}>
                キャンセル
              </UIUnSubmitButton>
              <UISubmitButton>
                {staffData ? "更新する" : "登録する"}
              </UISubmitButton>
            </div>
            <div className="text-center w-1/2">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロファイル写真</FormLabel>
                    <FormControl>
                      <UIAvatarUpload
                        onAvatarUpload={(mediaId) => {
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
            <div className="grid grid-cols-2 gap-3">
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
                      <Input {...field} placeholder="例: 佐藤 美咲" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      契約タイプ
                      <RequiredCharacter />
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">フルタイム</SelectItem>
                        <SelectItem value="0">パートタイム</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input placeholder="例: misaki@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    {emailValid === true && (
                      <p className="text-green-600 text-sm mt-1">
                        このメールアドレスは利用可能です。
                      </p>
                    )}
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
                      <Input placeholder="例: 090-1234-5678" {...field} />
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
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="	8文字以上で、英小文字・英大文字・数字・記号のすべてを含めてください。"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    パスワード確認
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="もう一度パスワードを入力してください"
                    />
                  </FormControl>
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
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span>〒</span>
                        <Input
                          placeholder="123-4567"
                          {...field}
                          value={formatPostalCode(field.value ?? "")}
                          maxLength={8}
                          onChange={(e) => {
                            const formatted = formatPostalCode(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prefecture"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Input placeholder="例: 渋谷区" {...field} />
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
                        placeholder="例: 神宮前5丁目47-10 OD表参道ビル4階"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="pr-6">
                    <FormLabel>
                      ステータス
                      <RequiredCharacter />
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">稼働中</SelectItem>
                        <SelectItem value="1">非稼働</SelectItem>
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
    </>
  );
}
