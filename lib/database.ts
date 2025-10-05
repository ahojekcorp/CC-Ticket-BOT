import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

export async function getGuildConfig(guildId: string) {
  try {
    const db = getPool()
    const [rows] = await db.query("SELECT * FROM guild_configs WHERE guild_id = ?", [guildId])
    return (rows as any[])[0] || null
  } catch (error) {
    console.error("Error fetching guild config:", error)
    return null
  }
}

export async function setGuildConfig(guildId: string, config: { transcript_channel_id?: string }) {
  try {
    const db = getPool()
    await db.query(
      `INSERT INTO guild_configs (guild_id, transcript_channel_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE transcript_channel_id = ?`,
      [guildId, config.transcript_channel_id, config.transcript_channel_id],
    )
    return await getGuildConfig(guildId)
  } catch (error) {
    console.error("Error setting guild config:", error)
    return null
  }
}

export async function getTicketCategories(guildId: string) {
  try {
    const db = getPool()
    const [rows] = await db.query("SELECT * FROM ticket_categories WHERE guild_id = ?", [guildId])
    return rows as any[]
  } catch (error) {
    console.error("Error fetching ticket categories:", error)
    return []
  }
}

export async function addTicketCategory(
  guildId: string,
  category: {
    name: string
    emoji: string
    category_id: string
    support_roles: string[]
  },
) {
  try {
    const db = getPool()
    const [result] = await db.query(
      `INSERT INTO ticket_categories (guild_id, name, emoji, category_id, support_roles)
       VALUES (?, ?, ?, ?, ?)`,
      [guildId, category.name, category.emoji, category.category_id, JSON.stringify(category.support_roles)],
    )
    const insertId = (result as any).insertId
    const [rows] = await db.query("SELECT * FROM ticket_categories WHERE id = ?", [insertId])
    return (rows as any[])[0]
  } catch (error) {
    console.error("Error adding ticket category:", error)
    return null
  }
}

export async function removeTicketCategory(guildId: string, categoryId: string) {
  try {
    const db = getPool()
    await db.query("DELETE FROM ticket_categories WHERE guild_id = ? AND id = ?", [guildId, categoryId])
    return true
  } catch (error) {
    console.error("Error removing ticket category:", error)
    return false
  }
}
