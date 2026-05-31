import pool from "@/lib/db";
import { Categoria } from "@/types";

export async function findAll(): Promise<Categoria[]> {
  const [rows] = await pool.query(
    "SELECT id, nombre, descripcion, icono, created_at, updated_at FROM categorias"
  );
  return rows as Categoria[];
}

export async function findById(id: number): Promise<Categoria | null> {
  const [rows] = await pool.query(
    "SELECT id, nombre, descripcion, icono, created_at, updated_at FROM categorias WHERE id = ?",
    [id]
  );
  const result = (rows as Categoria[])[0];
  return result || null;
}

export async function create(
  data: Omit<Categoria, "id" | "created_at" | "updated_at">
): Promise<Categoria> {
  const [result] = await pool.query(
    "INSERT INTO categorias (nombre, descripcion, icono) VALUES (?, ?, ?)",
    [data.nombre, data.descripcion, data.icono]
  );
  const id = (result as { insertId: number }).insertId;
  return (await findById(id))!;
}

export async function update(
  id: number,
  data: Partial<Omit<Categoria, "id" | "created_at" | "updated_at">>
): Promise<Categoria | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.nombre !== undefined) {
    fields.push("nombre = ?");
    values.push(data.nombre);
  }
  if (data.descripcion !== undefined) {
    fields.push("descripcion = ?");
    values.push(data.descripcion);
  }
  if (data.icono !== undefined) {
    fields.push("icono = ?");
    values.push(data.icono);
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(
    `UPDATE categorias SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
    values
  );
  return findById(id);
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [
    id,
  ]);
  return (result as { affectedRows: number }).affectedRows > 0;
}
