import pool from "@/lib/db";
import { SugerenciaPack, SugerenciaProducto } from "@/types";

export async function findSuggestionsByUser(
  userId: number
): Promise<SugerenciaPack[]> {
  const [rows] = await pool.query(
    `SELECT
       pa.id   AS pack_id,
       pa.nombre AS pack_nombre,
       pr.id   AS producto_id,
       pr.nombre AS producto_nombre,
       pr.precio AS producto_precio,
       pr.imagen AS producto_imagen,
       pr.escencial AS producto_escencial,
       pr.id_lugar AS lugar_id,
       l.nombre AS lugar_nombre
     FROM paks_productos pp
     JOIN packs pa ON pp.id_pack = pa.id
     JOIN productos pr ON pp.id_prod = pr.id
     JOIN lugares l ON pr.id_lugar = l.id
     WHERE pr.activo = 1
       AND pr.id NOT IN (
         SELECT c.id_producto
         FROM compras c
         WHERE c.user_id = ?
       )
     ORDER BY pa.id ASC, pr.precio ASC`,
    [userId]
  );

  type Row = {
    pack_id: number;
    pack_nombre: string;
    producto_id: number;
    producto_nombre: string;
    producto_precio: number;
    producto_imagen: string | null;
    producto_escencial: number;
    lugar_id: number;
    lugar_nombre: string;
  };

  const packsMap = new Map<number, SugerenciaPack>();
  for (const r of rows as Row[]) {
    let pack = packsMap.get(r.pack_id);
    if (!pack) {
      pack = {
        id: r.pack_id,
        nombre: r.pack_nombre,
        total: 0,
        productos: [],
      };
      packsMap.set(r.pack_id, pack);
    }
    const producto: SugerenciaProducto = {
      id: r.producto_id,
      nombre: r.producto_nombre,
      precio: Number(r.producto_precio),
      imagen: r.producto_imagen,
      escencial: Boolean(r.producto_escencial),
      lugar_id: r.lugar_id,
      lugar_nombre: r.lugar_nombre,
    };
    pack.productos.push(producto);
  }

  for (const pack of packsMap.values()) {
    pack.total = pack.productos.length;
  }

  return Array.from(packsMap.values());
}
