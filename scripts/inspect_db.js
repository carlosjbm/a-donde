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

async function inspect() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "a-donde",
  });

  try {
    const [tables] = await conn.query(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? ORDER BY TABLE_NAME",
      [process.env.DB_NAME || "a-donde"]
    );
    console.log("=== TABLAS EXISTENTES ===");
    if (tables.length === 0) {
      console.log("(ninguna)");
    } else {
      for (const t of tables) {
        console.log(" -", t.TABLE_NAME);
      }
    }

    for (const tableName of ["productos", "usuarios", "lugares", "compras", "producto_precios"]) {
      console.log(`\n=== ESTRUCTURA: ${tableName} ===`);
      const [cols] = await conn.query(
        `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA
         FROM information_schema.columns
         WHERE table_schema = ? AND table_name = ?
         ORDER BY ORDINAL_POSITION`,
        [process.env.DB_NAME || "a-donde", tableName]
      );
      if (cols.length === 0) {
        console.log(" (no existe)");
        continue;
      }
      for (const c of cols) {
        const parts = [
          c.COLUMN_NAME,
          c.COLUMN_TYPE,
          c.IS_NULLABLE === "YES" ? "NULL" : "NOT NULL",
          c.COLUMN_KEY || "",
          c.EXTRA || "",
        ];
        if (c.COLUMN_DEFAULT !== null) parts.push(`DEFAULT '${c.COLUMN_DEFAULT}'`);
        console.log(" ", parts.join(" "));
      }
    }

    console.log("\n=== FKs EXISTENTES REFERIDAS A productos ===");
    const [fks] = await conn.query(
      `SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
       FROM information_schema.KEY_COLUMN_USAGE
       WHERE table_schema = ?
         AND REFERENCED_TABLE_NAME = 'productos'`,
      [process.env.DB_NAME || "a-donde"]
    );
    if (fks.length === 0) {
      console.log(" (ninguna)");
    } else {
      for (const fk of fks) {
        console.log(" ", fk.TABLE_NAME + "." + fk.COLUMN_NAME, "->", fk.REFERENCED_COLUMN_NAME, `[${fk.CONSTRAINT_NAME}]`);
      }
    }
  } finally {
    await conn.end();
  }
}

inspect().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
