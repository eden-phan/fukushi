export interface AssessmentProps {
  id: string
  reception_number?: string
  service_user_id: number
  staff_id?: number
  home_visit_dates?: string[]
  outpatient_visit_dates?: string[]
  phone_contact_dates?: string[]
  life_history?: string
  physical_disability_type?: string
  physical_disability_grade?: string
  intellectual_disability_code?: string
  mental_disability_grade?: string
  has_no_certificate?: boolean
  has_basic_disability_pension?: boolean
  basic_disability_grade?: string
  has_welfare_disability_pension?: boolean
  welfare_disability_grade?: string
  has_national_pension?: boolean
  has_other_pension?: boolean
  other_pension_details?: string
  receives_welfare?: boolean
  disability_support_level?: string
  medical_info?: string
  medication_detail?: string
  insurance_type?: string
  insured_person_relation?: string
  insurance_symbol?: string
  pension_type?: string
  pension_other_detail?: string
  current_assistive_device?: string
  daily_routine_self?: string
  daily_routine_caregiver?: string
  desired_life_user?: string
  desired_life_family?: string
  other_information?: string
  house_owned?: boolean
  house_type_other?: string
  note?: string
  created_by?: number
  created_at?: string
  updated_at?: string
  service_user?: {
    id: number
    profile?: {
      fullname: string
    }
    medical_disability_history?: MedicalDisabilityHistoryProps[]
  }
  living_domains?: LivingDomainProps[]
  staff?: {
    id: number
    profile?: {
      fullname: string
    }
  }
  creator?: {
    id: number
    profile?: {
      fullname: string
    }
  }
}

export interface LivingDomainProps {
  id: number
  assessment_id: number
  key: string
  current_status?: string
  preference?: string
  support_needed?: string
  environment_limitations_notes?: string
  abilities_limitations_notes?: string
  created_at?: string
  updated_at?: string
}

export interface MedicalDisabilityHistoryProps {
  id: number
  service_user_id: number
  date: string
  detail: string
  created_at?: string
  updated_at?: string
}

export interface VisitDateItem {
  month: string
  day: string
}

export interface FormAssessmentData {
  reception_number: string
  staff_id: string
  service_user_id: string
  home_visit_dates: VisitDateItem[]
  outpatient_visit_dates: VisitDateItem[]
  phone_contact_dates: VisitDateItem[]
  life_history: string
  physical_disability_type: string
  physical_disability_grade: string
  intellectual_disability_code: string
  mental_disability_grade: string
  has_no_certificate: boolean
  has_basic_disability_pension: boolean
  basic_disability_grade: string
  has_welfare_disability_pension: boolean
  welfare_disability_grade: string
  has_national_pension: boolean
  has_other_pension: boolean
  other_pension_details: string
  receives_welfare: boolean
  disability_support_level: string
  medical_history: string
  medical_info: string
  medication_detail: string
  insurance_type: string
  insured_person_relation: string
  insurance_symbol: string
  pension_type: string
  pension_other_detail: string
  current_assistive_device: string
  daily_routine_self: string
  daily_routine_caregiver: string
  desired_life_user: string
  desired_life_family: string
  other_information: string
  house_owned: boolean
  house_type_other: string
  note: string
  living_domains: LivingDomainFormData[]
}

export interface LivingDomainFormData {
  id?: number
  key: string
  current_status: string
  preference: string
  needs_support: string
  abilities_limitations_notes: string
  environment_limitations_notes: string
}
