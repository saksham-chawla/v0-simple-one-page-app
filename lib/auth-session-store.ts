import { verifyToken } from "@/lib/auth"

const AUTH_SESSION_COOKIE_NAME = "auth-token"

export type AuthSessionSource = "cookie" | "authorization_header"

export type CookieStoreLike = {
  get(name: string): { value: string } | undefined
}

export interface AuthSessionRecord {
  username: string
  issuedAt: number | null
  expiresAt: number | null
  source: AuthSessionSource
}

function normalizeAuthSessionRecord(
  payload: unknown,
  source: AuthSessionSource
): AuthSessionRecord | null {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const sessionPayload = payload as {
    username?: unknown
    iat?: unknown
    exp?: unknown
  }

  if (typeof sessionPayload.username !== "string") {
    return null
  }

  return {
    username: sessionPayload.username,
    issuedAt: typeof sessionPayload.iat === "number" ? sessionPayload.iat : null,
    expiresAt: typeof sessionPayload.exp === "number" ? sessionPayload.exp : null,
    source,
  }
}

export function readAuthSessionTokenFromCookies(cookieStore: CookieStoreLike) {
  return cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value ?? null
}

export function readAuthSessionTokenFromAuthorizationHeader(
  authorizationHeader: string | null
) {
  if (!authorizationHeader) {
    return null
  }

  const [scheme, token] = authorizationHeader.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null
  }

  return token
}

export async function readAuthSessionFromCookies(cookieStore: CookieStoreLike) {
  const token = readAuthSessionTokenFromCookies(cookieStore)
  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  return normalizeAuthSessionRecord(payload, "cookie")
}

export async function readAuthSessionFromAuthorizationHeader(
  authorizationHeader: string | null
) {
  const token = readAuthSessionTokenFromAuthorizationHeader(authorizationHeader)
  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  return normalizeAuthSessionRecord(payload, "authorization_header")
}
