"use client";
import React, { useState } from 'react';
import {
    UITable,
    UITableHeader,
    UITableBody,
    UITableHead,
    UITableRow,
    UITableCell,
    UITableCaption,
} from "@/components/customs/ui-table";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DepositItemModal from './deposit-item-modal';
import { UISkeleton } from '@/components/customs/ui-skeleton';
import UIPagination from '@/components/customs/ui-pagination';
import { UIDeleteDialog } from '@/components/customs/delete-dialog';
import http from "@/services/http";

type Props = {
    data: PaginatedResponse<DepositItemProps> | undefined;
    onRefresh: () => void;
    loading: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
};

const ListDepositItem = ({ data, onRefresh, loading, currentPage, onPageChange }: Props) => {

    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectId, setSelectId] = useState<string>();
    const [detailData, setDetailData] = useState<DepositItemProps>();
    const [loadingDetail, setLoadingDetail] = useState(false);

    const handleOpenAdd = () => {
        setEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = async (id: string) => {
        setLoadingDetail(true);
        try {
            const res = await http.get(`/deposit/item-detail/${id}`);
            setDetailData(res.data.data);
            setEdit(true);
            setOpen(true);
            setSelectId(id);
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <>
            <DepositItemModal
                selectId={selectId}
                open={open}
                setOpen={setOpen}
                edit={edit}
                onRefresh={onRefresh}
                detailData={detailData}
                loadingDetail={loadingDetail}                
            />
            <div className="w-full flex items-end justify-end pb-4">
                <Button onClick={handleOpenAdd} variant="formSubmit" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    新規追加
                </Button>
            </div>
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
                            <UITableHead>預かり品名</UITableHead>
                            <UITableHead>数量</UITableHead>
                            <UITableHead>預かり日</UITableHead>
                            <UITableHead>返却先</UITableHead>
                            <UITableHead>備考</UITableHead>
                            <UITableHead></UITableHead>
                        </UITableRow>
                    </UITableHeader>
                    <UITableBody>
                        {loading ? (
                            <>
                                {Array.from({ length: 10 }).map((_, rowIndex) => (
                                    <UITableRow key={rowIndex}>
                                        {Array.from({ length: 4 }).map((_, cellIndex) => (
                                            <UITableCell key={cellIndex}>
                                                <UISkeleton />
                                            </UITableCell>
                                        ))}
                                    </UITableRow>
                                ))}
                            </>
                        )
                            : data?.data.length === 0 ? (
                                <UITableRow className="hover:bg-transparent">
                                    <UITableCell
                                        colSpan={4}
                                        className="p-0 pt-9 text-gray-400 text-center"
                                    >
                                        データなし
                                    </UITableCell>
                                </UITableRow>
                            )
                                : (data?.data.map(item => (
                                    <UITableRow key={item.id}>
                                        <UITableCell className="truncate">{item.name}</UITableCell>
                                        <UITableCell className="truncate">{item.amount}</UITableCell>
                                        <UITableCell>{item.deposit_date}</UITableCell>
                                        <UITableCell>{item.return_address}</UITableCell>
                                        <UITableCell className="truncate">
                                            {(item.note || "").length > 30 ? item.note?.slice(0, 30) + '...' : item.note}
                                        </UITableCell>
                                        <UITableCell className='p-0'>
                                            <div className="flex items-center">
                                                <Button
                                                    className='text-blue-400'
                                                    variant='ellipsis'
                                                    onClick={() => handleOpenEdit(item.id)}
                                                >
                                                    無効化
                                                </Button>
                                                <UIDeleteDialog api={`/deposit/deposit-items/${item.id}`} onDeleted={onRefresh} />
                                            </div>
                                        </UITableCell>
                                    </UITableRow>
                                ))

                                )}
                    </UITableBody>
                </UITable>
            </div>
            <div>
                {data && data.last_page > 1 && (
                    <div className="mt-4">
                        <UIPagination
                            currentPage={currentPage}
                            lastPage={data.last_page}
                            onPageChange={onPageChange}
                        ></UIPagination>
                    </div>
                )}
            </div>
        </>
    )
}

export default ListDepositItem