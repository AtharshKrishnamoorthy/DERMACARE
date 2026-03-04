import type { Identification, AddIdentificationBody } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_IDENTIFICATION_API_URL || "http://localhost:8005";

export async function addIdentification(body: AddIdentificationBody): Promise<Identification> {
  const res = await fetch(`${BASE_URL}/identifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to add identification");
  return res.json();
}

export async function getAllIdentifications(): Promise<Identification[]> {
  const res = await fetch(`${BASE_URL}/identifications`);
  if (!res.ok) throw new Error("Failed to get identifications");
  return res.json();
}

export async function getUserIdentifications(userId: string): Promise<Identification[]> {
  const res = await fetch(`${BASE_URL}/identifications/user/${userId}`);
  if (!res.ok) throw new Error("Failed to get user identifications");
  return res.json();
}

export async function getIdentification(id: string): Promise<Identification> {
  const res = await fetch(`${BASE_URL}/identifications/${id}`);
  if (!res.ok) throw new Error("Failed to get identification");
  return res.json();
}

export async function deleteIdentification(id: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/identifications/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete identification");
  return res.json();
}
