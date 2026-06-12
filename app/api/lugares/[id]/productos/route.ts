import { NextRequest } from "next/server";
import * as lugarModel from "@/models/lugar";
import * as productModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lugarId = Number(id);

    if (!Number.isInteger(lugarId) || lugarId <= 0) {
      return errorResponse("ID de lugar inválido", 400);
    }

    const lugar = await lugarModel.findById(lugarId);
    if (!lugar) {
      return errorResponse("Lugar no encontrado", 404);
    }

    const productos = await productModel.findByLugarId(lugarId);
    return successResponse(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return errorResponse("Error al obtener productos", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lugarId = Number(id);
    if (!Number.isInteger(lugarId) || lugarId <= 0) {
      return errorResponse("ID de lugar inválido", 400);
    }

    const body = await request.json();
    const { nombre, precio, notas, imagen, escencial, id_categ } = body;

    if (!nombre || !precio) {
      return errorResponse("Nombre y precio son obligatorios", 400);
    }

    const lugar = await lugarModel.findById(lugarId);
    if (!lugar) {
      return errorResponse("Lugar no encontrado", 404);
    }

    const producto = await productModel.create({
      nombre,
      precio,
      notas: notas || null,
      imagen: imagen || null,
      escencial: Boolean(escencial),
      id_categ: id_categ || null,
      idLugar: lugarId,
    });

    return successResponse(producto, 201);
  } catch (error) {
    console.error("Error al crear producto:", error);
    const message = error instanceof Error ? error.message : "Error al crear producto";
    return errorResponse(message, 500);
  }
}
