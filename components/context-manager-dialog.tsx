"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Upload,
  Download,
  Trash2,
  Plus,
  FileText,
  Package,
  Users,
  Heart,
  Clock,
  Zap,
  Search,
  Edit3,
} from "lucide-react"
import {
  saveContextData,
  getAllContextData,
  removeContextData,
  downloadContextData,
  exportAllContexts,
  importContextsFromFile,
  createContextFromText,
  uploadContextData,
  CONTEXT_CATEGORIES,
  type ContextData,
} from "@/lib/context-manager"
import { useToast } from "@/hooks/use-toast"

interface ContextManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContextAdded?: (contextName: string) => void
  currentContext?: string
}

export function ContextManagerDialog({
  open,
  onOpenChange,
  onContextAdded,
  currentContext,
}: ContextManagerDialogProps) {
  const [contexts, setContexts] = useState<ContextData[]>([])
  const [selectedContext, setSelectedContext] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general" as ContextData["category"],
    content: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load contexts on mount
  useEffect(() => {
    loadContexts()
  }, [])

  // Set selected context from prop
  useEffect(() => {
    if (currentContext) {
      setSelectedContext(currentContext)
    }
  }, [currentContext])

  const loadContexts = () => {
    try {
      const allContexts = getAllContextData()
      setContexts(allContexts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load contexts",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "general",
      content: "",
    })
    setIsCreating(false)
    setIsEditing(false)
  }

  const handleEditContext = (context: ContextData) => {
    setFormData({
      name: context.name,
      description: context.description || "",
      category: context.category,
      content: context.data.rawContent,
    })
    setIsEditing(true)
    setSelectedContext(context.name)
  }

  const handleSaveContext = () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please provide both name and content",
        variant: "destructive",
      })
      return
    }

    try {
      const contextData = createContextFromText(
        formData.name.trim(),
        formData.content.trim(),
        formData.category,
        formData.description.trim(),
      )

      saveContextData(contextData)
      loadContexts()
      resetForm()
      onContextAdded?.(contextData.name)

      window.dispatchEvent(new Event("contexts-updated"))

      toast({
        title: "Success",
        description: `Context "${contextData.name}" saved successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save context",
        variant: "destructive",
      })
    }
  }

  const handleDeleteContext = (contextName: string) => {
    if (window.confirm(`Are you sure you want to delete "${contextName}"?`)) {
      try {
        removeContextData(contextName)
        loadContexts()
        if (selectedContext === contextName) {
          setSelectedContext("")
        }

        toast({
          title: "Success",
          description: `Context "${contextName}" deleted successfully`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete context",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const uploadedFiles = await uploadContextData(files)

      if ((isCreating || isEditing) && uploadedFiles.length === 1) {
        const file = uploadedFiles[0]
        const fileName = file.name.replace(/\.[^/.]+$/, "")

        setFormData((prev) => ({
          ...prev,
          name: prev.name || fileName,
          content: file.content,
          description: prev.description || `Content from ${file.name}`,
        }))

        toast({
          title: "File Loaded",
          description: `Content from ${file.name} has been loaded`,
        })
        return
      }

      if (files.length === 1 && files[0].name.endsWith(".json")) {
        try {
          const importedContexts = await importContextsFromFile(files[0])
          loadContexts()
          toast({
            title: "Success",
            description: `Imported ${importedContexts.length} context(s)`,
          })
          return
        } catch (error) {
          // Continue with regular file processing
        }
      }

      let createdCount = 0
      for (const file of uploadedFiles) {
        const contextName = file.name.replace(/\.[^/.]+$/, "")
        const contextData = createContextFromText(contextName, file.content, "general", `Uploaded from ${file.name}`)

        saveContextData(contextData)
        createdCount++
      }

      loadContexts()
      toast({
        title: "Success",
        description: `Created ${createdCount} context(s) from uploaded files`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process uploaded files",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  const handleDownload = (contextName: string) => {
    try {
      downloadContextData(contextName)
      toast({
        title: "Success",
        description: "Context downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download context",
        variant: "destructive",
      })
    }
  }

  const handleExportAll = () => {
    try {
      exportAllContexts()
      toast({
        title: "Success",
        description: "All contexts exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export contexts",
        variant: "destructive",
      })
    }
  }

  const filteredContexts = contexts.filter((context) => {
    const matchesSearch =
      searchQuery === "" ||
      context.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      context.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      context.analysis?.keyTopics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || context.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: ContextData["category"]) => {
    const iconMap = {
      company: Building2,
      product: Package,
      service: Zap,
      team: Users,
      values: Heart,
      history: Clock,
      general: FileText,
    }
    return iconMap[category] || FileText
  }

  return (
    <>
      {(isCreating || isEditing) && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Context" : "Create New Context"}</DialogTitle>
            </DialogHeader>

            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="context-name">
                  Context Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="context-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Product Overview"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="context-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: ContextData["category"]) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTEXT_CATEGORIES.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          <span className="capitalize">{category.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context-description">Description (Optional)</Label>
                  <Input
                    id="context-description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload File or Paste Content</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">TXT, MD, CSV, JSON files</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context-content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="context-content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Paste your content here..."
                  className="min-h-[200px] resize-y"
                />
                <div className="text-xs text-muted-foreground text-right">{formData.content.length} characters</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSaveContext} disabled={!formData.name.trim() || !formData.content.trim()}>
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!(isCreating || isEditing) && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  <div>
                    <DialogTitle>Context Manager</DialogTitle>
                    <p className="text-sm text-muted-foreground">Manage your context data</p>
                  </div>
                </div>
                <Badge variant="outline">{contexts.length} contexts</Badge>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => setIsCreating(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Context
                </Button>

                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".json,.txt,.md,.csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button variant="outline" size="sm" disabled={isUploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : "Import"}
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={handleExportAll}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </DialogHeader>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contexts..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories ({contexts.length})</SelectItem>
                  {CONTEXT_CATEGORIES.map((category) => {
                    const count = contexts.filter((c) => c.category === category.name).length
                    return (
                      <SelectItem key={category.name} value={category.name}>
                        <span className="capitalize">
                          {category.name} ({count})
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1">
              {filteredContexts.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No contexts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search or filters"
                      : "Create your first context to get started"}
                  </p>
                  {!searchQuery && selectedCategory === "all" && (
                    <Button onClick={() => setIsCreating(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Context
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredContexts.map((context) => {
                    const Icon = getCategoryIcon(context.category)

                    return (
                      <Card
                        key={context.name}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedContext(context.name)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{context.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {context.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                  <span>{context.data.rawContent.length} chars</span>
                                  <span>{context.analysis?.keyTopics.length || 0} topics</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(context.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {context.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{context.description}</p>
                                )}
                                <div className="flex flex-wrap gap-1">
                                  {context.analysis?.keyTopics.slice(0, 3).map((topic) => (
                                    <Badge key={topic} variant="outline" className="text-xs">
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditContext(context)
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDownload(context.name)
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
                                  handleDeleteContext(context.name)
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
