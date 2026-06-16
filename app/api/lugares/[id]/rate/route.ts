import { NextRequest } from "next/server";
import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id } = await params;
    const estrellas = await lugarModel.getUserRating(Number(id), Number(userId));
    return successResponse({ estrellas });
  } catch (error) {
    console.error("Error al obtener valoración:", error);
    return errorResponse("Error al obtener valoración", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id } = await params;
    const body = await request.json();
    const estrellas = Number(body.estrellas);

    if (!estrellas || estrellas < 1 || estrellas > 5) {
      return errorResponse("Valoración debe ser entre 1 y 5", 400);
    }

    const lugar = await lugarModel.rate(Number(id), Number(userId), estrellas);
    if (!lugar) return errorResponse("Lugar no encontrado", 404);

    return successResponse(lugar);
  } catch (error) {
    console.error("Error al valorar lugar:", error);
    return errorResponse("Error al valorar lugar", 500);
  }
}
