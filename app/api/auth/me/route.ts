import { NextRequest } from "next/server";
import * as usuarioModel from "@/models/usuario";
import { verifyAccessToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return errorResponse("No autorizado", 401);
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return errorResponse("Token inválido o expirado", 401);
    }

    const usuario = await usuarioModel.findById(payload.userId);
    if (!usuario) {
      return errorResponse("Usuario no encontrado", 404);
    }

    return successResponse({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return errorResponse("Error al obtener usuario", 500);
  }
}
