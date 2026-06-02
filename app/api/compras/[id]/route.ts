import { NextRequest } from "next/server";
import * as compraModel from "@/models/compra";
import { successResponse, errorResponse } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id } = await params;
    const compraId = Number(id);
    if (!Number.isFinite(compraId) || compraId <= 0) {
      return errorResponse("ID de compra inválido", 400);
    }

    const existing = await compraModel.findById(compraId, Number(userId));
    if (!existing) return errorResponse("Compra no encontrada", 404);

    const body = await request.json();
    if (typeof body.agotado !== "boolean") {
      return errorResponse("El campo 'agotado' debe ser booleano", 400);
    }

    const updated = await compraModel.setAgotado(
      compraId,
      Number(userId),
      body.agotado
    );
    if (!updated) return errorResponse("Compra no encontrada", 404);

    return successResponse(updated);
  } catch (error) {
    console.error("Error al actualizar compra:", error);
    return errorResponse("Error al actualizar compra", 500);
  }
}
