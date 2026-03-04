import type { Chat, AddChatBody, UpdateChatBody } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_CHAT_API_URL || "http://localhost:8004";

export async function addChat(body: AddChatBody): Promise<Chat> {
  const res = await fetch(`${BASE_URL}/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to add chat");
  return res.json();
}

export async function getAllChats(): Promise<Chat[]> {
  const res = await fetch(`${BASE_URL}/chats`);
  if (!res.ok) throw new Error("Failed to get chats");
  return res.json();
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const res = await fetch(`${BASE_URL}/chats/user/${userId}`);
  if (!res.ok) throw new Error("Failed to get user chats");
  return res.json();
}

export async function updateChat(chatId: string, body: UpdateChatBody): Promise<Chat> {
  const res = await fetch(`${BASE_URL}/chats/${chatId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to update chat");
  return res.json();
}

export async function deleteChat(chatId: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/chats/${chatId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete chat");
  return res.json();
}
