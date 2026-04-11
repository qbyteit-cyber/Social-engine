"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Plug,
  Mic2,
  Settings,
} from "lucide-react"

const nav = [
  { href: "/dashboard",     label: "Overview",     icon: LayoutDashboard },
  { href: "/create",        label: "Create",       icon: PlusCircle },
  { href: "/scheduler",     label: "Scheduler",    icon: Calendar },
  { href: "/connections",   label: "Connections",  icon: Plug },
  { href: "/brand-voice",   label: "Brand Voice",  icon: Mic2 },
  { href: "/settings",      label: "Settings",     icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-lg font-bold">Repurpose Engine</Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-muted text-foreground"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <UserButton />
      </div>
    </aside>
  )
}
