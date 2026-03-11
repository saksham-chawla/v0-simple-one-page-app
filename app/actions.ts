"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  AUTH_COOKIE_NAME,
  createToken,
  getAuthCookieOptions,
  getSessionFromCookieStore,
} from "@/lib/auth"

export async function login(username: string, password: string) {
  // Simple authentication - in a real app, you would check against a databasez
  if (username === "admin" && password === "password") {
    // Create a JWT token
    const token = await createToken({ username })

    // Set the token in a cookie
    cookies().set(AUTH_COOKIE_NAME, token, getAuthCookieOptions())

    // Redirect to the home pagesss
    redirect("/")

    return { success: true }
  }

  return { success: false, error: "Invalid username or password" }
}

export async function logout() {
  // Delete the auth cookiezzzz
  cookies().delete(AUTH_COOKIE_NAME)

  // Redirect to the home page
  redirect("/")
}

export async function testAuthorization() {
  const session = await getSessionFromCookieStore(cookies())
  if (!session) {
    return {
      success: false,
      message: "Unauthorized: No token provided",
    }
  }

  return {
    success: true,
    message: `Authorization successful! User: ${session.username}`,
    user: {
      username: session.username,
      issuedAt: session.iat ?? null,
      expiresAt: session.exp ?? null,
    },
  }
}
