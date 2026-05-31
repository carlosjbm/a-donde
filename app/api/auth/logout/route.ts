import { NextRequest, NextResponse } from "next/server";
import * as sesionModel from "@/models/sesion";
import { clearAuthCookies } from "@/lib/auth";
import { errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      await sesionModel.deleteByRefreshToken(refreshToken);
    }

    const response = NextResponse.json({
      success: true,
      data: { message: "Sesión cerrada" },
    });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return errorResponse("Error al cerrar sesión", 500);
  }
}
