import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ja } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequiredCharacter } from '@/components/customs/required-character';
import { Input } from '@/components/ui/input';
import { UITelephoneInput } from '@/components/customs/ui-input';
import { jpPrefectures } from '@/lib/constant';
import http from '@/services/http';
import { toast } from 'sonner';
import { UIFileUpload } from '@/components/customs/ui-file-upload';

type Props = {
  edit: () => void
  data?: patientProps
}

const formSchema = z.object({
  fullname: z.string().nonempty("このフィールドは必須です。"),
  furigana: z
    .string()
    .nonempty("このフィールドは必須です。"),
  dob: z.date({
    required_error: "このフィールドは必須です。",
  }).refine((val) => val <= new Date(), {
    message: "生年月日が無効です。",
  }),
  gender: z.string().min(1, {
    message: "このフィールドは必須です。",
  }),
  phone_number: z
    .string({ required_error: "電話番号を入力してください。" })
    .regex(/^\d{10,11}$/, {
      message: "電話番号は10桁または11桁の数字で入力してください。",
    }),
  status: z.string().min(1, {
    message: "就労状況を選択してください。",
  }),
  prefecture: z.string().nonempty("このフィールドは必須です。"),
  district: z.string().nonempty("このフィールドは必須です。"),
  address: z.string().nonempty("このフィールドは必須です。"),
  file: z.number().nullable().optional(),
});

const PatientProfileForm = ({ edit, data }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data ? {
      fullname: data?.profile.fullname,
      furigana: data?.profile.furigana,
      dob: data.profile?.dob ? new Date(data.profile.dob) : undefined,
      gender: String(data?.profile.gender),
      phone_number: data?.profile.phone_number,
      status:
        data.profile?.status !== undefined
          ? String(data.profile.status)
          : "",
      prefecture: data?.profile.prefecture,
      district: data?.profile.district,
      address: data?.profile.address,
    } : {
      fullname: "",
      furigana: "",
      dob: undefined,
      gender: "",
      phone_number: "",
      status: "",
      prefecture: "",
      district: "",
      address: "",
    },
  });

  const patientStatus = form.watch('status');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      dob: values.dob.toISOString().split('T')[0],
    };
    http.put(`/service-user/${data?.id}`, payload)
      .then(() => {
        toast.success("患者の更新が成功しました")
        edit();
      })
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className='flex justify-end gap-3'>
            <Button variant="cancel" type="button" onClick={edit}>
              キャンセル
            </Button>
            <Button variant="formSubmit" type="submit">登録する</Button>
          </div>
          <div className="grid grid-cols-2 gap-3 gap-y-7">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className='max-h-[60px]'>
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
              name="furigana"
              render={({ field }) => (
                <FormItem className="max-h-[60px]">
                  <FormLabel>
                    フリガナ
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
                    <UITelephoneInput
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <FormField
            control={form.control}
            name="prefecture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  住所
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
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="max-h-[60px] w-1/2">
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
                    <SelectItem value="0">入居中</SelectItem>
                    <SelectItem value="1">退去</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {patientStatus === "1" && (
            <div className="text-center w-1/2">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロファイル写真</FormLabel>
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
          )}
        </form>
      </Form>

    </>
  )
}

export default PatientProfileForm