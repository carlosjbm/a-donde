import { NextRequest } from "next/server";
import * as presupuestoModel from "@/models/presupuesto";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const presupuesto = await presupuestoModel.findById(Number(id));
    if (!presupuesto) return errorResponse("Presupuesto no encontrado", 404);
    return successResponse(presupuesto);
  } catch (error) {
    console.error("Error al obtener presupuesto:", error);
    return errorResponse("Error al obtener presupuesto", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const presupuesto = await presupuestoModel.update(Number(id), body);
    if (!presupuesto) return errorResponse("Presupuesto no encontrado", 404);
    return successResponse(presupuesto);
  } catch (error) {
    console.error("Error al actualizar presupuesto:", error);
    return errorResponse("Error al actualizar presupuesto", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await presupuestoModel.remove(Number(id));
    if (!deleted) return errorResponse("Presupuesto no encontrado", 404);
    return successResponse({ message: "Presupuesto eliminado" });
  } catch (error) {
    console.error("Error al eliminar presupuesto:", error);
    return errorResponse("Error al eliminar presupuesto", 500);
  }
}
