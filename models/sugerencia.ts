import pool from "@/lib/db";
import { SugerenciaPack, SugerenciaProducto } from "@/types";
import * as presupuestoModel from "./presupuesto";

export async function findSuggestionsByUser(
  userId: number
): Promise<SugerenciaPack[]> {
  const [packRows] = await pool.query(
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

  const [esencialRows] = await pool.query(
    `SELECT
       pr.id   AS producto_id,
       pr.nombre AS producto_nombre,
       pr.precio AS producto_precio,
       pr.imagen AS producto_imagen,
       pr.escencial AS producto_escencial,
       pr.id_lugar AS lugar_id,
       l.nombre AS lugar_nombre
     FROM productos pr
     JOIN lugares l ON pr.id_lugar = l.id
     WHERE pr.activo = 1
       AND pr.escencial = 1
       AND pr.id NOT IN (
         SELECT c.id_producto
         FROM compras c
         WHERE c.user_id = ?
       )
       AND pr.id NOT IN (
         SELECT pp.id_prod
         FROM paks_productos pp
         JOIN packs pa ON pp.id_pack = pa.id
         WHERE pa.usuario_id = ?
       )
     ORDER BY pr.precio ASC`,
    [userId, userId]
  );

  const [ofertaRows] = await pool.query(
    `SELECT
       pr.id   AS producto_id,
       pr.nombre AS producto_nombre,
       pr.precio AS producto_precio,
       (SELECT MAX(pp.precio) FROM producto_precios pp WHERE pp.id_producto = pr.id) AS precio_original,
       pr.imagen AS producto_imagen,
       pr.escencial AS producto_escencial,
       pr.id_lugar AS lugar_id,
       l.nombre AS lugar_nombre
     FROM productos pr
     JOIN lugares l ON pr.id_lugar = l.id
     WHERE pr.activo = 1
       AND pr.precio < (SELECT MAX(pp.precio) FROM producto_precios pp WHERE pp.id_producto = pr.id)
       AND pr.id NOT IN (
         SELECT c.id_producto
         FROM compras c
         WHERE c.user_id = ?
       )
       AND pr.id NOT IN (
         SELECT pp2.id_prod
         FROM paks_productos pp2
         JOIN packs pa ON pp2.id_pack = pa.id
         WHERE pa.usuario_id = ?
       )
       AND pr.id NOT IN (
         SELECT pr2.id
         FROM productos pr2
         WHERE pr2.escencial = 1
           AND pr2.id NOT IN (
             SELECT c2.id_producto
             FROM compras c2
             WHERE c2.user_id = ?
           )
           AND pr2.id NOT IN (
             SELECT pp3.id_prod
             FROM paks_productos pp3
             JOIN packs pa2 ON pp3.id_pack = pa2.id
             WHERE pa2.usuario_id = ?
           )
       )
     ORDER BY pr.precio ASC`,
    [userId, userId, userId, userId]
  );

  type PackRow = {
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

  type SimpleRow = {
    producto_id: number;
    producto_nombre: string;
    producto_precio: number;
    precio_original: number | null;
    producto_imagen: string | null;
    producto_escencial: number;
    lugar_id: number;
    lugar_nombre: string;
  };

  const packsMap = new Map<number, SugerenciaPack>();
  let packIdCounter = 100;

  for (const r of packRows as PackRow[]) {
    let pack = packsMap.get(r.pack_id);
    if (!pack) {
      pack = {
        id: r.pack_id,
        nombre: r.pack_nombre,
        total: 0,
        precio_total: 0,
        productos: [],
      };
      packsMap.set(r.pack_id, pack);
    }
    pack.productos.push({
      id: r.producto_id,
      nombre: r.producto_nombre,
      precio: Number(r.producto_precio),
      imagen: r.producto_imagen,
      escencial: Boolean(r.producto_escencial),
      lugar_id: r.lugar_id,
      lugar_nombre: r.lugar_nombre,
    });
  }

  if ((esencialRows as SimpleRow[]).length > 0) {
    const pack: SugerenciaPack = {
      id: ++packIdCounter,
      nombre: "Esenciales",
      total: 0,
      precio_total: 0,
      productos: [],
    };
    for (const r of esencialRows as SimpleRow[]) {
      pack.productos.push({
        id: r.producto_id,
        nombre: r.producto_nombre,
        precio: Number(r.producto_precio),
        imagen: r.producto_imagen,
        escencial: Boolean(r.producto_escencial),
        lugar_id: r.lugar_id,
        lugar_nombre: r.lugar_nombre,
      });
    }
    packsMap.set(pack.id, pack);
  }

  if ((ofertaRows as SimpleRow[]).length > 0) {
    const pack: SugerenciaPack = {
      id: ++packIdCounter,
      nombre: "Descuentos",
      total: 0,
      precio_total: 0,
      productos: [],
    };
    for (const r of ofertaRows as SimpleRow[]) {
      const precioOriginal = r.precio_original ? Number(r.precio_original) : null;
      const descuentoPct =
        precioOriginal && precioOriginal > Number(r.producto_precio)
          ? Math.round(
              (1 - Number(r.producto_precio) / precioOriginal) * 100
            )
          : null;
      pack.productos.push({
        id: r.producto_id,
        nombre: r.producto_nombre,
        precio: Number(r.producto_precio),
        precio_original: precioOriginal,
        descuento_porcentaje: descuentoPct,
        imagen: r.producto_imagen,
        escencial: Boolean(r.producto_escencial),
        lugar_id: r.lugar_id,
        lugar_nombre: r.lugar_nombre,
      });
    }
    packsMap.set(pack.id, pack);
  }

  for (const pack of packsMap.values()) {
    pack.total = pack.productos.length;
    pack.precio_total = pack.productos.reduce(
      (sum, p) => sum + Number(p.precio),
      0
    );
  }

  const presupuestos = await presupuestoModel.findActiveByUserId(userId);
  const hasBudget = presupuestos.length > 0;
  const disponible = hasBudget
    ? presupuestos.reduce((sum, p) => sum + Number(p.valor), 0)
    : Infinity;

  let result = Array.from(packsMap.values());
  if (hasBudget) {
    result = result
      .map((pack) => {
        if (pack.id >= 100) {
          const affordable = pack.productos.filter(
            (p) => Number(p.precio) <= disponible
          );
          if (affordable.length === 0) return null;
          return {
            ...pack,
            productos: affordable,
            total: affordable.length,
            precio_total: affordable.reduce(
              (sum, p) => sum + Number(p.precio),
              0
            ),
          };
        }
        return pack.precio_total <= disponible ? pack : null;
      })
      .filter((p): p is SugerenciaPack => p !== null);
  }
  result.sort(
    (a, b) => {
      const aIsAuto = a.id >= 100;
      const bIsAuto = b.id >= 100;
      if (aIsAuto && !bIsAuto) return 1;
      if (!aIsAuto && bIsAuto) return -1;
      return a.precio_total - b.precio_total || a.id - b.id;
    }
  );

  return result;
}
