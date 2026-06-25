import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import * as lugarModel from "@/models/lugar";

export interface AuthResult {
  userId: number;
  isAdmin: boolean;
}

export async function getAuthUser(request: NextRequest): Promise<AuthResult | null> {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;
  return { userId: payload.userId, isAdmin: payload.rolId === 1 };
}

export async function canManageLugar(
  request: NextRequest,
  lugarId: number
): Promise<AuthResult | null> {
  const user = await getAuthUser(request);
  if (!user) return null;
  if (user.isAdmin) return user;

  const isOwner = await lugarModel.isOwner(lugarId, user.userId);
  if (isOwner) return user;

  return null;
}
