"use client";

import { useEffect, useState } from "react";

export type ServiceStatus = "healthy" | "degraded" | "offline" | "loading";

/* Map each logical service name to the base URL that exposes it */
const SERVICE_URLS: Record<string, string> = {
  chat: process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8011",
  identification: process.env.NEXT_PUBLIC_IDENTIFICATION_API_URL || "http://localhost:8002",
  report: process.env.NEXT_PUBLIC_REPORT_API_URL || "http://localhost:8003",
  auth: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8001",
  symptoms: process.env.NEXT_PUBLIC_DASHBOARD_SYMPTOMS_API_URL || "http://localhost:8008",
};

/**
 * Ping a service's root or /health endpoint.
 * Returns "healthy" on 2xx, "degraded" on 4xx/5xx, "offline" on network error.
 */
async function checkService(name: string): Promise<ServiceStatus> {
  const baseUrl = SERVICE_URLS[name];
  if (!baseUrl) return "offline";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    // Try /health first, fall back to root
    let res: Response;
    try {
      res = await fetch(`${baseUrl}/health`, { signal: controller.signal, method: "GET" });
    } catch {
      res = await fetch(baseUrl, { signal: controller.signal, method: "GET" });
    }

    clearTimeout(timeout);

    if (res.ok) return "healthy";
    return "degraded";
  } catch {
    return "offline";
  }
}

/**
 * Hook that pings a named service on mount and every 30s.
 */
export function useServiceHealth(service: string): ServiceStatus {
  const [status, setStatus] = useState<ServiceStatus>("loading");

  useEffect(() => {
    let mounted = true;

    async function ping() {
      const s = await checkService(service);
      if (mounted) setStatus(s);
    }

    ping();
    const interval = setInterval(ping, 30_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [service]);

  return status;
}

/**
 * Hook that pings ALL services and returns a record of statuses.
 */
export function useAllServiceHealth(): Record<string, ServiceStatus> {
  const [statuses, setStatuses] = useState<Record<string, ServiceStatus>>(() => {
    const initial: Record<string, ServiceStatus> = {};
    for (const key of Object.keys(SERVICE_URLS)) initial[key] = "loading";
    return initial;
  });

  useEffect(() => {
    let mounted = true;

    async function pingAll() {
      const entries = await Promise.all(
        Object.keys(SERVICE_URLS).map(async (name) => {
          const s = await checkService(name);
          return [name, s] as [string, ServiceStatus];
        })
      );
      if (mounted) {
        setStatuses(Object.fromEntries(entries));
      }
    }

    pingAll();
    const interval = setInterval(pingAll, 30_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return statuses;
}
