import { ServiceUserProps } from "./service-user";

type DocumentReceiveMoneyProps = {
  /**Document */
  id: number;
  document_date: string;
  service_user_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  service_user: ServiceUserProps;

  /**Document_metadata */
  family_member_id: string;
  service_provision_date: string;
  facility_id: string;
  receipt_date: string;
  receive_amount: string;
  total_cost: string;
  user_charge: string;

  /**Medias */
  file: number;
};
