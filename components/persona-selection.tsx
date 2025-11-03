"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, Settings, Plus } from "lucide-react"
import { getAllPersonaData, initializeBuiltInPersonas } from "@/lib/persona-training"
import { useEffect, useState } from "react"

interface PersonaSelectionProps {
  selectedPersona: string
  onPersonaChange: (persona: string) => void
  onShowPersonaDialog: () => void
}

export function PersonaSelection({ selectedPersona, onPersonaChange, onShowPersonaDialog }: PersonaSelectionProps) {
  const [personas, setPersonas] = useState<any[]>([])

  useEffect(() => {
    // Initialize built-in personas on first load
    initializeBuiltInPersonas()
    loadPersonas()
  }, [])

  const loadPersonas = () => {
    try {
      const allPersonas = getAllPersonaData()
      setPersonas(allPersonas)
    } catch (error) {
      console.error("Error loading personas:", error)
    }
  }

  const selectedPersonaData = personas.find((p) => p.name === selectedPersona)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Writing Persona
            </CardTitle>
            <CardDescription>Choose a trained persona to match your writing style</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onShowPersonaDialog} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Manage Personas</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Persona Display */}
        {selectedPersonaData && (
          <div className="p-3 bg-muted/50 rounded-lg border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-primary" />
              <span className="font-medium capitalize">{selectedPersonaData.name}</span>
              <Badge variant="outline" className="text-xs">
                {selectedPersonaData.contentType || "mixed"}
              </Badge>
              {selectedPersonaData.isBuiltIn && (
                <Badge variant="secondary" className="text-xs">
                  Built-in
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedPersonaData.rawContent.length} characters of training data
            </p>
          </div>
        )}

        {/* Persona Selection */}
        <div className="space-y-2">
          <Select value={selectedPersona} onValueChange={onPersonaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a persona or use default style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted" />
                  Default (No Persona)
                </div>
              </SelectItem>
              {personas.map((persona) => (
                <SelectItem key={persona.name} value={persona.name}>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span className="capitalize">{persona.name}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {persona.contentType || "mixed"}
                    </Badge>
                    {persona.isBuiltIn && (
                      <Badge variant="secondary" className="text-xs">
                        Built-in
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onShowPersonaDialog} className="flex-1 bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Create New Persona
          </Button>
          <Button variant="outline" size="sm" onClick={loadPersonas} className="px-3 bg-transparent">
            Refresh
          </Button>
        </div>

        {personas.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No personas created yet</p>
            <p className="text-xs mt-1">Create your first persona to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
