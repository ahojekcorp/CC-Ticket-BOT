"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ticket, Settings, LogOut, Loader2 } from "lucide-react"

interface Guild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

interface User {
  id: string
  username: string
  discriminator: string
  avatar: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        router.push("/")
        return
      }
      const data = await response.json()
      setUser(data.user)
      setGuilds(data.guilds)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const getGuildIcon = (guild: Guild) => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">TicketBot Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                {user.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                    alt={user.username}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm">{user.username}</span>
              </div>
            )}
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Select a Server</h1>
            <p className="text-muted-foreground">Choose a server to configure the ticket bot</p>
          </div>

          {guilds.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <p className="text-muted-foreground">No servers found where you have management permissions.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guilds.map((guild) => (
                <Card
                  key={guild.id}
                  className="p-6 bg-card border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/${guild.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {getGuildIcon(guild) ? (
                      <img
                        src={getGuildIcon(guild)! || "/placeholder.svg"}
                        alt={guild.name}
                        className="h-16 w-16 rounded-lg"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                        {guild.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{guild.name}</h3>
                      <p className="text-sm text-muted-foreground">Click to configure</p>
                    </div>
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
