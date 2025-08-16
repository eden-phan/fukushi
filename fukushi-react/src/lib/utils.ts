import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  GenderEnum,
  PatientStatusEnum,
  CompanyEnum,
  DepositStatusEnum,
  DocumentConsentStatusEnum,
  ManagerStatusEnum,
  FacilityEnum,
  SupportPlanStatusEnum,
  SupportPlanRateEnum,
  EmployeeTypeEnum,
  DesiredUseStatusEnum,
  StaffStatusEnum,
  DocumentTypeEnum,
  NearMissesTypeEnum,
  SessionRecordEnum,
  MedicationProvisionLogEnum,
  MealProvidedEnum,
  StaffReason,
  DisabilityCerfiticateTypeEnum,
  ConsultationAcceptStatusEnum,
  FacilityTypeEnum,
  FacilityStatusEnum,
  FacilityServiceTypeEnum,
  StaffWorkShiftEnum,
  StaffWorkTypeEnum,
  LivingStatusEnum,
} from "./enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLivingStatusLabel(
  livingStatus: LivingStatusEnum | null | undefined | string
): string {
  switch (livingStatus) {
    case LivingStatusEnum.Together:
      return "同居";
    case LivingStatusEnum.Separate:
      return "別居";
    default:
      return "";
  }
}

export function getFacilityServiceTypeLabel(
  facilityServiceType: FacilityServiceTypeEnum | null | undefined | string
): string {
  switch (facilityServiceType) {
    case FacilityServiceTypeEnum.ComprehensiveCareType:
      return "介護包括型";
    case FacilityServiceTypeEnum.DaytimeSupportType:
      return "日中支援型";
    case FacilityServiceTypeEnum.ExternalType:
      return "外部型";
    default:
      return "";
  }
}

export function getFacilityStatusLabel(
  facilityStatus: FacilityStatusEnum | null | undefined | string
): string {
  switch (facilityStatus) {
    case FacilityStatusEnum.Stop:
      return "停止中";
    case FacilityStatusEnum.Open:
      return "稼働中";
    default:
      return "";
  }
}

export function getFacilityTypeLabel(
  facilityType: FacilityTypeEnum | null | undefined | string
): string {
  switch (facilityType) {
    case FacilityTypeEnum.TypeAContinuousEmploymentSupport:
      return "就労A";
    case FacilityTypeEnum.TypeBContinuousEmploymentSupport:
      return "就労B";
    case FacilityTypeEnum.GroupHome:
      return "グールプホーム";
    case FacilityTypeEnum.ShortStay:
      return "ショートステイ";
    case FacilityTypeEnum.ChildDevelopmentSupportOffice:
      return "児童発達支援事業所";
    case FacilityTypeEnum.AfterSchoolDayCareService:
      return "放課後等デイサービス";
    case FacilityTypeEnum.ConsultationSupportOffice:
      return "相談支援事業所";
    default:
      return "";
  }
}

export function getMealProvidedLabel(
  mealProvidedEnumStatus: MealProvidedEnum | null | undefined | string
): string {
  switch (mealProvidedEnumStatus) {
    case MealProvidedEnum.Morning:
      return "朝";
    case MealProvidedEnum.Noon:
      return "昼";
    case MealProvidedEnum.Night:
      return "夜";
    default:
      return "";
  }
}

export function getMedicationProvisionLogEnumLabel(
  medicationProvisionLogStatus:
    | MedicationProvisionLogEnum
    | null
    | undefined
    | string
): string {
  switch (medicationProvisionLogStatus) {
    case MedicationProvisionLogEnum.BeforeMeals:
      return "食前";
    case MedicationProvisionLogEnum.AfterMeals:
      return "食後";
    case MedicationProvisionLogEnum.BetweenMeals:
      return "食間";
    case MedicationProvisionLogEnum.Morning:
      return "朝";
    case MedicationProvisionLogEnum.Noon:
      return "昼";
    case MedicationProvisionLogEnum.Evening:
      return "夕";
    default:
      return "";
  }
}

export function getConsultationAcceptStatusLabel(
  consultationAcceptStatus:
    | ConsultationAcceptStatusEnum
    | null
    | undefined
    | string
): string {
  switch (consultationAcceptStatus) {
    case ConsultationAcceptStatusEnum.Pending:
      return "保留中";
    case ConsultationAcceptStatusEnum.Accepted:
      return "承認済み";
    case ConsultationAcceptStatusEnum.Rejected:
      return "却下";
    default:
      return "";
  }
}

export function getConsultationAcceptStatusClass(
  consultationAcceptStatus:
    | ConsultationAcceptStatusEnum
    | null
    | undefined
    | number
): string {
  switch (consultationAcceptStatus) {
    case ConsultationAcceptStatusEnum.Pending:
      return "text-yellow-600 font-normal";
    case ConsultationAcceptStatusEnum.Accepted:
      return "text-green-500 font-normal";
    case ConsultationAcceptStatusEnum.Pending:
      return "text-red-600 font-normal";
    default:
      return "";
  }
}

export function getDisabilityCerfiticateTypeLabel(
  disabilityCerfiticateType:
    | DisabilityCerfiticateTypeEnum
    | null
    | undefined
    | string
): string {
  switch (disabilityCerfiticateType) {
    case DisabilityCerfiticateTypeEnum.PhysicallyDisability:
      return "身体障害者手帳";
    case DisabilityCerfiticateTypeEnum.DevelopmentalDisability:
      return "療育手帳";
    case DisabilityCerfiticateTypeEnum.MentalHealthAndWelfare:
      return "精神障害者保健福祉手帳";
    case DisabilityCerfiticateTypeEnum.None:
      return "該当なし";
    default:
      return "";
  }
}

export function getNearMissesTypeLabel(
  nearMissesStatus: NearMissesTypeEnum | null | undefined | string
): string {
  switch (nearMissesStatus) {
    case NearMissesTypeEnum.FallOrTripping:
      return "転倒・転落・つまづき・";
    case NearMissesTypeEnum.IngestionOrSwallowing:
      return "誤嚥・誤飲";
    case NearMissesTypeEnum.MisadministrationOfMedication:
      return "誤与薬";
    case NearMissesTypeEnum.GoingoutWithoutPermission:
      return "無断外出";
    case NearMissesTypeEnum.Missing:
      return "行方不明";
    case NearMissesTypeEnum.ViolentBehavior:
      return "暴力行為";
    case NearMissesTypeEnum.AccidentsAtWork:
      return "事業所の事故（火災等）";
    case NearMissesTypeEnum.TrafficAccidents:
      return "交通事故";
    case NearMissesTypeEnum.Infringement:
      return "権利侵害";
    case NearMissesTypeEnum.Others:
      return "その他";
    default:
      return "";
  }
}

export function getFacilityLabel(
  facilityStatus: FacilityEnum | null | undefined | string
): string {
  switch (facilityStatus) {
    case FacilityEnum.TypeAContinuousEmploymentSupport:
      return FacilityEnum.TypeAContinuousEmploymentSupport;
    case FacilityEnum.TypeBContinuousEmploymentSupport:
      return FacilityEnum.TypeBContinuousEmploymentSupport;
    case FacilityEnum.GroupHome:
      return FacilityEnum.GroupHome;
    case FacilityEnum.ShortStay:
      return FacilityEnum.ShortStay;
    case FacilityEnum.ChildDevelopmentSupportOffice:
      return FacilityEnum.ChildDevelopmentSupportOffice;
    case FacilityEnum.AfterSchoolDayCareService:
      return FacilityEnum.AfterSchoolDayCareService;
    case FacilityEnum.ConsultationSupportOffice:
      return FacilityEnum.ConsultationSupportOffice;
    default:
      return "";
  }
}

export function getManagerStatusLabel(
  managerStatus: ManagerStatusEnum | null | undefined | number
): string {
  switch (managerStatus) {
    case ManagerStatusEnum.MaternityLeave:
      return "出産休暇";
    case ManagerStatusEnum.ChildcareLeave:
      return "育児休暇";
    case ManagerStatusEnum.NursingCareLeave:
      return "介護休暇";
    case ManagerStatusEnum.ChildcareReduce:
      return "育児・介護時短制度";
    case ManagerStatusEnum.RegularWork:
      return "通常勤務";
    case ManagerStatusEnum.Invalid:
      return "無効";
    default:
      return "";
  }
}

export function getDesiredUseStatusLabel(
  desiredUseStatus: DesiredUseStatusEnum | null | undefined | number
): string {
  switch (desiredUseStatus) {
    case DesiredUseStatusEnum.Undecided:
      return "未決定";
    case DesiredUseStatusEnum.Ready:
      return "入所希望あり";
    case DesiredUseStatusEnum.NotReady:
      return "入所希望なし";
    default:
      return "";
  }
}

export function getDesiredUseStatusColorClass(
  desiredUseStatus: DesiredUseStatusEnum | null | undefined | number
): string {
  switch (desiredUseStatus) {
    case DesiredUseStatusEnum.Undecided:
      return "text-red-600 font-normal";
    case DesiredUseStatusEnum.Ready:
      return "text-green-500 font-normal";
    case DesiredUseStatusEnum.NotReady:
      return "text-purple-500 font-normal";
    default:
      return "";
  }
}

export function getDocumentConsentStatusLabel(
  documentConsentStatus: DocumentConsentStatusEnum | null | undefined | number
): string {
  switch (documentConsentStatus) {
    case DocumentConsentStatusEnum.Valid:
      return "有効";
    case DocumentConsentStatusEnum.Ended:
      return "終了";
    default:
      return "";
  }
}

export function getDocumentConsentStatusColor(
  documentConsentStatus: DocumentConsentStatusEnum | null | undefined | number
): string {
  switch (documentConsentStatus) {
    case DocumentConsentStatusEnum.Valid:
      return "text-green-500 font-normal";
    case DocumentConsentStatusEnum.Ended:
      return "text-red-500 font-normal";
    default:
      return "";
  }
}

export function getGenderLabel(gender: GenderEnum | null | undefined): string {
  switch (gender) {
    case GenderEnum.Male:
      return "男性";
    case GenderEnum.Female:
      return "女性";
    default:
      return "";
  }
}

export function getPatientStatusLabel(
  status: PatientStatusEnum | null | undefined
): string {
  switch (status) {
    case PatientStatusEnum.Active:
      return "入居中";
    case PatientStatusEnum.Expired:
      return "退去";
    default:
      return "";
  }
}

export function getStaffStatusLabel(
  status: StaffStatusEnum | null | undefined
): string {
  switch (status) {
    case StaffStatusEnum.Active:
      return "対応中";
    case StaffStatusEnum.Expired:
      return "利用終了";
    default:
      return "";
  }
}

export function getSupportPlanStatusLabel(
  status: SupportPlanStatusEnum | null | undefined
): string {
  switch (status) {
    case SupportPlanStatusEnum.Active:
      return "有効";
    case SupportPlanStatusEnum.Expired:
      return "終了";
    default:
      return "";
  }
}

export function getSupportPlanRateLabel(
  status: SupportPlanRateEnum | null | undefined
): string {
  switch (status) {
    case SupportPlanRateEnum.Active:
      return "済み";
    case SupportPlanRateEnum.Expired:
      return "未完成";
    default:
      return "";
  }
}

export function getEmployeeTypeLabel(
  status: EmployeeTypeEnum | null | undefined
): string {
  switch (status) {
    case EmployeeTypeEnum.Fulltime:
      return "フルタイム";
    case EmployeeTypeEnum.Partime:
      return "パートタイム";
    default:
      return "";
  }
}

export function getStaffWorkTypeLabel(
  status: StaffWorkTypeEnum | null | undefined
): string {
  switch (status) {
    case StaffWorkTypeEnum.サービス管理責任者:
      return "サービス管理責任者";
    case StaffWorkTypeEnum.世話人:
      return "世話人";
    case StaffWorkTypeEnum.生活支援員:
      return "生活支援員";
    case StaffWorkTypeEnum.夜間支援従事者:
      return "夜間支援従事者";
    default:
      return "";
  }
}

export function getStaffWorkShiftLabel(
  status: StaffWorkShiftEnum | null | undefined
): string {
  switch (status) {
    case StaffWorkShiftEnum.朝番:
      return "朝番";
    case StaffWorkShiftEnum.夜番:
      return "夜番";
    default:
      return "";
  }
}

export function getDocumentTypeLabel(
  status: DocumentTypeEnum | null | undefined
): string {
  switch (status) {
    case DocumentTypeEnum.EmploymentContract:
      return "労働契約";
    case DocumentTypeEnum.DataProtection:
      return "情報保護契約";
    default:
      return "";
  }
}

export function getDepositStatusLabel(
  status: DepositStatusEnum | null | undefined
): string {
  switch (status) {
    case DepositStatusEnum.Deposit:
      return "預かり中";
    case DepositStatusEnum.Returned:
      return "返却済";
    default:
      return "";
  }
}

export function getCompanyLabel(
  status: CompanyEnum | null | undefined
): string {
  switch (status) {
    case CompanyEnum.facility1:
      return "facility1";
    case CompanyEnum.facility2:
      return "facility2";
    case CompanyEnum.facility3:
      return "facility3";
    default:
      return "";
  }
}

export function getSessionRecordLabel(
  status: SessionRecordEnum | null | undefined
): string {
  switch (status) {
    case SessionRecordEnum.training:
      return "研修議事録";
    case SessionRecordEnum.meeting:
      return "スタッフ会議事録";
    default:
      return "";
  }
}

export function getStaffReasonLabel(
  status: StaffReason | null | undefined
): string {
  switch (status) {
    case StaffReason.出産休暇:
      return "出産休暇";
    case StaffReason.育児休暇:
      return "出産休暇";
    case StaffReason.介護休暇:
      return "育児休暇";
    case StaffReason.育児介護時短制度:
      return "介護休暇";
    case StaffReason.通常勤務:
      return "非稼働";
    case StaffReason.無効:
      return "無効";
    default:
      return "";
  }
}

export function getStaffReasonColor(
  status: StaffReason | null | undefined
): string {
  switch (status) {
    case StaffReason.出産休暇:
      return "#F9A8D4";
    case StaffReason.育児休暇:
      return "#93C5FD";
    case StaffReason.介護休暇:
      return "#C4B5FD";
    case StaffReason.育児介護時短制度:
      return "#FDBA74";
    case StaffReason.通常勤務:
      return "#34D399";
    case StaffReason.無効:
      return "#9CA3AF";
    default:
      return "";
  }
}

export function getAgeFromDob(dob?: string | Date | null): string {
  if (!dob) return "";
  const birthDate = typeof dob === "string" ? new Date(dob) : dob;
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassedThisYear) {
    age--;
  }

  return age.toString() + ' 歳';
}

export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const formatPostalCode = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}`;
};

/**
 * Formats a time string from 24-hour format (HH:MM) to 12-hour format with AM/PM
 * @param timeString - Time string in HH:MM format
 * @returns Formatted time string in 12-hour format with AM/PM or "-" if invalid
 */
export function formatTime(timeString: string): string {
  if (!timeString) return "-";

  const time = timeString.substring(0, 5); // HH:MM format
  const [hours, minutes] = time.split(":");

  if (!hours || !minutes) return "-";

  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? "PM" : "AM";

  return `${hour12}:${minutes} ${ampm}`;
}

export function formatPhoneJP(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
  }

  return phone;
}
export function formatDateSlash(
  date: Date | string | null | undefined
): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}
