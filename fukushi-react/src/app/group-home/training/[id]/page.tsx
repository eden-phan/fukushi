"use client"

import * as React from "react"
import { HeadingPage } from "@/components/ui/heading-page"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit, ArrowLeft, Calendar, Clock, MapPin, User, FileText, MessageSquare } from "lucide-react"
import http from "@/services/http"
import { toast } from "sonner"
import { formatDate, formatTime, getSessionRecordLabel } from "@/lib/utils"
import { TrainingProps } from "@/@types/training"
import { Signature } from "@/components/customs/signature"

export default function ViewTraining({ params }: { params: Promise<{ id: string }> }) {
    const [data, setData] = useState<TrainingProps | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const resolvedParams = React.use(params)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get(`/session/${resolvedParams.id}`)
                setData(response.data.data)
            } catch (error) {
                console.error("Error fetching training data:", error)
                toast.error("研修ノートの取得に失敗しました")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [resolvedParams.id, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                <span className="ml-2 text-gray-600">読み込み中...</span>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center py-8">
                <p>研修ノートが見つかりません</p>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <HeadingPage title="研修ノート詳細" />
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.push("/group-home/training")}>
                        <ArrowLeft size={16} className="mr-2" />
                        戻る
                    </Button>
                    <Button onClick={() => router.push(`/group-home/training/edit/${resolvedParams.id}`)}>
                        <Edit size={16} className="mr-2" />
                        編集
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ID</label>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gray-100 rounded-md">
                                <User size={16} className="text-gray-600" />
                            </div>
                            <span className="text-sm">{data.id}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">記録種別</label>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-md">
                                <FileText size={16} className="text-blue-600" />
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {getSessionRecordLabel(data.record_type) || "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Theme */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">テーマ</label>
                    <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-900 break-all">{data.theme || "-"}</p>
                    </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">開催日</label>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-md">
                                <Calendar size={16} className="text-green-600" />
                            </div>
                            <span className="text-sm">{formatDate(data.date)}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">開催時間</label>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-md">
                                <Clock size={16} className="text-purple-600" />
                            </div>
                            <span className="text-sm">
                                {formatTime(data.start_time)} {" - "} {formatTime(data.end_time)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">開催場所</label>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-md">
                            <MapPin size={16} className="text-orange-600" />
                        </div>
                        <span className="text-sm break-all">{data.location || "-"}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">内容</label>
                    <div className="p-3 bg-gray-50 rounded-md min-h-[100px]">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap break-all">
                            {data.content || "研修内容が記録されていません"}
                        </p>
                    </div>
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">フィードバック</label>
                    <div className="flex items-start gap-2">
                        <div className="p-2 bg-yellow-100 rounded-md mt-1">
                            <MessageSquare size={16} className="text-yellow-600" />
                        </div>
                        <div className="flex-1 p-3 bg-gray-50 rounded-md min-h-[100px]">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap break-all">
                                {data.feedback || "フィードバックが記録されていません"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Signatures */}
                {data.signature && (
                    <div>
                        <Signature
                            fields={[
                                {
                                    name: "admin_signature",
                                    label: "管理者",
                                    value: data.signature.admin_signature || "",
                                    disabled: true,
                                },
                                {
                                    name: "child_support_manager_signature",
                                    label: "児童発達支援管理責任者",
                                    value: data.signature.child_support_manager_signature || "",
                                    disabled: true,
                                },
                                {
                                    name: "recorder_signature",
                                    label: "記録者",
                                    value: data.signature.recorder_signature || "",
                                    disabled: true,
                                },
                            ]}
                        />
                    </div>
                )}
            </div>
        </>
    )
}
