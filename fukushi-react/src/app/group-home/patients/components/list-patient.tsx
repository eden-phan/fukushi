'use client';
import { UISkeleton } from '@/components/customs/ui-skeleton';
import { UITable, UITableBody, UITableCaption, UITableCell, UITableHead, UITableHeader, UITableRow } from '@/components/customs/ui-table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn, formatDate, getGenderLabel, getPatientStatusLabel } from '@/lib/utils';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
    patients: PaginatedResponse<patientProps> | undefined;
    loading: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const ListPatient = ({ patients, loading, currentPage, onPageChange }: Props) => {

    const generatePageNumbers = () => {
        if (!patients) return [];

        const { current_page, last_page } = patients;
        const pages = [];
        const delta = 2;

        for (
            let i = Math.max(1, current_page - delta);
            i <= Math.min(last_page, current_page + delta);
            i++
        ) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className=" p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
            <UITable>
                <UITableCaption>
                    <div className="flex">
                        <p className="text-neutral">
                            {patients?.total || 0} 件中 {patients?.from || 0} から {patients?.to || 0}{" "}
                            まで表示
                        </p>
                    </div>
                </UITableCaption>
                <UITableHeader>
                    <UITableRow>
                        <UITableHead>利用者ID</UITableHead>
                        <UITableHead>氏名</UITableHead>
                        <UITableHead>フリガナ</UITableHead>
                        <UITableHead>生年月日</UITableHead>
                        <UITableHead>性別</UITableHead>
                        <UITableHead>ステータス</UITableHead>
                        <UITableHead></UITableHead>
                    </UITableRow>
                </UITableHeader>
                <UITableBody>
                    {loading ? (
                        <>
                            {Array.from({ length: 3 }).map((_, rowIndex) => (
                                <UITableRow key={rowIndex}>
                                    {Array.from({ length: 1 }).map((_, cellIndex) => (
                                        <UITableCell key={cellIndex}>
                                            <UISkeleton />
                                        </UITableCell>
                                    ))}
                                </UITableRow>
                            ))}
                        </>
                    ) : patients?.data.length === 0 ? (
                        <UITableRow className="hover:bg-transparent">
                            <UITableCell colSpan={8} className="p-0 pt-9 text-gray-400 text-center">
                                データなし
                            </UITableCell>
                        </UITableRow>
                    ) : (
                        <>
                            {patients?.data.map((item) => (
                                <UITableRow key={item?.id}>
                                    <UITableCell>{item?.id}</UITableCell>
                                    <UITableCell>{item?.profile?.fullname}</UITableCell>
                                    <UITableCell>{item?.profile?.furigana}</UITableCell>
                                    <UITableCell>{formatDate(item?.profile?.dob)}</UITableCell>
                                    <UITableCell>{getGenderLabel(item?.profile?.gender)}</UITableCell>
                                    <UITableCell
                                        className={
                                            Number(item.profile?.status) % 2 === 0
                                                ? "text-green-lime"
                                                : "text-red-bright"
                                        }
                                    >
                                        {getPatientStatusLabel(item.profile?.status)}
                                    </UITableCell>
                                    <UITableCell>
                                        <Link className="text-blue-bright hover:text-blue-700" href={`/group-home/patients/${item?.id}`}>
                                            詳細
                                        </Link>
                                    </UITableCell>
                                </UITableRow>
                            ))}
                        </>
                    )}
                </UITableBody>

            </UITable>

            {patients && patients.last_page > 1 && (
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    icon={<ChevronsLeft />}
                                    className={cn(
                                        "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                                        currentPage === 1 && "opacity-50 cursor-not-allowed"
                                    )}
                                    onClick={() =>
                                        currentPage > 1 && onPageChange(currentPage - 1)
                                    }
                                />
                            </PaginationItem>

                            {generatePageNumbers().map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        className={cn(
                                            "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                                            page === currentPage &&
                                            "bg-sky-500 hover:bg-sky-600 text-white hover:text-white"
                                        )}
                                        onClick={
                                            () => onPageChange(page)
                                        }
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>

                            ))}


                            {patients.last_page > 5 && currentPage < patients.last_page - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    className={cn(
                                        "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                                        currentPage === patients.last_page &&
                                        "opacity-50 cursor-not-allowed"
                                    )}
                                    icon={<ChevronsRight />}
                                    onClick={() =>
                                        currentPage < patients.last_page &&
                                        onPageChange(currentPage + 1)
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}

export default ListPatient