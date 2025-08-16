"use client"

import * as React from "react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { UISubmitButton, UICancelButton } from "@/components/customs/ui-button"
import { TextArea } from "@/components/ui/text-area"
import http from "@/services/http"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { DatePicker } from "@/components/customs/date-picker"
import { format } from "date-fns"
import { RequiredCharacter } from "@/components/customs/required-character"
import { Signature } from "@/components/customs/signature"

const formSchema = z.object({
    record_type: z.string().min(1, {
        message: "記録種別を選択してください。",
    }),
    theme: z.string().min(1, {
        message: "テーマを入力してください。",
    }),
    date: z.date({
        required_error: "このフィールドは必須です。",
        invalid_type_error: "この項目は無効です",
    }),
    time_range: z
        .object({
            start: z.string().min(1, { message: "開始時間を入力してください。" }),
            end: z.string().min(1, { message: "終了時間を入力してください。" }),
        })
        .refine(
            (data) => {
                if (!data.start || !data.end) return true // Let required validation handle empty values
                return data.end > data.start
            },
            {
                message: "終了時間は開始時間より後の時間を選択してください。",
                path: ["end"], // This will show the error on the end time field
            }
        ),
    location: z.string().optional(),
    content: z.string().optional(),
    feedback: z.string().optional(),
    signature: z.object({
        admin_signature: z.string().optional(),
        child_support_manager_signature: z.string().optional(),
        recorder_signature: z.string().optional(),
    }),
})
type FormTrainingProps = {
    mode?: "add" | "edit"
    id?: string
}

export default function FormTraining({ mode = "add", id }: FormTrainingProps) {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            record_type: "training",
            theme: "",
            date: undefined,
            time_range: { start: "09:00", end: "17:00" },
            location: "",
            content: "",
            feedback: "",
            signature: {
                admin_signature: "",
                child_support_manager_signature: "",
                recorder_signature: "",
            },
        },
    })

    // Load data for edit mode
    React.useEffect(() => {
        if (mode === "edit" && id) {
            setLoading(true)
            http.get(`/session/${id}`)
                .then((response) => {
                    const data = response.data.data
                    // Format times to HH:MM format
                    const formatTime = (time: string) => {
                        if (!time) return ""
                        if (time.includes(":")) {
                            const timeParts = time.split(":")
                            return `${timeParts[0].padStart(2, "0")}:${timeParts[1].padStart(2, "0")}`
                        }
                        return time
                    }

                    form.reset({
                        record_type: data.record_type || "training",
                        theme: data.theme || "",
                        date: new Date(data.date) || "",
                        time_range: {
                            start: formatTime(data.start_time || data.time || "09:00"),
                            end: formatTime(data.end_time || "17:00"),
                        },
                        location: data.location || "",
                        content: data.content || "",
                        feedback: data.feedback || "",
                        signature: {
                            admin_signature: data.signature?.admin_signature || "",
                            child_support_manager_signature: data.signature?.child_support_manager_signature || "",
                            recorder_signature: data.signature?.recorder_signature || "",
                        },
                    })
                })
                .catch((error) => {
                    console.error("Error fetching training data:", error)
                    toast.error("データの取得に失敗しました")
                    router.push("/group-home/training")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [mode, id, form, router])

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        // Prepare payload with backward compatibility for existing API
        const payload = {
            ...values,
            date: values.date ? format(values.date, "yyyy-MM-dd") : null,
            start_time: values.time_range.start,
            end_time: values.time_range.end,
        }

        const request =
            mode === "edit" ? http.put(`/session/update/${id}`, payload) : http.post("/session/store", payload)

        request
            .then((response) => {
                console.log("Response:", response)
                router.push("/group-home/training")
                toast.success(mode === "edit" ? "研修ノートを更新しました。" : "研修ノートを登録しました。", {
                    duration: 3000,
                    position: "top-right",
                })
            })
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.message ||
                    (mode === "edit" ? "研修ノートの更新に失敗しました。" : "研修ノートの登録に失敗しました。")
                toast.error(errorMessage, {
                    duration: 3000,
                    position: "top-right",
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
            <div className="px-6 pb-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        テーマ
                                        <RequiredCharacter />
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="研修テーマを入力" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            開催日
                                            <RequiredCharacter />
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <div className="min-h-[20px]">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="time_range.start"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>
                                                開始時間
                                                <RequiredCharacter />
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} className="w-auto" />
                                            </FormControl>
                                            <div className="min-h-[20px]">
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="time_range.end"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>
                                                終了時間
                                                <RequiredCharacter />
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} className="w-auto" />
                                            </FormControl>
                                            <div className="min-h-[20px]">
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>開催場所</FormLabel>
                                    <FormControl>
                                        <Input placeholder="会議室A" {...field} className="flex" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>内容</FormLabel>
                                    <FormControl>
                                        <TextArea placeholder="研修内容を入力" rows={4} cols={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="feedback"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>フィードバック</FormLabel>
                                    <FormControl>
                                        <TextArea
                                            placeholder="フィードバックを入力（任意）"
                                            rows={3}
                                            cols={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <Signature
                                fields={[
                                    {
                                        name: "admin_signature",
                                        label: "管理者",
                                        value: form.watch("signature.admin_signature"),
                                        onChange: (value) => form.setValue("signature.admin_signature", value),
                                        disabled: loading,
                                    },
                                    {
                                        name: "child_support_manager_signature",
                                        label: "児童発達支援管理責任者",
                                        value: form.watch("signature.child_support_manager_signature"),
                                        onChange: (value) =>
                                            form.setValue("signature.child_support_manager_signature", value),
                                        disabled: loading,
                                    },
                                    {
                                        name: "recorder_signature",
                                        label: "記録者",
                                        value: form.watch("signature.recorder_signature"),
                                        onChange: (value) => form.setValue("signature.recorder_signature", value),
                                        disabled: loading,
                                    },
                                ]}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <UICancelButton onClick={() => router.push("/group-home/training")} disabled={loading}>
                                キャンセル
                            </UICancelButton>
                            <UISubmitButton disabled={loading}>
                                {loading
                                    ? mode === "edit"
                                        ? "更新中..."
                                        : "登録中..."
                                    : mode === "edit"
                                    ? "更新する"
                                    : "登録する"}
                            </UISubmitButton>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
