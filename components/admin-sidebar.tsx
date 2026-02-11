"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileEdit,
  CalendarDays,
  FileText,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  FolderKanban,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Visão Geral",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Projetos",
    href: "/admin/projetos",
    icon: FolderKanban,
  },
  {
    label: "Editor do Site",
    href: "/admin/editor",
    icon: FileEdit,
  },
  {
    label: "Calendário",
    href: "/admin/calendario",
    icon: CalendarDays,
  },
  {
    label: "Briefings",
    href: "/admin/briefings",
    icon: FileText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border bg-[#dacbb8] transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-5">
        {!collapsed && (
          <span className="font-serif text-lg font-bold text-ink">
            Admin
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-ink/5 hover:text-ink",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-rose/15 text-rose"
                  : "text-muted-foreground hover:bg-ink/5 hover:text-ink"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-sans">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-ink/5 hover:text-ink",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-sans">Sair</span>}
        </Link>
      </div>
    </aside>
  );
}
