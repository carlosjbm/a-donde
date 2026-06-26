import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  try {
    const lugares = await lugarModel.findTopRated(5);
    return successResponse(lugares);
  } catch (error) {
    console.error("Error al obtener mejores lugares:", error);
    return errorResponse("Error al obtener lugares destacados", 500);
  }
}
