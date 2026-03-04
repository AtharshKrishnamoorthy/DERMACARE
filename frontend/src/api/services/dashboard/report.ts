import type { Report, AddReportBody } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_REPORT_API_URL || "http://localhost:8006";

export async function addReport(body: AddReportBody): Promise<Report> {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to add report");
  return res.json();
}

export async function getAllReports(): Promise<Report[]> {
  const res = await fetch(`${BASE_URL}/reports`);
  if (!res.ok) throw new Error("Failed to get reports");
  return res.json();
}

export async function getUserReports(userId: string): Promise<Report[]> {
  const res = await fetch(`${BASE_URL}/reports/user/${userId}`);
  if (!res.ok) throw new Error("Failed to get user reports");
  return res.json();
}

export async function getReport(id: string): Promise<Report> {
  const res = await fetch(`${BASE_URL}/reports/${id}`);
  if (!res.ok) throw new Error("Failed to get report");
  return res.json();
}

export async function deleteReport(id: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/reports/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete report");
  return res.json();
}
