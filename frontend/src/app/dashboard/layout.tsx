"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ScanEye,
  LayoutDashboard,
  MessageSquareText,
  ScanSearch,
  FileText,
  ClipboardList,
  Search,
  HelpCircle,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { HealthDot } from "@/components/health-dot";
import { useAllServiceHealth } from "@/hooks/use-service-health";
import { CommandMenuProvider, useCommandMenu } from "@/components/command-menu";
import { HelpDialogProvider, useHelpDialog } from "@/components/help-dialog";

/* ─── nav data ─── */
const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, service: null },
  { title: "Chat", href: "/dashboard/chat", icon: MessageSquareText, service: "chat" },
  { title: "Identification", href: "/dashboard/identification", icon: ScanSearch, service: "identification" },
  { title: "Report", href: "/dashboard/report", icon: FileText, service: "report" },
  { title: "Symptoms", href: "/dashboard/symptom", icon: ClipboardList, service: "symptoms" },
];

/* ─── layout ─── */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const serviceHealth = useAllServiceHealth();
  const commandMenu = useCommandMenu();
  const helpDialog = useHelpDialog();

  function handleSignOut() {
    localStorage.removeItem("access_token");
    router.push("/auth/signin");
  }

  return (
    <SidebarProvider>
      {/* ── Sidebar ── */}
      <Sidebar variant="sidebar" collapsible="icon">
        {/* brand */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex size-8 items-center justify-center rounded-md border-2 border-foreground">
                    <ScanEye className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold tracking-tight">DermaCare</span>
                    <span className="text-xs text-muted-foreground">AI Skin Health</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        {/* main nav */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Modules</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNav.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {item.service && (
                            <span className="ml-auto">
                              <HealthDot status={serviceHealth[item.service] ?? "loading"} />
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* push secondary nav to end */}
          <div className="mt-auto" />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Search" onClick={commandMenu.open}>
                    <Search className="size-4" />
                    <span>Search</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Help" onClick={helpDialog.open}>
                    <HelpCircle className="size-4" />
                    <span>Help</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        {/* user footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="cursor-pointer">
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px] font-medium">DC</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="text-sm font-medium">User</span>
                      <span className="text-xs text-muted-foreground">user@dermacare.app</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="w-56"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">User</p>
                      <p className="text-xs text-muted-foreground">user@dermacare.app</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? (
                        <Sun className="mr-2 size-4" />
                      ) : (
                        <Moon className="mr-2 size-4" />
                      )}
                      {theme === "dark" ? "Light mode" : "Dark mode"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 size-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* ── Main content area ── */}
      <SidebarInset>
        {/* top bar */}
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-medium capitalize">
            {pathname === "/dashboard"
              ? "Dashboard"
              : pathname.split("/").pop()?.replace(/-/g, " ") ?? ""}
          </h1>
        </header>

        {/* page content */}
        <div className="flex-1 overflow-auto p-3 sm:p-6">{children}</div>
      </SidebarInset>

      {/* ── Global overlays ── */}
      <CommandMenuProvider />
      <HelpDialogProvider />
    </SidebarProvider>
  );
}
