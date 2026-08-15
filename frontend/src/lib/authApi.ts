export interface CurrentUser {
  id: number;
  email: string;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
}

async function extractError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return typeof body.detail === "string" ? body.detail : "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export async function signUp(email: string, password: string): Promise<CurrentUser> {
  const response = await authFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(await extractError(response));
  return response.json();
}

export async function signIn(email: string, password: string): Promise<CurrentUser> {
  const response = await authFetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(await extractError(response));
  return response.json();
}

export async function signOut(): Promise<void> {
  await authFetch("/api/auth/signout", { method: "POST" });
}

/** Returns null (not an error) when there's no signed-in user. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const response = await authFetch("/api/auth/me");
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Failed to load the current user.");
  return response.json();
}
