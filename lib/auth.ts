import { type JWTPayload, SignJWT, jwtVerify } from "jose"

// In a real app, you would use a proper secret from environment variables
const JWT_SECRET = new TextEncoder().encode("your-secret-key-at-least-32-chars-long")

export const AUTH_COOKIE_NAME = "auth-token"

type CookieStoreLike = {
  get(name: string): { value: string } | undefined
}

export interface AuthSession extends JWTPayload {
  username: string
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  }
}

export async function createToken(payload: Pick<AuthSession, "username">) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (typeof payload.username !== "string") {
      return null
    }
    return payload as AuthSession
  } catch {
    return null
  }
}

export function getTokenFromCookieStore(cookieStore: CookieStoreLike) {
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null
}

export function getTokenFromAuthorizationHeader(authHeader: string | null) {
  if (!authHeader) {
    return null
  }

  const [scheme, token] = authHeader.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null
  }

  return token
}

export async function getSessionFromCookieStore(cookieStore: CookieStoreLike) {
  const token = getTokenFromCookieStore(cookieStore)
  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function getSessionFromAuthorizationHeader(
  authHeader: string | null
) {
  const token = getTokenFromAuthorizationHeader(authHeader)
  if (!token) {
    return null
  }

  return verifyToken(token)
}
