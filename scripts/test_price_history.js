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

const DIACRITIC_FROM =
  "àáâãäåçèéêëìíîïñòóôõöùúûüýÿ" +
  "ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ";
const DIACRITIC_TO =
  "aaaaaaceeeeiiiinooooouuuuyy" +
  "AAAAAACEEEEIIIINOOOOOUUUUY";

async function test() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "a-donde",
  });

  try {
    const [names] = await conn.query(
      `SELECT p.nombre, COUNT(*) AS filas
       FROM productos p
       JOIN producto_precios pp ON pp.id_producto = p.id
       GROUP BY p.nombre
       ORDER BY filas DESC
       LIMIT 5`
    );
    console.log("=== TOP 5 NOMBRES CON MÁS ENTRADAS DE HISTORIAL ===");
    for (const n of names) {
      console.log(`  "${n.nombre}" -> ${n.filas} entradas`);
    }

    if (names.length === 0) {
      console.log("Sin datos suficientes para probar");
      return;
    }

    const testName = names[0].nombre;
    const normalized = testName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    console.log(`\n=== SIMULANDO getPriceHistory para "${testName}" (periodo=mes) ===`);

    const [rows] = await conn.query(
      `SELECT DATE_FORMAT(pp.created_at, '%Y-%m') AS periodo,
              MIN(DATE_FORMAT(pp.created_at, '%Y-%m-01')) AS fecha_inicio,
              AVG(pp.precio) AS promedio,
              MIN(pp.precio) AS minimo,
              MAX(pp.precio) AS maximo,
              COUNT(*) AS cantidad
       FROM producto_precios pp
       JOIN productos p ON p.id = pp.id_producto
       WHERE LOWER(TRANSLATE(p.nombre, ?, ?)) = ?
       GROUP BY periodo
       ORDER BY MIN(pp.created_at) ASC`,
      [DIACRITIC_FROM, DIACRITIC_TO, normalized]
    );

    if (rows.length === 0) {
      console.log("Sin resultados para ese nombre");
    } else {
      for (const r of rows) {
        const fecha = r.fecha_inicio instanceof Date
          ? r.fecha_inicio.toISOString().slice(0, 10)
          : String(r.fecha_inicio).slice(0, 10);
        console.log(
          `  ${r.periodo} (${fecha}): prom=$${Number(r.promedio).toFixed(0)} min=$${r.minimo} max=$${r.maximo} n=${r.cantidad}`
        );
      }
    }
  } finally {
    await conn.end();
  }
}

test().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
