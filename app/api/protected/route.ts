import { type NextRequest, NextResponse } from "next/server"
import { getSessionFromAuthorizationHeader } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await getSessionFromAuthorizationHeader(
    request.headers.get("Authorization")
  )
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided or token is invalid" },
      { status: 401 }
    )
  }

  return NextResponse.json({
    message: "You have access to protected data!",
    user: session,
    authSource: "authorization_header",
    timestamp: new Date().toISOString(),
  })
}
