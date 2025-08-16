import { UserProps } from "./user";

type ManagerProps = {
  id: number;
  user_id: number;
  facility_id: number;
  role_id: number;
  facility_role: string;
  status: string;
  user: UserProps;
  facility: FacilityProps;
  role: RoleProps;
  created_at: string;
  updated_at: string;
};
