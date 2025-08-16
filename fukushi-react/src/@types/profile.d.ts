import { CompanyEnum, GenderEnum } from "@/lib/enum";
import { PatientStatusEnum, ManagerStatusEnum } from "@/lib/enum";

type ProfileProps = {
  id: string;
  address: string;
  gender: GenderEnum;
  dob: string;
  furigana: string;
  fullname: string;
  phone_number: string;
  company: CompanyEnum;
  role_id: string;
  status: PatientStatusEnum | ManagerStatusEnum;
  district: string;
  prefecture: string;
  postal_code: string;
  user_id: number;
};
