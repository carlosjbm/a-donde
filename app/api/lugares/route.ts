import { NextRequest } from "next/server";
import * as lugarModel from "@/models/lugar";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  try {
    const lugares = await lugarModel.findAll();
    return successResponse(lugares);
  } catch (error) {
    console.error("Error al obtener lugares:", error);
    return errorResponse("Error al obtener lugares", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, direccion, latitud, longitud } = body;

    if (!nombre || !direccion) {
      return errorResponse("Nombre y dirección son obligatorios");
    }

    const lugar = await lugarModel.create({
      nombre,
      descripcion: descripcion || "",
      direccion,
      latitud: latitud || null,
      longitud: longitud || null,
    });
    return successResponse(lugar, 201);
  } catch (error) {
    console.error("Error al crear lugar:", error);
    return errorResponse("Error al crear lugar", 500);
  }
}
