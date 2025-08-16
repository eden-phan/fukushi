type DocumentConsentProps = {
  id: number;
  service_user_id: string;
  family_member_id: string;
  staff_id: string;
  document_date: string;
  document_type: string;
  file: number;
  status: string;
  start_date: string;
  end_date: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  profile: ProfileProps;
  agent: FamilyMemberProps;
};

type UserOptionDocumentConsentProps = {
  service_user_id: number;
  profile_name: string;
};

type FamilyOptionDocumentConsentProps = {
  family_member_id: number;
  family_member_name: string;
};
