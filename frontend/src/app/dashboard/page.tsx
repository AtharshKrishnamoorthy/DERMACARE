"use client";

import {
  ScanSearch,
  MessageSquareText,
  FileText,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* ─── stat cards data ─── */
const stats = [
  {
    title: "Total Scans",
    value: "1,284",
    change: "+12.5%",
    trend: "up" as const,
    description: "Skin identifications this month",
    icon: ScanSearch,
  },
  {
    title: "Chat Sessions",
    value: "856",
    change: "-3.2%",
    trend: "down" as const,
    description: "AI consultations this month",
    icon: MessageSquareText,
  },
  {
    title: "Reports Generated",
    value: "342",
    change: "+8.1%",
    trend: "up" as const,
    description: "Medical reports analysed",
    icon: FileText,
  },
  {
    title: "Accuracy Rate",
    value: "94.7%",
    change: "+1.2%",
    trend: "up" as const,
    description: "Model prediction accuracy",
    icon: Activity,
  },
];

/* ─── chart data ─── */
const chartData = [
  { month: "Jan", scans: 186, chats: 80, reports: 45 },
  { month: "Feb", scans: 305, chats: 200, reports: 100 },
  { month: "Mar", scans: 237, chats: 120, reports: 80 },
  { month: "Apr", scans: 273, chats: 190, reports: 110 },
  { month: "May", scans: 409, chats: 260, reports: 150 },
  { month: "Jun", scans: 314, chats: 140, reports: 90 },
  { month: "Jul", scans: 478, chats: 310, reports: 180 },
  { month: "Aug", scans: 520, chats: 350, reports: 200 },
  { month: "Sep", scans: 390, chats: 280, reports: 160 },
  { month: "Oct", scans: 610, chats: 400, reports: 240 },
  { month: "Nov", scans: 540, chats: 370, reports: 210 },
  { month: "Dec", scans: 680, chats: 450, reports: 280 },
];

const chartConfig = {
  scans: { label: "Scans", color: "oklch(0.45 0 0)" },
  chats: { label: "Chats", color: "oklch(0.60 0 0)" },
  reports: { label: "Reports", color: "oklch(0.75 0 0)" },
} satisfies ChartConfig;

/* ─── recent activity ─── */
const recentActivity = [
  {
    action: "Skin scan completed",
    detail: "Eczema — 92% confidence",
    time: "2 min ago",
    badge: "Identification",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    action: "Chat session ended",
    detail: "12 messages · Acne treatment",
    time: "18 min ago",
    badge: "Chat",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  {
    action: "Report analysed",
    detail: "Blood work report — CBC panel",
    time: "1 hr ago",
    badge: "Report",
    badgeColor: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    action: "Skin scan completed",
    detail: "Psoriasis — 88% confidence",
    time: "3 hr ago",
    badge: "Identification",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    action: "Chat session ended",
    detail: "8 messages · Rosacea management",
    time: "5 hr ago",
    badge: "Chat",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  {
    action: "Report analysed",
    detail: "Dermatology referral letter",
    time: "Yesterday",
    badge: "Report",
    badgeColor: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
];

/* ─── page ─── */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* heading */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your DermaCare activity.
        </p>
      </div>

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">{s.title}</CardDescription>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {s.trend === "up" ? (
                  <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="size-3" />
                    {s.change}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-red-500">
                    <ArrowDownRight className="size-3" />
                    {s.change}
                  </span>
                )}
                <span className="text-muted-foreground">{s.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* chart + recent activity */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* area chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Monthly usage across all modules</CardDescription>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3.5" />
                Trending up
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="fillScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-scans)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-scans)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chats)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-chats)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-reports)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--color-reports)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="reports"
                  type="monotone"
                  fill="url(#fillReports)"
                  stroke="var(--color-reports)"
                  strokeWidth={1.5}
                  stackId="a"
                />
                <Area
                  dataKey="chats"
                  type="monotone"
                  fill="url(#fillChats)"
                  stroke="var(--color-chats)"
                  strokeWidth={1.5}
                  stackId="a"
                />
                <Area
                  dataKey="scans"
                  type="monotone"
                  fill="url(#fillScans)"
                  stroke="var(--color-scans)"
                  strokeWidth={2}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions across modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 size-2 shrink-0 rounded-full bg-foreground/25" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-none">{item.action}</p>
                      <Badge
                        variant="secondary"
                        className={`shrink-0 text-[10px] font-medium ${item.badgeColor}`}
                      >
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                    <p className="text-[11px] text-muted-foreground/60">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
