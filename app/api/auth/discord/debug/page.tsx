"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Ticket, Shield, Users, MessageSquare, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function HomeContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const handleLogin = () => {
    window.location.href = "/api/auth/discord"
  }

  const handleDebug = () => {
    window.open("/api/auth/discord/debug", "_blank")
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "missing_client_id":
        return "Discord Client ID is not configured. Please set the DISCORD_CLIENT_ID environment variable."
      case "invalid_client_id":
        return "Discord Client ID is invalid. It must be a numeric Discord snowflake ID."
      case "invalid_app_url_duplicate_protocol":
        return "NEXT_PUBLIC_APP_URL has duplicate protocol (https://https://). Please fix the environment variable to use only one protocol."
      case "invalid_app_url_placeholder":
        return "NEXT_PUBLIC_APP_URL contains '...' placeholder. Please replace it with your actual deployment URL."
      case "invalid_app_url_format":
        return "NEXT_PUBLIC_APP_URL is not a valid URL format. Please check the environment variable."
      case "missing_credentials":
        return "Discord credentials are not configured. Please set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET."
      case "no_code":
        return "Authorization code was not received from Discord."
      case "auth_failed":
        return "Authentication failed. Please try again."
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage(error)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">TicketBot</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDebug} variant="outline" size="sm">
              Debug OAuth
            </Button>
            <Button onClick={handleLogin} variant="default">
              Login with Discord
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {errorMessage && (
            <Alert variant="destructive" className="text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Professional Ticket System for Discord</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage support tickets efficiently with multiple categories, role management, and automatic backups.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Documentation
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            <Card className="p-6 space-y-3 bg-card border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Multiple Categories</h3>
              <p className="text-sm text-muted-foreground">
                Create unlimited ticket categories for different support types
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-card border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Role Management</h3>
              <p className="text-sm text-muted-foreground">Add or remove entire roles from tickets with ease</p>
            </Card>

            <Card className="p-6 space-y-3 bg-card border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Ticket Backups</h3>
              <p className="text-sm text-muted-foreground">
                Automatically backup closed tickets to a dedicated channel
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-card border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Multi-Server</h3>
              <p className="text-sm text-muted-foreground">
                Use the bot across multiple servers with independent configs
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with Discord.js and Next.js</p>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
