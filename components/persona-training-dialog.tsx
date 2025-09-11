"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Upload,
  Download,
  Trash2,
  Plus,
  FileText,
  MessageSquare,
  BookOpen,
  AlertCircle,
  User,
  Lightbulb,
  Calendar,
  BarChart3,
  Heart,
  Frown,
  Meh,
} from "lucide-react"
import {
  savePersonaTrainingDataWithType,
  getPersonaTrainingDataWithType,
  getAllPersonaData,
  removePersonaTrainingData,
  downloadPersonaData,
  uploadPersonaData,
  analyzeSentiment,
  createPersonaFromText,
} from "@/lib/persona-training"
import { useToast } from "@/hooks/use-toast"

interface PersonaTrainingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPersonaAdded?: (personaName: string) => void
  currentPersona?: string
}

export function PersonaTrainingDialog({
  open,
  onOpenChange,
  onPersonaAdded,
  currentPersona,
}: PersonaTrainingDialogProps) {
  const [personaName, setPersonaName] = useState("")
  const [contentType, setContentType] = useState<"posts" | "blogs" | "mixed">("mixed")
  const [trainingContent, setTrainingContent] = useState("")
  const [instructions, setInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [existingPersonas, setExistingPersonas] = useState<any[]>([])
  const [selectedPersona, setSelectedPersona] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [currentSentiment, setCurrentSentiment] = useState<any>(null)
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const [quickCreateName, setQuickCreateName] = useState("")
  const [quickCreateContent, setQuickCreateContent] = useState("")

  const { toast } = useToast()

  // Analyze sentiment when training content changes
  useEffect(() => {
    if (trainingContent.trim()) {
      const sentiment = analyzeSentiment(trainingContent)
      setCurrentSentiment(sentiment)
    } else {
      setCurrentSentiment(null)
    }
  }, [trainingContent])

  // Load existing personas when dialog opens
  useEffect(() => {
    if (open) {
      loadExistingPersonas()
      if (currentPersona) {
        setSelectedPersona(currentPersona)
        loadPersonaData(currentPersona)
        setIsEditing(true)
      }
    }
  }, [open, currentPersona])

  const loadExistingPersonas = () => {
    try {
      const personas = getAllPersonaData()
      setExistingPersonas(personas)
    } catch (error) {
      console.error("Error loading personas:", error)
    }
  }

  const loadPersonaData = (name: string) => {
    try {
      const persona = getPersonaTrainingDataWithType(name)
      if (persona) {
        setPersonaName(persona.name)
        setTrainingContent(persona.rawContent)
        setInstructions(persona.instructions || "")
        setContentType(persona.contentType || "mixed")
      }
    } catch (error) {
      console.error("Error loading persona data:", error)
    }
  }

  const handleSave = async () => {
    if (!personaName.trim() || !trainingContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both persona name and training content.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      savePersonaTrainingDataWithType(
        personaName.trim().toLowerCase(),
        trainingContent.trim(),
        contentType,
        instructions.trim() || undefined,
      )

      toast({
        title: "Persona Saved",
        description: `${personaName} persona has been saved successfully.`,
      })

      if (onPersonaAdded) {
        onPersonaAdded(personaName.trim().toLowerCase())
      }

      // Reset form
      resetForm()
      loadExistingPersonas()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save persona. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (name: string) => {
    try {
      removePersonaTrainingData(name)
      toast({
        title: "Persona Deleted",
        description: `${name} persona has been deleted.`,
      })
      loadExistingPersonas()
      if (selectedPersona === name) {
        resetForm()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete persona.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (name: string) => {
    try {
      downloadPersonaData(name)
      toast({
        title: "Download Started",
        description: `${name} persona backup is being downloaded.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download persona data.",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          const persona = await uploadPersonaData(file)
          successCount++
          console.log(`Successfully imported: ${persona.name}`)
        } catch (error) {
          errorCount++
          console.error(`Failed to import ${file.name}:`, error)
        }
      }

      // Show results
      if (successCount > 0 && errorCount === 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${successCount} persona${successCount > 1 ? "s" : ""}.`,
        })
      } else if (successCount > 0 && errorCount > 0) {
        toast({
          title: "Partial Import",
          description: `Imported ${successCount} persona${successCount > 1 ? "s" : ""}, ${errorCount} failed.`,
        })
      } else {
        toast({
          title: "Import Failed",
          description: "Failed to import persona files. Please check the file format.",
          variant: "destructive",
        })
      }

      loadExistingPersonas()
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during import.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => 
        file.type === "application/json" || 
        file.name.endsWith(".json") ||
        file.type === "text/plain" ||
        file.name.endsWith(".txt") ||
        file.type === "text/markdown" ||
        file.name.endsWith(".md")
    )

    if (files.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please drop JSON, TXT, or MD files only.",
        variant: "destructive",
      })
      return
    }

    // Process the dropped files using the same logic as handleUpload
    setIsLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const file of files) {
        try {
          const persona = await uploadPersonaData(file)
          successCount++
        } catch (error) {
          errorCount++
        }
      }

      if (successCount > 0 && errorCount === 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${successCount} persona${successCount > 1 ? "s" : ""}.`,
        })
      } else if (successCount > 0 && errorCount > 0) {
        toast({
          title: "Partial Import",
          description: `Imported ${successCount} persona${successCount > 1 ? "s" : ""}, ${errorCount} failed.`,
        })
      } else {
        toast({
          title: "Import Failed",
          description: "Failed to import persona files. Please check the file format.",
          variant: "destructive",
        })
      }

      loadExistingPersonas()
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during import.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPersonaName("")
    setTrainingContent("")
    setInstructions("")
    setContentType("mixed")
    setSelectedPersona("")
    setIsEditing(false)
    setShowQuickCreate(false)
    setQuickCreateName("")
    setQuickCreateContent("")
  }

  const editPersona = (persona: any) => {
    setSelectedPersona(persona.name)
    loadPersonaData(persona.name)
    setIsEditing(true)
    setShowQuickCreate(false)
  }

  const handleQuickCreate = () => {
    if (!quickCreateName.trim() || !quickCreateContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and content for quick creation.",
        variant: "destructive",
      })
      return
    }

    try {
      createPersonaFromText(quickCreateName.trim(), quickCreateContent.trim(), contentType)
      toast({
        title: "Persona Created",
        description: `${quickCreateName} persona has been created from text content.`,
      })
      
      if (onPersonaAdded) {
        onPersonaAdded(quickCreateName.trim().toLowerCase())
      }
      
      loadExistingPersonas()
      setShowQuickCreate(false)
      setQuickCreateName("")
      setQuickCreateContent("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create persona from text.",
        variant: "destructive",
      })
    }
  }

  // Add this function to handle bulk export
  const handleBulkExport = () => {
    if (existingPersonas.length === 0) {
      toast({
        title: "No Personas",
        description: "No personas available to export.",
        variant: "destructive",
      })
      return
    }

    try {
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        personas: existingPersonas.map((persona) => ({
          name: persona.name,
          rawContent: persona.rawContent,
          instructions: persona.instructions,
          contentType: persona.contentType,
          createdAt: persona.createdAt,
        })),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `all-personas-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `Exported ${existingPersonas.length} personas to backup file.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export personas. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Persona Manager</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Create and manage AI writing personas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{existingPersonas.length} personas</Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-6" style={{ overflowY: "auto" }}>
          <div className="space-y-6 py-4">
            {/* Quick Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={resetForm} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Persona
              </Button>
              <Button 
                onClick={() => setShowQuickCreate(!showQuickCreate)} 
                variant="outline" 
                size="sm"
                className={showQuickCreate ? "bg-blue-50 border-blue-300" : ""}
              >
                <FileText className="w-4 h-4 mr-2" />
                Quick Create
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json,.txt,.md"
                  multiple
                  onChange={handleUpload}
                  disabled={isLoading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button variant="outline" size="sm" disabled={isLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isLoading ? "Importing..." : "Import Files"}
                </Button>
              </div>
              {existingPersonas.length > 0 && (
                <Button onClick={handleBulkExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              )}
            </div>

            {/* Drag and Drop Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                {isDragOver ? "Drop files here" : "Drag & drop training files"}
              </p>
              <p className="text-xs text-muted-foreground">Supports JSON, TXT & MD files • Max 10MB per file</p>
            </div>

            {/* Quick Create Section */}
            {showQuickCreate && (
              <div className="border rounded-lg p-4 bg-blue-50/50 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Quick Create from Text</h4>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Persona Name</Label>
                      <Input
                        placeholder="e.g., my-writing-style"
                        value={quickCreateName}
                        onChange={(e) => setQuickCreateName(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Content Type</Label>
                      <Select value={contentType} onValueChange={(value: "posts" | "blogs" | "mixed") => setContentType(value)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="posts">Posts</SelectItem>
                          <SelectItem value="blogs">Blogs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Paste your writing samples here</Label>
                    <Textarea
                      placeholder="Paste your writing content here... Separate different samples with '---' or '==='"
                      value={quickCreateContent}
                      onChange={(e) => setQuickCreateContent(e.target.value)}
                      className="min-h-[120px] text-sm font-mono resize-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowQuickCreate(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleQuickCreate}
                      disabled={!quickCreateName.trim() || !quickCreateContent.trim()}
                    >
                      Create Persona
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Personas */}
            {existingPersonas.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Your Personas</h3>
                <div className="grid gap-3">
                  {existingPersonas.map((persona) => (
                    <Card
                      key={persona.name}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedPersona === persona.name ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => editPersona(persona)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-100 rounded">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium capitalize">{persona.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {persona.contentType || "mixed"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                                <span className="flex-shrink-0">{persona.rawContent.length} chars</span>
                                <span className="flex-shrink-0">{persona.rawContent.split(/---+|===+/).length} samples</span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(persona.createdAt).toLocaleDateString()}
                                </span>
                                {persona.instructions && (
                                  <span className="flex items-center gap-1 text-blue-600 flex-shrink-0">
                                    <Lightbulb className="w-3 h-3" />
                                    Instructions
                                  </span>
                                )}
                                {persona.sentiment && (
                                  <span className="flex items-center gap-1 text-purple-600 min-w-0">
                                    <BarChart3 className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">
                                      {persona.sentiment.dominant} tone • {persona.sentiment.styleCharacteristics?.formalityLevel || 'mixed'} style
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(persona.name)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(persona.name)
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Form Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{isEditing ? `Edit ${personaName}` : "Create New Persona"}</h3>
                {isEditing && (
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Persona Name</Label>
                  <Input
                    placeholder="e.g., tech-blogger, casual-writer"
                    value={personaName}
                    onChange={(e) => setPersonaName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Content Type</Label>
                  <Select
                    value={contentType}
                    onValueChange={(value: "posts" | "blogs" | "mixed") => setContentType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Mixed (Posts & Blogs)
                        </div>
                      </SelectItem>
                      <SelectItem value="posts">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Social Media Posts
                        </div>
                      </SelectItem>
                      <SelectItem value="blogs">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Blog Articles
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Custom Instructions (Optional)
                </Label>
                <Textarea
                  placeholder="Provide specific instructions on how you want the AI to write. For example: 'Write in a conversational tone, use emojis sparingly, focus on actionable tips, keep sentences short and punchy...'"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will guide the AI on your preferred writing style and approach.
                </p>
              </div>

              {/* Training Content */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Training Content
                </Label>
                <Textarea
                  placeholder="Paste your writing samples here. Include 3-5 examples of your best work. Separate different pieces with '---' or '===' to help the AI learn your style..."
                  value={trainingContent}
                  onChange={(e) => setTrainingContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm resize-none"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>Include 3-5 writing samples for best results</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{trainingContent.length} characters</span>
                    <span>{trainingContent.split(/---+|===+/).length} samples detected</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                  <strong>💡 Tip:</strong> You can also upload .txt or .md files using the import buttons above, or use Quick Create for faster setup.
                </div>
                
                {/* Sentiment Analysis Display */}
                {currentSentiment && (
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Sentiment Analysis</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-3 h-3 text-green-600" />
                        <span className="text-green-700">Positive: {currentSentiment.positive}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Frown className="w-3 h-3 text-red-600" />
                        <span className="text-red-700">Negative: {currentSentiment.negative}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Meh className="w-3 h-3 text-gray-600" />
                        <span className="text-gray-700">Neutral: {currentSentiment.neutral}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-purple-700">
                      <strong>Dominant tone:</strong> {currentSentiment.dominant}
                      {currentSentiment.keywords.length > 0 && (
                        <span> • <strong>Key words:</strong> {currentSentiment.keywords.slice(0, 5).join(', ')}</span>
                      )}
                    </div>
                    {currentSentiment.styleCharacteristics && (
                      <div className="text-xs text-purple-600 mt-1 space-y-1">
                        <div className="grid grid-cols-2 gap-2">
                          <span>📝 {currentSentiment.styleCharacteristics.formalityLevel} style</span>
                          <span>📏 {currentSentiment.styleCharacteristics.avgSentenceLength}w avg</span>
                          {currentSentiment.styleCharacteristics.usesEmojis && <span>😊 Uses emojis</span>}
                          {currentSentiment.styleCharacteristics.usesHashtags && <span># Uses hashtags</span>}
                        </div>
                        {currentSentiment.styleCharacteristics.writingPatterns && (
                          <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                            <div className="font-medium text-purple-700 mb-1">Writing Patterns Detected:</div>
                            {currentSentiment.styleCharacteristics.writingPatterns.contractionsUsed.length > 0 && (
                              <div>• Contractions: {currentSentiment.styleCharacteristics.writingPatterns.contractionsUsed.slice(0, 3).join(', ')}</div>
                            )}
                            {currentSentiment.styleCharacteristics.writingPatterns.uniquePhrases.length > 0 && (
                              <div>• Unique phrases: {currentSentiment.styleCharacteristics.writingPatterns.uniquePhrases.slice(0, 2).join(', ')}</div>
                            )}
                            <div>• Vocabulary: {currentSentiment.styleCharacteristics.writingPatterns.vocabularyLevel}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !personaName.trim() || !trainingContent.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Persona" : "Create Persona"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
