import { NextRequest } from "next/server";
import * as categoriaModel from "@/models/categoria";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  try {
    const categorias = await categoriaModel.findAll();
    return successResponse(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return errorResponse("Error al obtener categorías", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, icono } = body;

    if (!nombre) {
      return errorResponse("El nombre es obligatorio");
    }

    const categoria = await categoriaModel.create({
      nombre,
      descripcion: descripcion || "",
      icono: icono || null,
    });
    return successResponse(categoria, 201);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return errorResponse("Error al crear categoría", 500);
  }
}
