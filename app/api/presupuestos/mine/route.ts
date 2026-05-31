import { NextRequest } from "next/server";
import * as presupuestoModel from "@/models/presupuesto";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const presupuestos = await presupuestoModel.findByUserId(Number(userId));
    return successResponse(presupuestos);
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return errorResponse("Error al obtener presupuestos", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const body = await request.json();
    const { descripcion, valor } = body;

    if (!descripcion || valor === undefined) {
      return errorResponse("Descripción y valor son requeridos", 400);
    }

    const presupuesto = await presupuestoModel.create({
      descripcion,
      valor,
      user_id: Number(userId),
    });
    return successResponse(presupuesto, 201);
  } catch (error) {
    console.error("Error al crear presupuesto:", error);
    return errorResponse("Error al crear presupuesto", 500);
  }
}
