"use client"

import * as React from "react"
import { HeadingPage } from "@/components/ui/heading-page"
import FormStaff from "../components/forms/form-staff"
import { withAuth } from "@/components/auth/withAuth"

function AddStaff() {
    return (
        <>
            <HeadingPage title="スタッフ 新規追加" />
            <FormStaff />
        </>
    )
}

export default withAuth(AddStaff, ["admin", "manager"])
