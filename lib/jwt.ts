import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function signAccessToken(payload: {
  userId: number;
  email: string;
  rolId: number;
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyAccessToken(
  token: string
): Promise<{ userId: number; email: string; rolId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as {
      userId: number;
      email: string;
      rolId: number;
    };
  } catch {
    return null;
  }
}
