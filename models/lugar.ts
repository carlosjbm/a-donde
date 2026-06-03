import pool from "@/lib/db";
import { Lugar } from "@/types";

export async function findAll(): Promise<Lugar[]> {
  const [rows] = await pool.query(
    "SELECT id, nombre, descripcion, direccion, latitud, longitud, transferencia, created_at, updated_at FROM lugares"
  );
  return rows as Lugar[];
}

export async function findById(id: number): Promise<Lugar | null> {
  const [rows] = await pool.query(
    "SELECT id, nombre, descripcion, direccion, latitud, longitud, transferencia, created_at, updated_at FROM lugares WHERE id = ?",
    [id]
  );
  const result = (rows as Lugar[])[0];
  return result || null;
}

export async function create(
  data: Omit<Lugar, "id" | "created_at" | "updated_at">
): Promise<Lugar> {
  const [result] = await pool.query(
    "INSERT INTO lugares (nombre, descripcion, direccion, latitud, longitud, transferencia) VALUES (?, ?, ?, ?, ?, ?)",
    [
      data.nombre,
      data.descripcion,
      data.direccion,
      data.latitud,
      data.longitud,
      data.transferencia ? 1 : 0,
    ]
  );
  const id = (result as { insertId: number }).insertId;
  return (await findById(id))!;
}

export async function update(
  id: number,
  data: Partial<Omit<Lugar, "id" | "created_at" | "updated_at">>
): Promise<Lugar | null> {
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
  if (data.direccion !== undefined) {
    fields.push("direccion = ?");
    values.push(data.direccion);
  }
  if (data.latitud !== undefined) {
    fields.push("latitud = ?");
    values.push(data.latitud);
  }
  if (data.longitud !== undefined) {
    fields.push("longitud = ?");
    values.push(data.longitud);
  }
  if (data.transferencia !== undefined) {
    fields.push("transferencia = ?");
    values.push(data.transferencia ? 1 : 0);
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(
    `UPDATE lugares SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
    values
  );
  return findById(id);
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM lugares WHERE id = ?", [id]);
  return (result as { affectedRows: number }).affectedRows > 0;
}
