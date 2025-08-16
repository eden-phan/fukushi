type StaffProps = {
  work_shift: StaffReason | null | undefined;
  work_type: StaffWorkTypeEnum;
  start_date: string;
  employment_type: EmployeeTypeEnum;
  facility_user: FacilityUserProps;
  id: string;
  name: string;
  email: string;
  profile: ProfileProps;
};
