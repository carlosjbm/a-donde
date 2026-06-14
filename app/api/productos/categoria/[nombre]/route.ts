import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nombre: string }> }
) {
  try {
    const { nombre } = await params;
    const categoriaDecodificada = decodeURIComponent(nombre);

    const productos = await fetch(
      `http://localhost:3000/api/productos?filter=categoria&nombre=${encodeURIComponent(categoriaDecodificada)}`
    ).then((res) => res.json());

    return successResponse(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return errorResponse("Error al obtener productos por categoría", 500);
  }
}
