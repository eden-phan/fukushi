"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Home, Building, Folder, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { NavMain } from "@/components/sidebar/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

const urlPrefix = "/group-home";

type MenuItem = {
  title: string;
  url: string;
  icon?: LucideIcon | string;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

// Base menus for all roles in group-home facility
const getGroupHomeBaseMenus = (): MenuItem[] => [
  {
    title: "ダッシュボード",
    url: `${urlPrefix}`,
    icon: Home,
    
  },
  {
    title: "依頼の受付",
    url: `${urlPrefix}/consultation`,
    icon: "/heroicons.svg",
  },
  {
    title: "利用者の管理",
    url: `${urlPrefix}/patients`,
    icon: "/patient.svg",
  },
  {
    title: "文書管理",
    url: "#",
    icon: Folder,
    isActive: true,
    items: [
      {
        title: "法定受領代理通知",
        url: `${urlPrefix}/document-receive-money`,
      },
      {
        title: "金銭管理規程",
        url: `${urlPrefix}/document-financial-policy`,
      },
      {
        title: "金銭管理契約書",
        url: `${urlPrefix}/document-payment`,
      },
      {
        title: "同意書",
        url: `${urlPrefix}/document-consent`,
      },
      {
        title: "預かり書",
        url: "#",
      },
      {
        title: "金銭出納帳",
        url: "#",
      },
    ],
  },
];

// Staff management menu (for manager and admin only)
const getStaffManagementMenu = (): MenuItem => ({
  title: "スタッフの管理",
  url: "#",
  icon: "/care-staff.svg",
  isActive: true,
  items: [
    {
      title: "スタッフ一覧",
      url: `${urlPrefix}/staff`,
    },
    {
      title: "研修議事録",
      url: `${urlPrefix}/training`,
    },
    {
      title: "スタッフ会議議事録",
      url: `${urlPrefix}/meeting`,
    },
  ],
});

// Admin-only menus
const getAdminMenus = (): MenuItem[] => [
  {
    title: "ダッシュボード",
    url: "/",
    icon: Home,
  },
  {
    title: "事業所管理",
    url: "#",
    icon: Building,
    isActive: true,
    items: [
      {
        title: "事業所一覧",
        url: `/admin/facility`,
      },
      {
        title: "管理者管理",
        url: `/admin/manager`,
      },
      {
        title: "業務日報",
        url: "/admin/daily-report",
      },
    ],
  },
  {
    title: "グループホーム",
    url: "/group-home",
    icon: Home,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { role, isAuth } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatch by waiting for client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Default minimal menu for hydration
  const getDefaultMenus = (): MenuItem[] => [
    {
      title: "ダッシュボード",
      url: "/",
      icon: Home,
    },
  ];

  // Generate dynamic menu based on current path and role
  const getMenus = (): MenuItem[] => {
    // Show minimal menu during SSR/hydration to prevent mismatch
    if (!isHydrated) {
      return getDefaultMenus();
    }

    if (!isAuth) {
      return [];
    }

    // Check if user is on group-home pages
    if (pathname.startsWith("/group-home")) {
      const baseMenus = [...getGroupHomeBaseMenus()];

      // Add staff management for managers and admins only
      if (role === "manager" || role === "admin") {
        baseMenus.splice(1, 0, getStaffManagementMenu()); // Insert after dashboard
      }

      return baseMenus;
    }

    // For admin pages or root, show admin menus (admins only)
    if (role === "admin") {
      return getAdminMenus();
    }

    // Default: redirect non-admin users to their facility
    if (role === "manager" || role === "staff") {
      // Show group-home menus as fallback for facility users
      const baseMenus = [...getGroupHomeBaseMenus()];

      if (role === "manager") {
        baseMenus.splice(1, 0, getStaffManagementMenu());
      }

      return baseMenus;
    }

    // Fallback
    return getDefaultMenus();
  };

  const menus = getMenus();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        {isHydrated ? (
          <NavMain items={menus} pathname={pathname} />
        ) : (
          <NavMain items={getDefaultMenus()} pathname="/" />
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
