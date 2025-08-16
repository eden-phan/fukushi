"use client"

import { HeadingPage } from "@/components/ui/heading-page"
import { useCallback, useEffect, useState } from "react"
import http from "@/services/http"
import AddMeetingBtn from "./components/pages/add-meeting-btn"
import FilterMeeting from "./components/pages/filter-meeting"
import ListMeeting from "./components/pages/list-meeting"
import { formatDateToString } from "@/lib/utils"
import { MeetingProps } from "@/@types/meeting"

export default function Meeting() {
    const [data, setData] = useState<PaginatedResponse<MeetingProps>>()
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilter] = useState<{
        keyword?: string
        startDate?: Date
        endDate?: Date
    }>({})

    const fetchData = useCallback(async (page: number = 1, filterParams: typeof filters = {}) => {
        setLoading(true)
        try {
            const queryParams = new URLSearchParams()
            queryParams.append("record_type", "meeting")
            queryParams.append("page", page.toString())
            queryParams.append("sortBy", "created_at")
            queryParams.append("sortDirection", "desc")
            if (filterParams.keyword) queryParams.append("keyword", filterParams.keyword)
            if (filterParams.startDate) {
                queryParams.append("startDate", formatDateToString(filterParams.startDate))
            }
            if (filterParams.endDate) {
                queryParams.append("endDate", formatDateToString(filterParams.endDate))
            }

            const response = await http.get(`/session/index?${queryParams.toString()}`)
            setData(response.data.data)
        } catch (error) {
            console.error("Failed to fetch meeting data:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        fetchData(page, filters)
    }

    const handleRefresh = () => {
        fetchData(currentPage, filters)
    }

    const handleFilter = useCallback(
        (newFilter: typeof filters) => {
            setFilter(newFilter)
            setCurrentPage(1)
            fetchData(1, newFilter)
        },
        [fetchData]
    )

    useEffect(() => {
        fetchData(1, filters)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <HeadingPage title="スタッフ会議議事録" />
            <div className="mt-6 flex items-center gap-3">
                <FilterMeeting onFilterChange={handleFilter} />
                <AddMeetingBtn />
            </div>

            <div className="mt-6">
                <ListMeeting
                    data={data}
                    loading={loading}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onRefresh={handleRefresh}
                />
            </div>
        </>
    )
}
