import pool from "@/lib/db";
import { Usuario } from "@/types";
import { hashPassword } from "@/lib/auth";

export async function findAll(): Promise<Usuario[]> {
  const [rows] = await pool.query(
    "SELECT id, nombre, email, rol_id, created_at, updated_at FROM usuarios"
  );
  return rows as Usuario[];
}

export async function findById(id: number): Promise<Usuario | null> {
  const [rows] = await pool.query(
    "SELECT id, nombre, email, rol_id, created_at, updated_at FROM usuarios WHERE id = ?",
    [id]
  );
  const result = (rows as Usuario[])[0];
  return result || null;
}

export async function findByEmail(
  email: string
): Promise<(Usuario & { password: string }) | null> {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);
  const result = (rows as (Usuario & { password: string })[])[0];
  return result || null;
}

export async function create(
  data: Omit<Usuario, "id" | "created_at" | "updated_at"> & { password: string }
): Promise<Usuario> {
  const hashedPassword = await hashPassword(data.password);
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)",
    [data.nombre, data.email, hashedPassword, data.rol_id]
  );
  const id = (result as { insertId: number }).insertId;
  return (await findById(id))!;
}

export async function updatePassword(
  id: number,
  password: string
): Promise<void> {
  const hashedPassword = await hashPassword(password);
  await pool.query(
    "UPDATE usuarios SET password = ?, updated_at = NOW() WHERE id = ?",
    [hashedPassword, id]
  );
}

export async function update(
  id: number,
  data: Partial<Omit<Usuario, "id" | "created_at" | "updated_at">>
): Promise<Usuario | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.nombre !== undefined) {
    fields.push("nombre = ?");
    values.push(data.nombre);
  }
  if (data.email !== undefined) {
    fields.push("email = ?");
    values.push(data.email);
  }
  if (data.rol_id !== undefined) {
    fields.push("rol_id = ?");
    values.push(data.rol_id);
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(
    `UPDATE usuarios SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
    values
  );
  return findById(id);
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  return (result as { affectedRows: number }).affectedRows > 0;
}
