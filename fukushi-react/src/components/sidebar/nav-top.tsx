import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { Bell, ChevronDown, CircleUserRound } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import http from "@/services/http"
import { useRouter } from "next/navigation"
import { removeTokens, removeUser } from "@/services/auth"
import { useContext } from "react"
import { AppContext } from "../app-provider"

export default function NavTop() {
    const router = useRouter()
    const { setUserContext } = useContext(AppContext)

    const handleLogout = async () => {
        await http.post("/auth/logout")
        setUserContext(null)
        removeTokens()
        removeUser()
        router.push("/login")
    }
    return (
        <header className="bg-[#5e90bc] top-0 flex h-16 shrink-0 z-20 justify-between items-center gap-2 border-b px-4">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Link href="/" className="text-amber-50 text-lg font-semibold">
                    <Image src="/logo.png" alt="Logo" width={120} height={40} priority />
                </Link>
            </div>
            <div className="flex items-center gap-4 text-white">
                <Bell />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <CircleUserRound />
                            <span>山田 太郎</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>アカウント</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                router.push("/profile")
                            }}
                        >
                            <Link href="/profile">ファイル</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <button className="w-full text-left" onClick={handleLogout}>
                                Logout
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}