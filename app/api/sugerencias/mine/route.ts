import { NextRequest } from "next/server";
import * as sugerenciaModel from "@/models/sugerencia";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const sugerencias = await sugerenciaModel.findSuggestionsByUser(
      Number(userId)
    );
    return successResponse(sugerencias);
  } catch (error) {
    console.error("Error al obtener sugerencias:", error);
    return errorResponse("Error al obtener sugerencias", 500);
  }
}
