import { NextRequest } from "next/server";
import * as packModel from "@/models/pack";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id } = await params;
    const packId = Number(id);
    if (!packId) return errorResponse("ID de pack inválido", 400);

    const body = await request.json();
    const { producto_id } = body;
    if (!producto_id) return errorResponse("producto_id es requerido", 400);

    const result = await packModel.addProduct(packId, Number(producto_id), Number(userId));
    return successResponse({ id: result }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al agregar producto";
    console.error("Error al agregar producto al pack:", error);
    return errorResponse(message, 400);
  }
}
