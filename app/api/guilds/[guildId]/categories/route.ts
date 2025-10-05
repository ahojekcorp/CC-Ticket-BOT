import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getTicketCategories, addTicketCategory, removeTicketCategory } from "@/bot/utils/database"

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

  const categories = getTicketCategories(guildId)
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = await params

  const hasAccess = await verifyGuildAccess(guildId)
  if (!hasAccess) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await request.json()
  const category = addTicketCategory(guildId, body)

  return NextResponse.json(category)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = await params

  const hasAccess = await verifyGuildAccess(guildId)
  if (!hasAccess) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get("categoryId")

  if (!categoryId) {
    return NextResponse.json({ error: "Category ID required" }, { status: 400 })
  }

  const success = removeTicketCategory(guildId, categoryId)
  return NextResponse.json({ success })
}
