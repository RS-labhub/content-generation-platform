"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Sparkles } from "lucide-react"

interface PostContext {
  platform: string
  style: string
  keywords: string
}

interface GeneratedPostDisplayProps {
  generatedPost: string
  context: PostContext
  provider: string
  selectedPersona?: string
  copiedStates: { [key: string]: boolean }
  onCopy: (text: string, type: string) => void
}

export function GeneratedPostDisplay({
  generatedPost,
  context,
  provider,
  selectedPersona,
  copiedStates,
  onCopy,
}: GeneratedPostDisplayProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Generated Post</CardTitle>
        <CardDescription className="text-sm">Your AI-generated, platform-optimized content</CardDescription>
      </CardHeader>
      <CardContent>
        {generatedPost ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
              <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words text-gray-800 min-h-[200px] sm:min-h-[300px] max-h-[400px] resize-none text-sm overflow-y-auto">
                {generatedPost}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onCopy(generatedPost, "post")}
                className="flex-1 h-10"
                variant={copiedStates.post ? "secondary" : "default"}
              >
                {copiedStates.post ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Copy Post</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary" className="text-xs">
                {context.platform}
              </Badge>
              <Badge variant="secondary" className="text-xs truncate max-w-[120px]">
                {context.style}
              </Badge>
              {context.keywords && (
                <Badge variant="outline" className="text-xs truncate max-w-[150px]">
                  Keywords: {context.keywords}
                </Badge>
              )}
              {selectedPersona && (
                <Badge variant="outline" className="text-xs truncate max-w-[120px]">
                  Persona: {selectedPersona}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {provider}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Sparkles className="mx-auto h-8 w-8 sm:h-12 sm:w-12 mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Your generated post will appear here</p>
            <p className="text-xs sm:text-sm mt-2">
              The length will be automatically optimized for your selected platform
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
