import pool from "@/lib/db";
import { Compra, CompraConProducto } from "@/types";
import * as presupuestoModel from "./presupuesto";

export async function findByUserId(
  userId: number
): Promise<CompraConProducto[]> {
  const [rows] = await pool.query(
    `SELECT c.id, c.create_at, c.observacion, c.id_producto, c.user_id,
            p.nombre AS producto_nombre, p.precio AS producto_precio
     FROM compras c
     JOIN productos p ON c.id_producto = p.id
     WHERE c.user_id = ?
     ORDER BY c.create_at DESC`,
    [userId]
  );
  return rows as CompraConProducto[];
}

export async function create(data: {
  id_producto: number;
  user_id: number;
  observacion: string;
}): Promise<{ compra: Compra; nuevo_valor: number }> {
  const { id_producto, user_id, observacion } = data;

  const [prodRows] = await pool.query(
    "SELECT precio FROM productos WHERE id = ?",
    [id_producto]
  );
  const producto = (prodRows as { precio: number }[])[0];
  if (!producto) throw new Error("Producto no encontrado");

  const precio = Number(producto.precio);

  const presupuestos = await presupuestoModel.findByUserId(user_id);
  if (presupuestos.length === 0) throw new Error("No tienes presupuesto asignado");

  const gastado = await totalGastado(user_id);
  const totalPresupuesto = presupuestos.reduce(
    (sum, p) => sum + Number(p.valor),
    0
  );
  const disponible = totalPresupuesto - gastado;

  if (disponible < precio)
    throw new Error(
      `Presupuesto insuficiente. Disponible: $${disponible.toLocaleString("es-CL")}, Producto: $${precio.toLocaleString("es-CL")}`
    );

  const target = presupuestos.sort(
    (a, b) => Number(b.valor) - Number(a.valor)
  )[0];
  const nuevoValor = Number(target.valor) - precio;

  await pool.query("UPDATE presupuestos SET valor = ? WHERE id = ?", [
    nuevoValor,
    target.id,
  ]);

  const [result] = await pool.query(
    "INSERT INTO compras (id_producto, user_id, observacion, create_at) VALUES (?, ?, ?, NOW())",
    [id_producto, user_id, observacion]
  );
  const compraId = (result as { insertId: number }).insertId;

  const [compraRows] = await pool.query(
    "SELECT * FROM compras WHERE id = ?",
    [compraId]
  );
  const compra = (compraRows as Compra[])[0];

  return { compra, nuevo_valor: nuevoValor };
}

async function totalGastado(userId: number): Promise<number> {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(p.precio), 0) AS total
     FROM compras c
     JOIN productos p ON c.id_producto = p.id
     WHERE c.user_id = ?`,
    [userId]
  );
  return Number((rows as { total: number }[])[0].total);
}
