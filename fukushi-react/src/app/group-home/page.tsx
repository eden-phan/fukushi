"use client"
import {
    UITable,
    UITableBody,
    UITableCell,
    UITableHead,
    UITableHeader,
    UITableRow,
} from "@/components/customs/ui-table"
import { UICard, UICardContent, UICardFooter, UICardHeader } from "@/components/ui/ui-dashboard-card"
import { UIStatCard, UIStatCardContent, UIStatCardGroup, UIStatCardHeader } from "@/components/ui/ui-stat-card"
import { Label } from "@radix-ui/react-label"
import Link from "next/link"
import { Pie, Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartOptions,
} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, ChartDataLabels)

export default function GroupHomeDashboard() {
    const careScheduleColumns = [
        {
            header: "時間",
            accessorKey: "time",
        },
        {
            header: "利用者",
            accessorKey: "resident",
        },
        {
            header: "ケア内容",
            accessorKey: "care_type",
        },
        {
            header: "担当スタッフ",
            accessorKey: "staff",
        },
    ]

    const incidentColumns = [
        {
            header: "日時",
            accessorKey: "datetime",
        },
        {
            header: "利用者",
            accessorKey: "resident",
        },
        {
            header: "インシデント種別",
            accessorKey: "type",
        },
        {
            header: "対応状況",
            accessorKey: "status",
        },
    ]

    // Fixed data for Group Home dashboard
    const careScheduleData = [
        {
            time: "08:00",
            resident: "田中太郎",
            care_type: "服薬介助",
            staff: "山田看護師",
        },
        {
            time: "09:00",
            resident: "佐藤花子",
            care_type: "入浴介助",
            staff: "鈴木介護士",
        },
        {
            time: "12:00",
            resident: "高橋一郎",
            care_type: "服薬介助",
            staff: "山田看護師",
        },
        {
            time: "14:00",
            resident: "佐藤花子",
            care_type: "リハビリテーション",
            staff: "理学療法士",
        },
    ]

    const incidentData = [
        {
            datetime: "2024-01-15 14:30",
            resident: "田中太郎",
            type: "転倒",
            status: "対応済み",
        },
        {
            datetime: "2024-01-15 16:00",
            resident: "佐藤花子",
            type: "服薬拒否",
            status: "経過観察中",
        },
        {
            datetime: "2024-01-14 22:15",
            resident: "高橋一郎",
            type: "体調不良",
            status: "対応済み",
        },
    ]

    // Fixed service utilization data for chart
    const serviceUtilizationData = {
        labels: [
            "身体介護",
            "生活支援",
            "医療的ケア",
            "レクリエーション",
            "リハビリテーション",
        ],
        datasets: [
            {
                data: [45, 30, 25, 20, 15],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
        ],
    }

    // Fixed care hours trend data for chart
    const careHoursTrendData = {
        labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
        datasets: [
            {
                label: "身体介護時間",
                data: [120, 135, 140, 125, 150, 145],
                fill: false,
                backgroundColor: "#ff6384",
                borderColor: "#ff6384",
            },
            {
                label: "生活支援時間",
                data: [80, 85, 90, 75, 95, 88],
                fill: false,
                backgroundColor: "#36a2eb",
                borderColor: "#36a2eb",
            },
            {
                label: "医療的ケア時間",
                data: [60, 65, 55, 70, 68, 72],
                fill: false,
                backgroundColor: "#ffce56",
                borderColor: "#ffce56",
            },
        ],
    }

    const pieChartConfig: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            datalabels: {
                color: "#000",
                formatter: (value) => {
                    return `${value}`
                },
                font: {
                    weight: "bold",
                },
            },
        },
    }

    const lineChartConfig: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            datalabels: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "時間数",
                },
            },
        },
    }

    return (
        <div className="flex flex-col h-full pt-4 pb-4">
            <div className="p-8">
                <Label className="text-2xl font-bold">グループホーム ダッシュボード</Label>
            </div>
            
            {/* Statistics Overview */}
            <UIStatCardGroup>
                <UIStatCard>
                    <UIStatCardHeader color="#FA9193" icon="/service_user.svg">
                        入居者数
                    </UIStatCardHeader>
                    <UIStatCardContent>12</UIStatCardContent>
                </UIStatCard>
                <UIStatCard>
                    <UIStatCardHeader color="#76C0FF" icon="/staff.svg">
                        勤務中スタッフ
                    </UIStatCardHeader>
                    <UIStatCardContent>8</UIStatCardContent>
                </UIStatCard>
                <UIStatCard>
                    <UIStatCardHeader color="#56BA8F" icon="/form.svg">
                        緊急連絡先
                    </UIStatCardHeader>
                    <UIStatCardContent>24</UIStatCardContent>
                </UIStatCard>
                <UIStatCard>
                    <UIStatCardHeader color="#FFD385" icon="/building.svg">
                        今月のインシデント
                    </UIStatCardHeader>
                    <UIStatCardContent>3</UIStatCardContent>
                </UIStatCard>
            </UIStatCardGroup>

            {/* Care Management Section */}
            <div className="flex flex-row gap-16">
                <UICard className="mt-8">
                    <UICardHeader className="text-2xl font-bold" icon="/inbox-in.svg">
                        本日のケアスケジュール
                    </UICardHeader>
                    <UICardContent>
                        <UITable className="outline-0">
                            <UITableHeader>
                                <UITableRow>
                                    {careScheduleColumns.map((column) => (
                                        <UITableHead className="font-bold text-black" key={column.accessorKey}>
                                            {column.header}
                                        </UITableHead>
                                    ))}
                                </UITableRow>
                            </UITableHeader>
                            <UITableBody>
                                {careScheduleData.map((item, index) => (
                                    <UITableRow key={index}>
                                        <UITableCell>{item.time}</UITableCell>
                                        <UITableCell>{item.resident}</UITableCell>
                                        <UITableCell>{item.care_type}</UITableCell>
                                        <UITableCell>{item.staff}</UITableCell>
                                    </UITableRow>
                                ))}
                            </UITableBody>
                        </UITable>
                    </UICardContent>
                    <UICardFooter>
                        <Link href="#" className="font-bold text-sm hover:underline text-right block mt-4 mr-4">
                            {"詳細を見る >>"}
                        </Link>
                    </UICardFooter>
                </UICard>

                <UICard className="mt-8">
                    <UICardHeader className="text-2xl font-bold" icon="/stats-report.svg">
                        インシデント・アラート
                    </UICardHeader>
                    <UICardContent>
                        <UITable className="outline-0">
                            <UITableHeader>
                                <UITableRow>
                                    {incidentColumns.map((column) => (
                                        <UITableHead className="font-bold text-black" key={column.accessorKey}>
                                            {column.header}
                                        </UITableHead>
                                    ))}
                                </UITableRow>
                            </UITableHeader>
                            <UITableBody>
                                {incidentData.map((item, index) => (
                                    <UITableRow key={index}>
                                        <UITableCell>{item.datetime}</UITableCell>
                                        <UITableCell>{item.resident}</UITableCell>
                                        <UITableCell>{item.type}</UITableCell>
                                        <UITableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                item.status === "対応済み" 
                                                    ? "bg-green-100 text-green-800" 
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </UITableCell>
                                    </UITableRow>
                                ))}
                            </UITableBody>
                        </UITable>
                    </UICardContent>
                    <UICardFooter>
                        <Link href="#" className="font-bold text-sm hover:underline text-right block mt-4 mr-4">
                            {"もっと見る >>"}
                        </Link>
                    </UICardFooter>
                </UICard>
            </div>

            {/* Analytics Section */}
            <div className="mt-8">
                <UICard className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="outline-1 p-8 flex flex-col items-center h-120">
                        <Label className="font-bold text-2xl mb-4">サービス利用状況</Label>
                        <div className="h-96 w-full flex items-center justify-center">
                            <Pie data={serviceUtilizationData} options={pieChartConfig} />
                        </div>
                    </div>

                    <div className="outline-1 p-8 flex flex-col items-center h-120">
                        <Label className="font-bold text-2xl mb-4">月別ケア時間推移</Label>
                        <div className="h-96 w-full flex items-center justify-center">
                            <Line data={careHoursTrendData} options={lineChartConfig} />
                        </div>
                    </div>
                </UICard>
            </div>

            {/* Emergency Contacts & Quick Actions */}
            <div className="mt-8">
                <UICard className="p-8">
                    <UICardHeader className="text-2xl font-bold">緊急時対応・クイックアクション</UICardHeader>
                    <UICardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h3 className="font-bold text-red-800 mb-2">緊急連絡先</h3>
                                <p className="text-sm text-red-700">医師: 090-1234-5678</p>
                                <p className="text-sm text-red-700">看護師長: 090-2345-6789</p>
                                <p className="text-sm text-red-700">施設長: 090-3456-7890</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-2">当番スタッフ</h3>
                                <p className="text-sm text-blue-700">夜勤: 山田介護士</p>
                                <p className="text-sm text-blue-700">オンコール: 佐藤看護師</p>
                                <p className="text-sm text-blue-700">管理者: 田中主任</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h3 className="font-bold text-green-800 mb-2">今日の申し送り</h3>
                                <p className="text-sm text-green-700">・田中様、血圧要注意</p>
                                <p className="text-sm text-green-700">・佐藤様、薬変更あり</p>
                                <p className="text-sm text-green-700">・面会予定: 15:00〜</p>
                            </div>
                        </div>
                    </UICardContent>
                </UICard>
            </div>
        </div>
    )
}
