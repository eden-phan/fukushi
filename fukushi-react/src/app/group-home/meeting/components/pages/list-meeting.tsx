"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Ellipsis } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    UITable,
    UITableHeader,
    UITableBody,
    UITableHead,
    UITableRow,
    UITableCell,
    UITableCaption,
} from "@/components/customs/ui-table"
import { DeleteMeetingDialog } from "@/app/group-home/meeting/components/dialogs/delete-meeting-dialog"
import { cn, formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import UIPagination from "@/components/ui/pagination-component"
import { UISkeleton } from "@/components/customs/ui-skeleton"
import { formatTime } from "@/lib/utils"
import { MeetingProps } from "@/@types/meeting"

type ListMeetingProps = {
    data: PaginatedResponse<MeetingProps> | undefined
    loading: boolean
    onPageChange: (page: number) => void
    onRefresh: () => void
    currentPage: number
}

export default function ListMeeting({ data, loading, onPageChange, onRefresh, currentPage }: ListMeetingProps) {
    const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<MeetingProps | null>(null)
    const router = useRouter()

    const handleView = (item: MeetingProps) => {
        router.push(`/group-home/meeting/${item.id}`)
    }

    const handleEdit = (item: MeetingProps) => {
        router.push(`/group-home/meeting/edit/${item.id}`)
    }

    const handleDelete = (item: MeetingProps) => {
        setSelectedItem(item)
        setIsOpenDelDialog(true)
    }

    return (
        <div className="p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
            <UITable>
                <UITableCaption>
                    <div className="flex">
                        <p className="text-neutral">
                            {data?.total || 0} 件中 {data?.from || 0} から {data?.to || 0} まで表示
                        </p>
                    </div>
                </UITableCaption>
                <UITableHeader>
                    <UITableRow>
                        <UITableHead>ID</UITableHead>
                        <UITableHead>テーマ</UITableHead>
                        <UITableHead>開催日</UITableHead>
                        <UITableHead>開催時間</UITableHead>
                        <UITableHead>開催場所</UITableHead>
                        <UITableHead>操作</UITableHead>
                    </UITableRow>
                </UITableHeader>
                {loading ? (
                    <UITableBody>
                        {Array.from({ length: 10 }).map((_, rowIndex) => (
                            <UITableRow key={rowIndex}>
                                {Array.from({ length: 8 }).map((_, cellIndex) => (
                                    <UITableCell key={cellIndex}>
                                        <UISkeleton />
                                    </UITableCell>
                                ))}
                            </UITableRow>
                        ))}
                    </UITableBody>
                ) : (
                    <UITableBody>
                        {data?.data && Array.isArray(data.data) && data.data.length > 0 ? (
                            data.data.map((item: MeetingProps) => (
                                <UITableRow key={item.id}>
                                    <UITableCell>{item.id}</UITableCell>
                                    <UITableCell>
                                        <div className="truncate max-w-48" title={item.theme}>
                                            {item.theme || "-"}
                                        </div>
                                    </UITableCell>
                                    <UITableCell>{formatDate(item.date)}</UITableCell>
                                    <UITableCell>
                                        {formatTime(item.start_time)} {"-"} {formatTime(item.end_time)}
                                    </UITableCell>
                                    <UITableCell>
                                        <div className="truncate max-w-32" title={item.location}>
                                            {item.location || "-"}
                                        </div>
                                    </UITableCell>
                                    <UITableCell>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-bright hover:text-blue-700"
                                                onClick={() => handleView(item)}
                                            >
                                                {/* <Eye size={16} /> */}
                                                詳細
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size={"tight"} variant={"ellipsis"}>
                                                        <Ellipsis size={16} strokeWidth={1} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                        {/* <Edit size={16} className="mr-2" /> */}
                                                        編集
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className={cn(
                                                            "text-destructive",
                                                            "hover:!bg-destructive/10 hover:!text-destructive"
                                                        )}
                                                        onClick={() => handleDelete(item)}
                                                    >
                                                        {/* <Trash2 size={16} className="mr-2" /> */}
                                                        削除
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </UITableCell>
                                </UITableRow>
                            ))
                        ) : (
                            <UITableRow>
                                <UITableCell className="text-center" colSpan={7}>
                                    データがありません
                                </UITableCell>
                            </UITableRow>
                        )}
                    </UITableBody>
                )}
            </UITable>

            <UIPagination currentPage={currentPage} totalPages={data?.last_page || 1} onPageChange={onPageChange} />

            <DeleteMeetingDialog
                open={isOpenDelDialog}
                onOpenChange={setIsOpenDelDialog}
                item={selectedItem}
                onSuccess={onRefresh}
            />
        </div>
    )
}
