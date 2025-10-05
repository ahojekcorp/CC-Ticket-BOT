import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "http://localhost:3000"
const DISCORD_REDIRECT_URI = `${APP_URL}/api/auth/discord/callback`

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  console.log("[v0] Callback received with code:", !!code)
  console.log("[v0] Redirect URI being used:", DISCORD_REDIRECT_URI)

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.error("[v0] Missing required environment variables:", {
      hasClientId: !!DISCORD_CLIENT_ID,
      hasClientSecret: !!DISCORD_CLIENT_SECRET,
    })
    return NextResponse.redirect(new URL("/?error=missing_credentials", request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("[v0] Discord token exchange failed:", tokenData)
      return NextResponse.redirect(
        new URL(`/?error=token_exchange_failed&details=${encodeURIComponent(JSON.stringify(tokenData))}`, request.url),
      )
    }

    console.log("[v0] Token exchange successful")

    // Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()
    console.log("[v0] User data fetched:", userData.username)

    // Get user guilds
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const guildsData = await guildsResponse.json()
    console.log("[v0] Guilds fetched:", guildsData.length)

    const cookieStore = await cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    }

    cookieStore.set("discord_token", tokenData.access_token, cookieOptions)
    cookieStore.set("discord_user", JSON.stringify(userData), cookieOptions)
    cookieStore.set("discord_guilds", JSON.stringify(guildsData), cookieOptions)

    console.log("[v0] Cookies set successfully")
    console.log("[v0] Cookie options:", cookieOptions)
    console.log("[v0] Redirecting to dashboard...")

    const dashboardUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(dashboardUrl)
  } catch (error) {
    console.error("[v0] Discord OAuth error:", error)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
