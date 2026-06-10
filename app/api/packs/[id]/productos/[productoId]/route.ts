import { NextRequest } from "next/server";
import * as packModel from "@/models/pack";
import { successResponse, errorResponse } from "@/lib/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productoId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id, productoId } = await params;
    const packId = Number(id);
    const prodId = Number(productoId);
    if (!packId || !prodId) return errorResponse("ID inválido", 400);

    const deleted = await packModel.removeProduct(packId, prodId);
    if (!deleted) return errorResponse("Producto no encontrado en el pack", 404);

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("Error al eliminar producto del pack:", error);
    return errorResponse("Error al eliminar producto del pack", 500);
  }
}
