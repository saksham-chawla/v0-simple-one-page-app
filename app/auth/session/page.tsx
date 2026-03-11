import Link from "next/link"
import { cookies } from "next/headers"
import AuthSessionPanel from "@/components/auth-session-panel"
import { resolveAuthSessionSnapshotFromCookies } from "@/services/auth-session-service"

export default async function AuthSessionPage() {
  const authSessionSnapshot = await resolveAuthSessionSnapshotFromCookies(
    cookies()
  )

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-6 md:p-12">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Auth Session Diagnostics
        </p>
        <h1 className="text-3xl font-bold">Inspect the Auth Session Flow</h1>
        <p className="max-w-2xl text-muted-foreground">
          This auth session page is a focused view over the auth session action,
          auth session API route, auth session service, and auth session store.
        </p>
        <Link href="/" className="text-sm font-medium underline underline-offset-4">
          Return to the authentication test app
        </Link>
      </div>

      <AuthSessionPanel authSessionSnapshot={authSessionSnapshot} />
    </main>
  )
}
