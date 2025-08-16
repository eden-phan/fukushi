import { IDailyReportProps } from "@/@types/daily-report";

const DAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

export const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    return DAYS[date.getDay()];
};

export const getShiftType = (report: IDailyReportProps): string => {
    if (report.day_shift_staff) return "日勤";
    if (report.night_shift_staff) return "夜勤";
    return "-";
};

export const getRecorderName = (report: IDailyReportProps): string => {
    return report.day_shift_staff?.profile.fullname ||
        report.night_shift_staff?.profile.fullname ||
        "-";
};

export const getUserCount = (report: IDailyReportProps): string => {
    return `${report.daily_report_service_users.length}人`;
};

export const getOvernightHospitalInfo = (report: IDailyReportProps): string => {
    const overnightCount = report.daily_report_service_users.filter(
        user => user.overnight_stay
    ).length;

    const hospitalizedCount = report.daily_report_service_users.filter(
        user => user.hospitalized
    ).length;

    return `外泊${overnightCount}名、入院${hospitalizedCount}名`;
};
