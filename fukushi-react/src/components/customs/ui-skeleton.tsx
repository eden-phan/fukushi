import { Skeleton } from "@/components/ui/skeleton";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type UISkeletonProps = {
  className?: string;
} & ComponentProps<typeof Skeleton>;

function UISkeleton({ className = "", ...props }: UISkeletonProps) {
  return (
    <Skeleton className={cn("h-6 w-[100px] rounded", className)} {...props} />
  );
}

export { UISkeleton };
