import { NextRequest } from "next/server";
import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";
import { unauthorizedResponse } from "@/lib/admin-auth";
import { canManageLugar } from "@/lib/lugar-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lugar = await lugarModel.findById(Number(id));
    if (!lugar) return errorResponse("Lugar no encontrado", 404);
    return successResponse(lugar);
  } catch (error) {
    console.error("Error al obtener lugar:", error);
    return errorResponse("Error al obtener lugar", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lugarId = Number(id);
    const auth = await canManageLugar(request, lugarId);
    if (!auth) return unauthorizedResponse();

    const body = await request.json();
    const lugar = await lugarModel.update(lugarId, body);
    if (!lugar) return errorResponse("Lugar no encontrado", 404);
    return successResponse(lugar);
  } catch (error) {
    console.error("Error al actualizar lugar:", error);
    return errorResponse("Error al actualizar lugar", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lugarId = Number(id);
    const auth = await canManageLugar(request, lugarId);
    if (!auth) return unauthorizedResponse();

    const deleted = await lugarModel.remove(lugarId);
    if (!deleted) return errorResponse("Lugar no encontrado", 404);
    return successResponse({ message: "Lugar eliminado" });
  } catch (error) {
    console.error("Error al eliminar lugar:", error);
    return errorResponse("Error al eliminar lugar", 500);
  }
}
