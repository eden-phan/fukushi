import { StaffProps } from "./staff";

type DocumentPaymentProps = {
  /**document */
  id: number;
  service_user_id: number;
  staff_id: number;
  document_date: string;
  document_type: string;
  file: number;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;

  /**document_metadata */
  payment_date: string;
  payment_place: string;
  payment_purpose: string;
  payment_amount: string;

  /**staff */
  staff: StaffProps;
};
