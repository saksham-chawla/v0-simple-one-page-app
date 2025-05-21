"use client"

import { useState } from "react"
import { logout, testAuthorization } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, ShieldCheck, LogOut } from "lucide-react"

export default function ProtectedSection() {
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    timestamp?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTestAuth = async () => {
    setLoading(true)
    try {
      const result = await testAuthorization()
      setTestResult({
        success: result.success,
        message: result.message,
        timestamp: new Date().toLocaleTimeString(),
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: "Failed to test authorization",
        timestamp: new Date().toLocaleTimeString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Protected Section</CardTitle>
              <CardDescription>This section is only visible to authenticated users</CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Authenticated
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="test">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="test">Test Authorization</TabsTrigger>
              <TabsTrigger value="info">Auth Info</TabsTrigger>
            </TabsList>
            <TabsContent value="test" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Test your backend authorization by making a request to a protected API endpoint.
              </p>

              <div className="flex justify-center my-4">
                <Button onClick={handleTestAuth} disabled={loading} className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  {loading ? "Testing..." : "Test Authorization"}
                </Button>
              </div>

              {testResult && (
                <Alert variant={testResult.success ? "default" : "destructive"} className="mt-4">
                  {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertDescription className="flex flex-col">
                    <span>{testResult.message}</span>
                    <span className="text-xs text-muted-foreground mt-1">{testResult.timestamp}</span>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            <TabsContent value="info" className="pt-4">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">JWT Token Information</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    A JWT token has been stored in your cookies and is being used for authorization.
                  </p>
                  <div className="text-xs font-mono bg-background p-2 rounded border">
                    <div>
                      Token Location: <span className="font-semibold">HTTP Cookie (auth-token)</span>
                    </div>
                    <div>
                      Expiration: <span className="font-semibold">1 hour</span>
                    </div>
                    <div>
                      Signed with: <span className="font-semibold">HS256</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <form action={logout} className="w-full">
            <Button type="submit" variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
