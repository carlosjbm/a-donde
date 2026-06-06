import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  Producto,
  ProductoSearchResult,
  ProductoPrecio,
  ProductoPrecioFuente,
  PrecioHistorial,
  PrecioHistorialPeriodo,
} from "@/types";

export async function findAll():Promise<Producto[]> {
  const [rows]=await pool.query("SELECT * FROM productos")
  return rows as Producto[]
}

export async function findById(
  id: number,
  activo: boolean,
): Promise<Producto | null> {
  const [rows] = await pool.query(
    "SELECT * FROM productos WHERE id = ? and activo= ? ",
    [id, activo],
  );
  return (rows as Producto[])[0] || null;
}

export async function findByLugarId(lugarId: number): Promise<Producto[]> {
  const [rows] = await pool.query(
    "SELECT * FROM productos WHERE id_lugar = ? AND activo = true",
    [lugarId],
  );
  return rows as Producto[];
}

export async function searchByNombre(
  query: string,
): Promise<ProductoSearchResult[]> {
  const [rows] = await pool.query(
    `SELECT p.id, p.nombre, p.precio, l.id AS lugar_id, l.nombre AS lugar_nombre
     FROM productos p
     JOIN lugares l ON p.id_lugar = l.id
     WHERE LOWER(p.nombre) LIKE LOWER(?) AND p.activo = true
     ORDER BY p.precio ASC
     LIMIT 10`,
    [`%${query}%`],
  );
  return rows as ProductoSearchResult[];
}

function groupExpr(periodo: PrecioHistorialPeriodo): string {
  switch (periodo) {
    case "semana":
      return "DATE_FORMAT(pp.created_at, '%x-%v')";
    case "mes":
      return "DATE_FORMAT(pp.created_at, '%Y-%m')";
    case "ano":
      return "DATE_FORMAT(pp.created_at, '%Y')";
  }
}

function startDateExpr(periodo: PrecioHistorialPeriodo): string {
  switch (periodo) {
    case "semana":
      return "DATE_SUB(pp.created_at, INTERVAL WEEKDAY(pp.created_at) DAY)";
    case "mes":
      return "DATE_FORMAT(pp.created_at, '%Y-%m-01')";
    case "ano":
      return "DATE_FORMAT(pp.created_at, '%Y-01-01')";
  }
}

const COLLATION = "utf8mb4_unicode_ci";

function nombreNormalizado(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function getPriceHistory(
  nombre: string,
  periodo: PrecioHistorialPeriodo,
  excludeId?: number,
  lugarId?: number,
): Promise<PrecioHistorial | null> {
  const normalized = nombreNormalizado(nombre);

  if (!normalized) return null;

  const groupBy = groupExpr(periodo);
  const startDate = startDateExpr(periodo);

  const params: unknown[] = [normalized];
  let lugarClause = "";
  if (lugarId !== undefined) {
    lugarClause = "AND p.id_lugar = ? ";
    params.push(lugarId);
  }

  const [rows] = await pool.query(
    `SELECT ${groupBy} AS periodo,
            MIN(${startDate}) AS fecha_inicio,
            AVG(pp.precio) AS promedio,
            MIN(pp.precio) AS minimo,
            MAX(pp.precio) AS maximo,
            COUNT(*) AS cantidad
     FROM producto_precios pp
     JOIN productos p ON p.id = pp.id_producto
     WHERE p.nombre COLLATE ${COLLATION} = ?
       ${lugarClause}
     GROUP BY periodo
     ORDER BY MIN(pp.created_at) ASC`,
    params,
  );

  const puntos = (rows as Array<{
    periodo: string;
    fecha_inicio: Date;
    promedio: number;
    minimo: number;
    maximo: number;
    cantidad: number;
  }>).map((r) => ({
    periodo: String(r.periodo),
    fecha_inicio:
      r.fecha_inicio instanceof Date
        ? r.fecha_inicio.toISOString().slice(0, 10)
        : String(r.fecha_inicio).slice(0, 10),
    promedio: Number(r.promedio),
    minimo: Number(r.minimo),
    maximo: Number(r.maximo),
    cantidad: Number(r.cantidad),
  }));

  if (puntos.length === 0) return null;

  const [metaRows] = await pool.query(
    `SELECT p.precio, p.nombre, l.nombre AS lugar_nombre
     FROM productos p
     JOIN lugares l ON p.id_lugar = l.id
     WHERE p.id = ?`,
    [excludeId ?? -1],
  );
  const refProduct = (metaRows as Array<{
    precio: number;
    nombre: string;
    lugar_nombre: string;
  }>)[0];

  let precioActual: number;
  let lugarActual: string;
  let nombreReal: string;

  if (refProduct) {
    precioActual = Number(refProduct.precio);
    lugarActual = refProduct.lugar_nombre;
    nombreReal = refProduct.nombre;
  } else {
    const fallbackParams: unknown[] = [normalized];
    let fallbackLugarClause = "";
    if (lugarId !== undefined) {
      fallbackLugarClause = "AND p.id_lugar = ? ";
      fallbackParams.push(lugarId);
    }
    const [fallbackRows] = await pool.query(
      `SELECT p.precio, p.nombre, l.nombre AS lugar_nombre
       FROM producto_precios pp
       JOIN productos p ON p.id = pp.id_producto
       JOIN lugares l ON p.id_lugar = l.id
       WHERE p.nombre COLLATE ${COLLATION} = ?
         ${fallbackLugarClause}
       ORDER BY pp.created_at DESC
       LIMIT 1`,
      fallbackParams,
    );
    const fallback = (fallbackRows as Array<{
      precio: number;
      nombre: string;
      lugar_nombre: string;
    }>)[0];
    if (!fallback) return null;
    precioActual = Number(fallback.precio);
    lugarActual = fallback.lugar_nombre;
    nombreReal = fallback.nombre;
  }

  let variacionPorcentaje = 0;
  let tendencia: "sube" | "baja" | "estable" = "estable";
  if (puntos.length >= 2) {
    const primero = puntos[0].promedio;
    const ultimo = puntos[puntos.length - 1].promedio;
    if (primero > 0) {
      variacionPorcentaje = ((ultimo - primero) / primero) * 100;
    }
    if (variacionPorcentaje > 1) tendencia = "sube";
    else if (variacionPorcentaje < -1) tendencia = "baja";
  }

  return {
    nombre: nombreReal,
    periodo,
    precio_actual: precioActual,
    lugar_actual: lugarActual,
    variacion_porcentaje: Number(variacionPorcentaje.toFixed(2)),
    tendencia,
    puntos,
  };
}

export async function findPriceById(
  idProducto: number,
): Promise<ProductoPrecio | null> {
  const [rows] = await pool.query(
    "SELECT * FROM producto_precios WHERE id = ?",
    [idProducto],
  );
  return (rows as ProductoPrecio[])[0] || null;
}

export async function findPricesByProducto(
  idProducto: number,
  limit = 50,
): Promise<ProductoPrecio[]> {
  const [rows] = await pool.query(
    "SELECT * FROM producto_precios WHERE id_producto = ? ORDER BY created_at DESC LIMIT ?",
    [idProducto, limit],
  );
  return rows as ProductoPrecio[];
}

export interface UpdatePrecioInput {
  idProducto: number;
  precio: number;
  idUsuario?: number | null;
  fuente?: ProductoPrecioFuente;
  notas?: string | null;
}

export interface UpdatePrecioResult {
  id_producto: number;
  precio: number;
  precio_anterior: number;
  variacion_porcentaje: number;
  created_at: string;
}

export async function updatePrecio(
  input: UpdatePrecioInput,
): Promise<UpdatePrecioResult> {
  const { idProducto, precio, idUsuario, fuente, notas } = input;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [currentRows] = await conn.query<RowDataPacket[]>(
      "SELECT precio FROM productos WHERE id = ? FOR UPDATE",
      [idProducto],
    );
    const current = (currentRows as Array<{ precio: number }>)[0];
    if (!current) {
      await conn.rollback();
      throw new Error("Producto no encontrado");
    }
    const precioAnterior = Number(current.precio);

    const [insertResult] = await conn.query<ResultSetHeader>(
      `INSERT INTO producto_precios
         (id_producto, precio, id_usuario, fuente, notas)
       VALUES (?, ?, ?, ?, ?)`,
      [idProducto, precio, idUsuario ?? null, fuente ?? "manual", notas ?? null],
    );
    const newPriceId = insertResult.insertId;

    await conn.query(
      "UPDATE productos SET precio = ?, fech_act_precio = NOW() WHERE id = ?",
      [precio, idProducto],
    );

    await conn.commit();

    const [createdRows] = await conn.query<RowDataPacket[]>(
      "SELECT created_at FROM producto_precios WHERE id = ?",
      [newPriceId],
    );
    const createdAt = String(
      (createdRows as Array<{ created_at: string }>)[0]?.created_at ?? new Date().toISOString(),
    );

    const variacion =
      precioAnterior > 0
        ? Number((((precio - precioAnterior) / precioAnterior) * 100).toFixed(2))
        : 0;

    return {
      id_producto: idProducto,
      precio,
      precio_anterior: precioAnterior,
      variacion_porcentaje: variacion,
      created_at: createdAt,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
