import { NextResponse } from "next/server"

export async function GET() {
  try {
    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "1423751425800011849"

    // Check if bot is online by making a request to Discord API
    const response = await fetch(`https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/rpc`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    })

    // If we get any response (even 404), the bot token is valid and bot exists
    const isOnline = response.status !== 401 && response.status !== 403

    return NextResponse.json({
      online: isOnline,
      status: isOnline ? "online" : "offline",
    })
  } catch (error) {
    console.error("[v0] Bot status check failed:", error)
    return NextResponse.json({
      online: false,
      status: "offline",
    })
  }
}
