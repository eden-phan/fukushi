import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export const formatJapaneseDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const getFormattedDateRange = (date?: DateRange) => {
  return {
    date_from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
    date_to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
  };
};
