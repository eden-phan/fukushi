"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
function BackButton({ url }: { url?: string }) {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      size="icon"
      className="size-8"
      onClick={() => (url ? router.push(url) : router.back())}
    >
      <ChevronLeftIcon />
    </Button>
  );
}

export default BackButton;
