import pool from "@/lib/db";

export interface Sesion {
  id: number;
  usuario_id: number;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
}

export async function create(
  usuarioId: number,
  refreshToken: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query(
    "INSERT INTO sesiones (usuario_id, refresh_token, expires_at) VALUES (?, ?, ?)",
    [usuarioId, refreshToken, expiresAt]
  );
}

export async function findByRefreshToken(
  refreshToken: string
): Promise<Sesion | null> {
  const [rows] = await pool.query(
    "SELECT * FROM sesiones WHERE refresh_token = ? AND expires_at > NOW()",
    [refreshToken]
  );
  const result = (rows as Sesion[])[0];
  return result || null;
}

export async function deleteByUsuarioId(usuarioId: number): Promise<void> {
  await pool.query("DELETE FROM sesiones WHERE usuario_id = ?", [usuarioId]);
}

export async function deleteByRefreshToken(
  refreshToken: string
): Promise<void> {
  await pool.query("DELETE FROM sesiones WHERE refresh_token = ?", [
    refreshToken,
  ]);
}
