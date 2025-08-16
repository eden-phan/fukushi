import { FacilityStatusEnum } from "@/lib/enum";

type FacilityProps = {
  status: FacilityStatusEnum;
  id: string;
  name: string;
  service_type: string;
  facility_type: string;
  postal_code: string;
  prefecture: string;
  district: string;
  address: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type FacilityUserProps = {
  facility: FacilityProps;
  facility_role?: string | null;
};
