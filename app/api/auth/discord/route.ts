import { type NextRequest, NextResponse } from "next/server"

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`
  : "http://localhost:3000/api/auth/discord/callback"

export async function GET(request: NextRequest) {
  const authUrl = new URL("https://discord.com/api/oauth2/authorize")
  authUrl.searchParams.set("client_id", DISCORD_CLIENT_ID || "")
  authUrl.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", "identify guilds")

  return NextResponse.redirect(authUrl.toString())
}
