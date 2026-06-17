const fs = require("fs");
const path = require("path");

function loadEnv(file) {
  const p = path.join(__dirname, "..", file);
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, "utf8");

  function parseValue(value) {
    const quoteMatch = value.match(/^(['"])(.*)\1$/);
    return quoteMatch ? quoteMatch[2] : value;
  }

  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = parseValue(m[2]);
    }
  }
}
loadEnv(".env.local");
loadEnv(".env");

const mysql = require("mysql2/promise");

const SQL_STATEMENTS = [
  // 1) Crear la tabla con las relaciones
  `CREATE TABLE IF NOT EXISTS producto_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    precio INT NOT NULL,
    id_usuario INT NULL,
    fuente ENUM('manual', 'compra', 'importacion', 'sistema') NOT NULL DEFAULT 'manual',
    notas TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pp_producto
      FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
    CONSTRAINT fk_pp_usuario
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_pp_producto_created (id_producto, created_at),
    INDEX idx_pp_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // 2) Backfill: para cada producto sin historial, crear una entrada inicial
  `INSERT INTO producto_precios (id_producto, precio, fuente, created_at)
   SELECT p.id, p.precio, 'sistema', p.fech_act_precio
   FROM productos p
   WHERE NOT EXISTS (
     SELECT 1 FROM producto_precios pp WHERE pp.id_producto = p.id
   )`,

  // 3) Sincronizar fech_act_precio con la entrada más reciente del historial
  `UPDATE productos p
   JOIN (
     SELECT id_producto, MAX(created_at) AS max_created
     FROM producto_precios
     GROUP BY id_producto
   ) latest ON latest.id_producto = p.id
   SET p.fech_act_precio = latest.max_created
   WHERE p.fech_act_precio < latest.max_created`,
];

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || process.env.DB_DATABASE || "a-donde",
    multipleStatements: false,
  });

  try {
    console.log("Conectado a:", process.env.DB_NAME || "a-donde");
    console.log("");

    for (let i = 0; i < SQL_STATEMENTS.length; i++) {
      const sql = SQL_STATEMENTS[i];
      const label = ["CREATE TABLE", "BACKFILL", "SYNC fech_act_precio"][i];
      console.log(`[${i + 1}/${SQL_STATEMENTS.length}] ${label}...`);
      const [result] = await conn.query(sql);
      if (result && result.affectedRows !== undefined) {
        console.log(`  -> ${result.affectedRows} filas afectadas`);
      } else {
        console.log(`  -> OK`);
      }
    }

    console.log("\n=== VERIFICACIÓN ===");
    const [tables] = await conn.query(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_name = 'producto_precios'",
      [process.env.DB_NAME || "a-donde"],
    );
    console.log("Tabla creada:", tables.length > 0 ? "SÍ" : "NO");

    const [fks] = await conn.query(
      `SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
       FROM information_schema.KEY_COLUMN_USAGE
       WHERE table_schema = ? AND table_name = 'producto_precios'
         AND REFERENCED_TABLE_NAME IS NOT NULL
       ORDER BY CONSTRAINT_NAME`,
      [process.env.DB_NAME || "a-donde"],
    );
    console.log("Foreign keys:");
    for (const fk of fks) {
      console.log(
        `  ${fk.CONSTRAINT_NAME}: ${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`,
      );
    }

    const [indexes] = await conn.query(
      `SELECT INDEX_NAME, COLUMN_NAME, SEQ_IN_INDEX
       FROM information_schema.STATISTICS
       WHERE table_schema = ? AND table_name = 'producto_precios'
       ORDER BY INDEX_NAME, SEQ_IN_INDEX`,
      [process.env.DB_NAME || "a-donde"],
    );
    console.log("Índices:");
    const seen = new Set();
    for (const idx of indexes) {
      if (!seen.has(idx.INDEX_NAME)) {
        seen.add(idx.INDEX_NAME);
        const cols = indexes
          .filter((i) => i.INDEX_NAME === idx.INDEX_NAME)
          .map((i) => i.COLUMN_NAME)
          .join(", ");
        console.log(`  ${idx.INDEX_NAME} (${cols})`);
      }
    }

    const [count] = await conn.query(
      "SELECT COUNT(*) AS total FROM producto_precios",
    );
    console.log("Filas en producto_precios:", count[0].total);

    const [sample] = await conn.query(
      `SELECT pp.id, pp.id_producto, p.nombre, pp.precio, pp.fuente, pp.created_at
       FROM producto_precios pp
       JOIN productos p ON p.id = pp.id_producto
       ORDER BY pp.created_at DESC
       LIMIT 5`,
    );
    if (sample.length > 0) {
      console.log("\nÚltimas 5 entradas:");
      for (const s of sample) {
        console.log(
          `  #${s.id} prod=${s.id_producto} "${s.nombre}" $${s.precio} (${s.fuente}) @ ${s.created_at}`,
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
