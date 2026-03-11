"use client"

import { useState } from "react"
import { checkAuthSessionAction } from "@/app/auth/session/actions"
import type { AuthSessionSnapshot } from "@/services/auth-session-service"
import { formatAuthSessionExpiry } from "@/services/auth-session-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react"

interface AuthSessionPanelProps {
  authSessionSnapshot: AuthSessionSnapshot | null
}

export default function AuthSessionPanel({
  authSessionSnapshot,
}: AuthSessionPanelProps) {
  const [authSessionCheck, setAuthSessionCheck] = useState<{
    success: boolean
    message: string
    authSessionSnapshot?: AuthSessionSnapshot
    checkedAt: string
  } | null>(null)
  const [isCheckingAuthSession, setIsCheckingAuthSession] = useState(false)

  const handleCheckAuthSession = async () => {
    setIsCheckingAuthSession(true)

    try {
      const result = await checkAuthSessionAction()
      setAuthSessionCheck({
        ...result,
        checkedAt: new Date().toLocaleTimeString(),
      })
    } catch {
      setAuthSessionCheck({
        success: false,
        message: "Failed to run the auth session check.",
        checkedAt: new Date().toLocaleTimeString(),
      })
    } finally {
      setIsCheckingAuthSession(false)
    }
  }

  const displayedAuthSession = authSessionCheck?.authSessionSnapshot ?? authSessionSnapshot

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Auth Session Panel</CardTitle>
            <CardDescription>
              This page exercises the auth session page, auth session action, auth
              session API route, auth session service, and auth session store.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              displayedAuthSession
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }
          >
            {displayedAuthSession ? "Auth Session Active" : "No Auth Session"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border bg-muted/40 p-4 text-sm">
          <div>
            Auth Session Route:{" "}
            <span className="font-mono font-semibold">/api/auth/session</span>
          </div>
          <div>
            Auth Session Service:{" "}
            <span className="font-mono font-semibold">
              services/auth-session-service.ts
            </span>
          </div>
          <div>
            Auth Session Store:{" "}
            <span className="font-mono font-semibold">
              lib/auth-session-store.ts
            </span>
          </div>
        </div>

        <Button
          onClick={handleCheckAuthSession}
          disabled={isCheckingAuthSession}
          className="gap-2"
        >
          <ShieldCheck className="h-4 w-4" />
          {isCheckingAuthSession ? "Checking Auth Session..." : "Check Auth Session"}
        </Button>

        {authSessionCheck && (
          <Alert
            variant={authSessionCheck.success ? "default" : "destructive"}
          >
            {authSessionCheck.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="flex flex-col">
              <span>{authSessionCheck.message}</span>
              <span className="mt-1 text-xs text-muted-foreground">
                Checked at {authSessionCheck.checkedAt}
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border bg-background p-4 text-sm">
          <h3 className="mb-3 font-medium">Current Auth Session Snapshot</h3>
          {displayedAuthSession ? (
            <div className="space-y-2 font-mono text-xs">
              <div>
                Username:{" "}
                <span className="font-semibold">
                  {displayedAuthSession.username}
                </span>
              </div>
              <div>
                Source:{" "}
                <span className="font-semibold">
                  {displayedAuthSession.source}
                </span>
              </div>
              <div>
                Expires At:{" "}
                <span className="font-semibold">
                  {formatAuthSessionExpiry(displayedAuthSession.expiresAt)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No auth session snapshot is currently available. Log in on the home
              page first, then revisit this auth session page.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
