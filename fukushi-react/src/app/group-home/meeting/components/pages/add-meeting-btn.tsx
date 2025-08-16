"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddMeetingBtn() {
    const router = useRouter()
    return (
        <Button
            className="bg-sky-500 hover:bg-sky-600 gap-1 rounded-[4px] ml-auto"
            onClick={() => router.push("/group-home/meeting/add")}
        >
            <Plus className="w-5 h-5 text-white" />
            新規追加
        </Button>
    )
}
