"use client";
import { RequiredCharacter } from '@/components/customs/required-character';
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Input } from '@/components/ui/input';
import http from '@/services/http';
import { UserProps } from '@/@types/user';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UIFileUpload } from '@/components/customs/ui-file-upload';
import { toast } from 'sonner';

type Props = {
    data?: DocumentProps
    backToList: () => void
    refetchData: () => void
    patientId: string
    users: UserProps[]
}

const formSchema = z.object({
    start_date: z.date({
        required_error: "このフィールドは必須です。",
        invalid_type_error: "この項目は無効です",
    }),
    end_date: z.date({
        required_error: "このフィールドは必須です。",
        invalid_type_error: "この項目は無効です",
    }),
    staff_id: z.string(),
    family_name: z.string(),
    file: z.number().nullable().optional(),


});

const InformationConsentForm = ({ users, data, backToList, refetchData, patientId }: Props) => {



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start_date: data?.start_date ? new Date(data.start_date) : undefined,
            end_date: data?.end_date ? new Date(data.end_date) : undefined,
            staff_id: data?.staff_id ? String(data.staff_id) : "",
            family_name: data?.document_metadata?.find((item) => item.key === 'family_name')?.value || "",
            file: data?.file || null,

        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (data && data?.id) {
                await http.put(`information-consent/update/${data.id}`, values);
                refetchData()
            } else {
                await http.post(`information-consent/create/${patientId}`, values);
                refetchData()
            }

            backToList();
        } catch (error) {
            console.error("Lỗi xử lý form:", error);
        }
    };

    return (
        <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex justify-end gap-2">
                        <Button variant="cancel" onClick={backToList}>
                            キャンセル
                        </Button>
                        <Button variant="formSubmit" type="submit">登録する</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <FormField
                            control={form.control}
                            name="start_date"
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
                            name="end_date"
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
                            name="family_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        メールアドレス
                                        <RequiredCharacter />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="メールアドレスを入力してください"
                                            {...field}
                                        />
                                    </FormControl>
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
                </form>

            </Form>
        </div>
    )
}
export default InformationConsentForm