"us.e server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createToken, verifyToken } from "@/lib/auth"

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

export async function logout() {
  // Delete the auth cookie
  cookies().delete("auth-token")

  // Redirect to the home page
  redirect("/")
}

export async function testAuthorization() {
  // Get the token from cookies
  const token = cookies().get("auth-token")?.value

  // If there's no token, return unauthorized
  if (!token) {
    return {
      success: false,
      message: "Unauthorized: No token provided",
    }
  }

  // Verify the token
  try {
    const payload = await verifyToken(token)

    // If the token is valid, return success
    return {
      success: true,
      message: `Authorization successful! User: ${payload.username}`,
      user: payload,
    }
  } catch (error) {
    // If the token is invalid, return unauthorized
    return {
      success: false,
      message: "Unauthorized: Invalid token",
    }
  }
}
