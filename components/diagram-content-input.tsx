"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Edit3 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface DiagramContentInputProps {
  diagramContent: string
  onDiagramContentChange: (content: string) => void
  diagramType: string
  onSuggestionSelect: (suggestion: string) => void
}

export function DiagramContentInput({ 
  diagramContent, 
  onDiagramContentChange, 
  diagramType,
  onSuggestionSelect 
}: DiagramContentInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Generate suggestions when content changes
  useEffect(() => {
    if (diagramContent.trim().length > 20) {
      generateSuggestions()
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }, [diagramContent, diagramType])

  const generateSuggestions = () => {
    const content = diagramContent.toLowerCase()
    const newSuggestions: string[] = []

    // First suggestion: generic for the selected diagram type
    newSuggestions.push(`Create a ${diagramType} for this content`)

    // Add specific suggestions based on content keywords
    if (content.includes("process") || content.includes("step") || content.includes("workflow")) {
      newSuggestions.push("Show the step-by-step process flow")
      newSuggestions.push("Visualize the workflow with decision points")
    } else if (content.includes("organization") || content.includes("team") || content.includes("structure")) {
      newSuggestions.push("Create an organizational hierarchy")
      newSuggestions.push("Show team structure and reporting lines")
    } else if (content.includes("timeline") || content.includes("history") || content.includes("milestone")) {
      newSuggestions.push("Display as a chronological timeline")
      newSuggestions.push("Show key milestones and dates")
    } else if (content.includes("concept") || content.includes("idea") || content.includes("brainstorm")) {
      newSuggestions.push("Create a mind map of concepts")
      newSuggestions.push("Break down into main ideas and subtopics")
    } else if (content.includes("system") || content.includes("architecture") || content.includes("component")) {
      newSuggestions.push("Show system architecture and components")
      newSuggestions.push("Visualize data flow and connections")
    } else {
      // Generic fallback suggestions
      newSuggestions.push("Visualize the main components and relationships")
      newSuggestions.push("Show hierarchical breakdown of topics")
    }

    setSuggestions(newSuggestions.slice(0, 4)) // Keep only top 4 suggestions
  }

  const handleCustomClick = () => {
    textareaRef.current?.focus()
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Content for Diagram</CardTitle>
        <CardDescription className="text-sm">
          Describe the process, workflow, or concept you want to visualize
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          ref={textareaRef}
          placeholder="Describe your process, workflow, or any content you want to turn into a diagram. For example: 'User registration process with email verification and profile setup' or 'Project management workflow from planning to deployment'..."
          value={diagramContent}
          onChange={(e) => onDiagramContentChange(e.target.value)}
          className="min-h-[200px] max-h-[300px] resize-none text-sm overflow-y-auto"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>AI Suggestions</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-2 px-3 text-left justify-start whitespace-normal"
                  onClick={() => onSuggestionSelect(suggestion)}
                >
                  <Sparkles className="w-3 h-3 mr-2 flex-shrink-0 text-primary" />
                  <span className="text-sm">{suggestion}</span>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="h-auto py-2 px-3 text-left justify-start border-2 border-dashed"
                onClick={handleCustomClick}
              >
                <Edit3 className="w-3 h-3 mr-2 flex-shrink-0" />
                <span className="text-sm">Custom - Edit your description</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
