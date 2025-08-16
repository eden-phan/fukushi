"use client";

import React, { useState, useEffect } from "react";
import { getRole } from "@/services/auth";

type Role = "admin" | "manager" | "staff";

interface PermissionProps {
  role?: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  strict?: boolean; // Prevent admin to see
}

/**
 * Permission component that checks role
 * Usage: <Permission role="admin"> or <Permission role={["admin", "manager"]}>
 */
export function Permission({
  role,
  children,
  fallback = null,
  strict = false,
}: PermissionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatch by waiting for client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show fallback during SSR/hydration to prevent mismatch
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  const userRole = getRole() as Role | undefined;

  // If no role specified, just show children
  if (!role) {
    return <>{children}</>;
  }

  // Admin can access everything
  if (userRole === "admin") {
    if (!strict) return <>{children}</>;
  }

  // Check if user has required role(s)
  const hasRequiredRole = Array.isArray(role)
    ? role.includes(userRole as Role)
    : userRole === role;

  return hasRequiredRole ? <>{children}</> : <>{fallback}</>;
}
