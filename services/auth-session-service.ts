import {
  readAuthSessionFromAuthorizationHeader,
  readAuthSessionFromCookies,
  type AuthSessionRecord,
  type CookieStoreLike,
} from "@/lib/auth-session-store"

export interface AuthSessionSnapshot {
  username: string
  issuedAt: number | null
  expiresAt: number | null
  source: string
}

export function buildAuthSessionSnapshot(
  authSessionRecord: AuthSessionRecord
): AuthSessionSnapshot {
  return {
    username: authSessionRecord.username,
    issuedAt: authSessionRecord.issuedAt,
    expiresAt: authSessionRecord.expiresAt,
    source: authSessionRecord.source,
  }
}

export function formatAuthSessionExpiry(expiresAt: number | null) {
  if (!expiresAt) {
    return "Unknown"
  }

  return new Date(expiresAt * 1000).toLocaleString()
}

export async function resolveAuthSessionSnapshotFromCookies(
  cookieStore: CookieStoreLike
) {
  const authSessionRecord = await readAuthSessionFromCookies(cookieStore)
  if (!authSessionRecord) {
    return null
  }

  return buildAuthSessionSnapshot(authSessionRecord)
}

export async function checkAuthSessionFromCookies(
  cookieStore: CookieStoreLike
) {
  const authSessionSnapshot = await resolveAuthSessionSnapshotFromCookies(
    cookieStore
  )
  if (!authSessionSnapshot) {
    return {
      success: false,
      message: "No active auth session was found in the auth-token cookie.",
    }
  }

  return {
    success: true,
    message: `Resolved auth session for ${authSessionSnapshot.username}.`,
    authSessionSnapshot,
  }
}

export async function buildAuthSessionApiResponse(
  authorizationHeader: string | null
) {
  const authSessionRecord = await readAuthSessionFromAuthorizationHeader(
    authorizationHeader
  )
  if (!authSessionRecord) {
    return {
      status: 401,
      body: {
        error: "Unauthorized: No valid auth session bearer token was provided.",
      },
    }
  }

  return {
    status: 200,
    body: {
      message: "Resolved auth session from the authorization header.",
      authSessionSnapshot: buildAuthSessionSnapshot(authSessionRecord),
      timestamp: new Date().toISOString(),
    },
  }
}
