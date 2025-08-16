"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Conclusion from "./conclusion";
import DocumentContract from "./document-contract/document-contract";
import { useParams } from "next/navigation";
import http from "@/services/http";
import DocumentConfidentiality from "./tabs/document-confidentiality/document-confidentiality";
import { withAuth } from "@/components/auth/withAuth"
import { getAgeFromDob } from "@/lib/utils"
import { AvatarDisplay } from "@/app/(dashboard)/profile/components/information/profile-card"

const StaffDetail = () => {
    const params = useParams()
    const id = params?.id as string
    const [data, setData] = useState<StaffProps>()
    const [documentConfidentiality, setDocumentConfidentiality] = useState<DocumentConfidentialityProps>()

    const fetchStaff = useCallback(async () => {
        try {
            const response = await http.get(`/profile/${id}`)
            setData(response.data)
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu nhân viên:", error)
        }
    }, [id])

    const fetchDocumentConfidentiality = useCallback(async () => {
        try {
            if (data) {
                const response = await http.get(`/document-confidentiality/${data.profile.user_id}`)
                setDocumentConfidentiality(response.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch document confidentiality", error)
        }
    }, [data])

    useEffect(() => {
        if (!id) return
        fetchStaff()
    }, [id, fetchStaff])

    useEffect(() => {
        if (!data?.profile?.user_id) return
        fetchDocumentConfidentiality()
    }, [data?.profile?.user_id, fetchDocumentConfidentiality])

    return (
        <>
            <div className="p-6 max-w-6xl mx-auto items-center">
                <p className="text-[#A5A5A5] text-2xl p-4">スタッフ詳細</p>
                <div className="flex items-center gap-10">
                    <div className="w-[200px]">
                        <AvatarDisplay mediaId={data?.profile?.avatar} />
                    </div>
                    <div className="items-start">
                        <p className="font-medium text-2xl">{data?.profile?.fullname}</p>
                        <p className="font-bold">介護職</p>
                        <div className="flex items-center gap-4">
                            <p className="text-sm bg-white p-3 py-2 rounded-2xl">{getAgeFromDob(data?.profile?.dob)}</p>
                            <p className="bg-[#64D86C] text-sm text-amber-50 rounded-2xl p-1">支援中</p>
                        </div>
                    </div>
                </div>
                <Tabs defaultValue="conclusion" className="pt-8">
                    <TabsList className="bg-transparent gap-12 border-b-2 rounded-none pb-0 ">
                        <TabsTrigger className="font-bold data-[state=active]:bg-transparent" value="conclusion">
                            基本情報
                        </TabsTrigger>
                        <TabsTrigger className="font-bold data-[state=active]:bg-transparent" value="document-contract">
                            契約書管理
                        </TabsTrigger>
                        <TabsTrigger
                            className="font-bold data-[state=active]:bg-transparent"
                            value="document-confidentiality"
                        >
                            秘密保持誓約書
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="conclusion">
                        <Conclusion data={data} />
                    </TabsContent>
                    <TabsContent value="document-contract">
                        <DocumentContract staffId={id} />
                    </TabsContent>
                    <TabsContent value="document-confidentiality">
                        <DocumentConfidentiality
                            data={data}
                            documentConfidentiality={documentConfidentiality}
                            onChangeDocumentConfidentiality={setDocumentConfidentiality}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default withAuth(StaffDetail, ["admin", "manager"]);
