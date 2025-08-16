"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useLogin } from "@/hooks/useLogin"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Form validation schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "メールアドレスを入力してください。" })
        .max(100, {
            message: "メールアドレスは100文字を超えてはいけません。もう一度入力してください。",
        })
        .email("メールの形式が正しくありません。再入力してください。"),
    password: z
        .string()
        .min(1, { message: "パスワードを入力してください。" })
        .max(100, { message: "パスワードは100文字を超えてはいけません。もう一度入力してください。" }),
})

type LoginFormData = z.infer<typeof loginSchema>

// Constants
const FIELD_STYLES = "h-14 text-sm p-[14px] rounded-[10px] border focus-visible:ring-0"
const ERROR_COLOR = "#FF1717"
const DEFAULT_BORDER_COLOR = "#ccc"

export default function LoginPage() {
    // Form setup
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // State
    const [showPassword, setShowPassword] = useState(false)
    const { login, loading, error } = useLogin()

    // Handlers
    const handleSubmit = async (data: LoginFormData): Promise<void> => {
        form.clearErrors()
        await login(data.email, data.password)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.clearErrors("email")
        return e.target.value.trim()
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.clearErrors("password")
        return e.target.value
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    // Effects
    useEffect(() => {
        if (error) {
            const isUnauthorized = error.includes("Unauthorized") || error.includes("401")

            if (isUnauthorized) {
                form.setError("email", { message: "パスワードまたはメールアドレスが間違っています。" })
                form.setError("password", { message: "もう一度お試しください。" })
            } else {
                form.setError("email", { message: "エラーが発生しました" })
                form.setError("password", { message: "もう一度お試しください。" })
            }
        }
    }, [error, form])

    // Helper functions
    const getFieldBorderStyle = (hasError: boolean) => ({
        borderColor: hasError ? ERROR_COLOR : DEFAULT_BORDER_COLOR,
    })

    return (
        <div className="store bg-gray-100 min-h-screen">
            <div className="store-wrap mx-auto px-4">
                <div className="auto-wrap flex items-center justify-center min-h-screen flex-col py-6">
                    <h1 className="text-center text-slate-700 font-semibold text-[28px] mb-7">ログイン</h1>

                    <div className="w-full max-w-[530px] mx-auto bg-white md:px-10 px-4 md:py-12 py-6 border border-[#ccc] rounded-[6px]">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="mb-[30px] gap-0">
                                            <FormLabel className="mb-1 block text-md text-slate-700 font-bold">
                                                メールアドレス
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => field.onChange(handleEmailChange(e))}
                                                    className={FIELD_STYLES}
                                                    style={getFieldBorderStyle(!!form.formState.errors.email)}
                                                    placeholder="abc123@sample.com"
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-[13px] text-[#FF1717]" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mb-10 relative gap-0">
                                            <Link
                                                href="/lost-password"
                                                className="absolute right-0 top-1 text-sm text-sky-500"
                                            >
                                                パスワードを忘れた方はこちら
                                            </Link>

                                            <FormLabel className="mb-1 block text-md text-slate-700 font-bold">
                                                パスワード
                                            </FormLabel>

                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        onChange={(e) => field.onChange(handlePasswordChange(e))}
                                                        type={showPassword ? "text" : "password"}
                                                        className={`${FIELD_STYLES} pr-12`}
                                                        style={getFieldBorderStyle(!!form.formState.errors.password)}
                                                        placeholder="半角英数記号8~15桁"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={togglePasswordVisibility}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>

                                            <FormMessage className="mt-1 text-[13px] text-[#FF1717]" />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-3xl bg-sky-500 hover:bg-sky-600 text-white p-3 w-full cursor-pointer font-semibold h-13"
                                    >
                                        {loading ? <Loader2 className="animate-spin size-6" /> : "ログイン"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}