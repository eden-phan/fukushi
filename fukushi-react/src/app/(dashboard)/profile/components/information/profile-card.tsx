import React from 'react'
import { UIEditButton } from '@/components/customs/ui-button';
import { mediaService } from "@/services/media"
import { useEffect, useState } from "react"
import { CircleUser } from "lucide-react"
import Image from "next/image"

type items = {
    label: string
    value: string | undefined
    className?: string
}

type Props = {
    data?: StaffProps
    setIsEditMode: (arg0: boolean) => void
}

const Item = ({ label, value, className }: items) => (
    <div className={`grid grid-cols-[160px_1fr] ${className ?? ""}`}>
        <p className="font-semibold">{label}</p>
        <p>{value}</p>
    </div>
)

export const AvatarDisplay = ({ mediaId, size = 200 }: { mediaId?: number | null; size?: number }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        if (mediaId) {
            mediaService
                .getById(mediaId)
                .then((media) => setAvatarUrl(media.path))
                .catch((error) => {
                    console.error("Failed to load avatar:", error)
                    setAvatarUrl(null)
                })
        } else {
            setAvatarUrl(null)
        }
    }, [mediaId])

    if (avatarUrl) {
        return (
            <div className="overflow-hidden rounded-full border border-border" style={{ width: size, height: size }}>
                <Image
                    src={avatarUrl}
                    alt="Profile Avatar"
                    className="object-cover w-full h-full"
                    width={1000}
                    height={1000}
                />
            </div>
        )
    }

    return <CircleUser width={size} height={size} color="#c3c8cb" strokeWidth={1} />
}

const ProfileCard = ({ data, setIsEditMode }: Props) => {
    return (
        <div className="gap-36 justify-center">
            <div className="text-end">
                <UIEditButton
                    onClick={() => {
                        setIsEditMode(true)
                    }}
                >
                    無効化
                </UIEditButton>
            </div>
            <div className="mt-8">
                <div className="items-start mb-8">
                    <div className="w-1/2">
                        <AvatarDisplay mediaId={data?.profile?.avatar} />
                    </div>
                </div>
                <div className="">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-16">
                        <Item label="氏名" value={data?.profile?.fullname} />
                        <Item label="社員番号" value={data?.id} />
                        <Item label="ふりがな" value={data?.profile?.furigana} />
                        <Item label="生年月日" value={data?.profile?.dob} />
                        <Item label="性別" value={data?.profile?.gender} />
                        <Item label="年齢" value="25歳" />
                        <Item label="電話番号" value="090-1234-5678" />
                        <Item label="メールアドレス" value={data?.email} />
                        <Item label="住所" value={data?.profile?.address} />
                    </div>

                    <h2 className="font-bold mb-4">雇用情報</h2>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-16">
                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">職種</p>
                            <p>介護職</p>
                        </div>
                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">入職日</p>
                            <p>2023/04/01</p>
                        </div>
                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">雇用形態</p>
                            <p>正社員</p>
                        </div>
                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">勤務状況</p>
                            <p className="text-green-600">在職中</p>
                        </div>

                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">勤務シフト</p>
                            <p>早番</p>
                        </div>
                    </div>

                    <h2 className="font-bold mb-4">緊急連絡先</h2>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-16">
                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">氏名（名前）</p>
                            <p>佐藤 一郎</p>
                        </div>
                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">続柄</p>
                            <p>父</p>
                        </div>
                        <div className="grid grid-cols-[160px_1fr]">
                            <p className="font-semibold">電話番号</p>
                            <p>080-9876-5432</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard