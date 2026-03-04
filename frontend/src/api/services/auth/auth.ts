import type { SigninBody, SigninResponse, SignupBody, SignupResponse } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8001";

/**
 * Sign in an existing user.
 * Returns the JWT access token payload on success.
 * Throws an Error with the server's detail message on failure.
 */
export async function signIn(body: SigninBody): Promise<SigninResponse> {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "Invalid credentials");
  }

  return res.json();
}

/**
 * Register a new user account.
 * Throws an Error with the server's detail message on failure.
 */
export async function signUp(body: SignupBody): Promise<SignupResponse> {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "Signup failed");
  }

  return res.json();
}
