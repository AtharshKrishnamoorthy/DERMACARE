"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ServiceStatus } from "@/hooks/use-service-health";

const config: Record<ServiceStatus, { color: string; label: string }> = {
  healthy: { color: "bg-emerald-500", label: "Service online" },
  degraded: { color: "bg-amber-500", label: "Service degraded" },
  offline: { color: "bg-red-500", label: "Service offline" },
  loading: { color: "bg-muted-foreground/40 animate-pulse", label: "Checking…" },
};

export function HealthDot({ status }: { status: ServiceStatus }) {
  const { color, label } = config[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-block size-2 rounded-full ${color}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
