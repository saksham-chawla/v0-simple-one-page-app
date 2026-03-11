import { type NextRequest, NextResponse } from "next/server"
import { buildProtectedApiResponse } from "@/services/auth-session"

export async function GET(request: NextRequest) {
  const response = await buildProtectedApiResponse(
    request.headers.get("Authorization")
  )
  return NextResponse.json(response.body, { status: response.status })
}
