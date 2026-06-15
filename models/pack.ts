import pool from "@/lib/db";
import { UserPack, PackProducto } from "@/types";

export async function findByUserId(userId: number): Promise<UserPack[]> {
  const [rows] = await pool.query(
    `SELECT
       pa.id,
       pa.nombre,
       pa.usuario_id,
       pa.created_at,
       pp.id AS pp_id,
       pr.id AS producto_id,
       pr.nombre AS producto_nombre,
       pr.precio AS producto_precio,
       pr.imagen AS producto_imagen,
       pr.id_lugar AS lugar_id,
       l.nombre AS lugar_nombre,
       pp.cantidad AS cantidad,
       pp.unidades_compradas AS unidades_compradas
      FROM packs pa
      LEFT JOIN paks_productos pp ON pp.id_pack = pa.id
      LEFT JOIN productos pr ON pp.id_prod = pr.id
      LEFT JOIN lugares l ON pr.id_lugar = l.id
     WHERE pa.usuario_id = ?
     ORDER BY pa.id ASC, pr.nombre ASC`,
    [userId]
  );

  type Row = {
    id: number;
    nombre: string;
    usuario_id: number;
    created_at: string;
    pp_id: number | null;
    producto_id: number | null;
    producto_nombre: string | null;
    producto_precio: number | null;
    producto_imagen: string | null;
    lugar_id: number | null;
    lugar_nombre: string | null;
    cantidad: number | null;
    unidades_compradas: number | null;
  };

  const packsMap = new Map<number, UserPack>();
  for (const r of rows as Row[]) {
    let pack = packsMap.get(r.id);
    if (!pack) {
      pack = {
        id: r.id,
        nombre: r.nombre,
        usuario_id: r.usuario_id,
        created_at: r.created_at,
        total_productos: 0,
        total_unidades: 0,
        unidades_compradas: 0,
        comprados: 0,
        pendientes: 0,
        precio_total: 0,
        productos: [],
      };
      packsMap.set(r.id, pack);
    }
    pack = packsMap.get(r.id)!;
    if (r.pp_id === null) continue;
    const cantidad = r.cantidad ?? 1;
    const unidadesCompradas = r.unidades_compradas ?? 0;
    const producto: PackProducto = {
      id: r.pp_id,
      producto_id: r.producto_id!,
      nombre: r.producto_nombre!,
      precio: Number(r.producto_precio),
      cantidad,
      unidades_compradas: unidadesCompradas,
      imagen: r.producto_imagen,
      lugar_id: r.lugar_id!,
      lugar_nombre: r.lugar_nombre!,
      comprado: unidadesCompradas >= cantidad,
      compra_id: null,
    };
    pack.productos.push(producto);
  }

  for (const pack of packsMap.values()) {
    pack.total_productos = pack.productos.length;
    pack.total_unidades = pack.productos.reduce((sum, p) => sum + p.cantidad, 0);
    pack.unidades_compradas = pack.productos.reduce((sum, p) => sum + p.unidades_compradas, 0);
    pack.comprados = pack.productos.filter((p) => p.comprado).length;
    pack.pendientes = pack.total_productos - pack.comprados;
    pack.precio_total = pack.productos.reduce((sum, p) => sum + Number(p.precio) * p.cantidad, 0);
  }

  return Array.from(packsMap.values());
}

export async function findById(id: number, userId: number): Promise<UserPack | null> {
  const packs = await findByUserId(userId);
  return packs.find((p) => p.id === id) || null;
}

export async function create(data: {
  nombre: string;
  usuario_id: number;
}): Promise<UserPack> {
  const [result] = await pool.query(
    "INSERT INTO packs (nombre, usuario_id, created_at) VALUES (?, ?, NOW())",
    [data.nombre, data.usuario_id]
  );
  const id = (result as { insertId: number }).insertId;
  const pack = await findById(id, data.usuario_id);
  if (!pack) throw new Error("Error al crear pack");
  return pack;
}

export async function remove(id: number, userId: number): Promise<boolean> {
  const [result] = await pool.query(
    "DELETE FROM packs WHERE id = ? AND usuario_id = ?",
    [id, userId]
  );
  return (result as { affectedRows: number }).affectedRows > 0;
}

export async function addProduct(
  packId: number,
  productoId: number,
  userId: number,
  cantidad: number = 1
): Promise<number> {
  const [existing] = await pool.query(
    "SELECT id FROM paks_productos WHERE id_pack = ? AND id_prod = ?",
    [packId, productoId]
  );
  if ((existing as { id: number }[]).length > 0) {
    throw new Error("El producto ya está en el pack");
  }
  const [result] = await pool.query(
    "INSERT INTO paks_productos (id_pack, id_prod, usuario_id, cantidad) VALUES (?, ?, ?, ?)",
    [packId, productoId, userId, cantidad]
  );
  return (result as { insertId: number }).insertId;
}

export async function removeProduct(
  packId: number,
  productoId: number
): Promise<boolean> {
  const [result] = await pool.query(
    "DELETE FROM paks_productos WHERE id_pack = ? AND id_prod = ?",
    [packId, productoId]
  );
  return (result as { affectedRows: number }).affectedRows > 0;
}

export async function getPendingCount(userId: number): Promise<number> {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(pp.cantidad - pp.unidades_compradas), 0) AS total
     FROM paks_productos pp
     JOIN packs pa ON pp.id_pack = pa.id
     WHERE pa.usuario_id = ?
       AND pp.unidades_compradas < pp.cantidad`,
    [userId]
  );
  return Number((rows as { total: number }[])[0].total);
}
