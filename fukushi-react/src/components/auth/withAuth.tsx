"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, getRole } from "@/services/auth"

type Role = "admin" | "manager" | "staff"

/**
 * HOC for protecting pages with role checks
 * Usage: withAuth(Component, "admin") or withAuth(Component, "manager") or withAuth(Component, "staff")
 */
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    requiredRole?: Role | Role[],
    redirectTo: string = "/login"
) {
    const AuthorizedComponent: React.FC<P> = (props) => {
        const router = useRouter()
        const [isHydrated, setIsHydrated] = useState(false)

        // Wait for client-side hydration
        useEffect(() => {
            setIsHydrated(true)
        }, [])

        useEffect(() => {
            if (!isHydrated) return
            const token = getToken("access_token")
            const userRole = getRole() as Role | undefined

            // If not authenticated, redirect to login
            if (!token) {
                router.push(redirectTo)
                return
            }

            // If no role required, just check authentication
            if (!requiredRole) {
                return
            }

            // Admin can access everything
            if (userRole === "admin") {
                return
            }

            // Check if user has required role(s)
            const hasRequiredRole = Array.isArray(requiredRole)
                ? requiredRole.includes(userRole as Role)
                : userRole === requiredRole

            if (!hasRequiredRole) {
                router.push(redirectTo)
                return
            }
        }, [router, isHydrated])

        // Show loading while hydrating
        if (!isHydrated) {
            return null
        }

        const token = getToken("access_token")
        const userRole = getRole() as Role | undefined

        // Show loading while checking auth
        if (!token) {
            return null
        }

        // If no role required, just check authentication
        if (!requiredRole) {
            return <WrappedComponent {...props} />
        }

        // Admin can access everything
        if (userRole === "admin") {
            return <WrappedComponent {...props} />
        }

        // Check if user has required role(s)
        const hasRequiredRole = Array.isArray(requiredRole)
            ? requiredRole.includes(userRole as Role)
            : userRole === requiredRole

        if (!hasRequiredRole) {
            return null
        }

        return <WrappedComponent {...props} />
    }

    AuthorizedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`

    return AuthorizedComponent
}
