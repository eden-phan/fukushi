"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UISubmitButton } from "@/components/customs/ui-button"
import http from "@/services/http"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserProps } from "@/@types/user"
import { useParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import type { AssessmentProps, FormAssessmentData, LivingDomainFormData } from "@/@types/assessment"
import { Checkbox } from "@/components/ui/checkbox"
import { createSuccessToast, updateSuccessToast } from "@/lib/message"
import { toast } from "sonner"
import VisitDatesSection from "./components/visit-dates-section"
import MedicalHistoryTable from "./components/medical-history-table"
import LivingDomainTable from "./components/living-domain-table"
import { formatVisitDatesForAPI, parseVisitDates } from "@/lib/assessment"
import { Loading } from "@/components/ui/loading"

type FormAssessmentProps = {
  editId?: string
  onBackToList?: () => void
}

type ServiceUserProfileProps = {
  service_user_id: number
  profile_name: string
}

const visitDateItemSchema = z.object({
  month: z.string(),
  day: z.string(),
})

const livingDomainSchema = z.object({
  id: z.number().optional(),
  key: z.string(),
  current_status: z.string(),
  preference: z.string(),
  needs_support: z.string(),
  abilities_limitations_notes: z.string(),
  environment_limitations_notes: z.string(),
})

const formSchema = z
  .object({
    reception_number: z.string().max(20, "受付番号は20文字以内で入力してください"),
    staff_id: z.string().min(1, "対応職員は必須です"),
    service_user_id: z.string().min(1, "利用者は必須です"),
    home_visit_dates: z.array(visitDateItemSchema),
    outpatient_visit_dates: z.array(visitDateItemSchema),
    phone_contact_dates: z.array(visitDateItemSchema),
    life_history: z.string(),
    physical_disability_type: z.string().max(10, "身体障害種別は10文字以内で入力してください"),
    physical_disability_grade: z.string().max(10, "身体障害等級は10文字以内で入力してください"),
    intellectual_disability_code: z.string().max(10, "知的障害コードは10文字以内で入力してください"),
    mental_disability_grade: z.string().max(10, "精神障害等級は10文字以内で入力してください"),
    has_no_certificate: z.boolean(),
    has_basic_disability_pension: z.boolean(),
    basic_disability_grade: z.string().max(10, "基礎年金等級は10文字以内で入力してください"),
    has_welfare_disability_pension: z.boolean(),
    welfare_disability_grade: z.string().max(10, "厚生年金等級は10文字以内で入力してください"),
    has_national_pension: z.boolean(),
    has_other_pension: z.boolean(),
    other_pension_details: z.string().max(255, "その他年金詳細は255文字以内で入力してください"),
    receives_welfare: z.boolean(),
    disability_support_level: z.string(),
    medical_history: z.string(),
    medical_info: z.string(),
    medication_detail: z.string(),
    insurance_type: z.string().max(20, "保険種別は20文字以内で入力してください"),
    insurance_symbol: z.string(),
    insured_person_relation: z.string().max(20, "被保険者関係は20文字以内で入力してください"),
    pension_type: z.string().max(255, "年金種別は255文字以内で入力してください"),
    pension_other_detail: z.string().max(255, "年金その他詳細は255文字以内で入力してください"),
    current_assistive_device: z.string(),
    daily_routine_self: z.string(),
    daily_routine_caregiver: z.string(),
    desired_life_user: z.string(),
    desired_life_family: z.string(),
    other_information: z.string(),
    house_owned: z.boolean(),
    house_type_other: z.string(),
    note: z.string(),
    living_domains: z.array(livingDomainSchema),
  })
  .superRefine((data, ctx) => {
    if (data.physical_disability_type && !data.physical_disability_grade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "身体手帳の等級を入力してください",
        path: ["physical_disability_grade"],
      })
    }

    if (data.has_basic_disability_pension && !data.basic_disability_grade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "障害基礎年金の等級を入力してください",
        path: ["basic_disability_grade"],
      })
    }

    if (data.has_welfare_disability_pension && !data.welfare_disability_grade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "障害厚生年金の等級を入力してください",
        path: ["welfare_disability_grade"],
      })
    }

    if (data.has_other_pension && !data.other_pension_details) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "その他年金の詳細を入力してください",
        path: ["other_pension_details"],
      })
    }

    if (data.pension_type === "その他" && !data.pension_other_detail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "年金のその他詳細を入力してください",
        path: ["pension_other_detail"],
      })
    }
  })

const FormAssessment = ({ editId, onBackToList }: FormAssessmentProps) => {
  const params = useParams()
  const id = params.id
  const [userOptions, setUserOptions] = useState<UserProps[]>([])
  const [serviceUserProfiles, setServiceUserProfiles] = useState<ServiceUserProfileProps[]>([])
  const [assessmentData, setAssessmentData] = useState<AssessmentProps | undefined>()
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState({
    staff: false,
    serviceUsers: false,
    assessment: false
  })

  const livingDomainKeyMappings: Record<string, string> = useMemo(
    () => ({
      "経済環境": "economic_status",
      "住環境": "living_environment",
      "服薬管理": "medication_management",
      "食事管理": "meal_management",
      "病気への留意": "health_attention",
      "体力": "physical_strength",
      "衣類着脱（上衣）（ズボン等）": "dressing",
      "整容行為": "grooming",
      "食事行為": "eating",
      "排泄行為 （排尿）（排便）": "toileting",
      "睡眠": "sleep",
      "入浴行為": "bathing",
      "ベッドへ移乗 （床）（車いす等）": "bed_transfer",
      "屋内移動": "indoor_mobility",
      "調理（後かたづけを含む）": "cooking",
      "洗濯": "laundry",
      "掃除": "cleaning",
      "整理・整頓": "organizing",
      "ベッドメーキング": "bed_making",
      "書類の整理": "document_organizing",
      "買物": "shopping",
      "衣類の補修": "clothes_repair",
      "育児": "childcare",
      "意思表示の手段": "expression_method",
      "意思伝達の程度": "communication_level",
      "他者からの意思伝達の理解": "understanding_others",
      "情報伝達機器の使用": "device_usage",
      "対人関係": "interpersonal_relationships",
      "屋外移動（近距離移動）（遠距離移動）": "outdoor_mobility",
      "金銭管理": "money_management",
      "危機管理": "crisis_management",
      "レクリエーション等": "recreation",
      "趣味": "hobbies",
      "旅行": "travel",
      "当事者団体の活動": "peer_group_activity",
      "各種社会的活動": "social_activities",
      "教育": "education",
      "就労": "employment",
      "家族 1.情報提供 2.介護負担軽減 3.家族関係調整 社会参加": "family_support",
    }),
    [],
  )

  const livingDomainSections = useMemo(
    () => [
      {
        number: 1,
        title: "生活基盤に関する領域",
        domains: [
          { key: "経済環境", label: "経済環境" },
          { key: "住環境", label: "住環境" },
        ],
        startIndex: 0,
      },
      {
        number: 2,
        title: "健康に関する領域",
        domains: [
          { key: "服薬管理", label: "服薬管理" },
          { key: "食事管理", label: "食事管理" },
          { key: "病気への留意", label: "病気への留意" },
          { key: "体力", label: "体力" },
        ],
        startIndex: 2,
      },
      {
        number: 3,
        title: "日常生活に関する領域",
        domains: [
          { key: "衣類着脱（上衣）（ズボン等）", label: "衣類着脱<br/>（上衣）<br/>（ズボン等）" },
          { key: "整容行為", label: "整容行為" },
          { key: "食事行為", label: "食事行為" },
          { key: "排泄行為 （排尿）（排便）", label: "排泄行為<br/>（排尿）<br/>（排便）" },
          { key: "睡眠", label: "睡眠" },
          { key: "入浴行為", label: "入浴行為" },
          { key: "ベッドへ移乗 （床）（車いす等）", label: "ベッドへ移乗<br/>（床）<br/>（車いす等）" },
          { key: "屋内移動", label: "屋内移動" },
          { key: "調理（後かたづけを含む）", label: "調理（後かたづけを含む）" },
          { key: "洗濯", label: "洗濯" },
          { key: "掃除", label: "掃除" },
          { key: "整理・整頓", label: "整理・整頓" },
          { key: "ベッドメーキング", label: "ベッドメーキング" },
          { key: "書類の整理", label: "書類の整理" },
          { key: "買物", label: "買物" },
          { key: "衣類の補修", label: "衣類の補修" },
          { key: "育児", label: "育児" },
        ],
        startIndex: 6,
      },
      {
        number: 4,
        title: "コミュニケーション・スキルに関する領域",
        domains: [
          { key: "意思表示の手段", label: "意思表示の手段" },
          { key: "意思伝達の程度", label: "意思伝達の程度" },
          { key: "他者からの意思伝達の理解", label: "他者からの意思伝達の理解" },
          { key: "情報伝達機器の使用", label: "情報伝達機器の使用" },
        ],
        startIndex: 23,
      },
      {
        number: 5,
        title: "社会生活技能に関する領域",
        domains: [
          { key: "対人関係", label: "対人関係" },
          { key: "屋外移動（近距離移動）（遠距離移動）", label: "屋外移動<br/>（近距離移動）<br/>（遠距離移動）" },
          { key: "金銭管理", label: "金銭管理" },
          { key: "危機管理", label: "危機管理" },
        ],
        startIndex: 27,
      },
      {
        number: 6,
        title: "社会参加に関する領域",
        domains: [
          { key: "レクリエーション等", label: "レクリエーション等" },
          { key: "趣味", label: "趣味" },
          { key: "旅行", label: "旅行" },
          { key: "当事者団体の活動", label: "当事者団体の活動" },
          { key: "各種社会的活動", label: "各種社会的活動" },
        ],
        startIndex: 31,
      },
      {
        number: 7,
        title: "教育・就労に関する領域",
        domains: [
          { key: "教育", label: "教育" },
          { key: "就労", label: "就労" },
        ],
        startIndex: 36,
      },
      {
        number: 8,
        title: "家族支援に関する領域",
        domains: [
          {
            key: "家族 1.情報提供 2.介護負担軽減 3.家族関係調整 社会参加",
            label: "家族<br/>1.情報提供<br/>2.介護負担軽減<br/>3.家族関係調整<br/>社会参加",
          },
        ],
        startIndex: 38,
      },
    ],
    [],
  )

  const fetchStaffOptions = useCallback(async () => {
    try {
      const response = await http.get(`/user/staff`)
      setUserOptions(response.data.data)
      setDataLoaded(prev => ({ ...prev, staff: true }))
    } catch {
      setUserOptions([])
      setDataLoaded(prev => ({ ...prev, staff: true }))
    }
  }, [])

  const fetchServiceUserProfiles = useCallback(async () => {
    try {
      const response = await http.get(`/service-user/profile`)
      setServiceUserProfiles(response.data.data)
      setDataLoaded(prev => ({ ...prev, serviceUsers: true }))
    } catch {
      setServiceUserProfiles([])
      setDataLoaded(prev => ({ ...prev, serviceUsers: true }))
    }
  }, [])

  const fetchAssessmentData = useCallback(async () => {
    if (!editId) {
      setDataLoaded(prev => ({ ...prev, assessment: true }))
      return
    }

    setLoading(true)
    try {
      const response = await http.get(`/assessments/${editId}`)
      setAssessmentData(response.data.data)
      setDataLoaded(prev => ({ ...prev, assessment: true }))
    } catch {
      toast.error("アセスメントデータの取得に失敗しました")
      setDataLoaded(prev => ({ ...prev, assessment: true }))
    } finally {
      setLoading(false)
    }
  }, [editId])

  useEffect(() => {
    fetchStaffOptions()
    fetchServiceUserProfiles()
    fetchAssessmentData()
  }, [fetchStaffOptions, fetchServiceUserProfiles, fetchAssessmentData])

  const form = useForm<FormAssessmentData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reception_number: "",
      staff_id: "",
      service_user_id: id ? String(id) : "",
      home_visit_dates: [],
      outpatient_visit_dates: [],
      phone_contact_dates: [],
      life_history: "",
      physical_disability_type: "",
      physical_disability_grade: "",
      intellectual_disability_code: "",
      mental_disability_grade: "",
      has_no_certificate: false,
      has_basic_disability_pension: false,
      basic_disability_grade: "",
      has_welfare_disability_pension: false,
      welfare_disability_grade: "",
      has_national_pension: false,
      has_other_pension: false,
      other_pension_details: "",
      receives_welfare: false,
      disability_support_level: "",
      medical_history: JSON.stringify([{ date: "", event: "" }]),
      medical_info: "",
      medication_detail: "",
      insurance_type: "",
      insurance_symbol: "",
      insured_person_relation: "",
      pension_type: "",
      pension_other_detail: "",
      current_assistive_device: "",
      daily_routine_self: "",
      daily_routine_caregiver: "",
      desired_life_user: "",
      desired_life_family: "",
      other_information: "",
      house_owned: false,
      house_type_other: "",
      note: "",
      living_domains: livingDomainSections.flatMap((section) =>
        section.domains.map((domain) => ({
          key: livingDomainKeyMappings[domain.key] || domain.key,
          current_status: "",
          preference: "",
          needs_support: "",
          abilities_limitations_notes: "",
          environment_limitations_notes: "",
        })),
      ),
    },
  })

  const mapLivingDomainsFromAPI = useCallback(
    (apiDomains: AssessmentProps["living_domains"]): LivingDomainFormData[] => {
      const formDomains: LivingDomainFormData[] = livingDomainSections.flatMap((section) =>
        section.domains.map((domain) => ({
          key: livingDomainKeyMappings[domain.key] || domain.key,
          current_status: "",
          preference: "",
          needs_support: "",
          abilities_limitations_notes: "",
          environment_limitations_notes: "",
        })),
      )

      if (!apiDomains?.length) return formDomains

      apiDomains.forEach((apiDomain) => {
        const formDomainIndex = formDomains.findIndex((fd) => fd.key === apiDomain.key)
        if (formDomainIndex !== -1) {
          formDomains[formDomainIndex] = {
            ...(apiDomain.id && { id: apiDomain.id }),
            key: apiDomain.key,
            current_status: apiDomain.current_status || "",
            preference: apiDomain.preference || "",
            needs_support: apiDomain.support_needed || "",
            abilities_limitations_notes: apiDomain.abilities_limitations_notes || "",
            environment_limitations_notes: apiDomain.environment_limitations_notes || "",
          }
        }
      })

      return formDomains
    },
    [livingDomainKeyMappings, livingDomainSections],
  )

  useEffect(() => {
    if (editId && assessmentData && dataLoaded.staff && dataLoaded.serviceUsers) {
      const staffId = assessmentData.staff_id ? String(assessmentData.staff_id) : ""
      const serviceUserId = String(assessmentData.service_user_id || id || "")
      
      form.setValue("staff_id", staffId)
      form.setValue("service_user_id", serviceUserId)
      
      setTimeout(() => {
        form.trigger(["staff_id", "service_user_id"])
      }, 0)
    }
  }, [editId, assessmentData, dataLoaded.staff, dataLoaded.serviceUsers, form, id])

  useEffect(() => {
    const allDataLoaded = dataLoaded.staff && dataLoaded.serviceUsers && dataLoaded.assessment
    
    if (allDataLoaded && assessmentData) {
      const medicalHistoryData = assessmentData.service_user?.medical_disability_history?.length
        ? assessmentData.service_user.medical_disability_history.map((item) => ({
            date: item.date || "",
            event: item.detail || "",
          }))
        : [{ date: "", event: "" }]

      setTimeout(() => {
        form.reset({
          reception_number: assessmentData.reception_number || "",
          staff_id: assessmentData.staff_id ? String(assessmentData.staff_id) : "",
          service_user_id: String(assessmentData.service_user_id || id || ""),
          home_visit_dates: parseVisitDates(assessmentData.home_visit_dates || []),
          outpatient_visit_dates: parseVisitDates(assessmentData.outpatient_visit_dates || []),
          phone_contact_dates: parseVisitDates(assessmentData.phone_contact_dates || []),
          life_history: assessmentData.life_history || "",
          physical_disability_type: assessmentData.physical_disability_type || "",
          physical_disability_grade: assessmentData.physical_disability_grade || "",
          intellectual_disability_code: assessmentData.intellectual_disability_code || "",
          mental_disability_grade: assessmentData.mental_disability_grade || "",
          has_no_certificate: assessmentData.has_no_certificate || false,
          has_basic_disability_pension: assessmentData.has_basic_disability_pension || false,
          basic_disability_grade: assessmentData.basic_disability_grade || "",
          has_welfare_disability_pension: assessmentData.has_welfare_disability_pension || false,
          welfare_disability_grade: assessmentData.welfare_disability_grade || "",
          has_national_pension: assessmentData.has_national_pension || false,
          has_other_pension: assessmentData.has_other_pension || false,
          other_pension_details: assessmentData.other_pension_details || "",
          receives_welfare: assessmentData.receives_welfare || false,
          disability_support_level: assessmentData.disability_support_level || "",
          medical_history: JSON.stringify(medicalHistoryData),
          medical_info: assessmentData.medical_info || "",
          medication_detail: assessmentData.medication_detail || "",
          insurance_type: assessmentData.insurance_type || "",
          insurance_symbol: assessmentData.insurance_symbol || "",
          insured_person_relation: assessmentData.insured_person_relation || "",
          pension_type: assessmentData.pension_type || "",
          pension_other_detail: assessmentData.pension_other_detail || "",
          current_assistive_device: assessmentData.current_assistive_device || "",
          daily_routine_self: assessmentData.daily_routine_self || "",
          daily_routine_caregiver: assessmentData.daily_routine_caregiver || "",
          desired_life_user: assessmentData.desired_life_user || "",
          desired_life_family: assessmentData.desired_life_family || "",
          other_information: assessmentData.other_information || "",
          house_owned: assessmentData.house_owned || false,
          house_type_other: assessmentData.house_type_other || "",
          note: assessmentData.note || "",
          living_domains: mapLivingDomainsFromAPI(assessmentData.living_domains),
        })
      }, 100)
    }
  }, [assessmentData, form, id, mapLivingDomainsFromAPI, dataLoaded])

  const handleApiError = (error: { response?: { data?: { errors?: Record<string, string[]>; message?: string } } }) => {
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      Object.keys(errors).forEach((field) => {
        const errorMessages = errors[field]
        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          toast.error(`${field}: ${errorMessages[0]}`)
        }
      })
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error("保存に失敗しました")
    }
  }

  const preparePayloadForAPI = (submitData: FormAssessmentData) => {
    let medicalHistoryData: { date: string; detail: string }[] = []
    try {
      const parsedHistory = JSON.parse(submitData.medical_history || "[]")
      medicalHistoryData = parsedHistory
        .filter((item: { date: string; event: string }) => item.date && item.event)
        .map((item: { date: string; event: string }) => ({
          date: item.date,
          detail: item.event,
        }))
    } catch {
      medicalHistoryData = []
    }

    const payload: Record<string, unknown> = {
      reception_number: submitData.reception_number,
      service_user_id: Number(submitData.service_user_id),
      staff_id: Number(submitData.staff_id),
      home_visit_dates: formatVisitDatesForAPI(submitData.home_visit_dates),
      outpatient_visit_dates: formatVisitDatesForAPI(submitData.outpatient_visit_dates),
      phone_contact_dates: formatVisitDatesForAPI(submitData.phone_contact_dates),
      life_history: submitData.life_history,
      medical_disability_history: medicalHistoryData,
      living_domains: submitData.living_domains.map((domain) => ({
        ...domain,
        key: domain.key,
        current_status: domain.current_status,
        preference: domain.preference,
        support_needed: domain.needs_support,
        abilities_limitations_notes: domain.abilities_limitations_notes,
        environment_limitations_notes: domain.environment_limitations_notes,
      })),
      medical_info: submitData.medical_info,
      medication_detail: submitData.medication_detail,
      current_assistive_device: submitData.current_assistive_device,
      daily_routine_self: submitData.daily_routine_self,
      daily_routine_caregiver: submitData.daily_routine_caregiver,
      desired_life_user: submitData.desired_life_user,
      desired_life_family: submitData.desired_life_family,
      other_information: submitData.other_information,
      house_type_other: submitData.house_type_other,
      note: submitData.note,
      insurance_symbol: submitData.insurance_symbol,
    }

    payload.physical_disability_type = submitData.physical_disability_type || null
    payload.physical_disability_grade = submitData.physical_disability_grade || null
    payload.intellectual_disability_code = submitData.intellectual_disability_code || null
    payload.mental_disability_grade = submitData.mental_disability_grade || null
    payload.has_no_certificate = submitData.has_no_certificate
    payload.has_basic_disability_pension = submitData.has_basic_disability_pension
    payload.basic_disability_grade = submitData.has_basic_disability_pension ? submitData.basic_disability_grade : null
    payload.has_welfare_disability_pension = submitData.has_welfare_disability_pension
    payload.welfare_disability_grade = submitData.has_welfare_disability_pension ? submitData.welfare_disability_grade : null
    payload.has_national_pension = submitData.has_national_pension
    payload.has_other_pension = submitData.has_other_pension
    payload.other_pension_details = submitData.has_other_pension ? submitData.other_pension_details : null
    payload.receives_welfare = submitData.receives_welfare
    payload.disability_support_level = submitData.disability_support_level || null
    payload.insurance_type = submitData.insurance_type || null
    payload.insured_person_relation = submitData.insured_person_relation || null
    payload.pension_type = submitData.pension_type || null
    payload.pension_other_detail = submitData.pension_type === "その他" ? submitData.pension_other_detail : null
    payload.house_owned = submitData.house_owned

    return payload
  }

  async function onSubmit(submitData: FormAssessmentData) {
    const payload = preparePayloadForAPI(submitData)
    const message = editId ? updateSuccessToast : createSuccessToast
    const method = editId ? http.put : http.post
    const url = editId ? `assessments/update/${editId}` : "assessments/store"

    try {
      await method(url, payload)
      toast.success(message)

      if (onBackToList) {
        setTimeout(() => {
          onBackToList()
        }, 1000)
      }

      if (!editId) form.reset()
    } catch (error) {
      handleApiError(error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })
    }
  }

  const isFormReady = dataLoaded.staff && dataLoaded.serviceUsers && dataLoaded.assessment

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white relative">
      {loading || !isFormReady ? (
        <div className="flex items-center justify-center p-10">
          <Loading />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              <UISubmitButton>登録する</UISubmitButton>
            </div>
            <div className="space-y-8">
              <div className="border border-[#D9D9D9] p-4">
                <div className="grid grid-cols-2 gap-x-10 items-start">
                  <div className="space-y-4 mt-[40px]">
                    <div className="flex items-center gap-2">
                      <FormLabel className="w-[80px] text-right">受付№：</FormLabel>
                      <FormField
                        control={form.control}
                        name="reception_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="w-[262px] h-[30px] border-[#8B8484] rounded-[5px]"
                                {...field}
                                maxLength={20}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <FormLabel className="w-[80px] text-right">氏名：</FormLabel>
                      <FormField
                        control={form.control}
                        name="service_user_id"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              key={`service-user-${field.value}-${serviceUserProfiles.length}`}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[262px] !h-[30px] border-[#8B8484] rounded-[5px]">
                                  <SelectValue placeholder="利用者を選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceUserProfiles.length > 0 ? (
                                  serviceUserProfiles.map((profile) => (
                                    <SelectItem key={profile.service_user_id} value={String(profile.service_user_id)}>
                                      {profile.profile_name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem disabled={true} value="no-data">
                                    利用者が見つかりません
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <FormLabel className="w-[80px] text-right">対応職員：</FormLabel>
                      <FormField
                        control={form.control}
                        name="staff_id"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              key={`staff-${field.value}-${userOptions.length}`}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[262px] !h-[30px] border-[#8B8484] rounded-[5px]">
                                  <SelectValue placeholder="対応職員を選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {userOptions.length > 0 ? (
                                  userOptions.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                      {user.profile.fullname}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem disabled={true} value="no-data">
                                    スタッフが利用できません
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-base font-normal mb-1">アセスメント対応状況</span>
                    <VisitDatesSection form={form} fieldName="home_visit_dates" label="家庭訪問" />
                    <VisitDatesSection form={form} fieldName="outpatient_visit_dates" label="外来" />
                    <VisitDatesSection form={form} fieldName="phone_contact_dates" label="電話等" />
                  </div>
                </div>
              </div>

              <div className="border border-[#D9D9D9] pb-[50px] px-[32px] pt-[15px]">
                <div className="flex items-center justify-center">
                  <span className="text-xl font-bold leading-[130%]">障　害　者　本　人　の　概　要</span>
                </div>

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="life_history"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold leading-[130%]">生 活 歴</FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-16 mt-[15px]">
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-2">障害者手帳</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="physical_disability_type"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    if (!checked) {
                                      field.onChange("")
                                      form.setValue("physical_disability_grade", "")
                                    }
                                  }}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">身体手帳（</FormLabel>
                              <Input
                                className="w-[41px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                placeholder="種"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                maxLength={10}
                              />
                              <span>種</span>
                              <FormField
                                control={form.control}
                                name="physical_disability_grade"
                                render={({ field: gradeField }) => (
                                  <FormItem className="relative">
                                    <FormControl>
                                      <Input
                                        className="w-[41px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                        placeholder="級"
                                        {...gradeField}
                                        maxLength={10}
                                      />
                                    </FormControl>
                                    <div className="">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <span>級）</span>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="intellectual_disability_code"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    if (!checked) {
                                      field.onChange("")
                                    }
                                  }}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">療育手帳（</FormLabel>
                              <Input
                                className="w-[128px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                placeholder="記号"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                maxLength={10}
                              />
                              <span>）</span>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="mental_disability_grade"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    if (!checked) {
                                      field.onChange("")
                                    }
                                  }}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">精神保健福祉手帳（</FormLabel>
                              <Input
                                className="w-[49px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                placeholder="級"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                maxLength={10}
                              />
                              <span>級）</span>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="has_no_certificate"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">取得していない</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-2">障害者年金</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="has_basic_disability_pension"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked)
                                    if (!checked) {
                                      form.setValue("basic_disability_grade", "")
                                    }
                                  }}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">障害基礎年金</FormLabel>
                              <FormField
                                control={form.control}
                                name="basic_disability_grade"
                                render={({ field: gradeField }) => (
                                  <FormItem className="relative">
                                    <FormControl>
                                      <Input
                                        className="w-[86px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                        placeholder="級"
                                        {...gradeField}
                                        maxLength={10}
                                      />
                                    </FormControl>
                                    <div className="">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <span>級</span>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="has_welfare_disability_pension"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked)
                                    if (!checked) {
                                      form.setValue("welfare_disability_grade", "")
                                    }
                                  }}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">障害厚生年金</FormLabel>
                              <FormField
                                control={form.control}
                                name="welfare_disability_grade"
                                render={({ field: gradeField }) => (
                                  <FormItem >
                                    <FormControl>
                                      <Input
                                        className="w-[86px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                        placeholder="級"
                                        {...gradeField}
                                        maxLength={10}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <span>級</span>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="has_national_pension"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">国民年金</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <FormField
                          control={form.control}
                          name="has_other_pension"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked)
                                    if (!checked) {
                                      form.setValue("other_pension_details", "")
                                    }
                                  }}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="ml-2">その他年金（</FormLabel>
                              <FormField
                                control={form.control}
                                name="other_pension_details"
                                render={({ field: detailField }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        className="w-[154px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                        placeholder=""
                                        {...detailField}
                                        maxLength={255}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <span>）</span>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-[15px]">
                  <div className="font-bold text-base mb-2">生活保護の受給</div>
                  <div className="flex gap-8">
                    <FormField
                      control={form.control}
                      name="receives_welfare"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === true}
                              onCheckedChange={() => field.onChange(true)}
                              className="border-[#000000] rounded-[2px] w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-base font-normal">有り</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="receives_welfare"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === false}
                              onCheckedChange={() => field.onChange(false)}
                              className="border-[#000000] rounded-[2px] w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-base font-normal">無し</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-[15px]">
                  <div className="font-bold text-base mb-2">障害支援区分</div>
                  <div className="flex gap-8 flex-wrap">
                    <FormField
                      control={form.control}
                      name="disability_support_level"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "非該当"}
                              onCheckedChange={() => field.onChange(field.value === "非該当" ? "" : "非該当")}
                              className="border-[#000000] rounded-[2px] w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-base font-normal">非該当</FormLabel>
                        </FormItem>
                      )}
                    />
                    {["区分1", "区分2", "区分3", "区分4", "区分5", "区分6", "未認定"].map((level) => (
                      <FormField
                        key={level}
                        control={form.control}
                        name="disability_support_level"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === level}
                                onCheckedChange={() => field.onChange(field.value === level ? "" : level)}
                                className="border-[#000000] rounded-[2px] w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel className="text-base font-normal">{level}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <MedicalHistoryTable form={form} initialData={assessmentData?.service_user?.medical_disability_history} />

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="medical_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">
                          医療機関利用状況（現在の受診状況,受診科目,頻度,主治医,どの疾患での受診）
                        </FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="medication_detail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">＊服薬状況（服薬名・量）</FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-16 mt-[15px]">
                  <div className="flex-1">
                    <FormLabel className="font-bold text-base mb-2">医療保険　被保険者（本人・家族）</FormLabel>
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="insurance_type"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "国民健康保険"}
                                onCheckedChange={(checked) => field.onChange(checked ? "国民健康保険" : "")}
                                className="border-[#000000] rounded-[2px] w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel>国民健康保険</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="insurance_type"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "健康保険"}
                                onCheckedChange={(checked) => field.onChange(checked ? "健康保険" : "")}
                                className="border-[#000000] rounded-[2px] w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel>健康保険</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <FormLabel className="font-bold text-base mb-2">年金</FormLabel>
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="pension_type"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "更生医療"}
                                onCheckedChange={(checked) => field.onChange(checked ? "更生医療" : "")}
                                className="border-[#000000] rounded-[2px] w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel>更生医療</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pension_type"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "育成医療"}
                                onCheckedChange={(checked) => field.onChange(checked ? "育成医療" : "")}
                                className="border-[#000000] rounded-[2px] w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel>育成医療</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pension_type"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "精神通院医療"}
                                onCheckedChange={(checked) => field.onChange(checked ? "精神通院医療" : "")}
                                className="border-[#000000] rounded-[2px] w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel>精神通院医療</FormLabel>
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="pension_type"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "その他"}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange("その他")
                                    } else {
                                      field.onChange("")
                                      form.setValue("pension_other_detail", "")
                                    }
                                  }}
                                  className="border-[#000000] rounded-[2px] w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel>その他 (</FormLabel>
                              <FormField
                                control={form.control}
                                name="pension_other_detail"
                                render={({ field: detailField }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        className="w-[154px] h-[19px] text-sm border-[#8B8484] rounded-[5px]"
                                        placeholder=""
                                        {...detailField}
                                        maxLength={255}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <span>）</span>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="insurance_symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">記号</FormLabel>
                        <FormControl>
                          <Input className="w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="insured_person_relation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">番号</FormLabel>
                        <FormControl>
                          <Input className="w-full border-[#8B8484] rounded-[5px]" {...field} maxLength={20} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="current_assistive_device"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">現在使用している福祉用具：</FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border border-[#D9D9D9] rounded-[5px] p-[10px]">
                <div className="flex items-center mb-2">
                  <span className="text-base font-bold mr-2">生活状況（普通の１日の流れ）</span>
                  <span className="text-xs font-normal">※週間生活表が必要な場合は別紙に記入</span>
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="daily_routine_self"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold mb-2">本人</FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="daily_routine_caregiver"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold mb-2">介護者</FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border border-[#D9D9D9] rounded-[5px] p-[10px]">
                <div className="mb-2 flex items-center">
                  <span className="text-base font-bold mr-2">利用者の状況</span>
                </div>

                {livingDomainSections.map((section) => (
                  <LivingDomainTable
                    key={section.number}
                    form={form}
                    sectionNumber={section.number}
                    sectionTitle={section.title}
                    domains={section.domains}
                    startIndex={section.startIndex}
                  />
                ))}
              </div>

              <div className="border border-[#D9D9D9] rounded-[5px] p-[10px]">
                <div>
                  <FormField
                    control={form.control}
                    name="desired_life_user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">本人の要望・希望する暮らし</FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="desired_life_family"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">家族の要望・希望する暮らし</FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 mb-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="daily_routine_caregiver"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-base mb-2">関係職種からの情報</FormLabel>
                          <FormControl>
                            <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="other_information"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-base mb-2">その他の情報</FormLabel>
                          <FormControl>
                            <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <FormLabel className="font-bold text-base mb-2">家屋の見取り図</FormLabel>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={form.watch("house_owned") === true}
                        onCheckedChange={() => form.setValue("house_owned", true)}
                        className="border-[#000000] rounded-[2px] w-4 h-4"
                      />
                      <span>本人</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={form.watch("house_owned") === false}
                        onCheckedChange={() => form.setValue("house_owned", false)}
                        className="border-[#000000] rounded-[2px] w-4 h-4"
                      />
                      <span>ご家族</span>
                    </label>
                  </div>
                  <FormField
                    control={form.control}
                    name="house_type_other"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="h-[60px] w-full border-[#8B8484] rounded-[5px]"
                            {...field}
                            placeholder="トイレ、浴室位置の形状、玄関、道路までのアクセスや段差等の記入"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-base mb-2">
                          担当者所見（注目すべき点、気になる点を含む）
                        </FormLabel>
                        <FormControl>
                          <Textarea className="h-[100px] w-full border-[#8B8484] rounded-[5px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default FormAssessment
