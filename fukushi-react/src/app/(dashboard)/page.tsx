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

export default function Home() {
    const columns = [
        {
            header: "日付",
            accessorKey: "content",
        },
        {
            header: "氏名",
            accessorKey: "staff",
        },
        {
            header: "希望サービス",
            accessorKey: "status",
        },
    ]

    const consultationData = [
        {
            content: "2024-01-15",
            staff: "田中太郎",
            status: "就労継続支援A型",
        },
        {
            content: "2024-01-15",
            staff: "佐藤花子",
            status: "グループホーム",
        },
        {
            content: "2024-01-14",
            staff: "鈴木一郎",
            status: "放課後等デイサービス",
        },
    ]

    const reportData = [
        {
            content: "2024-01-15",
            staff: "山田看護師",
            status: "服薬管理記録完了",
        },
        {
            content: "2024-01-15",
            staff: "佐藤介護士",
            status: "入浴介助実施",
        },
        {
            content: "2024-01-14",
            staff: "田中相談員",
            status: "家族面談実施",
        },
    ]

    const monitoringData = [
        {
            content: "2024-01-20",
            staff: "田中太郎",
            status: "6か月モニタリング予定",
        },
        {
            content: "2024-01-22",
            staff: "佐藤花子",
            status: "3か月モニタリング予定",
        },
        {
            content: "2024-01-25",
            staff: "高橋美香",
            status: "年次見直し予定",
        },
    ]

    const pieChartData = {
        labels: [
            "グループホーム",
            "ショートステイ",
            "相談支援",
            "就労継続支援Aタイプ",
            "就労継続支援Bタイプ",
            "放課後等デイサービス",
        ],
        datasets: [
            {
                data: [65, 120, 35, 55, 40, 85],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            },
        ],
    }

    const lineChartData = {
        labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
        datasets: [
            {
                label: "―グループホーム",
                data: [17, 5, 12, 19, 2, 13],
                fill: false,
                backgroundColor: "#ff6384",
                borderColor: "#ff6384",
            },
            {
                label: "ショートステイ",
                data: [3, 18, 10, 6, 15, 9],
                fill: false,
                backgroundColor: "#36a2eb",
                borderColor: "#36a2eb",
            },
            {
                label: "相談支援",
                data: [7, 11, 4, 20, 16, 8],
                fill: false,
                backgroundColor: "#cc65fe",
                borderColor: "#cc65fe",
            },
            {
                label: "就労継続支援Aタイプ",
                data: [9, 2, 13, 8, 17, 3],
                fill: false,
                backgroundColor: "#ffce56",
                borderColor: "#ffce56",
            },
            {
                label: "就労継続支援Bタイプ",
                data: [4, 15, 6, 11, 14, 7],
                fill: false,
                backgroundColor: "#4bc0c0",
                borderColor: "#4bc0c0",
            },
            {
                label: "放課後等デイサービス",
                data: [14, 1, 18, 12, 5, 10],
                fill: false,
                backgroundColor: "#f67019",
                borderColor: "#f67019",
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
    }

    return (
        <div className="flex flex-col h-full pt-4 pb-4">
            <div className="p-8">
                <Label className="text-2xl font-bold">ダッシュボード</Label>
            </div>
            <UIStatCardGroup>
                <UIStatCard>
                    <UIStatCardHeader color="#FA9193" icon="/service_user.svg">
                        スタッフ総数
                    </UIStatCardHeader>
                    <UIStatCardContent>45</UIStatCardContent>
                </UIStatCard>
                <UIStatCard>
                    <UIStatCardHeader color="#76C0FF" icon="/staff.svg">
                        事業所数
                    </UIStatCardHeader>
                    <UIStatCardContent>8</UIStatCardContent>
                </UIStatCard>
                <UIStatCard>
                    <UIStatCardHeader color="#56BA8F" icon="/form.svg">
                        利用者数
                    </UIStatCardHeader>
                    <UIStatCardContent>128</UIStatCardContent>
                </UIStatCard>
                <UIStatCard>
                    <UIStatCardHeader color="#FFD385" icon="/building.svg">
                        今月の研修
                    </UIStatCardHeader>
                    <UIStatCardContent>12</UIStatCardContent>
                </UIStatCard>
            </UIStatCardGroup>
            <div className="flex flex-row gap-16">
                <UICard className="mt-8">
                    <UICardHeader className="text-2xl font-bold" icon="/inbox-in.svg">
                        相談受付
                    </UICardHeader>
                    <UICardContent>
                        <UITable className="outline-0">
                            <UITableHeader>
                                <UITableRow>
                                    {columns.map((column) => (
                                        <UITableHead className="font-bold text-black" key={column.accessorKey}>
                                            {column.header}
                                        </UITableHead>
                                    ))}
                                </UITableRow>
                            </UITableHeader>
                            <UITableBody>
                                {consultationData.map((item, index) => (
                                    <UITableRow key={index}>
                                        <UITableCell>{item.content}</UITableCell>
                                        <UITableCell>{item.staff}</UITableCell>
                                        <UITableCell>{item.status}</UITableCell>
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

                <UICard className="mt-8">
                    <UICardHeader className="text-2xl font-bold" icon="/stats-report.svg">
                        業務日報
                    </UICardHeader>
                    <UICardContent>
                        <UITable className="outline-0">
                            <UITableHeader>
                                <UITableRow>
                                    {columns.map((column) => (
                                        <UITableHead className="font-bold text-black" key={column.accessorKey}>
                                            {column.header}
                                        </UITableHead>
                                    ))}
                                </UITableRow>
                            </UITableHeader>
                            <UITableBody>
                                {reportData.map((item, index) => (
                                    <UITableRow key={index}>
                                        <UITableCell>{item.content}</UITableCell>
                                        <UITableCell>{item.staff}</UITableCell>
                                        <UITableCell>{item.status}</UITableCell>
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
            <div className="mt-8">
                <UICard className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="outline-1 p-8 flex flex-col items-center h-120">
                        <Label className="font-bold text-2xl mb-4">事業別利用者数</Label>
                        <div className="h-96 w-full flex items-center justify-center">
                            <Pie data={pieChartData} options={pieChartConfig}></Pie>
                        </div>
                    </div>

                    <div className="outline-1 p-8 flex flex-col items-center h-120">
                        <Label className="font-bold text-2xl mb-4">月別の利用者推移データ</Label>
                        <div className="h-96 w-full flex items-center justify-center ">
                            <Line data={lineChartData} options={lineChartConfig} />
                        </div>
                    </div>
                </UICard>
            </div>
            <div className="mt-8">
                <UICard className="p-8">
                    <UICardHeader className="text-2xl font-bold">利用者モニタリング予定</UICardHeader>
                    <UICardContent>
                        <UITable className="outline-0">
                            <UITableHeader>
                                <UITableRow>
                                    {columns.map((column) => (
                                        <UITableHead className="font-bold text-black" key={column.accessorKey}>
                                            {column.header}
                                        </UITableHead>
                                    ))}
                                </UITableRow>
                            </UITableHeader>
                            <UITableBody>
                                {monitoringData.map((item, index) => (
                                    <UITableRow key={index}>
                                        <UITableCell>{item.content}</UITableCell>
                                        <UITableCell>{item.staff}</UITableCell>
                                        <UITableCell>{item.status}</UITableCell>
                                    </UITableRow>
                                ))}
                            </UITableBody>
                        </UITable>
                    </UICardContent>
                </UICard>
            </div>
        </div>
    )
}
