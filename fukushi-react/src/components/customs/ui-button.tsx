"use client";

import { Button } from "../ui/button";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface UIResetFilterButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

interface UISubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

interface UIReturnButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

interface UICreateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

interface UIUnSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

interface UIEditButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

interface UICancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  url?: string;
}

interface UIAddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  url?: string;
}

interface UIUpdateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  url?: string;
}

interface UIRemoveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  url?: string;
}

function UIResetFilterButton({
  children = "リセット",
  className,
  ...props
}: UIResetFilterButtonProps) {
  return (
    <Button
      type="button"
      className={cn(
        "bg-gray-400 hover:bg-gray-500 flex items-center gap-1 rounded-[4px] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

function UICreateButton({
  children,
  className,
  ...props
}: UICreateButtonProps) {
  return (
    <Button
      type="button"
      className={cn(
        "bg-sky-500 hover:bg-sky-600 flex items-center gap-1 rounded-[4px] cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        <Plus className="w-5 h-5 text-white" />
        {children}
      </div>
    </Button>
  );
}

function UIReturnButton({
  children,
  className,
  ...props
}: UIReturnButtonProps) {
  return (
    <Button
      type="button"
      className={cn(
        "bg-gray-400 hover:bg-gray-500 rounded-[4px] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

function UIRemoveButton({ children = "削除", ...props }: UIRemoveButtonProps) {
  return (
    <Button
      size={"tight"}
      variant={"noneOutline"}
      className="text-xs text-destructive hover:!bg-destructive/10 hover:!text-destructive"
      {...props}
    >
      {children}
    </Button>
  );
}

function UIUpdateButton({
  children = "詳細",
  url,
  className,
  ...props
}: UIUpdateButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <Button
      size={"tight"}
      variant={"noneOutline"}
      className={cn("text-xs text-blue-bright", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

function UISubmitButton({
  children,
  className,
  ...props
}: UISubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        "bg-sky-500 hover:bg-sky-600 rounded-[4px] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

function UIUnSubmitButton({ children, ...props }: UIUnSubmitButtonProps) {
  return (
    <Button
      type="button"
      className="bg-gray-400 hover:bg-gray-500 rounded-[4px] cursor-pointer"
      {...props}
    >
      {children}
    </Button>
  );
}

function UIEditButton({ children, className, ...props }: UIEditButtonProps) {
  return (
    <Button
      type="button"
      className={cn(
        "bg-sky-500 hover:bg-sky-600 rounded-[4px] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

function UICancelButton({ children, className, url }: UICancelButtonProps) {
  const router = useRouter();
  return (
    <Button
      type="button"
      className={cn(
        "bg-gray-400 hover:bg-gray-500 rounded-[4px] cursor-pointer",
        className
      )}
      onClick={() => (url ? router.push(url) : router.back())}
    >
      {children}
    </Button>
  );
}

function UIAddButton({ children, url, className }: UIAddButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <Button
      className={cn(
        "bg-sky-500 hover:bg-sky-600 flex items-center gap-1 rounded-[4px] cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        <Plus className="w-5 h-5 text-white" />
        {children}
      </div>
    </Button>
  );
}

export {
  UISubmitButton,
  UICancelButton,
  UIAddButton,
  UIEditButton,
  UIUnSubmitButton,
  UIUpdateButton,
  UIRemoveButton,
  UIReturnButton,
  UICreateButton,
  UIResetFilterButton,
};
