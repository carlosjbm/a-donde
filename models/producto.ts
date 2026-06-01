import pool from "@/lib/db";
import { Producto } from "@/types";

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
    "SELECT * FROM productos WHERE id_lugar = ?",
    [lugarId],
  );
  return rows as Producto[];
}
