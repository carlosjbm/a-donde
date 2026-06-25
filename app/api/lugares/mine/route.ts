import { NextRequest } from "next/server";
import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const lugares = await lugarModel.findByUsuarioId(Number(userId));
    return successResponse(lugares);
  } catch (error) {
    console.error("Error al obtener lugares del usuario:", error);
    return errorResponse("Error al obtener lugares", 500);
  }
}
