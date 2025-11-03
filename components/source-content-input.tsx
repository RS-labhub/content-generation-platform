"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Edit3 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface SourceContentInputProps {
  content: string
  onContentChange: (content: string) => void
  platform: string
  onSuggestionSelect: (suggestion: string) => void
}

export function SourceContentInput({ 
  content, 
  onContentChange,
  platform,
  onSuggestionSelect 
}: SourceContentInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Generate suggestions when content changes
  useEffect(() => {
    if (content.trim().length > 30) {
      generateSuggestions()
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }, [content, platform])

  const generateSuggestions = () => {
    const contentLower = content.toLowerCase()
    const newSuggestions: string[] = []

    // First suggestion: generic for the platform
    const platformName = platform || "social media"
    newSuggestions.push(`Create a ${platformName} post from this content`)

    // Add specific suggestions based on content keywords and patterns
    if (contentLower.includes("tutorial") || contentLower.includes("how to") || contentLower.includes("guide")) {
      newSuggestions.push("Transform this into a step-by-step thread")
      newSuggestions.push("Create an educational post highlighting key points")
    } else if (contentLower.includes("announcement") || contentLower.includes("launch") || contentLower.includes("release")) {
      newSuggestions.push("Write an exciting announcement post")
      newSuggestions.push("Create a launch post with key features")
    } else if (contentLower.includes("story") || contentLower.includes("experience") || contentLower.includes("journey")) {
      newSuggestions.push("Share this as a personal story")
      newSuggestions.push("Create an engaging narrative post")
    } else if (contentLower.includes("tip") || contentLower.includes("advice") || contentLower.includes("best practice")) {
      newSuggestions.push("Turn this into actionable tips")
      newSuggestions.push("Create a quick-win advice post")
    } else if (contentLower.includes("research") || contentLower.includes("data") || contentLower.includes("study")) {
      newSuggestions.push("Share key insights from this research")
      newSuggestions.push("Create a data-driven post with highlights")
    } else if (contentLower.includes("opinion") || contentLower.includes("think") || contentLower.includes("believe")) {
      newSuggestions.push("Express this as a thought leadership post")
      newSuggestions.push("Create a perspective-sharing post")
    } else {
      // Generic fallback suggestions
      newSuggestions.push("Summarize this into key takeaways")
      newSuggestions.push("Create an engaging post with hooks")
    }

    setSuggestions(newSuggestions.slice(0, 4)) // Keep only top 4 suggestions
  }

  const handleCustomClick = () => {
    textareaRef.current?.focus()
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Source Content</CardTitle>
        <CardDescription className="text-sm">
          Paste your blog post, notes, or any content to transform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          ref={textareaRef}
          placeholder="Paste your blog post, website content, notes, or any text you want to transform into a social media post..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[150px] sm:min-h-[200px] max-h-[300px] resize-none text-sm overflow-y-auto"
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
                <span className="text-sm">Custom - Edit your content</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
