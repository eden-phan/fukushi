"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
type Props = {
  handleAddItem: () => void;
}

const CustomAddBtn = ({ handleAddItem }: Props) => {
  return (
    <Button
      className="bg-sky-500 hover:bg-sky-600 ml-auto rounded-[4px]"
      onClick={handleAddItem}
    >
      <Plus className="w-5 h-5 text-white" />
      新規追加
    </Button>
  );
}

export default CustomAddBtn