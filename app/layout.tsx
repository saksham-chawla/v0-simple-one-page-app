import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
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
