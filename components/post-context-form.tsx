"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, Settings, Plus, User, RefreshCw } from "lucide-react"
import { getAllPersonaData, getPersonaTrainingDataWithType } from "@/lib/persona-training"
import { useEffect, useState } from "react"

interface PostContext {
  platform: string
  style: string
  keywords: string
}

interface PostContextFormProps {
  context: PostContext
  onContextChange: (context: PostContext) => void
  selectedPersona: string
  onPersonaChange: (persona: string) => void
  onShowPersonaDialog: () => void
}

export function PostContextForm({
  context,
  onContextChange,
  selectedPersona,
  onPersonaChange,
  onShowPersonaDialog,
}: PostContextFormProps) {
  const [personas, setPersonas] = useState<any[]>([])
  const [selectedPersonaData, setSelectedPersonaData] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  useEffect(() => {
    loadPersonas()

    // Listen for persona updates
    const handlePersonasUpdated = () => {
      console.log("Personas updated event received") // Debug log
      loadPersonas()
    }

    window.addEventListener("personas-updated", handlePersonasUpdated)

    return () => {
      window.removeEventListener("personas-updated", handlePersonasUpdated)
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
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm capitalize">{selectedPersonaData.name}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedPersonaData.contentType || "mixed"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>{selectedPersonaData.rawContent.length} characters of training data</p>
                {selectedPersonaData.instructions && <p className="text-primary">✓ Has custom instructions</p>}
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
      </CardContent>
    </Card>
  )
}
