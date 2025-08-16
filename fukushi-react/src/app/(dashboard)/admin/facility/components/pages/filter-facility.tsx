"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { facilityStatusOptions, facilityTypeOptions } from "@/lib/selections";

type FacilityProps = {
  keyword: string;
  onKeywordChange: (search: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  facilityTypeFilter: string;
  onFacilityTypeFilterChange: (facilityName: string) => void;
};

export default function FilterFacility({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  facilityTypeFilter,
  onFacilityTypeFilterChange,
}: FacilityProps) {
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

      <Select
        value={facilityTypeFilter}
        onValueChange={onFacilityTypeFilterChange}
      >
        <SelectTrigger className="w-[180px] bg-white rounded-[50px]">
          <SelectValue placeholder="事業種別" />
        </SelectTrigger>
        <SelectContent>
          {facilityTypeOptions.map((type) => {
            return (
              <SelectItem key={type.value} value={String(type.value)}>
                {type.label}
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
          {facilityStatusOptions.map((status) => {
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
