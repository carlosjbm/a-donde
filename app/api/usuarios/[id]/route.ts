import { NextRequest } from "next/server";
import * as usuarioModel from "@/models/usuario";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuario = await usuarioModel.findById(Number(id));
    if (!usuario) return errorResponse("Usuario no encontrado", 404);
    return successResponse(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return errorResponse("Error al obtener usuario", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const usuario = await usuarioModel.update(Number(id), body);
    if (!usuario) return errorResponse("Usuario no encontrado", 404);
    return successResponse(usuario);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return errorResponse("Error al actualizar usuario", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await usuarioModel.remove(Number(id));
    if (!deleted) return errorResponse("Usuario no encontrado", 404);
    return successResponse({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return errorResponse("Error al eliminar usuario", 500);
  }
}
