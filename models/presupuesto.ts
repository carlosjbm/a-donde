import pool from "@/lib/db";
import { Presupuesto } from "@/types";

export async function findAll(): Promise<Presupuesto[]> {
  const [rows] = await pool.query("SELECT * FROM presupuestos");
  return rows as Presupuesto[];
}

export async function findById(id: number): Promise<Presupuesto | null> {
  const [rows] = await pool.query(
    "SELECT * FROM presupuestos WHERE id = ?",
    [id]
  );
  const result = (rows as Presupuesto[])[0];
  return result || null;
}

export async function create(
  data: Omit<Presupuesto, "id" | "created_date">
): Promise<Presupuesto> {
  const [result] = await pool.query(
    "INSERT INTO presupuestos (descripcion, valor, created_date) VALUES (?, ?, NOW())",
    [data.descripcion, data.valor]
  );
  const id = (result as { insertId: number }).insertId;
  return (await findById(id))!;
}

export async function update(
  id: number,
  data: Partial<Omit<Presupuesto, "id" | "created_date">>
): Promise<Presupuesto | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.descripcion !== undefined) {
    fields.push("descripcion = ?");
    values.push(data.descripcion);
  }
  if (data.valor !== undefined) {
    fields.push("valor = ?");
    values.push(data.valor);
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(
    `UPDATE presupuestos SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
  return findById(id);
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM presupuestos WHERE id = ?", [id]);
  return (result as { affectedRows: number }).affectedRows > 0;
}
