import pool from "@/lib/db";
import { Compra, CompraConProducto } from "@/types";
import * as presupuestoModel from "./presupuesto";

export async function findByUserId(
  userId: number
): Promise<CompraConProducto[]> {
  const [rows] = await pool.query(
    `SELECT c.id, c.create_at, c.observacion, c.id_producto, c.user_id,
            c.agotado, c.fecha_agotado,
            p.nombre AS producto_nombre, p.precio AS producto_precio
     FROM compras c
     JOIN productos p ON c.id_producto = p.id
     WHERE c.user_id = ?
     ORDER BY c.create_at DESC`,
    [userId]
  );
  return rows as CompraConProducto[];
}

export async function findById(
  id: number,
  userId: number
): Promise<Compra | null> {
  const [rows] = await pool.query(
    "SELECT id, create_at, observacion, id_producto, user_id, agotado, fecha_agotado FROM compras WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return (rows as Compra[])[0] || null;
}

export async function setAgotado(
  id: number,
  userId: number,
  agotado: boolean
): Promise<Compra | null> {
  const fechaAgotado = agotado ? new Date() : null;
  await pool.query(
    "UPDATE compras SET agotado = ?, fecha_agotado = ? WHERE id = ? AND user_id = ?",
    [agotado, fechaAgotado, id, userId]
  );
  return findById(id, userId);
}

export async function create(data: {
  id_producto: number;
  user_id: number;
  observacion: string;
  cantidad?: number;
}): Promise<{ compra: Compra; nuevo_valor: number }> {
  const { id_producto, user_id, observacion, cantidad = 1 } = data;

  const [prodRows] = await pool.query(
    "SELECT precio FROM productos WHERE id = ?",
    [id_producto]
  );
  const producto = (prodRows as { precio: number }[])[0];
  if (!producto) throw new Error("Producto no encontrado");

  const precio = Number(producto.precio);
  const totalCosto = precio * cantidad;

  const presupuestos = await presupuestoModel.findActiveByUserId(user_id);
  if (presupuestos.length === 0) throw new Error("No tienes presupuesto activo");

  const totalPresupuesto = presupuestos.reduce(
    (sum, p) => sum + Number(p.valor),
    0
  );
  const disponible = totalPresupuesto;

  if (disponible < totalCosto)
    throw new Error(
      `Presupuesto insuficiente. Disponible: $${disponible.toLocaleString("es-CL")}, Total: $${totalCosto.toLocaleString("es-CL")}`
    );

  const target = presupuestos.sort(
    (a, b) => Number(b.valor) - Number(a.valor)
  )[0];
  const nuevoValor = Number(target.valor) - totalCosto;

  await pool.query("UPDATE presupuestos SET valor = ? WHERE id = ?", [
    nuevoValor,
    target.id,
  ]);

  let lastCompraId = 0;
  for (let i = 0; i < cantidad; i++) {
    const [result] = await pool.query(
      "INSERT INTO compras (id_producto, user_id, observacion, agotado, fecha_agotado, create_at) VALUES (?, ?, ?, 0, NULL, NOW())",
      [id_producto, user_id, observacion]
    );
    lastCompraId = (result as { insertId: number }).insertId;
  }

  await pool.query(
    `UPDATE paks_productos pp
     JOIN packs pa ON pp.id_pack = pa.id
     SET pp.unidades_compradas = LEAST(pp.unidades_compradas + ?, pp.cantidad)
     WHERE pp.id_prod = ?
       AND pa.usuario_id = ?
       AND pp.unidades_compradas < pp.cantidad`,
    [cantidad, id_producto, user_id]
  );

  const [compraRows] = await pool.query(
    "SELECT id, create_at, observacion, id_producto, user_id, agotado, fecha_agotado FROM compras WHERE id = ?",
    [lastCompraId]
  );
  const compra = (compraRows as Compra[])[0];

  return { compra, nuevo_valor: nuevoValor };
}


