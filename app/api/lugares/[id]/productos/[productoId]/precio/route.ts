import { NextRequest } from "next/server";
import { z } from "zod";
import * as productModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";
import { canManageLugar } from "@/lib/lugar-auth";

const bodySchema = z.object({
  precio: z.coerce.number().positive("El precio debe ser mayor a 0").optional(),
  notas: z.string().max(500).optional(),
  activo: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const { id, productoId } = await context.params;
    const lugarId = Number(id);
    const idProducto = Number(productoId);

    if (!Number.isInteger(lugarId) || lugarId <= 0) {
      return errorResponse("ID de lugar inválido", 400);
    }
    if (!Number.isInteger(idProducto) || idProducto <= 0) {
      return errorResponse("ID de producto inválido", 400);
    }

    const auth = await canManageLugar(request, lugarId);
    if (!auth) return errorResponse("No autorizado", 401);

    const producto = await productModel.findByIdAny(idProducto);
    if (!producto || producto.id_lugar !== lugarId) {
      return errorResponse("Producto no encontrado en este lugar", 404);
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    let result = null;
    if (parsed.data.precio !== undefined) {
      result = await productModel.updatePrecio({
        idProducto,
        precio: parsed.data.precio,
        idUsuario: auth.userId,
        fuente: "manual",
        notas: parsed.data.notas ?? null,
        activo: parsed.data.activo,
      });
    } else if (parsed.data.activo !== undefined) {
      await productModel.updateActivo(idProducto, parsed.data.activo);
    }

    return successResponse({
      id_producto: idProducto,
      precio: parsed.data.precio ?? producto.precio,
      activo: parsed.data.activo ?? producto.activo,
      ...(result ? { precio_anterior: result.precio_anterior, variacion_porcentaje: result.variacion_porcentaje, created_at: result.created_at } : {}),
    });
  } catch (error) {
    console.error("Error al actualizar precio:", error);
    const message =
      error instanceof Error ? error.message : "Error al actualizar precio";
    return errorResponse(message, 500);
  }
}
