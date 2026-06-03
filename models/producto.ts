import pool from "@/lib/db";
import { Producto, ProductoSearchResult } from "@/types";

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
