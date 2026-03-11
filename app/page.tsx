import { cookies } from "next/headers"
import PublicSection from "@/components/public-section"
import ProtectedSection from "@/components/protected-section"
import { getSessionFromCookieStore } from "@/lib/auth"

export default async function Home() {
  const session = await getSessionFromCookieStore(cookies())

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Authentication Test App</h1>

      {!session ? <PublicSection /> : <ProtectedSection session={session} />}
    </main>
  )
}
