"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { facilityOptions, managerStatusOptions } from "@/lib/selections";

type FilterManagerProps = {
  keyword: string;
  onKeywordChange: (search: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  facilityFilter: string;
  onFacilityFilterChange: (facilityName: string) => void;
};

export default function FilterManager({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  facilityFilter,
  onFacilityFilterChange,
}: FilterManagerProps) {
  return (
    <>
      <Input
        placeholder="キーワードを入力"
        className="w-64 rounded-[50px] bg-white"
        value={keyword}
        onChange={(e) => {
          onKeywordChange(e.target.value);
        }}
      />

      <Select value={facilityFilter} onValueChange={onFacilityFilterChange}>
        <SelectTrigger className="w-[180px] bg-white rounded-[50px]">
          <SelectValue placeholder="所属事業所" />
        </SelectTrigger>
        <SelectContent>
          {facilityOptions.map((facility) => {
            return (
              <SelectItem key={facility.value} value={String(facility.value)}>
                {facility.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px] bg-white rounded-[50px]">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          {managerStatusOptions.map((status) => {
            return (
              <SelectItem key={status.value} value={String(status.value)}>
                {status.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
