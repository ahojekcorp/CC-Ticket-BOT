"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ticket, ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TicketCategory {
  id: string
  name: string
  emoji: string
  categoryId: string
  supportRoles: string[]
}

interface GuildConfig {
  transcriptChannelId?: string
  categories?: TicketCategory[]
}

export default function GuildSettingsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<GuildConfig>({})
  const [transcriptChannelId, setTranscriptChannelId] = useState("")
  const [newCategory, setNewCategory] = useState({
    name: "",
    emoji: "🎫",
    categoryId: "",
    supportRoles: "",
  })

  useEffect(() => {
    fetchConfig()
  }, [guildId])

  const fetchConfig = async () => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/config`)
      if (!response.ok) throw new Error("Failed to fetch config")
      const data = await response.json()
      setConfig(data)
      setTranscriptChannelId(data.transcriptChannelId || "")
    } catch (error) {
      console.error("Failed to fetch config:", error)
      toast({
        title: "Error",
        description: "Failed to load server configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveGeneralSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/guilds/${guildId}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptChannelId }),
      })
      if (!response.ok) throw new Error("Failed to save")
      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addCategory = async () => {
    if (!newCategory.name || !newCategory.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/guilds/${guildId}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCategory,
          supportRoles: newCategory.supportRoles
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
        }),
      })
      if (!response.ok) throw new Error("Failed to add category")

      toast({
        title: "Success",
        description: "Category added successfully",
      })

      setNewCategory({ name: "", emoji: "🎫", categoryId: "", supportRoles: "" })
      fetchConfig()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      })
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/categories?categoryId=${categoryId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete category")

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })

      fetchConfig()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">Server Settings</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General Settings */}
          <Card className="p-6 bg-card border-border space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">General Settings</h2>
              <p className="text-sm text-muted-foreground">Configure basic bot settings for this server</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transcriptChannel">Transcript Channel ID</Label>
                <Input
                  id="transcriptChannel"
                  placeholder="Enter channel ID for ticket backups"
                  value={transcriptChannelId}
                  onChange={(e) => setTranscriptChannelId(e.target.value)}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">Closed tickets will be backed up to this channel</p>
              </div>

              <Button onClick={saveGeneralSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Ticket Categories */}
          <Card className="p-6 bg-card border-border space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ticket Categories</h2>
              <p className="text-sm text-muted-foreground">
                Create multiple ticket categories for different support types
              </p>
            </div>

            {/* Existing Categories */}
            {config.categories && config.categories.length > 0 && (
              <div className="space-y-3">
                {config.categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.emoji}</span>
                      <div>
                        <p className="font-semibold">{category.name}</p>
                        <p className="text-xs text-muted-foreground">Category ID: {category.categoryId}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Category */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-semibold">Add New Category</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="e.g., General Support"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryEmoji">Emoji</Label>
                  <Input
                    id="categoryEmoji"
                    placeholder="🎫"
                    value={newCategory.emoji}
                    onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Discord Category ID</Label>
                  <Input
                    id="categoryId"
                    placeholder="Enter category ID"
                    value={newCategory.categoryId}
                    onChange={(e) => setNewCategory({ ...newCategory, categoryId: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportRoles">Support Role IDs (comma-separated)</Label>
                  <Input
                    id="supportRoles"
                    placeholder="123456789, 987654321"
                    value={newCategory.supportRoles}
                    onChange={(e) => setNewCategory({ ...newCategory, supportRoles: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <Button onClick={addCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
