"use client"

import * as React from "react"
import { HeadingPage } from "@/components/ui/heading-page"
import FormMeeting from "../../components/forms/form-meeting"

export default function EditMeeting({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params)

    return (
        <>
            <HeadingPage title="スタッフ会議議事録編集" />
            <FormMeeting mode="edit" id={resolvedParams.id} />
        </>
    )
}
