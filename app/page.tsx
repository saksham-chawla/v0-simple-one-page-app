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

export async function login(username: string, password: string) {
  // Simple authentication - in a real app, you would check against a database
  if (username === "admin" && password === "password") {
    // Create a JWT token
    const token = await createToken({ username })

    // Set the token in a cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    })

    // Redirect to the home page
    redirect("/")

    return { success: true }
  }

  return { success: false, error: "Invalid username or password" }
}
