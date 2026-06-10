import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { errorResponse } from "@/lib/utils";

export async function requireAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) return null;

  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.rolId !== 1) return null;

  return payload;
}

export function unauthorizedResponse() {
  return errorResponse("No autorizado", 401);
}
