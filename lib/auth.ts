import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAccessToken(payload: {
  userId: number;
  email: string;
  rolId: number;
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyAccessToken(
  token: string
): Promise<{ userId: number; email: string; rolId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as {
      userId: number;
      email: string;
      rolId: number;
    };
  } catch {
    return null;
  }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    path: "/api/auth",
    maxAge: 0,
  });
}
