import type { Settings, UpdateSettingsBody } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_SETTINGS_API_URL || "http://localhost:8007";

export async function createSettings(userId: string): Promise<Settings> {
  const res = await fetch(`${BASE_URL}/settings/${userId}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to create settings");
  return res.json();
}

export async function getSettings(userId: string): Promise<Settings> {
  const res = await fetch(`${BASE_URL}/settings/${userId}`);
  if (!res.ok) throw new Error("Failed to get settings");
  return res.json();
}

export async function updateSettings(userId: string, body: UpdateSettingsBody): Promise<Settings> {
  const res = await fetch(`${BASE_URL}/settings/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export async function deleteSettings(userId: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/settings/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete settings");
  return res.json();
}
