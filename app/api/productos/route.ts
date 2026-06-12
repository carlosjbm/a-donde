import { NextRequest } from "next/server";
import * as productoModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  try {
    const productos = await productoModel.findAll();
    return successResponse(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return errorResponse("Error al obtener productos", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { nombre, precio, id_lugar, id_categ, escencial, notas } = body;

    if (!nombre || precio === undefined || !id_lugar) {
      return errorResponse("Nombre, precio y lugar son obligatorios");
    }

    const producto = await productoModel.create({
      nombre,
      precio: Number(precio),
      idLugar: Number(id_lugar),
      id_categ: id_categ ? Number(id_categ) : null,
      escencial: Boolean(escencial),
      notas: notas || null,
    });
    return successResponse(producto, 201);
  } catch (error) {
    console.error("Error al crear producto:", error);
    return errorResponse("Error al crear producto", 500);
  }
}
