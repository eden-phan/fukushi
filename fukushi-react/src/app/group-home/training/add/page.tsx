"use client"

import * as React from "react"
import { HeadingPage } from "@/components/ui/heading-page"
import FormTraining from "../components/forms/form-training"

export default function AddTraining() {
    return (
        <>
            <HeadingPage title="研修ノート登録" />
            <FormTraining />
        </>
    )
}
