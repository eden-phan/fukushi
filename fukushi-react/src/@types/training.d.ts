import { SessionRecordEnum } from "@/lib/enum"

type TrainingProps = {
    id: number
    record_type: SessionRecordEnum
    theme: string
    date: string
    start_time: string
    end_time: string
    location: string
    content: string
    feedback: string
    signature?: {
        admin_signature?: string
        child_support_manager_signature?: string
        recorder_signature?: string
    }
}