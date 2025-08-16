"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState, useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, CalendarIcon, Minus } from 'lucide-react'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import http from "@/services/http"
import { createSuccessToast, updateSuccessToast } from "@/lib/message"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ja } from "date-fns/locale"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { TimeRangePicker } from "@/components/customs/time-range-picker"
import { Signature } from "@/components/customs/signature"
import { IDailyReportProps } from "@/@types/daily-report"
import { Loading } from "@/components/ui/loading"
import { TextArea } from "@/components/ui/text-area"

type ServiceUserProfileProps = {
  service_user_id: number
  profile_name: string
}

const formSchema = z.object({
  entry_date: z.string().nonempty("記入年月日は必須です"),
  day_shift_staff_id: z.string().optional(),
  night_shift_staff_id: z.string().optional(),
  support_content: z.string().optional(),
  work_details: z.string().optional(),
  note: z.string().optional(),
  night_shift_note: z.string().optional(),
  daily_report_staffs: z.array(z.object({
    id: z.number().optional(),
    staff_id: z.string().nonempty("スタッフを選択してください"),
    work_content: z.string().optional(),
    shift_type: z.enum(["day_shift", "night_shift"]),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
  })),
  daily_report_service_users: z.array(z.object({
    id: z.number().optional(),
    service_user_id: z.string().nonempty("利用者を選択してください"),
    overnight_stay: z.boolean().optional(),
    hospitalized: z.boolean().optional(),
  })),
  overnight_stay_users: z.array(z.object({
    service_user_id: z.string().nonempty("利用者を選択してください"),
  })),
  hospitalized_users: z.array(z.object({
    service_user_id: z.string().nonempty("利用者を選択してください"),
  })),
  signatures: z.object({
    admin_signature: z.string().optional(),
    service_manager_signature: z.string().optional(),
    life_support_staff_signature_1: z.string().optional(),
    life_support_staff_signature_2: z.string().optional(),
    life_support_staff_signature_3: z.string().optional(),
    caregiver_signature_1: z.string().optional(),
    caregiver_signature_2: z.string().optional(),
    caregiver_signature_3: z.string().optional(),
    caregiver_signature_4: z.string().optional(),
  }),
})

type FormDailyReportProps = {
  data?: IDailyReportProps
  editId?: string
  onBackToList?: () => void
  initialLoading?: boolean
  dataLoaded?: boolean
}

export default function FormDailyReport({ data, editId, onBackToList, initialLoading = false, dataLoaded = true }: FormDailyReportProps) {
  const router = useRouter()
  const [staffOptions, setStaffOptions] = useState<StaffProps[]>([])
  const [serviceUserOptions, setServiceUserOptions] = useState<ServiceUserProfileProps[]>([])
  const [loading, setLoading] = useState(false)
  const [internalDataLoaded, setInternalDataLoaded] = useState({
    staff: false,
    serviceUsers: false,
    facilityUserRoles: false,
    formData: false
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entry_date: "",
      day_shift_staff_id: "",
      night_shift_staff_id: "",
      support_content: "",
      work_details: "",
      note: "",
      night_shift_note: "",
      daily_report_staffs: [
        {
          staff_id: "",
          work_content: "",
          shift_type: "day_shift",
          start_time: "",
          end_time: "",
        }
      ],
      daily_report_service_users: [
        {
          service_user_id: "",
          overnight_stay: false,
          hospitalized: false,
        }
      ],
      overnight_stay_users: [],
      hospitalized_users: [],
      signatures: {
        admin_signature: "",
        service_manager_signature: "",
        life_support_staff_signature_1: "",
        life_support_staff_signature_2: "",
        life_support_staff_signature_3: "",
        caregiver_signature_1: "",
        caregiver_signature_2: "",
        caregiver_signature_3: "",
        caregiver_signature_4: "",
      },
    },
  })

  const { fields: staffFields, append: appendStaff } = useFieldArray({
    control: form.control,
    name: "daily_report_staffs",
  })

  const { fields: serviceUserFields, append: appendServiceUser, remove: removeServiceUser } = useFieldArray({
    control: form.control,
    name: "daily_report_service_users",
  })

  const { fields: overnightStayFields, append: appendOvernightStay, remove: removeOvernightStay } = useFieldArray({
    control: form.control,
    name: "overnight_stay_users",
  })

  const { fields: hospitalizedFields, append: appendHospitalized, remove: removeHospitalized } = useFieldArray({
    control: form.control,
    name: "hospitalized_users",
  })

  const fetchStaffAndRoles = useCallback(async () => {
    try {
      const staffResponse = await http.get("/user/staff")
      const staffData: StaffProps[] = staffResponse.data.data || []

      const facilityUserRolesResponse = await http.get("/facility-user")
      const facilityUserRolesData: { user_id: number; facility_role: string | null }[] = facilityUserRolesResponse.data.data || facilityUserRolesResponse.data || []

      const mergedStaffData = staffData.map(staff => {
        const roleInfo = facilityUserRolesData.find(fu => fu.user_id === Number(staff.id))
        return {
          ...staff,
          facility_user: {
            ...staff.facility_user,
            facility_role: roleInfo?.facility_role || staff.facility_user?.facility_role || null,
          }
        }
      })
      setStaffOptions(mergedStaffData)
      setInternalDataLoaded(prev => ({ ...prev, staff: true, facilityUserRoles: true }))
    } catch {
      setStaffOptions([])
      setInternalDataLoaded(prev => ({ ...prev, staff: true, facilityUserRoles: true }))
    }
  }, [])

  const fetchServiceUserProfiles = useCallback(async () => {
    try {
      const response = await http.get("/service-user/profile")
      setServiceUserOptions(response.data.data || [])
      setInternalDataLoaded(prev => ({ ...prev, serviceUsers: true }))
    } catch {
      setServiceUserOptions([])
      setInternalDataLoaded(prev => ({ ...prev, serviceUsers: true }))
    }
  }, [])

  useEffect(() => {
    fetchStaffAndRoles()
    fetchServiceUserProfiles()
  }, [fetchStaffAndRoles, fetchServiceUserProfiles])

  useEffect(() => {
    if (data && internalDataLoaded.staff && internalDataLoaded.serviceUsers && internalDataLoaded.facilityUserRoles && dataLoaded) {
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      const getSignatureValue = (type: string, index?: number) => {
        const signatureKey = index !== undefined ? `${type}_${index + 1}` : type
        return data.signatures?.find(sig => sig.signature_type === signatureKey)?.signature_value || ""
      }

      const overnightStayUsers = data.daily_report_service_users
        ?.filter(user => user.overnight_stay)
        .map(user => ({ service_user_id: String(user.service_user_id) })) || []

      const hospitalizedUsers = data.daily_report_service_users
        ?.filter(user => user.hospitalized)
        .map(user => ({ service_user_id: String(user.service_user_id) })) || []

      setTimeout(() => {
        form.reset({
          entry_date: formatDate(data.entry_date),
          day_shift_staff_id: data.day_shift_staff_id ? String(data.day_shift_staff_id) : "",
          night_shift_staff_id: data.night_shift_staff_id ? String(data.night_shift_staff_id) : "",
          support_content: data.support_content || "",
          work_details: data.work_details || "",
          note: data.note || "",
          night_shift_note: data.night_shift_note || "",
          daily_report_staffs: data.daily_report_staffs?.length > 0 ? data.daily_report_staffs.map(staff => ({
            id: staff.id,
            staff_id: String(staff.staff_id),
            work_content: staff.work_content || "",
            shift_type: staff.shift_type,
            start_time: staff.shift_hours?.[0] || "",
            end_time: staff.shift_hours?.[1] || "",
          })) : [{
            staff_id: "",
            work_content: "",
            shift_type: "day_shift" as const,
            start_time: "",
            end_time: "",
          }],
          daily_report_service_users: data.daily_report_service_users?.length > 0 ? data.daily_report_service_users.map(serviceUser => ({
            id: serviceUser.id,
            service_user_id: String(serviceUser.service_user_id),
            overnight_stay: serviceUser.overnight_stay || false,
            hospitalized: serviceUser.hospitalized || false,
          })) : [{
            service_user_id: "",
            overnight_stay: false,
            hospitalized: false,
          }],
          overnight_stay_users: overnightStayUsers.length > 0 ? overnightStayUsers : [],
          hospitalized_users: hospitalizedUsers.length > 0 ? hospitalizedUsers : [],
          signatures: {
            admin_signature: getSignatureValue("admin"),
            service_manager_signature: getSignatureValue("service_manager"),
            life_support_staff_signature_1: getSignatureValue("life_support_staff", 0),
            life_support_staff_signature_2: getSignatureValue("life_support_staff", 1),
            life_support_staff_signature_3: getSignatureValue("life_support_staff", 2),
            caregiver_signature_1: getSignatureValue("caregiver", 0),
            caregiver_signature_2: getSignatureValue("caregiver", 1),
            caregiver_signature_3: getSignatureValue("caregiver", 2),
            caregiver_signature_4: getSignatureValue("caregiver", 3),
          },
        })
        setInternalDataLoaded(prev => ({ ...prev, formData: true }))
      }, 100)
    } else if (!data && dataLoaded) {
      setInternalDataLoaded(prev => ({ ...prev, formData: true }))
    }
  }, [data, form, internalDataLoaded.staff, internalDataLoaded.serviceUsers, internalDataLoaded.facilityUserRoles, dataLoaded])

  const addStaffEntry = () => {
    appendStaff({
      staff_id: "",
      work_content: "",
      shift_type: "day_shift",
      start_time: "",
      end_time: "",
    })
  }

  const addServiceUserEntry = () => {
    appendServiceUser({
      service_user_id: "",
      overnight_stay: false,
      hospitalized: false,
    })
  }

  const addOvernightStayEntry = () => {
    appendOvernightStay({
      service_user_id: "",
    })
  }

  const addHospitalizedEntry = () => {
    appendHospitalized({
      service_user_id: "",
    })
  }

  const handleRemoveServiceUser = (index: number) => {
    const serviceUserId = form.watch(`daily_report_service_users.${index}.service_user_id`)

    const overnightStayIndex = overnightStayFields.findIndex(
      (_, idx) => form.watch(`overnight_stay_users.${idx}.service_user_id`) === serviceUserId
    )
    if (overnightStayIndex !== -1) {
      removeOvernightStay(overnightStayIndex)
    }

    const hospitalizedIndex = hospitalizedFields.findIndex(
      (_, idx) => form.watch(`hospitalized_users.${idx}.service_user_id`) === serviceUserId
    )
    if (hospitalizedIndex !== -1) {
      removeHospitalized(hospitalizedIndex)
    }

    removeServiceUser(index)
  }

  const getStaffPosition = (staffId: string) => {
    if (!staffId) {
      return ""
    }
    const staff = staffOptions.find(s => String(s.id) === staffId)
    return staff?.facility_user?.facility_role || staff?.facility_user?.facility?.name || ""
  }

  const getAvailableServiceUsers = (currentIndex: number) => {
    const selectedIds = serviceUserFields
      .map((_, index) => index !== currentIndex ? form.watch(`daily_report_service_users.${index}.service_user_id`) : null)
      .filter(id => id)

    return serviceUserOptions.filter(user =>
      !selectedIds.includes(String(user.service_user_id))
    )
  }

  const getAvailableServiceUsersForOvernightStay = (currentIndex: number) => {
    const selectedServiceUserIds = form.getValues("daily_report_service_users")
      .map(user => user.service_user_id)
      .filter(id => id)

    const selectedOvernightIds = overnightStayFields
      .map((_, index) => index !== currentIndex ? form.watch(`overnight_stay_users.${index}.service_user_id`) : null)
      .filter(id => id)

    const hospitalizedIds = form.getValues("hospitalized_users")
      .map(user => user.service_user_id)
      .filter(id => id)

    return serviceUserOptions.filter(user =>
      selectedServiceUserIds.includes(String(user.service_user_id)) &&
      !selectedOvernightIds.includes(String(user.service_user_id)) &&
      !hospitalizedIds.includes(String(user.service_user_id))
    )
  }

  const getAvailableServiceUsersForHospitalized = (currentIndex: number) => {
    const selectedServiceUserIds = form.getValues("daily_report_service_users")
      .map(user => user.service_user_id)
      .filter(id => id)

    const selectedHospitalizedIds = hospitalizedFields
      .map((_, index) => index !== currentIndex ? form.watch(`hospitalized_users.${index}.service_user_id`) : null)
      .filter(id => id)

    const overnightStayIds = form.getValues("overnight_stay_users")
      .map(user => user.service_user_id)
      .filter(id => id)

    return serviceUserOptions.filter(user =>
      selectedServiceUserIds.includes(String(user.service_user_id)) &&
      !selectedHospitalizedIds.includes(String(user.service_user_id)) &&
      !overnightStayIds.includes(String(user.service_user_id))
    )
  }

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

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      const signaturesArray = [
        { signature_type: "admin", signature_value: submitData.signatures.admin_signature || "" },
        { signature_type: "service_manager", signature_value: submitData.signatures.service_manager_signature || "" },
        { signature_type: "life_support_staff_1", signature_value: submitData.signatures.life_support_staff_signature_1 || "" },
        { signature_type: "life_support_staff_2", signature_value: submitData.signatures.life_support_staff_signature_2 || "" },
        { signature_type: "life_support_staff_3", signature_value: submitData.signatures.life_support_staff_signature_3 || "" },
        { signature_type: "caregiver_1", signature_value: submitData.signatures.caregiver_signature_1 || "" },
        { signature_type: "caregiver_2", signature_value: submitData.signatures.caregiver_signature_2 || "" },
        { signature_type: "caregiver_3", signature_value: submitData.signatures.caregiver_signature_3 || "" },
        { signature_type: "caregiver_4", signature_value: submitData.signatures.caregiver_signature_4 || "" },
      ].filter(sig => sig.signature_value)

      const mergedServiceUsers = submitData.daily_report_service_users.map(serviceUser => {
        const isOvernightStay = submitData.overnight_stay_users.some(
          overnight => overnight.service_user_id === serviceUser.service_user_id
        )
        const isHospitalized = submitData.hospitalized_users.some(
          hospitalized => hospitalized.service_user_id === serviceUser.service_user_id
        )

        return {
          ...serviceUser,
          service_user_id: Number(serviceUser.service_user_id),
          overnight_stay: isOvernightStay,
          hospitalized: isHospitalized,
        }
      })

      const requestData = {
        ...submitData,
        day_shift_staff_id: submitData.day_shift_staff_id ? Number(submitData.day_shift_staff_id) : null,
        night_shift_staff_id: submitData.night_shift_staff_id ? Number(submitData.night_shift_staff_id) : null,
        daily_report_staffs: submitData.daily_report_staffs.map(staff => ({
          ...staff,
          staff_id: Number(staff.staff_id),
          shift_hours: [staff.start_time || "", staff.end_time || ""],
        })),
        daily_report_service_users: mergedServiceUsers,
        signatures: signaturesArray,
      }

      delete (requestData as Record<string, unknown>).overnight_stay_users
      delete (requestData as Record<string, unknown>).hospitalized_users

      const message = editId ? updateSuccessToast : createSuccessToast
      const method = editId ? http.put : http.post
      const url = editId ? `/daily-reports/update/${editId}` : "/daily-reports/store"

      await method(url, requestData)
      toast.success(message)

      if (onBackToList) {
        setTimeout(() => {
          onBackToList()
        }, 1000)
      } else {
        router.push("/admin/daily-report")
      }

      if (!editId) form.reset()
    } catch (error) {
      handleApiError(error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })
    } finally {
      setLoading(false)
    }
  }

  const isFormReady = internalDataLoaded.staff && internalDataLoaded.serviceUsers && internalDataLoaded.facilityUserRoles && internalDataLoaded.formData && dataLoaded && !initialLoading

  // This function is no longer needed as per user request to remove staffEntries validation
  // const getStaffValidationErrors = () => {
  //   const errors: string[] = []
  //   const staffErrors = form.formState.errors?.daily_report_staffs
  //   if (Array.isArray(staffErrors)) {
  //     staffErrors.forEach((staffError, index) => {
  //       if (staffError && typeof staffError === "object" && !Array.isArray(staffError)) {
  //         if ("staff_id" in staffError && staffError.staff_id?.message) {
  //           errors.push(`行 ${index + 1}: ${staffError.staff_id.message}`)
  //         }
  //         if ("start_time" in staffError && staffError.start_time?.message) {
  //           errors.push(`行 ${index + 1}: ${staffError.start_time.message}`)
  //         }
  //         if ("end_time" in staffError && staffError.end_time?.message) {
  //           errors.push(`行 ${index + 1}: ${staffError.end_time.message}`)
  //         }
  //       }
  //     })
  //   }
  //   return errors
  // }

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white relative">
      {loading || !isFormReady ? (
        <div className="flex items-center justify-center p-10">
          <Loading />
        </div>
      ) : (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center justify-end">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="noneOutline"
                    onClick={() => {
                      if (onBackToList) {
                        onBackToList();
                      } else {
                        router.push("/admin/daily-report");
                      }
                    }}
                    disabled={loading || !isFormReady}
                    className="font-normal bg-gray-400 rounded-[4px]"
                  >
                    戻る
                  </Button>
                  <Button type="submit" disabled={loading || !isFormReady} className="bg-[#3C94DF] rounded-[4px]">
                    {loading ? "更新中..." : editId ? "更新" : "登録"}
                  </Button>
                </div>
              </div>

              <div className="border border-[#D9D9D9] px-[15px] py-[20px] w-full">
                <div className="flex justify-start mb-4">
                  <span className="text-black text-base font-bold">記録者名</span>
                </div>

                <div className="grid grid-cols-2 gap-[62px] gap-y-4 w-full">
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="entry_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-sm font-normal">
                            記入年月日 <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full !h-[45px] pl-3 text-left font-normal justify-start rounded-[4px]",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? format(new Date(field.value), "yyyy年MM月dd日 (EEEE)", { locale: ja })
                                    : "日付を選択"}
                                  <CalendarIcon className="ml-auto h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) =>
                                    field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                                  }
                                  captionLayout="label"
                                  locale={ja}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full" />

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="day_shift_staff_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            日中 <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            key={`day-shift-${field.value}-${staffOptions.length}`}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full !h-[45px] pl-3 text-left font-normal  rounded-[4px]">
                                <SelectValue placeholder="対応職員を選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {staffOptions.map((user) => (
                                <SelectItem key={user.id} value={String(user.id)}>
                                  {user.profile.fullname}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="night_shift_staff_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            夜勤 <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            key={`night-shift-${field.value}-${staffOptions.length}`}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full !h-[45px] pl-3 text-left font-normal rounded-[4px]">
                                <SelectValue placeholder="対応職員を選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {staffOptions.map((user) => (
                                <SelectItem key={user.id} value={String(user.id)}>
                                  {user.profile.fullname}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#D9D9D9] px-[15px] py-[20px] w-full">
                <div className="space-y-[10px]">
                  <div className="flex justify-start">
                    <span className="text-base font-bold">スタッフ</span>
                  </div>
                  <div className="overflow-x-auto rounded-[5px] overflow-hidden border border-[#D9D9D9]">
                    <Table className="w-full border-collapse">
                      <TableBody>
                        {staffFields.map((field, index) => (
                          <TableRow key={field.id} className={index === 0 ? "" : "border-t border-[#D9D9D9]"}>
                            <TableCell className="border-r border-[#D9D9D9] p-0 bg-white w-[300px] h-[54px]">
                              <Select
                                onValueChange={(value) => {
                                  form.setValue(`daily_report_staffs.${index}.staff_id`, value, { shouldValidate: true, shouldDirty: true });
                                  form.trigger(`daily_report_staffs`);
                                }}
                                value={form.watch(`daily_report_staffs.${index}.staff_id`) || ""}
                                key={`staff-${index}-${form.watch(`daily_report_staffs.${index}.staff_id`)}-${staffOptions.length}`}
                              >
                                <FormControl className="w-full h-full">
                                  <SelectTrigger className="w-full min-w-full border-none rounded-none resize-none focus:ring-0 focus-visible:ring-0 focus:border-none shadow-none">
                                    <SelectValue placeholder="対応職員を選択してください" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {staffOptions.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                      {user.profile.fullname}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell className="border-r border-[#D9D9D9] p-0 bg-white h-[54px] w-[200px]">
                              <div className="flex items-center justify-center h-[54px] px-3 text-sm text-gray-700">
                                {getStaffPosition(form.watch(`daily_report_staffs.${index}.staff_id`))}
                              </div>
                            </TableCell>

                            <TableCell className="p-0 bg-white h-[54px] min-w-[200px]">
                              <div className="flex flex-col">
                                <TimeRangePicker
                                  startTime={form.watch(`daily_report_staffs.${index}.start_time`)}
                                  endTime={form.watch(`daily_report_staffs.${index}.end_time`)}
                                  onStartTimeChange={(time) => {
                                    form.setValue(`daily_report_staffs.${index}.start_time`, time, { shouldValidate: true, shouldDirty: true });
                                    form.trigger(`daily_report_staffs`);
                                  }}
                                  onEndTimeChange={(time) => {
                                    form.setValue(`daily_report_staffs.${index}.end_time`, time, { shouldValidate: true, shouldDirty: true });
                                    form.trigger(`daily_report_staffs`);
                                  }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Removed the getStaffValidationErrors() call and its rendering block as per user request */}

                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      onClick={addStaffEntry}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-normal"
                      variant="ghost"
                    >
                      <Plus className="w-4 h-4" />
                      新規作成
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-start mb-4">
                    <h3 className="text-base font-bold">利用者</h3>
                  </div>

                  <div className="space-y-3">
                    {serviceUserFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`daily_report_service_users.${index}.service_user_id`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  key={`service-user-${index}-${field.value}-${serviceUserOptions.length}`}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full h-[45px] border border-gray-300 rounded">
                                      <SelectValue placeholder="利用者を選択" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {getAvailableServiceUsers(index).map((user) => (
                                      <SelectItem key={user.service_user_id} value={String(user.service_user_id)}>
                                        {user.profile_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {serviceUserFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveServiceUser(index)}
                            className="h-[45px] w-[45px] p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end mt-3">
                    <Button
                      type="button"
                      onClick={addServiceUserEntry}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-normal"
                      variant="ghost"
                    >
                      <Plus className="w-4 h-4" />
                      新規作成
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-[22px]">
                  <div className="space-y-[10px]">
                    <h3 className="text-base font-bold">外泊</h3>
                    <div className="space-y-[10px]">
                      {overnightStayFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`overnight_stay_users.${index}.service_user_id`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value || ""}
                                    key={`overnight-${index}-${field.value}-${serviceUserOptions.length}`}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full h-[45px] border border-gray-300 rounded">
                                        <SelectValue placeholder="外泊する利用者を選択" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {getAvailableServiceUsersForOvernightStay(index).map((user) => (
                                        <SelectItem key={user.service_user_id} value={String(user.service_user_id)}>
                                          {user.profile_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOvernightStay(index)}
                            className="h-[45px] w-[45px] p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        onClick={addOvernightStayEntry}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-normal"
                        variant="ghost"
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                        追加
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-[10px]">
                    <h3 className="text-base font-bold">入院</h3>
                    <div className="space-y-[10px]">
                      {hospitalizedFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`hospitalized_users.${index}.service_user_id`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value || ""}
                                    key={`hospitalized-${index}-${field.value}-${serviceUserOptions.length}`}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full h-[45px] border border-gray-300 rounded">
                                        <SelectValue placeholder="入院する利用者を選択" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {getAvailableServiceUsersForHospitalized(index).map((user) => (
                                        <SelectItem key={user.service_user_id} value={String(user.service_user_id)}>
                                          {user.profile_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHospitalized(index)}
                            className="h-[45px] w-[45px] p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        onClick={addHospitalizedEntry}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-normal"
                        variant="ghost"
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                        追加
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-[#D9D9D9] px-[15px] py-[20px] mt-[22px]">
                <span className="text-base font-bold">本　日　の　予　定</span>
                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="support_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">会議・研修</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] resize-none border border-gray-300"
                            placeholder="本日の予定を入力してください"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-[15px]">
                  <span className="text-base font-bold">本日の出来事</span>
                  <FormField
                    control={form.control}
                    name="work_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">朝～夜</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] resize-none border border-gray-300"
                            placeholder="本日の出来事を入力してください"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="night_shift_note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">夜勤時</FormLabel>
                        <FormControl>
                          <TextArea
                            className="min-h-[120px] resize-none border border-gray-300 mt-2"
                            placeholder="夜勤時の出来事を入力してください"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-[15px]">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">報告・申し送り</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] resize-none border border-gray-300"
                            placeholder="報告・申し送り事項を入力してください"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-[10px]">
                <Signature
                  fields={[
                    {
                      name: "admin_signature",
                      label: "管理者",
                      value: form.watch("signatures.admin_signature"),
                      onChange: (value) => form.setValue("signatures.admin_signature", value),
                      disabled: loading,
                    },
                    {
                      name: "service_manager_signature",
                      label: "サービス管理責任者",
                      value: form.watch("signatures.service_manager_signature"),
                      onChange: (value) => form.setValue("signatures.service_manager_signature", value),
                      disabled: loading,
                    },
                    {
                      name: "life_support_staff_signature",
                      label: "生活支援員",
                      multipleFields: [
                        {
                          name: "life_support_staff_signature_1",
                          value: form.watch("signatures.life_support_staff_signature_1"),
                          onChange: (value) => form.setValue("signatures.life_support_staff_signature_1", value),
                          disabled: loading,
                        },
                        {
                          name: "life_support_staff_signature_2",
                          value: form.watch("signatures.life_support_staff_signature_2"),
                          onChange: (value) => form.setValue("signatures.life_support_staff_signature_2", value),
                          disabled: loading,
                        },
                        {
                          name: "life_support_staff_signature_3",
                          value: form.watch("signatures.life_support_staff_signature_3"),
                          onChange: (value) => form.setValue("signatures.life_support_staff_signature_3", value),
                          disabled: loading,
                        },
                      ],
                    },
                    {
                      name: "caregiver_signature",
                      label: "世話人",
                      multipleFields: [
                        {
                          name: "caregiver_signature_1",
                          value: form.watch("signatures.caregiver_signature_1"),
                          onChange: (value) => form.setValue("signatures.caregiver_signature_1", value),
                          disabled: loading,
                        },
                        {
                          name: "caregiver_signature_2",
                          value: form.watch("signatures.caregiver_signature_2"),
                          onChange: (value) => form.setValue("signatures.caregiver_signature_2", value),
                          disabled: loading,
                        },
                        {
                          name: "caregiver_signature_3",
                          value: form.watch("signatures.caregiver_signature_3"),
                          onChange: (value) => form.setValue("signatures.caregiver_signature_3", value),
                          disabled: loading,
                        },
                        {
                          name: "caregiver_signature_4",
                          value: form.watch("signatures.caregiver_signature_4"),
                          onChange: (value) => form.setValue("signatures.caregiver_signature_4", value),
                          disabled: loading,
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
