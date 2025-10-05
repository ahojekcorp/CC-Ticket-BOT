import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  console.log("[v0] /api/auth/me called")

  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  console.log(
    "[v0] All cookies:",
    allCookies.map((c) => c.name),
  )

  const userCookie = cookieStore.get("discord_user")
  const guildsCookie = cookieStore.get("discord_guilds")

  console.log("[v0] Has user cookie:", !!userCookie)
  console.log("[v0] Has guilds cookie:", !!guildsCookie)

  if (!userCookie || !guildsCookie) {
    console.log("[v0] Missing cookies, returning 401")
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const user = JSON.parse(userCookie.value)
    const guilds = JSON.parse(guildsCookie.value)

    console.log("[v0] Parsed user:", user.username)
    console.log("[v0] Parsed guilds count:", guilds.length)

    // Filter guilds where user has MANAGE_GUILD permission
    const managedGuilds = guilds.filter((guild: any) => {
      const permissions = BigInt(guild.permissions)
      const MANAGE_GUILD = BigInt(0x20)
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD
    })

    console.log("[v0] Managed guilds count:", managedGuilds.length)

    return NextResponse.json({
      user,
      guilds: managedGuilds,
    })
  } catch (error) {
    console.error("[v0] Error parsing cookies:", error)
    return NextResponse.json({ error: "Invalid session data" }, { status: 500 })
  }
}
