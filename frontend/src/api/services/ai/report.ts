import type { ReportAnalysisResponse } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_REPORT_API_URL || "http://localhost:8003";

export async function analyzeReport(file: File): Promise<ReportAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to analyze report");
  return res.json();
}
