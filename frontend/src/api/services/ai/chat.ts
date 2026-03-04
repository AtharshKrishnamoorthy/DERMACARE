import type { AiChatRequest, AiChatResponse } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8011";

export async function sendMessage(body: AiChatRequest): Promise<AiChatResponse> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
