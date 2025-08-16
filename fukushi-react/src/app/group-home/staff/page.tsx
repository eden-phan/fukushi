"use client";
import { HeadingPage } from '@/components/ui/heading-page'
import React, { useEffect, useState, useCallback } from 'react'
import FilterStaff from './components/pages/filter-staff'
import AddStaffBtn from './components/pages/add-staff-btn'
import ListStaff from './components/pages/list-staff'
import http from '@/services/http'
import { withAuth } from "@/components/auth/withAuth"

const Page = () => {
    const [profile, setProfile] = useState<PaginatedResponse<StaffProps>>()
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [keyword, setKeyword] = useState<string>("")
    const [status, setStatus] = useState<string | undefined>()
    const [type, setType] = useState<string | undefined>()

    const fetchData = useCallback(async (page: number, search?: string, statusFilter?: string, typeFilter?: string) => {
        setLoading(true)
        try {
            let url = `/profile?page=${page}&sortBy=created_at&sortDirection=desc`
            if (search) url += `&keyword=${encodeURIComponent(search)}`
            if (statusFilter != null && statusFilter !== "") url += `&status=${encodeURIComponent(statusFilter)}`
            if (typeFilter) url += `&type=${encodeURIComponent(typeFilter)}`
            const response = await http.get(url)
            setProfile(response.data.data)
        } catch (error) {
            console.error("Failed to fetch profile", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [keyword, status, type])

    useEffect(() => {
        fetchData(currentPage, keyword, status, type)
    }, [currentPage, keyword, status, type, fetchData])

    const handleRefresh = () => {
        fetchData(currentPage, keyword, status, type)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <>
            <HeadingPage title="スタッフ一覧" />
            <div className="mt-6 flex items-center gap-3">
                <FilterStaff
                    keyword={keyword}
                    onKeywordChange={setKeyword}
                    status={status}
                    onStatusChange={setStatus}
                    type={type}
                    onTypeChange={setType}
                />
                <AddStaffBtn />
            </div>

            <div className="mt-6">
                <ListStaff
                    staff={profile}
                    loading={loading}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onRefresh={handleRefresh}
                />
            </div>
        </>
    )
}

export default withAuth(Page, ["admin", "manager"])