"use client"

import * as React from "react"
import { HeadingPage } from "@/components/ui/heading-page"
import FormMeeting from "../components/forms/form-meeting"

export default function AddMeeting() {
    return (
        <>
            <HeadingPage title="スタッフ会議議事録登録" />
            <FormMeeting />
        </>
    )
}
