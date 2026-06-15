import { NextRequest } from "next/server";
import * as productoModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const categoriaId = Number(id);

    if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
      return errorResponse("ID de categoría inválido", 400);
    }

    const productos = await productoModel.findByCategoriaId(categoriaId, 5);
    return successResponse(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return errorResponse("Error al obtener productos", 500);
  }
}
