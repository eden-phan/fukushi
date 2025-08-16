export const monthRegex = /^(1[0-2]|[1-9])$/
export const dayRegex = /^(3[01]|[12][0-9]|[1-9])$/

export const formatVisitDatesForAPI = (dates: { month: string; day: string }[]): string[] => {
  return dates
    .filter((date) => {
      const month = date.month?.trim()
      const day = date.day?.trim()
      return month && day && month !== "" && day !== ""
    })
    .map((date) => {
      const year = new Date().getFullYear()
      const month = String(date.month).padStart(2, "0")
      const day = String(date.day).padStart(2, "0")
      return `${year}-${month}-${day}`
    })
}

export const parseVisitDates = (dates: string[]): { month: string; day: string }[] => {
  if (!dates?.length) return []

  return dates
    .map((dateStr) => {
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return null

        const month = date.getMonth() + 1
        const day = date.getDate()

        if (month < 1 || month > 12 || day < 1 || day > 31) return null

        return { month: String(month), day: String(day) }
      } catch {
        return null
      }
    })
    .filter((date): date is { month: string; day: string } => date !== null)
}

export const handleTextareaChange = (value: string, maxLength = 1000): string => {
  return value.length <= maxLength ? value : value.substring(0, maxLength)
}

export const validateMonthInput = (month: string): boolean => {
  return month === "" || monthRegex.test(month)
}

export const validateDayInput = (day: string): boolean => {
  return day === "" || dayRegex.test(day)
}
