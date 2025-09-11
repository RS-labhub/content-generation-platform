"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, Sparkles, Edit, Save, X } from "lucide-react"

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
  onPostUpdate?: (updatedPost: string) => void
}

export function GeneratedPostDisplay({
  generatedPost,
  context,
  provider,
  selectedPersona,
  copiedStates,
  onCopy,
  onPostUpdate,
}: GeneratedPostDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // Update edited post when generated post changes
  useEffect(() => {
    setEditedPost(generatedPost)
    setHasChanges(false)
    setIsEditing(false)
  }, [generatedPost])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (onPostUpdate && hasChanges) {
      onPostUpdate(editedPost)
    }
    setIsEditing(false)
    setHasChanges(false)
  }

  const handleCancel = () => {
    setEditedPost(generatedPost)
    setIsEditing(false)
    setHasChanges(false)
  }

  const handlePostChange = (value: string) => {
    setEditedPost(value)
    setHasChanges(value !== generatedPost)
  }

  const currentPost = isEditing ? editedPost : (hasChanges ? editedPost : generatedPost)
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Generated Post</CardTitle>
        <CardDescription className="text-sm">Your AI-generated, platform-optimized content</CardDescription>
      </CardHeader>
      <CardContent>
        {generatedPost ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border relative">
              {isEditing ? (
                <Textarea
                  value={editedPost}
                  onChange={(e) => handlePostChange(e.target.value)}
                  className="min-h-[200px] sm:min-h-[300px] max-h-[400px] resize-none text-sm border-0 bg-transparent p-0 focus-visible:ring-0 font-normal"
                  placeholder="Edit your generated post..."
                />
              ) : (
                <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words text-gray-800 min-h-[200px] sm:min-h-[300px] max-h-[400px] overflow-y-auto">
                  {currentPost}
                </div>
              )}
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 h-10"
                    disabled={!hasChanges}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="h-10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Cancel</span>
                    <span className="sm:hidden">Cancel</span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => onCopy(currentPost, "post")}
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
              )}
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
