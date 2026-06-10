import { NextRequest } from "next/server";
import * as usuarioModel from "@/models/usuario";
import { successResponse, errorResponse } from "@/lib/utils";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

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
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const { password, ...data } = await request.json();

    if (Number(id) === admin.userId && data.rol_id !== undefined && data.rol_id !== 1) {
      return errorResponse("No puedes cambiarte el rol a ti mismo", 400);
    }

    if (password) {
      await usuarioModel.updatePassword(Number(id), password);
    }

    const usuario = await usuarioModel.update(Number(id), data);
    if (!usuario) return errorResponse("Usuario no encontrado", 404);
    return successResponse(usuario);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return errorResponse("Error al actualizar usuario", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { id } = await params;

    if (Number(id) === admin.userId) {
      return errorResponse("No puedes eliminarte a ti mismo", 400);
    }

    const deleted = await usuarioModel.remove(Number(id));
    if (!deleted) return errorResponse("Usuario no encontrado", 404);
    return successResponse({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return errorResponse("Error al eliminar usuario", 500);
  }
}
