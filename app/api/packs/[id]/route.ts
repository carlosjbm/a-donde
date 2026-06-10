import { NextRequest } from "next/server";
import * as packModel from "@/models/pack";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id } = await params;
    const packId = Number(id);
    if (!packId) return errorResponse("ID inválido", 400);

    const pack = await packModel.findById(packId, Number(userId));
    if (!pack) return errorResponse("Pack no encontrado", 404);

    return successResponse(pack);
  } catch (error) {
    console.error("Error al obtener pack:", error);
    return errorResponse("Error al obtener pack", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id } = await params;
    const packId = Number(id);
    if (!packId) return errorResponse("ID inválido", 400);

    const deleted = await packModel.remove(packId, Number(userId));
    if (!deleted) return errorResponse("Pack no encontrado", 404);

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("Error al eliminar pack:", error);
    return errorResponse("Error al eliminar pack", 500);
  }
}
