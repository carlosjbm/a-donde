import { NextRequest } from "next/server";
import * as productModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length === 0) {
      return errorResponse("Debe proporcionar un término de búsqueda");
    }

    const results = await productModel.searchByNombre(q.trim());
    return successResponse(results);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return errorResponse("Error al buscar productos", 500);
  }
}
