"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Ticket, Shield, Users, MessageSquare, AlertCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function HomeContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const DISCORD_CLIENT_ID = "1423751425800011849"
  const BOT_INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`

  const handleInviteBot = () => {
    window.open(BOT_INVITE_URL, "_blank")
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "missing_client_id":
        return "Discord Client ID is not configured. Please set the DISCORD_CLIENT_ID environment variable."
      case "invalid_client_id":
        return "Discord Client ID is invalid. It must be a numeric Discord snowflake ID."
      case "no_code":
        return "Authorization was cancelled or the code was not received from Discord. Please try logging in again."
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
          <Button onClick={handleInviteBot} variant="default">
            <ExternalLink className="h-4 w-4 mr-2" />
            Add to Discord
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {errorMessage && (
            <Alert variant="destructive" className="text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>
                <p>{errorMessage}</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Professional Ticket System for Discord</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage support tickets efficiently with multiple categories, role management, and automatic backups.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleInviteBot} size="lg" className="text-lg px-8">
              <ExternalLink className="h-5 w-5 mr-2" />
              Add Bot to Server
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Documentation
            </Button>
          </div>

          <Card className="p-6 bg-muted/50 border-border text-left max-w-2xl mx-auto mt-12">
            <h3 className="font-semibold text-lg mb-3">Quick Setup</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Click "Add Bot to Server" and select your Discord server</li>
              <li>Grant the bot Administrator permissions</li>
              <li>
                Use Discord slash commands to configure your ticket system:
                <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                  <li>
                    <code className="bg-background px-1 py-0.5 rounded text-xs">/setup</code> - Initialize the ticket
                    system
                  </li>
                  <li>
                    <code className="bg-background px-1 py-0.5 rounded text-xs">/category add</code> - Create ticket
                    categories
                  </li>
                  <li>
                    <code className="bg-background px-1 py-0.5 rounded text-xs">/panel create</code> - Create a ticket
                    panel
                  </li>
                </ul>
              </li>
            </ol>
          </Card>

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
