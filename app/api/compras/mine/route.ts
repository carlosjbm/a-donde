import { NextRequest } from "next/server";
import * as compraModel from "@/models/compra";
import * as packModel from "@/models/pack";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const compras = await compraModel.findByUserId(Number(userId));
    return successResponse(compras);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    return errorResponse("Error al obtener compras", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const body = await request.json();
    const { id_producto, observacion, id_pack, cantidad } = body;

    if (!id_producto) {
      return errorResponse("id_producto es requerido", 400);
    }

    const result = await compraModel.create({
      id_producto: Number(id_producto),
      user_id: Number(userId),
      observacion: observacion || "",
      cantidad: cantidad ? Number(cantidad) : 1,
    });

    if (id_pack) {
      try {
        await packModel.addProduct(Number(id_pack), Number(id_producto), Number(userId));
      } catch (error) {
        console.error("Error al agregar producto al pack:", error);
      }
    }

    return successResponse(result, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al realizar compra";
    console.error("Error al realizar compra:", error);
    return errorResponse(message, 400);
  }
}
