import { StaffProps } from "./staff";
import { UserProps } from "./user";

export interface IDailyReportServiceUser {
  id: number;
  daily_report_id: number;
  service_user_id: number;
  overnight_stay?: boolean;
  hospitalized?: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  service_user: UserProps;
}

export interface IDailyReportStaff {
  id: number;
  daily_report_id: number;
  staff_id: number;
  work_content?: string;
  shift_type: "day_shift" | "night_shift";
  shift_hours?: string[];
  created_by: number;
  created_at: string;
  staff: StaffProps;
}

export interface IDailyReportProps {
  id: number;
  entry_date: string;
  day_shift_staff_id?: number;
  night_shift_staff_id?: number;
  support_content?: string;
  work_details?: string;
  note?: string;
  night_shift_note?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  day_shift_staff?: UserProps;
  night_shift_staff?: UserProps;
  daily_report_staffs: IDailyReportStaff[];
  daily_report_service_users: IDailyReportServiceUser[];
  signatures: {
    signature_type: "admin" | "service_manager" | "life_support_staff" | "caregiver";
    signature_value: string;
  }[];
}

export interface IFilterDailyReportProps {
  keyword: string;
  onKeywordChange: (search: string) => void;
  shiftType: string;
  onShiftTypeChange: (shiftType: string) => void;
  onReset: () => void;
  onSearch: () => void;
}

export interface IListDailyReportProps {
  data: PaginatedResponse<IDailyReportProps> | undefined;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface IFetchParams {
  keyword: string;
  page: number;
  work_shift?: string;
}
