import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

type ChildrenClassNameProps = {
    children?: ReactNode
    className?: string
    colSpan?: number
}

function UITable({ children, className = "" }: ChildrenClassNameProps) {
    return <Table className={className}>{children}</Table>
}

function UITableHeader({ children, className = "" }: ChildrenClassNameProps) {
    return <TableHeader className={className}>{children}</TableHeader>
}

function UITableBody({ children, className = "" }: ChildrenClassNameProps) {
    return <TableBody className={className}>{children}</TableBody>
}

function UITableFooter({ children, className = "" }: ChildrenClassNameProps) {
    return <TableFooter className={className}>{children}</TableFooter>
}

function UITableCaption({ children, className = "" }: ChildrenClassNameProps) {
    return <TableCaption className={className}>{children}</TableCaption>
}

function UITableRow({ children, className = "" }: ChildrenClassNameProps) {
    return <TableRow className={className}>{children}</TableRow>
}

function UITableHead({ children, className = "" }: ChildrenClassNameProps) {
    return <TableHead className={cn("p-4", className)}>{children}</TableHead>
}

function UITableCell({ children, className = "", colSpan = 1 }: ChildrenClassNameProps) {
    return (
        <TableCell colSpan={colSpan} className={cn("p-4 text-xs", className)}>
            {children}
        </TableCell>
    )
}

export {
  UITable,
  UITableHeader,
  UITableBody,
  UITableFooter,
  UITableHead,
  UITableRow,
  UITableCell,
  UITableCaption,
};
