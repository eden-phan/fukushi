"use client";
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TextArea } from '@/components/ui/text-area'
import { Label } from '@/components/ui/label'
import http from '@/services/http'
import { useParams } from 'next/navigation'
import { supportPlanAssessedOptions, SupportPlanDomainItems, SupportPlanDomainKey, SupportPlanDomains, supportPlanOptions, timeSlots } from "@/lib/supportPlan";
import { Loader2 } from 'lucide-react';
import { UITable, UITableBody, UITableCell, UITableHeader, UITableRow } from '@/components/customs/ui-table';
import { Input } from '@/components/ui/input';
import SupportPlanGoal from './support-plan-goal';
import { toast } from 'sonner';
import { createSuccessToast, updateSuccessToast } from '@/lib/message';

type Props = {
    backToList: () => void
    editId?: string
}

interface SupportPlanGoalItem {
    domain: SupportPlanDomainKey;
    support_category: string | null;
    goal: string | null;
    support_content: string | null;
    progress_first_term: string | null;
    progress_second_term: string | null;
}

type SupportPlanDetail = {
    time: string;
    description: string;
    activity_name: string;
    activity_time: string;
    
}

const domainSchema = z.object({
    support_category: z.array(z.string()),
    goal: z.string().optional(),
    support_content: z.string().optional(),
    progress_first_term: z.string().optional(),
    progress_second_term: z.string().optional(),
});

const supportDetailSchema = z.object({
  time: z.string(),
  item: z.string().optional(),
  detail: z.string().optional(),
});

const formSchema = z.object({
    status: z.string().optional(),
    is_assessed: z.string().optional(),
    staff_id: z.string(),
    user_family_intention: z.string(),
    yearly_support_goal: z.string(),
    daily_life: domainSchema,
    health: domainSchema,
    leisure: domainSchema,
    community_life: domainSchema,
    other_support: domainSchema,
    support_details: z.array(supportDetailSchema),
});

export type SupportPlanFormType = z.infer<typeof formSchema>;

type DomainData = {
    [key in SupportPlanDomainKey]?: z.infer<typeof domainSchema>;
};

const SupportPlanAddForm = ({ backToList, editId }: Props) => {
    console.log(editId)
    const params = useParams();
    const patientId = params?.id as string;
    const [loading, setLoading] = useState(false);
    const domains = SupportPlanDomains;
    const domainItems = SupportPlanDomainItems;
    const [staffOptions, setStaffOptions] = useState<{ id: string, label: string }[]>([]);
    const [staffLoading, setStaffLoading] = useState(false);
    const [patient, setPatient] = useState(null)

    useEffect(() => {
      setStaffLoading(true);
      http.get('/profile').then(res => {
        const data = res.data.data || [];
        setStaffOptions(data.data.map((staff: StaffProps) => ({
          id: String(staff.id),
          label: staff.profile.fullname
        })));
      }).finally(() => setStaffLoading(false));
    }, []);

    const defaultSupportDetails = timeSlots.map(time => ({
      time,
      item: "",
      detail: ""
    }));

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "",
            is_assessed: "",
            staff_id: "",
            user_family_intention: "",
            yearly_support_goal: "",
            daily_life: {
                support_category: [],
                goal: "",
                support_content: "",
                progress_first_term: "",
                progress_second_term: "",
            },
            health: {
                support_category: [],
                goal: "",
                support_content: "",
                progress_first_term: "",
                progress_second_term: "",
            },
            leisure: {
                support_category: [],
                goal: "",
                support_content: "",
                progress_first_term: "",
                progress_second_term: "",
            },
            community_life: {
                support_category: [],
                goal: "",
                support_content: "",
                progress_first_term: "",
                progress_second_term: "",
            },
            other_support: {
                support_category: [],
                goal: "",
                support_content: "",
                progress_first_term: "",
                progress_second_term: "",
            },
            support_details: [
                { time: "6:00", item: "", detail: "" },
                { time: "7:00", item: "", detail: "" },
                { time: "8:00", item: "", detail: "" },
                { time: "9:00", item: "", detail: "" },
                { time: "10:00", item: "", detail: "" },
                { time: "15:00", item: "", detail: "" },
                { time: "16:00", item: "", detail: "" },
                { time: "17:00", item: "", detail: "" },
                { time: "18:00", item: "", detail: "" },
                { time: "19:00", item: "", detail: "" },
                { time: "20:00", item: "", detail: "" },
                { time: "21:00", item: "", detail: "" },
                { time: "22:00", item: "", detail: "" },
                { time: "23:00", item: "", detail: "" },
                { time: "24:00", item: "", detail: "" },
            ],
        },
    });

    useEffect(() => {
        if (!editId) return;
        setLoading(true)
        http.get(`support-plan/detail/${editId}`).then(async (res) => {
            const data = (await res).data?.data;
            setPatient(data.service_user.profile.fullname)
            console.log(data)
            if (!data) return;

            const domainData: DomainData = {};
            if (Array.isArray(data.support_plan_goal)) {
                data.support_plan_goal.forEach((item: SupportPlanGoalItem) => {
                    domainData[item.domain] = {
                        support_category: item.support_category ? JSON.parse(item.support_category) : [],
                        goal: item.goal || "",
                        support_content: item.support_content || "",
                        progress_first_term: item.progress_first_term || "",
                        progress_second_term: item.progress_second_term || "",
                    }
                });
            }


            const supportDetails = (data.support_plan_detail || []).map((item:SupportPlanDetail) => {
                let time = item.activity_time || "";
                if (time.length === 8) { 
                    time = time.slice(0, 5);
                }
                return {
                    time,
                    item: item.activity_name || "",
                    detail: item.description || "",
                };
            });

            const filledSupportDetails = defaultSupportDetails.map(row => {
                const found = supportDetails.find((d: SupportPlanDetail) => d.time === row.time);
                return found ? found : row; 
            });

            form.reset({
                status: data.status?.toString() || "",
                is_assessed: data.is_assessed?.toString() || "",
                staff_id: data.staff_id?.toString() || "",
                user_family_intention: data.user_family_intention || "",
                yearly_support_goal: data.yearly_support_goal || "",
                daily_life: domainData.daily_life || {
                    support_category: [],
                    goal: "",
                    support_content: "",
                    progress_first_term: "",
                    progress_second_term: "",
                },
                health: domainData.health || {
                    support_category: [],
                    goal: "",
                    support_content: "",
                    progress_first_term: "",
                    progress_second_term: "",
                },
                leisure: domainData.leisure || {
                    support_category: [],
                    goal: "",
                    support_content: "",
                    progress_first_term: "",
                    progress_second_term: "",
                },
                community_life: domainData.community_life || {
                    support_category: [],
                    goal: "",
                    support_content: "",
                    progress_first_term: "",
                    progress_second_term: "",
                },
                other_support: domainData.other_support || {
                    support_category: [],
                    goal: "",
                    support_content: "",
                    progress_first_term: "",
                    progress_second_term: "",
                },
                support_details: filledSupportDetails,
            });

            setLoading(false)
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId, form]);


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const filteredSupportDetails = values.support_details.filter(
            row => (row.item?.trim() || "") !== "" || (row.detail?.trim() || "") !== ""
        );

        const payload = {
            ...values,
            support_details: filteredSupportDetails,
        };

        if (editId) {
            http.put(`/support-plan/edit/${editId}`, payload)
                .then(() => {
                    toast.success(updateSuccessToast);
                    backToList()
                });
        } else {
            http.post(`/support-plan/create/${patientId}`, payload)
                .then(() => {
                    toast.success(createSuccessToast);
                    backToList()
                });
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
            </div>
        )
    }

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
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>状態</FormLabel>
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
                                                <SelectValue placeholder="select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {supportPlanOptions.length > 0 ? (
                                                supportPlanOptions.map(
                                                    (user) => {
                                                        return (
                                                            <SelectItem
                                                                key={user.id}
                                                                value={(user.id)}
                                                            >
                                                                {user.label}
                                                            </SelectItem>
                                                        );
                                                    }
                                                )
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
                            name="is_assessed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>評価済み</FormLabel>
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
                                                <SelectValue placeholder="select Rated" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {supportPlanAssessedOptions.length > 0 ? (
                                                supportPlanAssessedOptions.map(
                                                    (user) => {
                                                        return (
                                                            <SelectItem
                                                                key={user.id}
                                                                value={(user.id)}
                                                            >
                                                                {user.label}
                                                            </SelectItem>
                                                        );
                                                    }
                                                )
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

                    <div className="border-2 p-4 flex flex-col gap-3">
                        <Label className='font-bold'>基本情報</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <FormItem>
                                <FormLabel>サービス管理責任者</FormLabel>
                                <FormControl>
                                    <Input value={patient ?? ''} disabled />
                                </FormControl>
                            </FormItem>

                            <FormField
                                control={form.control}
                                name="staff_id"
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
                                                    <SelectValue placeholder="select staff" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {staffLoading ? (
                                                    <SelectItem value="loading">Đang tải...</SelectItem>
                                                ) : staffOptions.length > 0 ? (
                                                    staffOptions.map((user) => (
                                                        <SelectItem key={user.id} value={user.id}>
                                                            {user.label}
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
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="user_family_intention"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>備考</FormLabel>
                                    <FormControl>
                                        <TextArea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="yearly_support_goal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>備考</FormLabel>
                                    <FormControl>
                                        <TextArea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {domains.map((domain) => (
                        <SupportPlanGoal
                            key={domain.key}
                            domain={domain}
                            domainItems={domainItems[domain.key] || []}
                            control={form.control}
                        />
                    ))}
                    <FormField
                        control={form.control}
                        name="support_details"
                        render={({ field }) => (
                            <UITable className='border-2'>
                                <UITableHeader>
                                    <UITableRow className='bg-gray-100 text-center'>
                                        <UITableCell>時間</UITableCell>
                                        <UITableCell>事項</UITableCell>
                                        <UITableCell>具体的な支援内容</UITableCell>
                                    </UITableRow>
                                </UITableHeader>
                                <UITableBody>
                                    {field.value.map((row, idx) => (
                                        <UITableRow key={row.time}>
                                            <UITableCell>{row.time}</UITableCell>
                                            <UITableCell>
                                                <Input
                                                    type="text"
                                                    value={row.item}
                                                    onChange={e => {
                                                        const newArr = [...field.value];
                                                        newArr[idx].item = e.target.value;
                                                        field.onChange(newArr);
                                                    }}
                                                    className="w-full border px-2 py-1"
                                                />
                                            </UITableCell>
                                            <UITableCell>
                                                <Input
                                                    value={row.detail}
                                                    onChange={e => {
                                                        const newArr = [...field.value];
                                                        newArr[idx].detail = e.target.value;
                                                        field.onChange(newArr);
                                                    }}
                                                    className="w-full border px-2 py-1"
                                                />
                                            </UITableCell>
                                        </UITableRow>
                                    ))}
                                </UITableBody>
                            </UITable>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}

export default SupportPlanAddForm