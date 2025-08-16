import { ProfileProps } from "./profile";

type ServiceUserProps = {
  id: number;
  certificate_number: string;
  facility_id: number;
  service_user_profile: ProfileProps;
  created_at: string;
  updated_at: string;
};

type ServiceUserOptionProps = {
  user_id: number;
  fullname: string;
  certificate_number: string;
};
