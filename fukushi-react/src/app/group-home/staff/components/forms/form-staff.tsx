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
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UISubmitButton, UICancelButton } from "@/components/customs/ui-button";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn, formatPostalCode } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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
import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
import { RequiredCharacter } from "@/components/customs/required-character"
import { Button } from "@/components/ui/button"
import { jpPrefectures } from "@/lib/constant"
import { UITelephoneInput } from "@/components/customs/ui-input"
import UIAvatarUpload from "@/components/customs/ui-avatar-upload"

export default function FormStaff({
    staffData,
}: //  loading
{
    staffData?: StaffProps
    loading?: boolean
}) {
    const router = useRouter()

    const [emailValid, setEmailValid] = useState<boolean | null>(null)
    const [show, setShow] = useState(false)
    const [showConFirmPassword, setShowConFirmPassword] = useState(false)

    let emailCheckTimer: ReturnType<typeof setTimeout> | null = null
    let lastCheckedEmail = ""
    let lastResult = false

    const getFormSchema = (isEdit: boolean) =>
        z
            .object({
                employment_type: z.string().min(1, {
                    message: "職種を選択してください。",
                }),

                password: isEdit
                    ? z.string().optional()
                    : z
                          .string()
                          .min(8, { message: "パスワードは8文字以上で入力してください。" })
                          .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
                              message: "パスワードは英字と数字を含めてください。",
                          }),

                confirm_password: z.string().optional(),
                email: z
                    .string({ required_error: "メールアドレスを入力してください。" })
                    .email({ message: "正しいメールアドレス形式で入力してください。" }),
                fullname: z.string().min(1, {
                    message: "氏名を入力してください。",
                }),
                phone_number: z.string({ required_error: "電話番号を入力してください。" }).regex(/^\d{10,11}$/, {
                    message: "電話番号は10桁または11桁の数字で入力してください。",
                }),

                facility_id: z.string().nullable(),

                status: z.string().min(1, {
                    message: "就労状況を選択してください。",
                }),

                gender: z.string().min(1, {
                    message: "このフィールドは必須です。",
                }),

                district: z.string(),

                address: z.string(),

                prefecture: z.string().nullable(),

                postal_code: z
                    .string()
                    .optional()
                    .refine(
                        (val) => {
                            if (!val) return true
                            return /^\d{3}-?\d{4}$/.test(val)
                        },
                        {
                            message: "有効な郵便番号を入力してください（例: 123-4567）。",
                        }
                    ),

                avatar: z.number().nullable().optional(),

                dob: z
                    .date({
                        required_error: "このフィールドは必須です。",
                    })
                    .refine((val) => val <= new Date(), {
                        message: "生年月日が無効です。",
                    }),
                family_name: z.string().nullable(),

                relationship: z.string().nullable(),

                family_phone: z.string().nullable(),

                work_type: z.string().min(1, {
                    message: "職種を選択してください。",
                }),
            })
            .refine(
                (data) => {
                    if (isEdit) {
                        if (data.password || data.confirm_password) {
                            return data.password === data.confirm_password
                        }
                        return true
                    }
                    return data.password === data.confirm_password
                },
                {
                    message: "確認用パスワードが一致していません。",
                    path: ["confirm_password"],
                }
            )
            .superRefine(async (data, ctx) => {
                // Validate format trước
                const email = data.email
                const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                if (!isValidFormat) return

                const isAvailable = await debounceCheckEmail(email)
                if (!isAvailable) {
                    ctx.addIssue({
                        path: ["email"],
                        code: z.ZodIssueCode.custom,
                        message: "このメールアドレスは既に使用されています。",
                    })
                }
            })

    const debounceCheckEmail = (email: string): Promise<boolean> => {
        return new Promise((resolve) => {
            if (email === lastCheckedEmail) {
                setEmailValid(lastResult)
                resolve(lastResult)
                return
            }

            if (emailCheckTimer) clearTimeout(emailCheckTimer)

            emailCheckTimer = setTimeout(async () => {
                try {
                    const { data } = await http.get("/profile/check-email", {
                        params: { param: email, id: staffData?.id },
                    })

                    const available = !data.data.exists
                    lastCheckedEmail = email
                    lastResult = available

                    setEmailValid(available)
                    resolve(available)
                } catch (error) {
                    console.error("Check email failed", error)
                    setEmailValid(null)
                    resolve(true)
                }
            }, 500)
        })
    }

    const isEdit = !!staffData

    // useEffect(() => {
    //   setCompanyLoading(true);
    //   http.get('/facility').then(res => {
    //     const data = res.data.data || [];
    //     setCompanyOptions(data.data.map((company: FacilityProps) => ({
    //       id: String(company.id),
    //       label: company.name
    //     })));
    //   }).finally(() => setCompanyLoading(false));
    // }, []);
    const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
        resolver: zodResolver(getFormSchema(isEdit)),
        defaultValues: {
            employment_type: "",
            password: "",
            confirm_password: "",
            fullname: "",
            email: "",
            phone_number: "",
            facility_id: "",
            status: "",
            gender: "",
            district: "",
            address: "",
            prefecture: "",
            postal_code: "",
            avatar: undefined,
            family_name: "",
            family_phone: "",
            relationship: "",
            work_type: "",
        },
    })

    useEffect(() => {
        if (staffData) {
            form.reset({
                employment_type: staffData.employment_type !== undefined ? String(staffData.employment_type) : "",
                password: "",
                confirm_password: "",
                fullname: staffData.profile?.fullname || "",
                email: staffData.email || "",
                phone_number: staffData.profile?.phone_number || "",
                gender: staffData.profile?.gender !== undefined ? String(staffData.profile?.gender) : "",

                // facility_id: staffData?.facility_user?.facility?.id !== undefined ? String(staffData.facility_user.facility.id) : "",
                facility_id: "3",
                status: staffData.profile?.status !== undefined ? String(staffData.profile.status) : "",
                district: staffData.profile?.district || "",
                address: staffData.profile?.address || "",
                prefecture: staffData.profile?.prefecture || "",
                postal_code: staffData.profile?.postal_code || "",
                avatar: staffData.profile?.avatar || undefined,
                dob: staffData.profile?.dob ? new Date(staffData.profile.dob) : undefined,
                family_name: staffData.profile?.family_name || "",
                family_phone: staffData.profile?.family_phone || "",
                relationship: staffData.profile?.relationship || "",
                work_type: staffData.work_type !== undefined ? String(staffData.work_type) : "",
            })
        }
    }, [staffData, form])

    function onSubmit(values: z.infer<ReturnType<typeof getFormSchema>>) {
        const payload = {
            ...values,
            facility_id: "3",
            prefecture: values.prefecture === "" ? null : values.prefecture,
            postal_code: values.postal_code === "" ? null : values.postal_code,
            district: values.district === "" ? null : values.district,
            address: values.address === "" ? null : values.address,
            dob: values.dob.toISOString().split("T")[0],
        }
        if (staffData && staffData.id) {
            http.put(`/profile/${staffData.id}`, payload)
                .then(() => {
                    toast.success("プロフィールを更新しました")
                    router.push("/group-home/staff")
                })
                .catch((err) => {
                    console.error("Lỗi khi cập nhật profile:", err)
                })
        } else {
            http.post("/profile", payload)
                .then(() => {
                    toast.success("プロフィールを更新しました")
                    router.push("/group-home/staff")
                })
                .catch((err) => {
                    console.error("Lỗi khi tạo profile:", err)
                })
        }
    }

    // if (loading) {
    //   return (
    //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
    //       <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
    //     </div>
    //   )
    // }

    return (
        <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
            <div className="px-6 pb-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex justify-end gap-2">
                            <UICancelButton>キャンセル</UICancelButton>
                            <UISubmitButton>{staffData ? "更新する" : "登録する"}</UISubmitButton>
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
                                                    field.onChange(mediaId)
                                                }}
                                                onError={(error) => {
                                                    toast.error(error)
                                                }}
                                                mediaId={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="my-4 grid grid-cols-2 gap-4 gap-y-8">
                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem className="max-h-[60px]">
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

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="max-h-[60px]">
                                            <FormLabel>
                                                生年月日
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
                                                                <span>YYYY年MM月DD日</span>
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
                                                        captionLayout="dropdown"
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
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem className="max-h-[60px]">
                                            <FormLabel>
                                                性別
                                                <RequiredCharacter />
                                            </FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="性別を選択" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="0">男性</SelectItem>
                                                    <SelectItem value="1">女性</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="work_type"
                                render={({ field }) => (
                                    <FormItem className="max-h-[60px]">
                                        <FormLabel>
                                            職種
                                            <RequiredCharacter />
                                        </FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="選択してください" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">サービス管理責任者</SelectItem>
                                                <SelectItem value="2">世話人</SelectItem>
                                                <SelectItem value="3">生活支援員</SelectItem>
                                                <SelectItem value="4">夜間支援従事者</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employment_type"
                                render={({ field }) => (
                                    <FormItem className="max-h-[60px]">
                                        <FormLabel>
                                            契約タイプ
                                            <RequiredCharacter />
                                        </FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
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
                                    <FormItem className="max-h-[60px] my-2">
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
                                            <UITelephoneInput {...field} value={field.value ?? ""} />
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
                                <FormItem className="max-h-[60px]">
                                    <FormLabel className="mt-2">
                                        パスワード
                                        <RequiredCharacter />
                                    </FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                className="pr-10"
                                                type={show ? "text" : "password"}
                                                {...field}
                                                placeholder="	少なくとも 8 文字で、小文字と数字を含める必要があります。"
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="noneOutline"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:bg-transparent focus:outline-none"
                                            onClick={() => setShow((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem className="max-h-[60px] mt-2">
                                    <FormLabel>
                                        パスワード確認
                                        <RequiredCharacter />
                                    </FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                type={showConFirmPassword ? "text" : "password"}
                                                {...field}
                                                placeholder="もう一度パスワードを入力してください"
                                                className="pr-10"
                                            />
                                        </FormControl>

                                        <Button
                                            type="button"
                                            variant="noneOutline"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:bg-transparent focus:outline-none"
                                            onClick={() => setShowConFirmPassword((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showConFirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="postal_code"
                                render={({ field }) => (
                                    <FormItem className="w-1/5 max-h-[60px]">
                                        <FormLabel>郵便番号</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-2">
                                                <span>〒</span>
                                                <Input
                                                    placeholder="123-4567"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    maxLength={8}
                                                    onChange={(e) => {
                                                        const formatted = formatPostalCode(e.target.value)
                                                        field.onChange(formatted)
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* <FormField
                control={form.control}
                name="prefecture"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

                            <FormField
                                control={form.control}
                                name="prefecture"
                                render={({ field }) => (
                                    <FormItem className="min-h-[20px]">
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value !== undefined ? String(field.value) : undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-1/2">
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
                                                        )
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
                                    <FormItem className="w-1/2">
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
                                            <Input placeholder="例: 神宮前5丁目47-10 OD表参道ビル4階" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* <FormField
                control={form.control}
                name="facility_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>利用者氏名</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value !== undefined ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companyLoading ? (
                          <SelectItem value="loading">Đang tải...</SelectItem>
                        ) : companyOptions && companyOptions.length > 0 ? (
                          companyOptions.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data">Users are not available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

                            <FormField
                                control={form.control}
                                name="facility_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>所属事業所</FormLabel>
                                        <Select onValueChange={field.onChange} disabled>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="グールプホーム" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="3">グールプホーム</SelectItem>
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
                                    <FormItem className="max-h-[60px]">
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
                                                <SelectItem value="1">出産休暇</SelectItem>
                                                <SelectItem value="2">育児休暇</SelectItem>
                                                <SelectItem value="3">介護休暇</SelectItem>
                                                <SelectItem value="4">育児・介護時短制度</SelectItem>
                                                <SelectItem value="5">通常勤務</SelectItem>
                                                <SelectItem value="6">無効</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <h2 className="text-[18px]">緊急連絡先</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="family_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>氏名</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ""} placeholder="例: 佐藤 美咲" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="relationship"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>続柄</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ""} placeholder="例: 佐藤 美咲" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="family_phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>電話番号</FormLabel>
                                        <FormControl>
                                            <UITelephoneInput {...field} value={field.value ?? ""} />

                                            {/* <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="例: 佐藤 美咲" /> */}
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
    )
}
