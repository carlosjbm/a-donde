export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
}

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function register(
  nombre: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password }),
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function getMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;

  const json = await res.json();
  if (!json.success) return null;
  return json.data;
}

export async function refreshSession(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  if (!res.ok) return null;

  const json = await res.json();
  if (!json.success) return null;
  return json.data;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
