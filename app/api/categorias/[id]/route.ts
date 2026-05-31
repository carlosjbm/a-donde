import { NextRequest } from "next/server";
import * as categoriaModel from "@/models/categoria";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoria = await categoriaModel.findById(Number(id));
    if (!categoria) return errorResponse("Categoría no encontrada", 404);
    return successResponse(categoria);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return errorResponse("Error al obtener categoría", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const categoria = await categoriaModel.update(Number(id), body);
    if (!categoria) return errorResponse("Categoría no encontrada", 404);
    return successResponse(categoria);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return errorResponse("Error al actualizar categoría", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await categoriaModel.remove(Number(id));
    if (!deleted) return errorResponse("Categoría no encontrada", 404);
    return successResponse({ message: "Categoría eliminada" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return errorResponse("Error al eliminar categoría", 500);
  }
}
