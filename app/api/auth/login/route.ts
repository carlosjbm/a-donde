import { NextRequest } from "next/server";
import * as usuarioModel from "@/models/usuario";
import * as sesionModel from "@/models/sesion";
import {
  verifyPassword,
  signAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import { loginSchema } from "@/schemas/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { email, password } = parsed.data;

    const usuario = await usuarioModel.findByEmail(email);
    if (!usuario || !(await verifyPassword(password, usuario.password))) {
      return errorResponse("Credenciales inválidas", 401);
    }

    const accessToken = await signAccessToken({
      userId: usuario.id,
      email: usuario.email,
      rolId: usuario.rol_id,
    });

    const refreshToken = generateRefreshToken();
    await sesionModel.create(usuario.id, refreshToken);

    const response = successResponse({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
    });

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return errorResponse("Error al iniciar sesión", 500);
  }
}
