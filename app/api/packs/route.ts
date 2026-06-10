import { NextRequest } from "next/server";
import * as packModel from "@/models/pack";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const body = await request.json();
    const { nombre } = body;

    if (!nombre || !nombre.trim()) {
      return errorResponse("El nombre del pack es requerido", 400);
    }

    const newPack = await packModel.create({
      nombre: nombre.trim(),
      usuario_id: Number(userId),
    });

    return successResponse(newPack, 201);
  } catch (error) {
    console.error("Error al crear pack:", error);
    return errorResponse("Error al crear pack", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return errorResponse("id es requerido", 400);

    const deleted = await packModel.remove(id, Number(userId));
    if (!deleted) return errorResponse("Pack no encontrado", 404);

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("Error al eliminar pack:", error);
    return errorResponse("Error al eliminar pack", 500);
  }
}
