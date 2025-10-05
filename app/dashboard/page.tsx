import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardClient from "./dashboard-client"

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

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("discord_user")
  const guildsCookie = cookieStore.get("discord_guilds")

  console.log("[v0] Dashboard Server: Has user cookie:", !!userCookie)
  console.log("[v0] Dashboard Server: Has guilds cookie:", !!guildsCookie)

  if (!userCookie || !guildsCookie) {
    console.log("[v0] Dashboard Server: No auth cookies, redirecting to home")
    redirect("/")
  }

  try {
    const user: User = JSON.parse(userCookie.value)
    const guilds: Guild[] = JSON.parse(guildsCookie.value)

    console.log("[v0] Dashboard Server: User:", user.username)
    console.log("[v0] Dashboard Server: Total guilds:", guilds.length)

    // Filter guilds where user has MANAGE_GUILD permission
    const managedGuilds = guilds.filter((guild) => {
      const permissions = BigInt(guild.permissions)
      const MANAGE_GUILD = BigInt(0x20)
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD
    })

    console.log("[v0] Dashboard Server: Managed guilds:", managedGuilds.length)

    return <DashboardClient user={user} guilds={managedGuilds} />
  } catch (error) {
    console.error("[v0] Dashboard Server: Error parsing cookies:", error)
    redirect("/")
  }
}
