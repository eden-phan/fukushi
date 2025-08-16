"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SignatureFieldProps {
    label: string
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
}

const SignatureField = React.forwardRef<HTMLTextAreaElement, SignatureFieldProps>(
    ({ label, value = "", onChange, disabled = false }, ref) => {
        return (
            <div className="border-r border-gray-300 last:border-r-0 w-24 flex flex-col">
                <div className="bg-gray-50 border-b border-gray-300 p-2 text-center flex-1 flex items-center justify-center min-h-[2.5rem]">
                    <span className="text-xs font-medium text-gray-900 leading-tight break-words">{label}</span>
                </div>
                <div className="relative w-24 h-24 p-2">
                    <textarea
                        ref={ref as React.RefObject<HTMLTextAreaElement>}
                        value={value}
                        onChange={(e) => {
                            const newValue = e.target.value.slice(0, 6)
                            onChange?.(newValue)
                        }}
                        disabled={disabled}
                        maxLength={6}
                        className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-transparent resize-none cursor-text text-center overflow-hidden flex items-center justify-center"
                        style={{
                            caretColor: "black",
                            paddingTop: "calc(50% - 0.75rem)",
                            textAlign: "center",
                        }}
                    />
                    <div className="absolute inset-2 flex items-center justify-center text-sm text-gray-700 pointer-events-none overflow-hidden">
                        {value && (
                            <span className="font-handwriting text-center break-words whitespace-pre-wrap leading-tight">
                                {value}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        )
    }
)

SignatureField.displayName = "SignatureField"

interface MultiSignatureFieldProps {
    label: string
    fields: Array<{
        name: string
        value?: string
        onChange?: (value: string) => void
        disabled?: boolean
    }>
}

const MultiSignatureField = React.forwardRef<HTMLDivElement, MultiSignatureFieldProps>(
    ({ label, fields }, ref) => {
        const fieldWidth = fields.length === 3 ? "w-20" : fields.length === 4 ? "w-16" : "w-24"
        const totalWidth = fields.length === 3 ? "w-60" : fields.length === 4 ? "w-64" : "w-24"
        
        return (
            <div ref={ref} className={cn("border-r border-gray-300 last:border-r-0 flex flex-col", totalWidth)}>
                <div className="bg-gray-50 border-b border-gray-300 p-2 text-center flex-1 flex items-center justify-center min-h-[2.5rem]">
                    <span className="text-xs font-medium text-gray-900 leading-tight break-words">{label}</span>
                </div>
                <div className="flex">
                    {fields.map((field, index) => (
                        <div key={field.name || index} className={cn("relative p-2 border-r border-gray-300 last:border-r-0", fieldWidth, "h-24")}>
                            <textarea
                                value={field.value || ""}
                                onChange={(e) => {
                                    const newValue = e.target.value.slice(0, 6)
                                    field.onChange?.(newValue)
                                }}
                                disabled={field.disabled}
                                maxLength={6}
                                className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-transparent resize-none cursor-text text-center overflow-hidden flex items-center justify-center"
                                style={{
                                    caretColor: "black",
                                    paddingTop: "calc(50% - 0.75rem)",
                                    textAlign: "center",
                                }}
                            />
                            <div className="absolute inset-2 flex items-center justify-center text-sm text-gray-700 pointer-events-none overflow-hidden">
                                {field.value && (
                                    <span className="font-handwriting text-center break-words whitespace-pre-wrap leading-tight">
                                        {field.value}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
)

MultiSignatureField.displayName = "MultiSignatureField"

interface SignatureProps extends React.HTMLAttributes<HTMLDivElement> {
    fields: Array<{
        name: string
        label: string
        value?: string
        onChange?: (value: string) => void
        disabled?: boolean
        multipleFields?: Array<{
            name: string
            value?: string
            onChange?: (value: string) => void
            disabled?: boolean
        }>
    }>
}

const Signature = React.forwardRef<HTMLDivElement, SignatureProps>(({ className, fields, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("flex justify-end", className)} {...props}>
            <div className={`flex flex-row border border-gray-300`}>
                {fields.map((field, index) => {
                    if (field.multipleFields && field.multipleFields.length > 0) {
                        return (
                            <MultiSignatureField
                                key={field.name || index}
                                label={field.label}
                                fields={field.multipleFields}
                            />
                        )
                    }
                    
                    return (
                        <SignatureField
                            key={field.name || index}
                            label={field.label}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={field.disabled}
                        />
                    )
                })}
            </div>
        </div>
    )
})

Signature.displayName = "Signature"

export { Signature, SignatureField, MultiSignatureField }
