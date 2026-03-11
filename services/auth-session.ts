import {
  getSessionFromAuthorizationHeader,
  getSessionFromCookieStore,
  type AuthSession,
  type CookieStoreLike,
} from "@/lib/auth"

export interface SessionSnapshot {
  username: string
  issuedAt: number | null
  expiresAt: number | null
}

export function buildSessionSnapshot(
  session: AuthSession
): SessionSnapshot {
  return {
    username: session.username,
    issuedAt: session.iat ?? null,
    expiresAt: session.exp ?? null,
  }
}

export function formatSessionExpiry(expiresAt: number | null) {
  if (!expiresAt) {
    return "Unknown"
  }

  return new Date(expiresAt * 1000).toLocaleString()
}

export async function resolveSessionFromCookies(
  cookieStore: CookieStoreLike
) {
  return getSessionFromCookieStore(cookieStore)
}

export async function resolveSessionFromAuthorizationHeader(
  authHeader: string | null
) {
  return getSessionFromAuthorizationHeader(authHeader)
}

export async function buildAuthorizationResult(
  cookieStore: CookieStoreLike
) {
  const session = await resolveSessionFromCookies(cookieStore)
  if (!session) {
    return {
      success: false,
      message: "Unauthorized: No token provided",
    }
  }

  return {
    success: true,
    message: `Authorization successful! User: ${session.username}`,
    user: buildSessionSnapshot(session),
  }
}

export async function buildProtectedApiResponse(authHeader: string | null) {
  const session = await resolveSessionFromAuthorizationHeader(authHeader)
  if (!session) {
    return {
      status: 401,
      body: {
        error: "Unauthorized: No token provided or token is invalid",
      },
    }
  }

  return {
    status: 200,
    body: {
      message: "You have access to protected data!",
      user: buildSessionSnapshot(session),
      authSource: "authorization_header",
      timestamp: new Date().toISOString(),
    },
  }
}
