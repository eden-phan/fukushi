import {
  GenderEnum,
  DocumentConsentStatusEnum,
  ManagerStatusEnum,
  FacilityEnum,
  ConsultationMethodEnum,
  DisabilityCerfiticateTypeEnum,
  DesiredUseStatusEnum,
  NearMissesTypeEnum,
  MedicationProvisionLogEnum,
  MealProvidedEnum,
  ConsultationAcceptStatusEnum,
  FacilityTypeEnum,
  FacilityStatusEnum,
  FacilityServiceTypeEnum,
  LivingStatusEnum,
} from "./enum";
import {
  getGenderLabel,
  getDocumentConsentStatusLabel,
  getManagerStatusLabel,
  getFacilityLabel,
  getDesiredUseStatusLabel,
  getNearMissesTypeLabel,
  getMedicationProvisionLogEnumLabel,
  getMealProvidedLabel,
  getDisabilityCerfiticateTypeLabel,
  getConsultationAcceptStatusLabel,
  getFacilityTypeLabel,
  getFacilityStatusLabel,
  getFacilityServiceTypeLabel,
  getLivingStatusLabel,
} from "./utils";

export const livingStatusOptions = [
  {
    value: LivingStatusEnum.Together,
    label: getLivingStatusLabel(LivingStatusEnum.Together),
  },
  {
    value: LivingStatusEnum.Separate,
    label: getLivingStatusLabel(LivingStatusEnum.Separate),
  },
];

export const facilityServiceTypeOptions = [
  {
    value: FacilityServiceTypeEnum.ComprehensiveCareType,
    label: getFacilityServiceTypeLabel(
      FacilityServiceTypeEnum.ComprehensiveCareType
    ),
  },
  {
    value: FacilityServiceTypeEnum.DaytimeSupportType,
    label: getFacilityServiceTypeLabel(
      FacilityServiceTypeEnum.DaytimeSupportType
    ),
  },
  {
    value: FacilityServiceTypeEnum.ExternalType,
    label: getFacilityServiceTypeLabel(FacilityServiceTypeEnum.ExternalType),
  },
];

export const facilityStatusOptions = [
  {
    value: FacilityStatusEnum.Stop,
    label: getFacilityStatusLabel(FacilityStatusEnum.Stop),
  },
  {
    value: FacilityStatusEnum.Open,
    label: getFacilityStatusLabel(FacilityStatusEnum.Open),
  },
];

export const facilityTypeOptions = [
  {
    value: FacilityTypeEnum.TypeAContinuousEmploymentSupport,
    label: getFacilityTypeLabel(
      FacilityTypeEnum.TypeAContinuousEmploymentSupport
    ),
  },
  {
    value: FacilityTypeEnum.TypeBContinuousEmploymentSupport,
    label: getFacilityTypeLabel(
      FacilityTypeEnum.TypeBContinuousEmploymentSupport
    ),
  },
  {
    value: FacilityTypeEnum.GroupHome,
    label: getFacilityTypeLabel(FacilityTypeEnum.GroupHome),
  },
  {
    value: FacilityTypeEnum.ShortStay,
    label: getFacilityTypeLabel(FacilityTypeEnum.ShortStay),
  },
  {
    value: FacilityTypeEnum.ChildDevelopmentSupportOffice,
    label: getFacilityTypeLabel(FacilityTypeEnum.ChildDevelopmentSupportOffice),
  },
  {
    value: FacilityTypeEnum.AfterSchoolDayCareService,
    label: getFacilityTypeLabel(FacilityTypeEnum.AfterSchoolDayCareService),
  },
  {
    value: FacilityTypeEnum.ConsultationSupportOffice,
    label: getFacilityTypeLabel(FacilityTypeEnum.ConsultationSupportOffice),
  },
];

export const consultationAcceptStatusOptions = [
  {
    value: ConsultationAcceptStatusEnum.Pending,
    label: getConsultationAcceptStatusLabel(
      ConsultationAcceptStatusEnum.Pending
    ),
  },
  {
    value: ConsultationAcceptStatusEnum.Accepted,
    label: getConsultationAcceptStatusLabel(
      ConsultationAcceptStatusEnum.Accepted
    ),
  },
  {
    value: ConsultationAcceptStatusEnum.Rejected,
    label: getConsultationAcceptStatusLabel(
      ConsultationAcceptStatusEnum.Rejected
    ),
  },
];

export const getMealProvidedOptions = [
  {
    value: MealProvidedEnum.Morning,
    label: getMealProvidedLabel(MealProvidedEnum.Morning),
  },
  {
    value: MealProvidedEnum.Noon,
    label: getMealProvidedLabel(MealProvidedEnum.Noon),
  },
  {
    value: MealProvidedEnum.Night,
    label: getMealProvidedLabel(MealProvidedEnum.Night),
  },
];

export const getMedicationProvisionLogOptions = [
  {
    value: MedicationProvisionLogEnum.BeforeMeals,
    label: getMedicationProvisionLogEnumLabel(
      MedicationProvisionLogEnum.BeforeMeals
    ),
  },
  {
    value: MedicationProvisionLogEnum.AfterMeals,
    label: getMedicationProvisionLogEnumLabel(
      MedicationProvisionLogEnum.AfterMeals
    ),
  },
  {
    value: MedicationProvisionLogEnum.BetweenMeals,
    label: getMedicationProvisionLogEnumLabel(
      MedicationProvisionLogEnum.BetweenMeals
    ),
  },
  {
    value: MedicationProvisionLogEnum.Morning,
    label: getMedicationProvisionLogEnumLabel(
      MedicationProvisionLogEnum.Morning
    ),
  },
  {
    value: MedicationProvisionLogEnum.Noon,
    label: getMedicationProvisionLogEnumLabel(MedicationProvisionLogEnum.Noon),
  },
  {
    value: MedicationProvisionLogEnum.Evening,
    label: getMedicationProvisionLogEnumLabel(
      MedicationProvisionLogEnum.Evening
    ),
  },
];

export const getNearMissesTypeOptions = [
  {
    value: NearMissesTypeEnum.AccidentsAtWork,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.AccidentsAtWork),
  },
  {
    value: NearMissesTypeEnum.FallOrTripping,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.FallOrTripping),
  },
  {
    value: NearMissesTypeEnum.GoingoutWithoutPermission,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.GoingoutWithoutPermission),
  },
  {
    value: NearMissesTypeEnum.Infringement,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.Infringement),
  },
  {
    value: NearMissesTypeEnum.IngestionOrSwallowing,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.IngestionOrSwallowing),
  },
  {
    value: NearMissesTypeEnum.MisadministrationOfMedication,
    label: getNearMissesTypeLabel(
      NearMissesTypeEnum.MisadministrationOfMedication
    ),
  },
  {
    value: NearMissesTypeEnum.Missing,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.Missing),
  },
  {
    value: NearMissesTypeEnum.TrafficAccidents,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.TrafficAccidents),
  },
  {
    value: NearMissesTypeEnum.ViolentBehavior,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.ViolentBehavior),
  },
  {
    value: NearMissesTypeEnum.Others,
    label: getNearMissesTypeLabel(NearMissesTypeEnum.Others),
  },
];

export const disabilityLevelOptions = [
  { value: 1, label: "1級" },
  { value: 2, label: "2級" },
  { value: 3, label: "3級" },
];

export const disabilityCategoryOptions = [
  { value: 1, label: "1種" },
  { value: 2, label: "2種" },
  { value: 3, label: "3種" },
  { value: 4, label: "4種" },
  { value: 5, label: "5種" },
  { value: 6, label: "6種" },
];

export const disabilityCerfiticateTypeOptions = [
  {
    value: DisabilityCerfiticateTypeEnum.PhysicallyDisability,
    label: getDisabilityCerfiticateTypeLabel(
      DisabilityCerfiticateTypeEnum.PhysicallyDisability
    ),
  },
  {
    value: DisabilityCerfiticateTypeEnum.DevelopmentalDisability,
    label: getDisabilityCerfiticateTypeLabel(
      DisabilityCerfiticateTypeEnum.DevelopmentalDisability
    ),
  },
  {
    value: DisabilityCerfiticateTypeEnum.MentalHealthAndWelfare,
    label: getDisabilityCerfiticateTypeLabel(
      DisabilityCerfiticateTypeEnum.MentalHealthAndWelfare
    ),
  },
  {
    value: DisabilityCerfiticateTypeEnum.None,
    label: getDisabilityCerfiticateTypeLabel(
      DisabilityCerfiticateTypeEnum.None
    ),
  },
];

export const consultationMethodOptions = [
  { value: ConsultationMethodEnum.Visit, label: ConsultationMethodEnum.Visit },
  { value: ConsultationMethodEnum.Phone, label: ConsultationMethodEnum.Phone },
  {
    value: ConsultationMethodEnum.letter,
    label: ConsultationMethodEnum.letter,
  },
  { value: ConsultationMethodEnum.Fax, label: ConsultationMethodEnum.Fax },
];

export const desiredUseStatusOptions = [
  {
    value: DesiredUseStatusEnum.Undecided,
    label: getDesiredUseStatusLabel(DesiredUseStatusEnum.Undecided),
  },
  {
    value: DesiredUseStatusEnum.Ready,
    label: getDesiredUseStatusLabel(DesiredUseStatusEnum.Ready),
  },
  {
    value: DesiredUseStatusEnum.NotReady,
    label: getDesiredUseStatusLabel(DesiredUseStatusEnum.NotReady),
  },
];

export const genderOptions = [
  { value: GenderEnum.Female, label: getGenderLabel(GenderEnum.Female) },
  { value: GenderEnum.Male, label: getGenderLabel(GenderEnum.Male) },
];

export const documentConsentStatusOptions = [
  {
    value: DocumentConsentStatusEnum.Valid,
    label: getDocumentConsentStatusLabel(DocumentConsentStatusEnum.Valid),
  },
  {
    value: DocumentConsentStatusEnum.Ended,
    label: getDocumentConsentStatusLabel(DocumentConsentStatusEnum.Ended),
  },
];

export const managerStatusOptions = [
  {
    value: ManagerStatusEnum.MaternityLeave,
    label: getManagerStatusLabel(ManagerStatusEnum.MaternityLeave),
  },
  {
    value: ManagerStatusEnum.ChildcareLeave,
    label: getManagerStatusLabel(ManagerStatusEnum.ChildcareLeave),
  },
  {
    value: ManagerStatusEnum.NursingCareLeave,
    label: getManagerStatusLabel(ManagerStatusEnum.NursingCareLeave),
  },
  {
    value: ManagerStatusEnum.ChildcareReduce,
    label: getManagerStatusLabel(ManagerStatusEnum.ChildcareReduce),
  },
  {
    value: ManagerStatusEnum.RegularWork,
    label: getManagerStatusLabel(ManagerStatusEnum.RegularWork),
  },
  {
    value: ManagerStatusEnum.Invalid,
    label: getManagerStatusLabel(ManagerStatusEnum.Invalid),
  },
];

export const facilityOptions = [
  {
    value: FacilityEnum.TypeAContinuousEmploymentSupport,
    label: getFacilityLabel(FacilityEnum.TypeAContinuousEmploymentSupport),
  },
  {
    value: FacilityEnum.TypeBContinuousEmploymentSupport,
    label: getFacilityLabel(FacilityEnum.TypeBContinuousEmploymentSupport),
  },
  {
    value: FacilityEnum.GroupHome,
    label: getFacilityLabel(FacilityEnum.GroupHome),
  },
  {
    value: FacilityEnum.ShortStay,
    label: getFacilityLabel(FacilityEnum.ShortStay),
  },
  {
    value: FacilityEnum.ChildDevelopmentSupportOffice,
    label: getFacilityLabel(FacilityEnum.ChildDevelopmentSupportOffice),
  },
  {
    value: FacilityEnum.AfterSchoolDayCareService,
    label: getFacilityLabel(FacilityEnum.AfterSchoolDayCareService),
  },
  {
    value: FacilityEnum.ConsultationSupportOffice,
    label: getFacilityLabel(FacilityEnum.ConsultationSupportOffice),
  },
];
