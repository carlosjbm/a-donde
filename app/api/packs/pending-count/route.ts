import { NextRequest } from "next/server";
import * as packModel from "@/models/pack";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const count = await packModel.getPendingCount(Number(userId));
    return successResponse({ count });
  } catch (error) {
    console.error("Error al obtener conteo pendiente:", error);
    return errorResponse("Error al obtener conteo pendiente", 500);
  }
}
