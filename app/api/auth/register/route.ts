import { NextRequest } from "next/server";
import * as usuarioModel from "@/models/usuario";
import * as sesionModel from "@/models/sesion";
import {
  signAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import { registerSchema } from "@/schemas/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { nombre, email, password } = parsed.data;

    const existing = await usuarioModel.findByEmail(email);
    if (existing) {
      return errorResponse("El email ya está registrado", 409);
    }

    const usuario = await usuarioModel.create({
      nombre,
      email,
      password,
      rol_id: 1,
    });

    const accessToken = await signAccessToken({
      userId: usuario.id,
      email: usuario.email,
      rolId: usuario.rol_id,
    });

    const refreshToken = generateRefreshToken();
    await sesionModel.create(usuario.id, refreshToken);

    const response = successResponse(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_id: usuario.rol_id,
      },
      201
    );

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return errorResponse("Error al registrar usuario", 500);
  }
}
