import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getGuildConfig, setGuildConfig } from "@/bot/utils/database"

async function verifyGuildAccess(guildId: string) {
  const cookieStore = await cookies()
  const guildsCookie = cookieStore.get("discord_guilds")

  if (!guildsCookie) {
    return false
  }

  const guilds = JSON.parse(guildsCookie.value)
  const guild = guilds.find((g: any) => g.id === guildId)

  if (!guild) return false

  const permissions = BigInt(guild.permissions)
  const MANAGE_GUILD = BigInt(0x20)
  return (permissions & MANAGE_GUILD) === MANAGE_GUILD
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = await params

  const hasAccess = await verifyGuildAccess(guildId)
  if (!hasAccess) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const config = getGuildConfig(guildId)
  return NextResponse.json(config || {})
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = await params

  const hasAccess = await verifyGuildAccess(guildId)
  if (!hasAccess) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await request.json()
  const config = setGuildConfig(guildId, body)

  return NextResponse.json(config)
}
