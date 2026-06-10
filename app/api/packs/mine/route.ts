import { NextRequest } from "next/server";
import * as packModel from "@/models/pack";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const packs = await packModel.findByUserId(Number(userId));
    return successResponse(packs);
  } catch (error) {
    console.error("Error al obtener packs:", error);
    return errorResponse("Error al obtener packs", 500);
  }
}
