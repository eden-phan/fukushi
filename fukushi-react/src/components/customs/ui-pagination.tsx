"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type UIPaginationProps = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

export default function UIPagination({
  currentPage,
  lastPage,
  onPageChange,
}: UIPaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const delta = 2;

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(lastPage, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  return (
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
                page === currentPage &&
                  "bg-sky-500 hover:bg-sky-600 text-white hover:text-white"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {lastPage > 5 && currentPage < lastPage - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className={cn(
              "cursor-pointer border border-sky-500 text-sky-500 hover:text-sky-500",
              currentPage === lastPage && "opacity-50 cursor-not-allowed"
            )}
            icon={<ChevronsRight />}
            onClick={() =>
              currentPage < lastPage && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
