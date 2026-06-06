const fs = require("fs");
const path = require("path");

function loadEnv(file) {
  const p = path.join(__dirname, "..", file);
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2];
    }
  }
}
loadEnv(".env.local");
loadEnv(".env");

const mysql = require("mysql2/promise");

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "a-donde",
  });

  try {
    console.log("[1/2] Cambiando collation de productos.nombre a utf8mb4_unicode_ci...");
    await conn.query(
      "ALTER TABLE productos MODIFY nombre VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL"
    );
    console.log("  -> OK");

    console.log("[2/2] Verificando collation actual...");
    const [cols] = await conn.query(
      `SELECT TABLE_NAME, TABLE_COLLATION
       FROM information_schema.tables
       WHERE table_schema = ? AND table_name = 'productos'`,
      [process.env.DB_NAME || "a-donde"]
    );
    console.log("  ->", cols[0]);

    console.log("\n=== PRUEBA DE MATCH ACENTO-INSENSIBLE ===");
    const [r] = await conn.query(
      `SELECT id, nombre, precio FROM productos
       WHERE nombre COLLATE utf8mb4_unicode_ci = ?
       ORDER BY id`,
      ["bolsa de pan suave 10u"]
    );
    console.log("Buscar 'bolsa de pan suave 10u' (sin acentos) contra la BD:");
    for (const row of r) {
      console.log(`  #${row.id} "${row.nombre}" $${row.precio}`);
    }

    console.log("\n=== PRUEBA DE getPriceHistory PARA ESE NOMBRE (periodo=mes) ===");
    const [puntos] = await conn.query(
      `SELECT DATE_FORMAT(pp.created_at, '%Y-%m') AS periodo,
              MIN(DATE_FORMAT(pp.created_at, '%Y-%m-01')) AS fecha_inicio,
              AVG(pp.precio) AS promedio,
              MIN(pp.precio) AS minimo,
              MAX(pp.precio) AS maximo,
              COUNT(*) AS cantidad
       FROM producto_precios pp
       JOIN productos p ON p.id = pp.id_producto
       WHERE p.nombre COLLATE utf8mb4_unicode_ci = ?
       GROUP BY periodo
       ORDER BY MIN(pp.created_at) ASC`,
      ["bolsa de pan suave 10u"]
    );
    if (puntos.length === 0) {
      console.log("  (sin puntos)");
    } else {
      for (const p of puntos) {
        const fecha = p.fecha_inicio instanceof Date
          ? p.fecha_inicio.toISOString().slice(0, 10)
          : String(p.fecha_inicio).slice(0, 10);
        console.log(
          `  ${p.periodo} (${fecha}): prom=$${Number(p.promedio).toFixed(0)} min=$${p.minimo} max=$${p.maximo} n=${p.cantidad}`
        );
      }
    }
  } finally {
    await conn.end();
  }
}

run().catch((e) => {
  console.error("ERROR:", e.message);
  console.error(e);
  process.exit(1);
});
