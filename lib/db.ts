import mysql from "mysql2/promise";

function getEnv(key: string): string | undefined {
  const raw = process.env[key];
  if (!raw) return undefined;
  const match = raw.match(/^(['"])(.*)\1$/);
  return match ? match[2] : raw;
}

const host = getEnv("DB_HOST") || "localhost";
const port = Number(getEnv("DB_PORT") ?? "") || 3306;
const user = getEnv("DB_USER") || getEnv("DB_USERNAME") || "root";
const password = getEnv("DB_PASSWORD") || "";
const database = getEnv("DB_NAME") || getEnv("DB_DATABASE") || "a-donde";

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    host !== "localhost"
      ? {
          minVersion: "TLSv1.2",
          rejectUnauthorized: getEnv("DB_SSL_REJECT_UNAUTHORIZED") !== "false",
        }
      : undefined,
});

export default pool;
