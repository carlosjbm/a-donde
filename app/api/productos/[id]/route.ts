import { NextRequest } from "next/server";
import * as productoModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const producto = await productoModel.findById(Number(id), true);
    if (!producto) return errorResponse("Producto no encontrado", 404);
    return successResponse(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return errorResponse("Error al obtener producto", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.nombre !== undefined) updateData.nombre = body.nombre;
    if (body.precio !== undefined) updateData.precio = Number(body.precio);
    if (body.id_lugar !== undefined) updateData.id_lugar = Number(body.id_lugar);
    if (body.id_categ !== undefined) updateData.id_categ = body.id_categ ? Number(body.id_categ) : null;
    if (body.escencial !== undefined) updateData.escencial = Boolean(body.escencial);
    if (body.notas !== undefined) updateData.notas = body.notas;
    if (body.activo !== undefined) updateData.activo = Boolean(body.activo);

    const producto = await productoModel.update(Number(id), updateData);
    if (!producto) return errorResponse("Producto no encontrado", 404);
    return successResponse(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return errorResponse("Error al actualizar producto", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    await productoModel.deleteProducto(Number(id), admin.userId);
    return successResponse({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return errorResponse("Error al eliminar producto", 500);
  }
}
