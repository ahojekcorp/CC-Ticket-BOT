import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("discord_user")
  const guildsCookie = cookieStore.get("discord_guilds")

  if (!userCookie || !guildsCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = JSON.parse(userCookie.value)
  const guilds = JSON.parse(guildsCookie.value)

  // Filter guilds where user has MANAGE_GUILD permission
  const managedGuilds = guilds.filter((guild: any) => {
    const permissions = BigInt(guild.permissions)
    const MANAGE_GUILD = BigInt(0x20)
    return (permissions & MANAGE_GUILD) === MANAGE_GUILD
  })

  return NextResponse.json({
    user,
    guilds: managedGuilds,
  })
}
