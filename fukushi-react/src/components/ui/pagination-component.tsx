"use client"

import { ChevronsLeft, ChevronsRight } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

type PaginationComponentProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    showIfOnlyOne?: boolean
}

export default function UIPagination({
    currentPage,
    totalPages,
    onPageChange,
    showIfOnlyOne = false,
}: PaginationComponentProps) {
    const generatePageNumbers = () => {
        const pages = []
        const delta = 2

        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            pages.push(i)
        }

        return pages
    }

    if (!showIfOnlyOne && totalPages <= 1) {
        return null
    }

    return (
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
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        />
                    </PaginationItem>

                    {generatePageNumbers().map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                className={cn(
                                    "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                                    page === currentPage && "bg-sky-500 hover:bg-sky-600 text-white hover:text-white"
                                )}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            className={cn(
                                "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
                                currentPage === totalPages && "opacity-50 cursor-not-allowed"
                            )}
                            icon={<ChevronsRight />}
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
