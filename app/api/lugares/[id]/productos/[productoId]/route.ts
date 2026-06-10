import { NextRequest } from "next/server";
import * as productModel from "@/models/producto";
import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const { id, productoId } = await params;
    const lugarId = Number(id);
    const idProducto = Number(productoId);

    if (!Number.isInteger(lugarId) || lugarId <= 0) {
      return errorResponse("ID de lugar inválido", 400);
    }
    if (!Number.isInteger(idProducto) || idProducto <= 0) {
      return errorResponse("ID de producto inválido", 400);
    }

    const lugar = await lugarModel.findById(lugarId);
    if (!lugar) {
      return errorResponse("Lugar no encontrado", 404);
    }

    const producto = await productModel.findById(idProducto, true);
    if (!producto || producto.id_lugar !== lugarId) {
      return errorResponse("Producto no encontrado en este lugar", 404);
    }

    return successResponse(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return errorResponse("Error al obtener producto", 500);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id, productoId } = await context.params;
    const lugarId = Number(id);
    const idProducto = Number(productoId);

    if (!Number.isInteger(lugarId) || lugarId <= 0) {
      return errorResponse("ID de lugar inválido", 400);
    }
    if (!Number.isInteger(idProducto) || idProducto <= 0) {
      return errorResponse("ID de producto inválido", 400);
    }

    const lugar = await lugarModel.findById(lugarId);
    if (!lugar) {
      return errorResponse("Lugar no encontrado", 404);
    }

    const body = await request.json();
    const { nombre, precio, notas, imagen, escencial, id_categ } = body;

    const result = await productModel.update(idProducto, {
      nombre,
      precio,
      notas,
      imagen,
      escencial,
      id_categ,
    });

    if (!result) {
      return errorResponse("Producto no encontrado", 404);
    }

    return successResponse(result);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    const message = error instanceof Error ? error.message : "Error al actualizar producto";
    return errorResponse(message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productoId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return errorResponse("No autenticado", 401);

    const { id, productoId } = await params;
    const lugarId = Number(id);
    const prodId = Number(productoId);

    if (!Number.isInteger(lugarId) || lugarId <= 0) {
      return errorResponse("ID de lugar inválido", 400);
    }
    if (!Number.isInteger(prodId) || prodId <= 0) {
      return errorResponse("ID de producto inválido", 400);
    }

    const lugar = await lugarModel.findById(lugarId);
    if (!lugar) {
      return errorResponse("Lugar no encontrado", 404);
    }

    const deleted = await productModel.deleteProducto(prodId, Number(userId));
    if (!deleted) return errorResponse("Producto no encontrado", 404);

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    const message = error instanceof Error ? error.message : "Error al eliminar producto";
    return errorResponse(message, 500);
  }
}
