import type { PredictResponse, PredictDescribeResponse } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_IDENTIFICATION_API_URL || "http://localhost:8002";

export async function predict(file: File): Promise<PredictResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to predict");
  return res.json();
}

export async function predictAndDescribe(
  file: File,
  userId: string
): Promise<PredictDescribeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/predict-and-describe?user_id=${userId}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to predict and describe");
  return res.json();
}
