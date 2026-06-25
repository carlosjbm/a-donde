import pool from "@/lib/db";
import { Lugar } from "@/types";

const COLUMNS = "id, nombre, descripcion, direccion, latitud, longitud, transferencia, estrellas, usuario_id, created_at, updated_at";

export async function findAll(): Promise<Lugar[]> {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM lugares`
  );
  return rows as Lugar[];
}

export async function findById(id: number): Promise<Lugar | null> {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM lugares WHERE id = ?`,
    [id]
  );
  const result = (rows as Lugar[])[0];
  return result || null;
}

export async function rate(
  lugarId: number,
  userId: number,
  estrellas: number
): Promise<Lugar | null> {
  await pool.query(
    `INSERT INTO valoraciones (id_lugar, user_id, estrellas, created_at)
     VALUES (?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE estrellas = VALUES(estrellas), created_at = NOW()`,
    [lugarId, userId, estrellas]
  );

  const [avgRows] = await pool.query(
    "SELECT ROUND(AVG(estrellas)) as promedio FROM valoraciones WHERE id_lugar = ?",
    [lugarId]
  );
  const promedio = (avgRows as { promedio: number | null }[])[0].promedio;

  await pool.query(
    "UPDATE lugares SET estrellas = ? WHERE id = ?",
    [promedio, lugarId]
  );

  return findById(lugarId);
}

export async function findTopRated(limit: number = 5): Promise<Lugar[]> {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM lugares WHERE estrellas > 0 ORDER BY estrellas DESC, nombre ASC LIMIT ?`,
    [limit]
  );
  return rows as Lugar[];
}

export async function findByUsuarioId(usuarioId: number): Promise<Lugar[]> {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM lugares WHERE usuario_id = ? ORDER BY created_at DESC`,
    [usuarioId]
  );
  return rows as Lugar[];
}

export async function create(
  data: Omit<Lugar, "id" | "created_at" | "updated_at" | "estrellas">
): Promise<Lugar> {
  const [result] = await pool.query(
    "INSERT INTO lugares (nombre, descripcion, direccion, latitud, longitud, transferencia, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      data.nombre,
      data.descripcion,
      data.direccion,
      data.latitud,
      data.longitud,
      data.transferencia ? 1 : 0,
      data.usuario_id ?? null,
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

export async function getUserRating(
  lugarId: number,
  userId: number
): Promise<number | null> {
  const [rows] = await pool.query(
    "SELECT estrellas FROM valoraciones WHERE id_lugar = ? AND user_id = ?",
    [lugarId, userId]
  );
  const row = (rows as { estrellas: number }[])[0];
  return row ? row.estrellas : null;
}

export async function isOwner(lugarId: number, usuarioId: number): Promise<boolean> {
  const lugar = await findById(lugarId);
  if (!lugar) return false;
  return lugar.usuario_id === usuarioId;
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM lugares WHERE id = ?", [id]);
  return (result as { affectedRows: number }).affectedRows > 0;
}
