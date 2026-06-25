import { NextRequest } from "next/server";
import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";
import { verifyAccessToken } from "@/lib/auth";

async function getUserIdFromCookie(request: NextRequest): Promise<number | null> {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return payload?.userId ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const lugares = await lugarModel.findAll();
    return successResponse(lugares);
  } catch (error) {
    console.error("Error al obtener lugares:", error);
    return errorResponse("Error al obtener lugares", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromCookie(request);
    if (!userId) return errorResponse("No autenticado", 401);

    const body = await request.json();
    const { nombre, descripcion, direccion, latitud, longitud, transferencia } = body;

    if (!nombre || !direccion) {
      return errorResponse("Nombre y dirección son obligatorios");
    }

    const lugar = await lugarModel.create({
      nombre,
      descripcion: descripcion || "",
      direccion,
      latitud: latitud || null,
      longitud: longitud || null,
      transferencia: Boolean(transferencia),
      usuario_id: userId,
    });
    return successResponse(lugar, 201);
  } catch (error) {
    console.error("Error al crear lugar:", error);
    return errorResponse("Error al crear lugar", 500);
  }
}
