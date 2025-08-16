"use client";

import BackButton from "@/components/ui/back-button";
import React from "react";
import { cn } from "@/lib/utils";

export function HeadingPage({
  title,
  showBack = false,
  icon,
  className,
  url,
}: {
  title: string;
  showBack?: boolean;
  icon?: React.ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showBack && <BackButton url={url} />}
      {icon && <span>{icon}</span>}
      <h1 className="mt-8 text-2xl font-medium tracking-normal text-neutral-400">
        {title}
      </h1>
    </div>
  );
}
