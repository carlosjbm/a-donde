import { NextRequest } from "next/server";
import * as usuarioModel from "@/models/usuario";
import { successResponse, errorResponse } from "@/lib/utils";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const usuarios = await usuarioModel.findAll();
    return successResponse(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return errorResponse("Error al obtener usuarios", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { nombre, email, password } = body;

    if (!nombre || !email || !password) {
      return errorResponse("Nombre, email y password son obligatorios");
    }

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
    return successResponse(usuario, 201);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return errorResponse("Error al crear usuario", 500);
  }
}
