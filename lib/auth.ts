import { SignJWT, jwtVerify } from "jose";

// In a real app, you would use a proper secret from environment variables
const JWT_SECRET = new TextEncoder().encode(
  "your-secret-key-at-least-32-chars-long"
);

export async function createToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return false;
  }
}
