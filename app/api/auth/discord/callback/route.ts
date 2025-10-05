import { type NextRequest, NextResponse } from "next/server"

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const DISCORD_REDIRECT_URI = APP_URL
  ? `${APP_URL}/api/auth/discord/callback`
  : "http://localhost:3000/api/auth/discord/callback"

export async function GET(request: NextRequest) {
  if (!DISCORD_CLIENT_ID) {
    console.error("[v0] DISCORD_CLIENT_ID environment variable is not set")
    return NextResponse.redirect(new URL("/?error=missing_client_id", request.url))
  }

  // Validate that client ID is a valid Discord snowflake (numeric string)
  if (!/^\d+$/.test(DISCORD_CLIENT_ID)) {
    console.error(
      "[v0] DISCORD_CLIENT_ID is invalid. Must be a numeric Discord snowflake ID. Current value:",
      DISCORD_CLIENT_ID,
    )
    return NextResponse.redirect(new URL("/?error=invalid_client_id", request.url))
  }

  if (APP_URL) {
    // Check for common URL issues
    if (APP_URL.includes("https://https://") || APP_URL.includes("http://http://")) {
      console.error("[v0] NEXT_PUBLIC_APP_URL has duplicate protocol. Current value:", APP_URL)
      return NextResponse.redirect(new URL("/?error=invalid_app_url_duplicate_protocol", request.url))
    }

    if (APP_URL.endsWith("...") || APP_URL.includes("...")) {
      console.error("[v0] NEXT_PUBLIC_APP_URL contains '...' placeholder. Current value:", APP_URL)
      return NextResponse.redirect(new URL("/?error=invalid_app_url_placeholder", request.url))
    }

    // Validate URL format
    try {
      new URL(APP_URL)
    } catch (e) {
      console.error("[v0] NEXT_PUBLIC_APP_URL is not a valid URL. Current value:", APP_URL)
      return NextResponse.redirect(new URL("/?error=invalid_app_url_format", request.url))
    }
  }

  console.log("[v0] Discord OAuth initiated")
  console.log("[v0] Client ID:", DISCORD_CLIENT_ID)
  console.log("[v0] Redirect URI:", DISCORD_REDIRECT_URI)

  const authUrl = new URL("https://discord.com/api/oauth2/authorize")
  authUrl.searchParams.set("client_id", DISCORD_CLIENT_ID)
  authUrl.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", "identify guilds")

  return NextResponse.redirect(authUrl.toString())
}
