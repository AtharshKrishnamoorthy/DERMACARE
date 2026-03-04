import type { Symptom, AddSymptomBody } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_SYMPTOMS_API_URL || "http://localhost:8008";

export async function addSymptom(body: AddSymptomBody): Promise<Symptom> {
  const res = await fetch(`${BASE_URL}/symptoms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to add symptom");
  return res.json();
}

export async function getAllSymptoms(): Promise<Symptom[]> {
  const res = await fetch(`${BASE_URL}/symptoms`);
  if (!res.ok) throw new Error("Failed to get symptoms");
  return res.json();
}

export async function getUserSymptoms(userId: string): Promise<Symptom[]> {
  const res = await fetch(`${BASE_URL}/symptoms/user/${userId}`);
  if (!res.ok) throw new Error("Failed to get user symptoms");
  return res.json();
}

export async function getSymptom(id: string): Promise<Symptom> {
  const res = await fetch(`${BASE_URL}/symptoms/${id}`);
  if (!res.ok) throw new Error("Failed to get symptom");
  return res.json();
}

export async function deleteSymptom(id: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/symptoms/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete symptom");
  return res.json();
}
