import { NextRequest } from "next/server";
import * as productModel from "@/models/producto";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productos = await productModel.findByLugarId(Number(id));
    return successResponse(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return errorResponse("Error al obtener productos", 500);
  }
}
