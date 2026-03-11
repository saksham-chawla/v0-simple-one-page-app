"use server"

import { cookies } from "next/headers"
import { checkAuthSessionFromCookies } from "@/services/auth-session-service"

export async function checkAuthSessionAction() {
  return checkAuthSessionFromCookies(cookies())
}
