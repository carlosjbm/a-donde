import { NextRequest } from "next/server";
import { z } from "zod";
import * as productModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";

const querySchema = z.object({
  nombre: z.string().min(1, "nombre es requerido"),
  periodo: z.enum(["semana", "mes", "ano"]).default("mes"),
  lugar: z.coerce.number().int().positive().optional(),
  exclude: z.coerce.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      nombre: searchParams.get("nombre") ?? "",
      periodo: searchParams.get("periodo") ?? "mes",
      lugar: searchParams.get("lugar") ?? undefined,
      exclude: searchParams.get("exclude") ?? undefined,
    });

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { nombre, periodo, lugar, exclude } = parsed.data;

    const historial = await productModel.getPriceHistory(
      nombre,
      periodo,
      exclude,
      lugar,
    );

    if (!historial) {
      return successResponse({
        nombre,
        periodo,
        precio_actual: 0,
        lugar_actual: "",
        variacion_porcentaje: 0,
        tendencia: "estable" as const,
        puntos: [],
      });
    }

    return successResponse(historial);
  } catch (error) {
    console.error("Error al obtener historial de precios:", error);
    return errorResponse("Error al obtener historial de precios", 500);
  }
}
