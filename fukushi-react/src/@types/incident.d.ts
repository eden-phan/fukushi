import { StaffProps } from "./staff";

type IncidentProps = {
  id: number;
  reporter_id: number;
  reporter: StaffProps;
  service_user_id: number;
  report_date: string;
  incident_date: string;
  location: string;
  incident_type: string;
  incident_detail: string;
  response: string;
  prevent_plan: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};
