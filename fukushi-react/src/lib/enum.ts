export enum FacilityEnum {
  TypeAContinuousEmploymentSupport = "就労継続支援A型",
  TypeBContinuousEmploymentSupport = "就労継続支援B型",
  GroupHome = "グループホーム",
  ShortStay = "ショートステイ",
  ChildDevelopmentSupportOffice = "児童発達支援事業所",
  AfterSchoolDayCareService = "放課後等デイサービス",
  ConsultationSupportOffice = "相談支援事業所",
}

export enum FacilityServiceTypeEnum {
  ComprehensiveCareType = "comprehensive_care_type",
  DaytimeSupportType = "daytime_support_type",
  ExternalType = "external_type",
}

export enum FacilityIdEnum {
  TypeAContinuousEmploymentSupport = 1,
  TypeBContinuousEmploymentSupport,
  GroupHome,
  ShortStay,
  ChildDevelopmentSupportOffice,
  AfterSchoolDayCareService,
  ConsultationSupportOffice,
}

export enum FacilityTypeEnum {
  TypeAContinuousEmploymentSupport = "type_a_continuous_employment_support",
  TypeBContinuousEmploymentSupport = "type_b_continuous_employment_support",
  GroupHome = "group_home",
  ShortStay = "short_stay",
  ChildDevelopmentSupportOffice = "child_development_support_office",
  AfterSchoolDayCareService = "after_school_day_care_service",
  ConsultationSupportOffice = "consultation_support_office",
}

export enum FacilityStatusEnum {
  Stop,
  Open,
}

export enum LivingStatusEnum {
  Together,
  Separate,
}

export enum MealProvidedEnum {
  Morning = "moring",
  Noon = "noon",
  Night = "night",
}

export enum MedicationProvisionLogEnum {
  BeforeMeals = "before_meals",
  AfterMeals = "after_meals",
  BetweenMeals = "between_meals",
  Morning = "morning",
  Noon = "noon",
  Evening = "evening",
}

export enum ConsultationAcceptStatusEnum {
  Pending = 1,
  Accepted,
  Rejected,
}

export enum NearMissesTypeEnum {
  FallOrTripping = "fall_tripping",
  IngestionOrSwallowing = "ingestion_or_swallowing",
  MisadministrationOfMedication = "misadministration_of_medication",
  GoingoutWithoutPermission = "goingout_without_permission",
  Missing = "missing",
  ViolentBehavior = "violent_behavior",
  AccidentsAtWork = "accidents_at_work",
  TrafficAccidents = "traffic_accidents",
  Infringement = "infringement",
  Others = "others",
}

export enum ConsultationMethodEnum {
  Visit = "visit",
  Phone = "phone",
  letter = "letter",
  Fax = "fax",
}

export enum DisabilityCerfiticateTypeEnum {
  PhysicallyDisability = "physically_disability",
  DevelopmentalDisability = "developmental_disability",
  MentalHealthAndWelfare = "mental_health_and_welfare",
  None = "none",
}

export enum DesiredUseStatusEnum {
  Undecided = 1,
  Ready,
  NotReady,
}

export enum GenderEnum {
  Female,
  Male,
}

export enum PatientStatusEnum {
  Active,
  Expired,
}

export enum StaffStatusEnum {
  Active,
  Expired,
}

export enum DocumentTypeEnum {
  EmploymentContract = "0",
  DataProtection = "1",
}

export enum SupportPlanStatusEnum {
  Active,
  Expired,
}

export enum SupportPlanRateEnum {
  Active,
  Expired,
}

export enum EmployeeTypeEnum {
  Partime,
  Fulltime,
}

export enum ManagerStatusEnum {
  MaternityLeave = 1,
  ChildcareLeave,
  NursingCareLeave,
  ChildcareReduce,
  RegularWork,
  Invalid,
}

export enum DepositStatusEnum {
  Deposit,
  Returned,
}

export enum CompanyEnum {
  facility1 = 1,
  facility2 = 2,
  facility3 = 3,
}

export enum SessionRecordEnum {
  training = "training",
  meeting = "meeting",
}

export enum DocumentConsentStatusEnum {
  Valid,
  Ended,
}

export enum StaffReason {
  出産休暇 = 1,
  育児休暇,
  介護休暇,
  育児介護時短制度,
  通常勤務,
  無効
}

export enum StaffWorkTypeEnum {
  サービス管理責任者 = 1,
  世話人,
  生活支援員,
  夜間支援従事者,
}

export enum StaffWorkShiftEnum {
  朝番 = 0,
  夜番 = 1,
}
