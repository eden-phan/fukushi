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
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ja } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/components/app-provider";
import ListFamilyMember from "../family-member/pages/list-family-member";
import { UserProps } from "@/@types/user";
import {
  consultationMethodOptions,
  disabilityCerfiticateTypeOptions,
  disabilityCategoryOptions,
  disabilityLevelOptions,
  desiredUseStatusOptions,
  consultationAcceptStatusOptions,
  genderOptions,
} from "@/lib/selections";
import { RequiredCharacter } from "@/components/customs/required-character";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createSuccessToast,
  updateSuccessToast,
  requiredFamilyMemberErrToast,
} from "@/lib/message";
import { useRouter } from "next/navigation";
import {
  ConsultationAcceptStatusEnum,
  DesiredUseStatusEnum,
  FacilityIdEnum,
} from "@/lib/enum";
import { jpPrefectures } from "@/lib/constant";
import { FacilityProps } from "@/@types/facility";
import {
  UIFaxInput,
  UIPostalCodeInput,
  UITelephoneInput,
} from "@/components/customs/ui-input";

const formSchema = z
  .object({
    // Basic information
    date: z.date({
      required_error: "このフィールドは必須です。",
      invalid_type_error: "この項目は無効です",
    }),
    furigana: z.string().nonempty("このフィールドは必須です。"),
    full_name: z.string().nonempty("このフィールドは必須です。"),
    method: z.string().nonempty("このフィールドは必須です。"),
    transit_agency: z.string().nonempty("このフィールドは必須です。"),
    staff_id: z.string().nonempty("このフィールドは必須です。"),
    gender: z.string().nonempty("このフィールドは必須です。"),

    // User information
    disability_certificate_type: z
      .string()
      .nonempty("このフィールドは必須です。"),
    disability_category: z.string().nonempty("このフィールドは必須です。"),
    disability_level: z.string().nonempty("このフィールドは必須です。"),
    dob: z.date({
      required_error: "このフィールドは必須です。",
      invalid_type_error: "この項目は無効です",
    }),
    postal_code: z.string().nonempty("このフィールドは必須です。"),
    prefecture: z.string().nonempty("このフィールドは必須です。"),
    district: z.string().nonempty("このフィールドは必須です。"),
    address: z.string().nonempty("このフィールドは必須です。"),
    telephone: z
      .string()
      .nonempty("電話番号を入力してください")
      .regex(/^\d{10,11}$/, "有効な電話番号を入力してください。"),
    fax: z.string().nonempty("このフィールドは必須です。"),

    // Consultant information
    consultant_name: z.string().nonempty("このフィールドは必須です。"),
    consultant_relationship: z.string().nonempty("このフィールドは必須です。"),
    consultant_postal_code: z.string().nonempty("このフィールドは必須です。"),
    consultant_prefecture: z.string().nonempty("このフィールドは必須です。"),
    consultant_district: z.string().nonempty("このフィールドは必須です。"),
    consultant_street: z.string().nonempty("このフィールドは必須です。"),
    consultant_telephone: z
      .string()
      .nonempty("電話番号を入力してください")
      .regex(/^\d{10,11}$/, "有効な電話番号を入力してください。"),
    consultant_fax: z.string().nonempty("このフィールドは必須です。"),
    disability_name: z.string().nonempty("このフィールドは必須です。"),

    // Other contact information
    other_contact_fullname: z.string().nonempty("このフィールドは必須です。"),
    other_contact_address: z.string().nonempty("このフィールドは必須です。"),
    other_contact_telephone: z
      .string()
      .nonempty("電話番号を入力してください")
      .regex(/^\d{10,11}$/, "有効な電話番号を入力してください。"),
    other_contact_fax: z.string().nonempty("このフィールドは必須です。"),

    // Consultation content
    consultation_content: z.string().nonempty("このフィールドは必須です。"),
    current_services: z.string().nonempty("このフィールドは必須です。"),
    desired_use_status: z.string().nonempty("このフィールドは必須です。"),
    desired_admission_date: z.date().optional(),
    note: z.string().nonempty("このフィールドは必須です。"),
    response_status: z.string().nonempty("このフィールドは必須です。"),
    referral_facility_id: z.string().optional(),
    home_visit_schedule: z.date({
      required_error: "このフィールドは必須です。",
      invalid_type_error: "この項目は無効です",
    }),
    next_visit_schedule: z.date({
      required_error: "このフィールドは必須です。",
      invalid_type_error: "この項目は無効です",
    }),

    /**Accept status */
    accept_status: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.response_status === "1" && !data.referral_facility_id) {
      ctx.addIssue({
        path: ["referral_facility_id"],
        code: z.ZodIssueCode.custom,
        message: "このフィールドは必須です。",
      });
    }
  });

type FormConsultationProps = {
  data?: ConsultationProps | undefined;
};

export default function FormConsultation({ data }: FormConsultationProps) {
  const router = useRouter();
  const { userContext } = useAppContext();

  const [users, setUsers] = useState<UserProps[]>([]);
  const [facilities, setFacilities] = useState<FacilityProps[]>([]);

  const [familyMembers, setFamilyMembers] = useState<FamilyMemberProps[]>([]);
  const [loadingFamilyMembers, setLoadingFamilyMembers] =
    useState<boolean>(true);

  const fetchFamilyMembers = useCallback(async () => {
    try {
      const response = await http.get(
        `/family-member/consultation/${data?.id}`
      );
      setFamilyMembers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch consultation", error);
    } finally {
      setLoadingFamilyMembers(false);
    }
  }, [data?.id]);

  useEffect(() => {
    fetchUsers();
    fetchFacilities();
    if (data) {
      fetchFamilyMembers();
    } else if (!data) {
      setLoadingFamilyMembers(false);
    }
  }, [data, fetchFamilyMembers]);

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

  const fetchUsers = async () => {
    try {
      const response = await http.get(`/user/staff`);
      setUsers(response.data.data);
    } catch (error) {
      console.log("Fail to fetch staff", error);
      setUsers([]);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Basic information
      date: undefined,
      furigana: "",
      full_name: "",
      method: "",
      transit_agency: "",
      staff_id: "",
      gender: "",

      // User information
      disability_certificate_type: "",
      disability_category: "",
      disability_level: "",
      dob: undefined,
      postal_code: "",
      prefecture: "",
      district: "",
      address: "",
      telephone: "",
      fax: "",
      disability_name: "",

      // Consultant information
      consultant_name: "",
      consultant_relationship: "",
      consultant_postal_code: "",
      consultant_prefecture: "",
      consultant_district: "",
      consultant_street: "",
      consultant_telephone: "",
      consultant_fax: "",

      // Other contact information
      other_contact_fullname: "",
      other_contact_address: "",
      other_contact_telephone: "",
      other_contact_fax: "",

      // Consultation content
      consultation_content: "",
      current_services: "",
      desired_use_status: "",
      desired_admission_date: undefined,
      note: "",
      response_status: "",
      referral_facility_id: "",
      home_visit_schedule: undefined,
      next_visit_schedule: undefined,

      //Accept status
      accept_status: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        // Basic information
        date: new Date(data.date),
        furigana: data.furigana,
        full_name: data.full_name,
        method: data.method,
        transit_agency: data.transit_agency,
        staff_id: String(data.staff_id),
        gender: String(data.gender),

        // User information
        disability_certificate_type: data.disability_certificate_type,
        disability_category: String(data.disability_category),
        disability_level: String(data.disability_level),
        dob: new Date(data.dob),
        postal_code: data.postal_code,
        prefecture: data.prefecture,
        district: data.district,
        address: data.address,
        telephone: data.telephone,
        fax: data.fax,
        disability_name: data.disability_name,

        // Consultant information
        consultant_name: data.consultant_name,
        consultant_relationship: data.consultant_relationship,
        consultant_postal_code: data.consultant_postal_code,
        consultant_prefecture: data.consultant_prefecture,
        consultant_district: data.consultant_district,
        consultant_street: data.consultant_street,
        consultant_telephone: data.consultant_telephone,
        consultant_fax: data.consultant_fax,

        // Other contact information
        other_contact_fullname: data.other_contact_fullname,
        other_contact_address: data.other_contact_address,
        other_contact_telephone: data.other_contact_telephone,
        other_contact_fax: data.other_contact_fax,

        // Consultation content
        consultation_content: data.consultation_content,
        current_services: data.current_services,
        desired_use_status: String(data.desired_use_status),
        desired_admission_date: new Date(data.desired_admission_date),
        note: data.note,
        response_status: String(data.response_status),
        referral_facility_id: String(data.referral_facility_id),
        home_visit_schedule: new Date(data.home_visit_schedule),
        next_visit_schedule: new Date(data.next_visit_schedule),

        // Accept status
        accept_status: String(data.accept_status),
      });
    }
  }, [data, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const consultation = {
      ...submitData,
      facility_id: FacilityIdEnum.GroupHome,
      referral_facility_id: submitData.referral_facility_id
        ? Number(submitData.referral_facility_id)
        : null,
      date: submitData.date ? format(submitData.date, "yyyy-MM-dd") : null,
      staff_id: Number(submitData.staff_id),
      disability_category: Number(submitData.disability_category),
      disability_level: Number(submitData.disability_level),
      dob: submitData.dob ? format(submitData.dob, "yyyy-MM-dd") : null,

      // Consultation content
      response_status: String(submitData.response_status)
        ? Number(submitData.response_status)
        : null,
      home_visit_schedule: submitData.home_visit_schedule
        ? format(submitData.home_visit_schedule, "yyyy-MM-dd")
        : null,
      desired_use_status: Number(submitData.desired_use_status),
      desired_admission_date: submitData.desired_admission_date
        ? format(submitData.desired_admission_date, "yyyy-MM-dd")
        : null,
      next_visit_schedule: submitData.next_visit_schedule
        ? format(submitData.next_visit_schedule, "yyyy-MM-dd")
        : null,
      accept_status:
        data && data.accept_status == ConsultationAcceptStatusEnum.Rejected
          ? Number(submitData.accept_status)
          : undefined,
      created_by: userContext ? userContext.id : null,
    };

    const family_members = familyMembers;

    if (!familyMembers.length) {
      toast.error(requiredFamilyMemberErrToast);
      return;
    }

    const payload = {
      consultation,
      family_members,
    };

    const message = data ? updateSuccessToast : createSuccessToast;

    const method = data ? http.put : http.post;
    const url = data ? `consultation/${data.id}` : "consultation";

    await method(url, payload);

    if (!data) {
      form.reset();
      setFamilyMembers([]);
    }

    router.back();
    fetchFamilyMembers();
    toast.success(message);
  }

  const responseStatus = form.watch("response_status");
  const desiredUseStatus = form.watch("desired_use_status");
  const isRejected = data
    ? data.accept_status === ConsultationAcceptStatusEnum.Rejected
    : false;

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              <UICancelButton>キャンセル</UICancelButton>
              <UISubmitButton>登録する</UISubmitButton>
            </div>
            <div>
              {/* Basic Information */}
              <div>
                <div className="pb-6">
                  <span className="font-semibold">基本情報</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-start">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          相談日
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
                                  <span>相談日を選択してください</span>
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

                  <FormItem>
                    <FormLabel>施設名</FormLabel>
                    <FormControl>
                      <Input placeholder="グループホーム" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="furigana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ふりがな
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="おおさか　はなこ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          氏名
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="大阪 花子" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          相談方法
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
                              <SelectValue placeholder="相談方法を選択してください" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {consultationMethodOptions.map((method) => {
                              return (
                                <SelectItem
                                  key={method.value}
                                  value={String(method.value)}
                                >
                                  {method.label}
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
                    name="transit_agency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          経由機関
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="〇〇病院、△△センターなど"
                            {...field}
                          />
                        </FormControl>
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
                          担当者名
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
                              <SelectValue placeholder="佐藤 健" />
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          gender
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
                              <SelectValue placeholder="性別を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genderOptions.map((sex, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={String(sex.value)}
                                >
                                  {sex.label}
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
              </div>

              <hr className="mt-8 mb-4 border-gray-200" />

              {/* User information */}
              <div>
                <div className="pb-6">
                  <span className="font-semibold pb-4">ユーザー情報</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="disability_certificate_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            障がい手帳の種類
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
                                <SelectValue placeholder="身体障害者" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {disabilityCerfiticateTypeOptions.map((type) => {
                                return (
                                  <SelectItem
                                    key={type.value}
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
                    <FormField
                      control={form.control}
                      name="disability_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            種別
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
                                <SelectValue placeholder="1種" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {disabilityCategoryOptions.map(
                                (category, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={String(category.value)}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  );
                                }
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="disability_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            等級
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
                                <SelectValue placeholder="1級" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {disabilityLevelOptions.map((level, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={String(level.value)}
                                  >
                                    {level.label}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
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
                                    <span>生年月日を選択してください</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                                <SelectValue placeholder="都道府県を選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jpPrefectures.length > 0 ? (
                                jpPrefectures.map((prefecture, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={String(
                                        prefecture.prefecture_kanji
                                      )}
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
                            <Textarea
                              placeholder="神宮前5丁目 47-10 OD表参道ビル4階"
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
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            TEL
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <UITelephoneInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            FAX
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <UIFaxInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="disability_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          障がい名
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="体幹機能障がい、呼吸器機能障がい、音声機能喪失"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <hr className="mt-8 mb-4 border-gray-200" />

              {/* Consultant information */}
              <div>
                <div className="pb-6">
                  <span className="font-semibold pb-4">相談員情報</span>
                </div>
                <div className="grid gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="consultant_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            相談者氏名
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="大阪 花子" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consultant_relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            利用者との関係
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="本人・父・母・兄弟・姉妹・おじ・おば"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="consultant_postal_code"
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
                      name="consultant_prefecture"
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
                                <SelectValue placeholder="都道府県を選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jpPrefectures.length > 0 ? (
                                jpPrefectures.map((prefecture, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={String(
                                        prefecture.prefecture_kanji
                                      )}
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

                    <FormField
                      control={form.control}
                      name="consultant_district"
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
                      name="consultant_street"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="神宮前5丁目 47-10 OD表参道ビル4階"
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
                      name="consultant_telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            TEL
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <UITelephoneInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consultant_fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            FAX
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <UIFaxInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-8 mb-4 border-gray-200" />

              {/* Other contact information */}
              <div>
                <div className="pb-6">
                  <span className="font-semibold pb-4">その他の連 絡先</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="other_contact_fullname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            氏名
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="大阪 花子" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="other_contact_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            住所
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="神宮前5丁目 47-10 OD表参道ビル4階"
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
                      name="other_contact_telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            TEL
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <UITelephoneInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="other_contact_fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            FAX
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <UIFaxInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-8 mb-4 border-gray-200" />

              {/* Consultation content */}
              <div>
                <div className="pb-6">
                  <span className="font-semibold pb-4">相談内容情報</span>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="consultation_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          相談内容
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="一人で出かけるのが不安...."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="current_services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          現在受けているサービス（訪問介護、デイサービス等）
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="移動介護40時間（未使用）"
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
                      name="desired_use_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ご利用希望の決定状況
                            <RequiredCharacter />
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (
                                Number(value) !== DesiredUseStatusEnum.Ready
                              ) {
                                form.setValue(
                                  "desired_admission_date",
                                  undefined
                                );
                              }
                            }}
                            value={
                              field.value !== undefined
                                ? String(field.value)
                                : undefined
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="未決定・入所希望あり・入所希望なし" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {desiredUseStatusOptions.map((status, index) => {
                                return (
                                  <SelectItem
                                    key={index}
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
                      name="desired_admission_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            希望入所日
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
                                  disabled={desiredUseStatus !== "2"}
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          対応者所見・その他の情報
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="吸引器使用などの配慮（体力的な問題）"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="response_status"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            対応状況
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value === "0") {
                                  form.setValue("referral_facility_id", "");
                                }
                              }}
                              className="flex gap-24"
                            >
                              <FormItem className="flex items-center gap-3">
                                <FormControl>
                                  <RadioGroupItem value="0" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  情報提供のみ
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center gap-3">
                                <FormControl>
                                  <RadioGroupItem value="1" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  他機関紹介
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referral_facility_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            紹介先
                            <RequiredCharacter />
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={
                              field.value !== undefined
                                ? String(field.value)
                                : undefined
                            }
                            disabled={responseStatus !== "1"}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="紹介先を選択してください" />
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="home_visit_schedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            訪問対応予定
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                      name="next_visit_schedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            再来所予定
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                    {isRejected && (
                      <FormField
                        control={form.control}
                        name="accept_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              accept_status
                              <RequiredCharacter />
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (
                                  Number(value) !== DesiredUseStatusEnum.Ready
                                ) {
                                  form.setValue(
                                    "desired_admission_date",
                                    undefined
                                  );
                                }
                              }}
                              value={
                                field.value !== undefined
                                  ? String(field.value)
                                  : undefined
                              }
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="accept_status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {consultationAcceptStatusOptions.map(
                                  (status, index) => {
                                    if (
                                      status.value !==
                                      ConsultationAcceptStatusEnum.Accepted
                                    ) {
                                      return (
                                        <SelectItem
                                          key={index}
                                          value={String(status.value)}
                                        >
                                          {status.label}
                                        </SelectItem>
                                      );
                                    }
                                  }
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>

        <hr className="mt-8 mb-4 border-gray-200" />

        <div>
          <div>
            <span className="font-semibold pb-4">家族</span>
          </div>
          <div className="">
            <ListFamilyMember
              familyMembers={familyMembers}
              setFamilyMembers={setFamilyMembers}
              loading={loadingFamilyMembers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
