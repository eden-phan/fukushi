"use client"

import * as React from "react"
import { HeadingPage } from "@/components/ui/heading-page"
import FormTraining from "../../components/forms/form-training"

export default function EditTraining({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params)
    
    return (
        <>
            <HeadingPage title="研修ノート編集" />
            <FormTraining mode="edit" id={resolvedParams.id} />
        </>
    )
}
