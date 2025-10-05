import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("discord_token")
  cookieStore.delete("discord_user")
  cookieStore.delete("discord_guilds")

  return NextResponse.json({ success: true })
}
