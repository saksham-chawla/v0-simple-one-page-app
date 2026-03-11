import { type NextRequest, NextResponse } from "next/server"
import { buildAuthSessionApiResponse } from "@/services/auth-session-service"

export async function GET(request: NextRequest) {
  const authSessionApiResponse = await buildAuthSessionApiResponse(
    request.headers.get("Authorization")
  )

  return NextResponse.json(authSessionApiResponse.body, {
    status: authSessionApiResponse.status,
  })
}
