import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils"
import * as presupuestoModel from "@/models/presupuesto"

export async function GET() {
  try {
    const presupuestos = await presupuestoModel.findAll()
    return successResponse(presupuestos)
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return errorResponse("Error al obtener presupuestos", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { descripcion, valor } = body;

    if (!descripcion || valor === undefined) {
      return errorResponse(" descripción y valor son requeridos", 400);
    }

    const presupuesto = await presupuestoModel.create({ descripcion, valor });
    return successResponse(presupuesto, 201);
  } catch (error) {
    console.error("Error al crear presupuesto:", error);
    return errorResponse("Error al crear presupuesto", 500);
  }
}
