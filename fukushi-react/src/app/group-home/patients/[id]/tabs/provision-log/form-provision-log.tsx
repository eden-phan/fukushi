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
import { CalendarIcon, Clock } from "lucide-react";
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
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { ServiceProvisionLogProps } from "@/@types/service-provision-log";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  getMedicationProvisionLogOptions,
  getMealProvidedOptions,
} from "@/lib/selections";
import { createSuccessToast, updateSuccessToast } from "@/lib/message";
import { toast } from "sonner";

type FormProvisionLogProps = {
  data?: ServiceProvisionLogProps | undefined;
  onBackToList: () => void;
};

const formSchema = z
  .object({
    staff_id: z.string().nonempty("このフィールドは必須です。"),
    date: z.date({
      required_error: "このフィールドは必須です。",
      invalid_type_error: "この項目は無効です",
    }),
    meal_provided: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "このフィールドは必須です。",
      }),
    medication: z.string().nonempty("このフィールドは必須です。"),
    wake_up_time: z.string().nonempty("このフィールドは必須です。"),
    bed_time: z.string().nonempty("このフィールドは必須です。"),
    daytime_activity: z.string().nonempty("このフィールドは必須です。"),
    daytime_activity_content: z.string().optional(),
    condition: z.string().nonempty("このフィールドは必須です。"),
    overnight_stay: z.string().nonempty("このフィールドは必須です。"),
    hospital_facility: z.string().nonempty("このフィールドは必須です。"),
    other_note: z.string().nonempty("このフィールドは必須です。"),
  })
  .superRefine((data, ctx) => {
    if (data.daytime_activity === "1" && !data.daytime_activity_content) {
      ctx.addIssue({
        path: ["daytime_activity_content"],
        code: z.ZodIssueCode.custom,
        message: "このフィールドは必須です。",
      });
    }
  });

const FormProvisionLog = ({ data, onBackToList }: FormProvisionLogProps) => {
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
      staff_id: "",
      date: undefined,
      meal_provided: [""],
      medication: "",
      wake_up_time: "",
      bed_time: "",
      daytime_activity: "",
      daytime_activity_content: "",
      condition: "",
      overnight_stay: "",
      hospital_facility: "",
      other_note: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        staff_id: String(data.staff_id),
        date: new Date(data.date),
        meal_provided: data.meal_provided
          ? data.meal_provided.split(",").map((item: string) => item.trim())
          : [],
        medication: data.medication,
        wake_up_time: data.wake_up_time?.slice(0, 5) ?? "",
        bed_time: data.bed_time?.slice(0, 5) ?? "",
        daytime_activity: String(data.daytime_activity),
        daytime_activity_content: data.daytime_activity_content
          ? data.daytime_activity_content
          : "",
        condition: data.condition,
        overnight_stay: data.overnight_stay,
        hospital_facility: data.hospital_facility,
        other_note: data.other_note,
      });
    }
  }, [data, userOptions, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const payload = {
      ...submitData,
      service_user_id: Number(id),
      date: submitData.date ? format(submitData.date, "yyyy-MM-dd") : null,
      meal_provided: Array.isArray(submitData.meal_provided)
        ? submitData.meal_provided.filter(Boolean).join(", ")
        : submitData.meal_provided,
    };

    const message = data ? updateSuccessToast : createSuccessToast;
    const method = data ? http.put : http.post;
    const url = data
      ? `service-provision-log/${data.id}`
      : "service-provision-log";
    await method(url, payload);

    if (!data) form.reset();

    onBackToList();
    toast.success(message);
  }

  const isDaytimeActivity = form.watch("daytime_activity");

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        日付
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
                  name="meal_provided"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>食事提供</FormLabel>
                      </div>
                      <div className="flex flex-row flex-wrap gap-4">
                        {getMealProvidedOptions.map((item) => (
                          <FormField
                            key={item.value}
                            control={form.control}
                            name="meal_provided"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.value}
                                  className="flex flex-row items-center"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        item.value
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.value,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.value
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        服薬
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
                            <SelectValue placeholder="薬の情報を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getMedicationProvisionLogOptions.map(
                            (option, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={String(option.value)}
                                >
                                  {option.label}
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
                  name="staff_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        記録者
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
                            <SelectValue placeholder="記録者を選択してください" />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <FormField
                    control={form.control}
                    name="wake_up_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          起床時刻
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
                                  ? field.value
                                  : "起床時刻を選択してください"}
                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="flex flex-col gap-2 w-auto p-2"
                            align="start"
                          >
                            <Input
                              type="time"
                              step={60}
                              className="w-full"
                              value={field.value ?? "00:00"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bed_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          就寝時刻
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
                                  ? field.value
                                  : "就寝時刻を選択してください"}
                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="flex flex-col gap-2 w-auto p-2"
                            align="start"
                          >
                            <Input
                              type="time"
                              step={60}
                              className="w-full"
                              value={field.value ?? "00:00"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="daytime_activity"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-8">
                          <FormLabel>日中活動</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value === "0") {
                                  form.setValue("daytime_activity_content", "");
                                }
                              }}
                              value={field.value}
                              className="flex flex-row gap-4"
                            >
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="1" id="1" />
                                <label htmlFor="yes">有</label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="0" id="0" />
                                <label htmlFor="no">無</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="daytime_activity_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isDaytimeActivity !== "1"}
                            placeholder="活動内容を入力してください"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      本人の状況
                      <RequiredCharacter />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="状況を入力してください"
                        id="message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div>
                  <span className="font-semibold">特記事項</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="overnight_stay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            外泊
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="外泊情報を入力してください"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hospital_facility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            入院
                            <RequiredCharacter />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="入院情報を入力してください"
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
                    name="other_note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          その他
                          <RequiredCharacter />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="その他の情報を入力してください"
                            {...field}
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
};

export default FormProvisionLog;
