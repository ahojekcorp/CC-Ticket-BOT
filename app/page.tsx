"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Ticket, Shield, Users, MessageSquare, AlertCircle, ExternalLink, Globe } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const translations = {
  en: {
    title: "Core Customs Ticket Bot",
    hero: "Professional Ticket System for Discord",
    description: "Manage support tickets efficiently with multiple categories, role management, and automatic backups.",
    addToDiscord: "Add to Discord",
    quickSetup: "Quick Setup",
    step1: "Click 'Add Bot to Server' and select your Discord server",
    step2: "Grant the bot Administrator permissions",
    step3: "Use Discord slash commands to configure your ticket system:",
    setupCmd: "Initialize the ticket system",
    categoryCmd: "Create ticket categories",
    panelCmd: "Create a ticket panel",
    feature1Title: "Multiple Categories",
    feature1Desc: "Create unlimited ticket categories for different support types",
    feature2Title: "Role Management",
    feature2Desc: "Add or remove entire roles from tickets with ease",
    feature3Title: "Ticket Backups",
    feature3Desc: "Automatically backup closed tickets to a dedicated channel",
    feature4Title: "Multi-Server",
    feature4Desc: "Use the bot across multiple servers with independent configs",
    footer: "Built with Discord.js and Next.js",
    botStatus: "Bot Status",
    online: "Online",
    offline: "Offline",
  },
  de: {
    title: "Core Customs Ticket Bot",
    hero: "Professionelles Ticket-System für Discord",
    description:
      "Verwalte Support-Tickets effizient mit mehreren Kategorien, Rollenverwaltung und automatischen Backups.",
    addToDiscord: "Zu Discord hinzufügen",
    quickSetup: "Schnelleinrichtung",
    step1: "Klicke auf 'Bot zum Server hinzufügen' und wähle deinen Discord-Server",
    step2: "Erteile dem Bot Administrator-Berechtigungen",
    step3: "Verwende Discord Slash-Befehle, um dein Ticket-System zu konfigurieren:",
    setupCmd: "Ticket-System initialisieren",
    categoryCmd: "Ticket-Kategorien erstellen",
    panelCmd: "Ticket-Panel erstellen",
    feature1Title: "Mehrere Kategorien",
    feature1Desc: "Erstelle unbegrenzt Ticket-Kategorien für verschiedene Support-Typen",
    feature2Title: "Rollenverwaltung",
    feature2Desc: "Füge ganze Rollen zu Tickets hinzu oder entferne sie mit Leichtigkeit",
    feature3Title: "Ticket-Backups",
    feature3Desc: "Sichere geschlossene Tickets automatisch in einem dedizierten Kanal",
    feature4Title: "Multi-Server",
    feature4Desc: "Nutze den Bot auf mehreren Servern mit unabhängigen Konfigurationen",
    footer: "Erstellt mit Discord.js und Next.js",
    botStatus: "Bot-Status",
    online: "Online",
    offline: "Offline",
  },
}

function HomeContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [language, setLanguage] = useState<"en" | "de">("de")
  const [botStatus, setBotStatus] = useState<"online" | "offline" | "loading">("loading")
  const t = translations[language]

  useEffect(() => {
    const checkBotStatus = async () => {
      try {
        const response = await fetch("/api/bot-status")
        const data = await response.json()
        setBotStatus(data.online ? "online" : "offline")
      } catch (error) {
        console.error("[v0] Failed to check bot status:", error)
        setBotStatus("offline")
      }
    }

    checkBotStatus()
    const interval = setInterval(checkBotStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">{t.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.botStatus}:</span>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    botStatus === "online"
                      ? "bg-green-500 animate-pulse"
                      : botStatus === "offline"
                        ? "bg-red-500"
                        : "bg-gray-400"
                  }`}
                />
                <span className={botStatus === "online" ? "text-green-500" : "text-muted-foreground"}>
                  {botStatus === "loading" ? "..." : botStatus === "online" ? t.online : t.offline}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("de")}>Deutsch</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleInviteBot} variant="default">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t.addToDiscord}
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
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>
                <p>{errorMessage}</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.hero}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.description}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleInviteBot} size="lg" className="text-lg px-8">
              <ExternalLink className="h-5 w-5 mr-2" />
              {t.addToDiscord}
            </Button>
          </div>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 text-left max-w-2xl mx-auto mt-12">
            <h3 className="font-semibold text-lg mb-3">{t.quickSetup}</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>{t.step1}</li>
              <li>{t.step2}</li>
              <li>
                {t.step3}
                <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                  <li>
                    <code className="bg-background px-1 py-0.5 rounded text-xs">/setup</code> - {t.setupCmd}
                  </li>
                  <li>
                    <code className="bg-background px-1 py-0.5 rounded text-xs">/category add</code> - {t.categoryCmd}
                  </li>
                  <li>
                    <code className="bg-background px-1 py-0.5 rounded text-xs">/panel create</code> - {t.panelCmd}
                  </li>
                </ul>
              </li>
            </ol>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            <Card className="p-6 space-y-3 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{t.feature1Title}</h3>
              <p className="text-sm text-muted-foreground">{t.feature1Desc}</p>
            </Card>

            <Card className="p-6 space-y-3 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">{t.feature2Title}</h3>
              <p className="text-sm text-muted-foreground">{t.feature2Desc}</p>
            </Card>

            <Card className="p-6 space-y-3 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{t.feature3Title}</h3>
              <p className="text-sm text-muted-foreground">{t.feature3Desc}</p>
            </Card>

            <Card className="p-6 space-y-3 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">{t.feature4Title}</h3>
              <p className="text-sm text-muted-foreground">{t.feature4Desc}</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t.footer}</p>
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
