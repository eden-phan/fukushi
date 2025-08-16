type ConsultationProps = {
  id: number;
  facility_id: number;

  // Basic information
  date: string;
  furigana: string;
  full_name: string;
  method: string;
  transit_agency: string;
  staff_id: number;
  gender: number;

  // User information
  disability_certificate_type: string;
  disability_category: number;
  disability_level: number;
  dob: string;
  postal_code: string;
  prefecture: string;
  district: string;
  address: string;
  telephone: string;
  fax: string;
  disability_name: string;

  // Consultant information
  consultant_name: string;
  consultant_relationship: string;
  consultant_postal_code: string;
  consultant_prefecture: string;
  consultant_district: string;
  consultant_street: string;
  consultant_telephone: string;
  consultant_fax: string;

  // Other contact information
  other_contact_fullname: string;
  other_contact_address: string;
  other_contact_telephone: string;
  other_contact_fax: string;

  // Consultation content
  consultation_content: string;
  current_services: string;
  desired_use_status: number;
  desired_admission_date: string;
  note: string;
  response_status: number;
  referral_facility_id: number;
  home_visit_schedule: string;
  next_visit_schedule: string;

  facility: FacilityProps;
  referral_facility: FacilityProps;

  // Accept status
  accept_status: number;
};
