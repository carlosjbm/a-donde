import { NextRequest } from "next/server";
import * as productModel from "@/models/producto";
import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lugarId = Number(id);

    if (!Number.isInteger(lugarId) || lugarId <= 0) {
      return errorResponse("ID de lugar inválido", 400);
    }

    const lugar = await lugarModel.findById(lugarId);
    if (!lugar) {
      return errorResponse("Lugar no encontrado", 404);
    }

    const productos = await productModel.findByLugarId(lugarId);
    return successResponse(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return errorResponse("Error al obtener productos", 500);
  }
}
