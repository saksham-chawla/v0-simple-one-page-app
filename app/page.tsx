import { cookies } from "next/headers"
import PublicSection from "@/components/public-section"
import ProtectedSection from "@/components/protected-section"
import { verifyToken } from "@/lib/auth"

export default async function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  const isAuthenticated = token ? await verifyToken(token) : false

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Authentication Test App</h1>

      {!isAuthenticated ? <PublicSection /> : <ProtectedSection />}
    </main>
  )
}
