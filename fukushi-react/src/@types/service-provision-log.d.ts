import { StaffProps } from "./staff";

type ServiceProvisionLogProps = {
  id: number;
  staff_id: number;
  staff: StaffProps;
  service_user_id: number;
  date: string;
  meal_provided: string;
  medication: string;
  wake_up_time: string;
  bed_time: string;
  daytime_activity: number;
  daytime_activity_content: string;
  condition: string;
  overnight_stay: string;
  hospital_facility: string;
  other_note: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};
