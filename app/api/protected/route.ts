import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // Get the token from the Authorization header
  const authHeader = request.headers.get("Authorization")
  const token = authHeader?.split(" ")[1] // Bearer token

  // If there's no token, return unauthorized
  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 })
  }

  // Verify the token
  try {
    const payload = await verifyToken(token)

    // If the token is invalid, return unauthorized
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }

    // If the token is valid, return the protected data
    return NextResponse.json({
      message: "You have access to protected data!",
      user: payload,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
  }
}
