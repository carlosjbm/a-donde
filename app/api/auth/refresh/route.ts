import { NextRequest } from "next/server";
import * as sesionModel from "@/models/sesion";
import * as usuarioModel from "@/models/usuario";
import {
  signAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return errorResponse("No autorizado", 401);
    }

    const sesion = await sesionModel.findByRefreshToken(refreshToken);
    if (!sesion) {
      const response = errorResponse("Sesión inválida o expirada", 401);
      clearAuthCookies(response);
      return response;
    }

    await sesionModel.deleteByRefreshToken(refreshToken);

    const usuario = await usuarioModel.findById(sesion.usuario_id);
    if (!usuario) {
      return errorResponse("Usuario no encontrado", 404);
    }

    const newAccessToken = await signAccessToken({
      userId: usuario.id,
      email: usuario.email,
      rolId: usuario.rol_id,
    });

    const newRefreshToken = generateRefreshToken();
    await sesionModel.create(usuario.id, newRefreshToken);

    const response = successResponse({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
    });

    setAuthCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch (error) {
    console.error("Error al refrescar sesión:", error);
    return errorResponse("Error al refrescar sesión", 500);
  }
}
