"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Brain, Settings, Plus, User, RefreshCw, Building2 } from "lucide-react"
import { getAllPersonaData, getPersonaTrainingDataWithType } from "@/lib/persona-training"
import { getAllContextData, getContextData } from "@/lib/context-manager"
import { useEffect, useState } from "react"

interface PostContext {
  platform: string
  style: string
  keywords: string
  contentType?: string
  postLength?: string
  customWordCount?: number
}

interface PostContextFormProps {
  context: PostContext
  onContextChange: (context: PostContext) => void
  selectedPersona: string
  onPersonaChange: (persona: string) => void
  onShowPersonaDialog: () => void
  selectedBrandContext?: string
  onBrandContextChange?: (context: string) => void
  onShowContextDialog?: () => void
}

export function PostContextForm({
  context,
  onContextChange,
  selectedPersona,
  onPersonaChange,
  onShowPersonaDialog,
  selectedBrandContext = "",
  onBrandContextChange,
  onShowContextDialog,
}: PostContextFormProps) {
  const [personas, setPersonas] = useState<any[]>([])
  const [selectedPersonaData, setSelectedPersonaData] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [contexts, setContexts] = useState<any[]>([])
  const [selectedContextData, setSelectedContextData] = useState<any>(null)

  const normalizeWhitespace = (value: string) => value.trim().replace(/\s+/g, " ")

  const formatTopic = (topic: string, limit = 48) => {
    const normalized = normalizeWhitespace(topic)
    return normalized.length > limit ? `${normalized.slice(0, limit - 1)}…` : normalized
  }

  const formatPreview = (value: string | undefined, limit = 160) => {
    if (!value) return ""
    const normalized = normalizeWhitespace(value)
    return normalized.length > limit ? `${normalized.slice(0, limit - 1)}…` : normalized
  }

  const loadPersonas = () => {
    try {
      setIsRefreshing(true)
      const allPersonas = getAllPersonaData()
      console.log("Loaded personas:", allPersonas) // Debug log
      setPersonas(allPersonas)
    } catch (error) {
      console.error("Error loading personas:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const loadContexts = () => {
    try {
      const allContexts = getAllContextData()
      setContexts(allContexts)
    } catch (error) {
      console.error("Error loading contexts:", error)
    }
  }

  useEffect(() => {
    loadPersonas()
    loadContexts()

    // Listen for persona updates
    const handlePersonasUpdated = () => {
      console.log("Personas updated event received") // Debug log
      loadPersonas()
    }

    // Listen for context updates
    const handleContextsUpdated = () => {
      console.log("Contexts updated event received") // Debug log
      loadContexts()
    }

    window.addEventListener("personas-updated", handlePersonasUpdated)
    window.addEventListener("contexts-updated", handleContextsUpdated)

    return () => {
      window.removeEventListener("personas-updated", handlePersonasUpdated)
      window.removeEventListener("contexts-updated", handleContextsUpdated)
    }
  }, [])

  useEffect(() => {
    if (selectedPersona && selectedPersona !== "default") {
      const personaData = getPersonaTrainingDataWithType(selectedPersona)
      console.log("Selected persona data:", personaData) // Debug log
      setSelectedPersonaData(personaData)
    } else {
      setSelectedPersonaData(null)
    }
  }, [selectedPersona])

  useEffect(() => {
    if (selectedBrandContext) {
      const contextData = getContextData(selectedBrandContext)
      console.log("Selected context data:", contextData) // Debug log
      setSelectedContextData(contextData)
    } else {
      setSelectedContextData(null)
    }
  }, [selectedBrandContext])

  const hasPersonaSelected = selectedPersona && selectedPersona !== "default"

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Post Context</CardTitle>
        <CardDescription className="text-sm">Define your target platform and content preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platform" className="text-sm font-medium">
            Platform
          </Label>
          <Select value={context.platform} onValueChange={(value) => onContextChange({ ...context, platform: value })}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="x">X (Twitter)</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="discord">Discord</SelectItem>
              <SelectItem value="threads">Threads</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="content-type" className="text-sm font-medium">
            Content Type (Optional)
          </Label>
          <Select value={context.contentType || "none"} onValueChange={(value) => onContextChange({ ...context, contentType: value === "none" ? undefined : value })}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select content type (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-muted-foreground">No specific type</span>
              </SelectItem>
              <SelectItem value="linkedin-carousel">🔄 Carousel</SelectItem>
              <SelectItem value="product-announcement">🚀 Product Announcement</SelectItem>
              <SelectItem value="thought-leadership">💡 Thought Leadership</SelectItem>
              <SelectItem value="company-update">📢 Company Update</SelectItem>
              <SelectItem value="customer-story">👥 Customer Success Story</SelectItem>
              <SelectItem value="educational">📚 Educational Content</SelectItem>
              <SelectItem value="behind-the-scenes">🎬 Behind the Scenes</SelectItem>
              <SelectItem value="industry-news">📰 Industry News/Commentary</SelectItem>
              <SelectItem value="event-promotion">🎟️ Event Promotion</SelectItem>
              <SelectItem value="team-spotlight">⭐ Team Spotlight</SelectItem>
              <SelectItem value="milestone">🎯 Milestone/Achievement</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Optional: Helps structure the content for specific purposes
          </p>
        </div>

        {/* Persona Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Writing Persona
            </Label>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={loadPersonas} disabled={isRefreshing} className="h-7 text-xs">
                <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={onShowPersonaDialog} className="h-7 text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Manage
              </Button>
            </div>
          </div>
          <Select value={selectedPersona} onValueChange={onPersonaChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Choose a persona or use custom style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/20" />
                  <span>Custom Style (No Persona)</span>
                </div>
              </SelectItem>
              {personas.map((persona) => (
                <SelectItem key={persona.name} value={persona.name}>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded-sm">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="capitalize">{persona.name}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {persona.contentType || "mixed"}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Show persona details if selected */}
          {selectedPersonaData && (
            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm capitalize">{selectedPersonaData.name}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedPersonaData.contentType || "mixed"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>{selectedPersonaData.rawContent.length} characters of training data</p>
                {selectedPersonaData.instructions && <p className="text-primary dark:text-primary/90">✓ Has custom instructions</p>}
              </div>
            </div>
          )}

          {/* Show create persona option if no personas exist */}
          {personas.length === 0 && !isRefreshing && (
            <div className="p-3 border border-dashed rounded-lg text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">No personas created yet</p>
              <Button variant="outline" size="sm" onClick={onShowPersonaDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Persona
              </Button>
            </div>
          )}
        </div>

        {/* Brand/Company Context Selection */}
        {onBrandContextChange && onShowContextDialog && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="context-select" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Brand Context (Optional)
              </Label>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={loadContexts} className="h-7 text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" onClick={onShowContextDialog} className="h-7 text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Manage
                </Button>
              </div>
            </div>
            <Select value={selectedBrandContext || "none"} onValueChange={(value) => onBrandContextChange?.(value === "none" ? "" : value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select brand/company context (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/20" />
                    <span>No Context</span>
                  </div>
                </SelectItem>
                {contexts.map((context) => (
                  <SelectItem key={context.name} value={context.name}>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                        <Building2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>{context.name}</span>
                      <Badge variant="outline" className="text-xs ml-auto capitalize">
                        {context.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Show context details if selected */}
            {selectedContextData && (
              <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg border border-blue-500/30 dark:border-blue-500/40">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-sm">{selectedContextData.name}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedContextData.category}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{selectedContextData.data.rawContent.length} characters of context data</p>
                  {selectedContextData.description && (
                    <p className="text-blue-700 dark:text-blue-300">"{formatPreview(selectedContextData.description, 140)}"</p>
                  )}
                  {selectedContextData.analysis?.keyTopics?.length ? (
                    <p className="text-[11px] uppercase tracking-[0.28em] text-blue-600/80 dark:text-blue-400/80">
                      {selectedContextData.analysis.keyTopics.length} topic
                      {selectedContextData.analysis.keyTopics.length === 1 ? "" : "s"}
                    </p>
                  ) : null}
                  {selectedContextData.analysis?.keyInsights?.length ? (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300">
                      <span className="rounded-full border border-blue-500/30 dark:border-blue-500/40 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700/80 dark:text-blue-300/80">
                        Insight
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{formatPreview(selectedContextData.analysis.keyInsights[0], 160)}</span>
                      {selectedContextData.analysis.keyInsights.length > 1 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 rounded-full px-2 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              +{selectedContextData.analysis.keyInsights.length - 1} more
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="max-w-[calc(100vw-4rem)] w-72 space-y-2 text-sm" align="start">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              Additional insights
                            </p>
                            <div className="grid max-h-48 gap-1.5 overflow-y-auto pr-1">
                              {selectedContextData.analysis.keyInsights.slice(1).map((insight: string) => (
                                <div
                                  key={insight}
                                  className="rounded-lg border border-border/60 bg-background/70 px-2 py-1 text-xs text-foreground"
                                >
                                  {formatPreview(insight, 180)}
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Show create context option if no contexts exist */}
            {contexts.length === 0 && (
              <div className="p-3 border border-dashed rounded-lg text-center">
                <Building2 className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">No brand contexts created yet</p>
                <Button variant="outline" size="sm" onClick={onShowContextDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Context
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Custom Style - only show if no persona is selected */}
        {!hasPersonaSelected && (
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-medium">
              Custom Style
            </Label>
            <Input
              id="style"
              placeholder="e.g., storytelling, educational, humorous..."
              value={context.style}
              onChange={(e) => onContextChange({ ...context, style: e.target.value })}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">Describe your preferred writing style and tone</p>
          </div>
        )}

        {/* Show persona override message if persona is selected */}
        {hasPersonaSelected && (
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-primary" />
              <span className="font-medium">Using persona style</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              The selected persona will override custom styling preferences
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium">
            Keywords (Optional)
          </Label>
          <Input
            id="keywords"
            placeholder="e.g., AI, productivity, startup..."
            value={context.keywords}
            onChange={(e) => onContextChange({ ...context, keywords: e.target.value })}
            className="h-10"
          />
          <p className="text-xs text-gray-500">Comma-separated keywords to emphasize in your post</p>
        </div>

        {/* Post Length Control */}
        <div className="space-y-2">
          <Label htmlFor="post-length" className="text-sm font-medium">
            Post Length
          </Label>
          <Select 
            value={context.postLength || "medium"} 
            onValueChange={(value) => onContextChange({ ...context, postLength: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select post length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Small</span>
                  <span className="text-xs text-muted-foreground">50-150 words • Quick & punchy</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Medium</span>
                  <span className="text-xs text-muted-foreground">150-300 words • Balanced content</span>
                </div>
              </SelectItem>
              <SelectItem value="large">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Large</span>
                  <span className="text-xs text-muted-foreground">300-500 words • In-depth discussion</span>
                </div>
              </SelectItem>
              <SelectItem value="custom">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Custom</span>
                  <span className="text-xs text-muted-foreground">Specify your own word count</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {context.postLength === "custom" && (
            <div className="mt-2">
              <Input
                type="number"
                placeholder="Enter word count"
                min="10"
                max="1000"
                value={context.customWordCount || ""}
                onChange={(e) => onContextChange({ ...context, customWordCount: parseInt(e.target.value) || undefined })}
                className="h-10"
              />
              <p className="text-xs text-muted-foreground mt-1">Target word count for your post</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
