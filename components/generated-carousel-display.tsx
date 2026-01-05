"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, ExternalLink, Edit, Save, X, Palette, Wand2, FileDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CarouselDesigner } from "@/components/carousel-designer"
import { useRouter } from "next/navigation"

interface GeneratedCarouselDisplayProps {
  carouselContent: string[]
  platform: string
  provider: string
  selectedPersona?: string
  copiedStates: { [key: string]: boolean }
  onCopy: (text: string, type: string) => void
  onExport?: () => void
  onCarouselUpdate?: (slides: string[]) => void
}

export function GeneratedCarouselDisplay({
  carouselContent,
  platform,
  provider,
  selectedPersona,
  copiedStates,
  onCopy,
  onExport,
  onCarouselUpdate,
}: GeneratedCarouselDisplayProps) {
  const [editableContent, setEditableContent] = useState<string[]>(carouselContent)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState<string>("")
  const [editingAllSlides, setEditingAllSlides] = useState<boolean>(false)
  const [bulkEditText, setBulkEditText] = useState<string>("")
  const [showDesigner, setShowDesigner] = useState<boolean>(false)
  const router = useRouter()

  // Update local state when props change
  if (JSON.stringify(carouselContent) !== JSON.stringify(editableContent) && 
      editingSlideIndex === null && !editingAllSlides) {
    setEditableContent(carouselContent)
  }

  const downloadCarouselAsText = () => {
    // Create the formatted text with numbered slides
    const formattedText = editableContent.map((slide, index) => 
      `Slide ${index + 1}\n\n${slide}\n\n${"=".repeat(60)}\n\n`
    ).join('')
    
    // Create a blob and download
    const blob = new Blob([formattedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carousel-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAndOpenDesigner = () => {
    // Download the carousel
    downloadCarouselAsText()
    
    // Open carousel designer in new tab
    window.open('/carousel-designer', '_blank')
  }

  const startEditing = (index: number) => {
    setEditingSlideIndex(index)
    setEditText(editableContent[index])
  }

  const saveEdit = () => {
    if (editingSlideIndex !== null) {
      const newSlides = [...editableContent]
      newSlides[editingSlideIndex] = editText
      setEditableContent(newSlides)
      setEditingSlideIndex(null)
      if (onCarouselUpdate) {
        onCarouselUpdate(newSlides)
      }
    }
  }

  const cancelEdit = () => {
    setEditingSlideIndex(null)
    setEditText("")
  }

  const startBulkEdit = () => {
    const formattedText = editableContent.map((slide, index) => 
      `// Slide ${index + 1}\n${slide}\n\n`
    ).join('')
    setBulkEditText(formattedText)
    setEditingAllSlides(true)
  }

  const saveBulkEdit = () => {
    try {
      // Parse the bulk edit text back into individual slides
      const slideRegex = /\/\/\s*Slide\s*\d+\s*\n([\s\S]*?)(?=\n\n\/\/\s*Slide|\n*$)/g
      const matches = [...bulkEditText.matchAll(slideRegex)]
      
      if (matches.length > 0) {
        const newSlides = matches.map(match => match[1].trim())
        setEditableContent(newSlides)
        setEditingAllSlides(false)
        if (onCarouselUpdate) {
          onCarouselUpdate(newSlides)
        }
      } else {
        // If regex fails, split by double newlines as a fallback
        const slides = bulkEditText.split(/\n\s*\n/)
          .map(text => text.replace(/\/\/\s*Slide\s*\d+\s*\n/, '').trim())
          .filter(text => text.length > 0)
        
        if (slides.length > 0) {
          setEditableContent(slides)
          setEditingAllSlides(false)
          if (onCarouselUpdate) {
            onCarouselUpdate(slides)
          }
        }
      }
    } catch (error) {
      console.error("Error parsing bulk edit:", error)
      // Keep editing open if there was an error
    }
  }

  const cancelBulkEdit = () => {
    setEditingAllSlides(false)
    setBulkEditText("")
  }

  if (!editableContent || editableContent.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">LinkedIn Carousel Preview</CardTitle>
          <CardDescription className="text-sm">
            Your generated carousel slides will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 border border-dashed border-muted-foreground/20 rounded-md h-64 flex items-center justify-center p-4">
            <p className="text-muted-foreground text-center text-sm">
              Configure your content parameters and click &quot;Generate Carousel&quot; to create carousel slides
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Generated Carousel</CardTitle>
          <div className="flex gap-1">
            {platform && (
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                {platform}
              </Badge>
            )}
            {selectedPersona && (
              <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                {selectedPersona}
              </Badge>
            )}
            {provider && (
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                {provider}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-sm">
          {editableContent.length} slides created for LinkedIn - editable content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Designer Mode Button */}
        <div className="flex gap-2 mb-4">
          <Dialog open={showDesigner} onOpenChange={setShowDesigner}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Palette className="h-4 w-4 mr-2" />
                Open Designer Mode
                <Badge variant="secondary" className="ml-2 text-xs">PRO</Badge>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Carousel Designer</DialogTitle>
                <DialogDescription>
                  Design your carousel with professional templates
                </DialogDescription>
              </DialogHeader>
              <CarouselDesigner 
                initialContent={editableContent}
                onExport={(format: string, blobs: Blob[]) => {
                  console.log(`Exported ${blobs.length} slides as ${format}`)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Carousel Preview</TabsTrigger>
            <TabsTrigger value="all">All Slides Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4 mt-2">
            <ScrollArea className="h-80 rounded-md border p-4">
              <div className="space-y-4">
                {editableContent.map((slide, index) => (
                  <div key={index} className="p-4 bg-card border rounded-md shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">Slide {index + 1}</Badge>
                      <div className="flex gap-1">
                        {editingSlideIndex === index ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={saveEdit}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => startEditing(index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => onCopy(slide, `slide-${index}`)}
                            >
                              {copiedStates[`slide-${index}`] ? (
                                <span className="text-xs text-muted-foreground">Copied</span>
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    {editingSlideIndex === index ? (
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[100px] text-sm"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">{slide}</div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="all" className="mt-2">
            <div className="bg-muted rounded-md p-4">
              <ScrollArea className="h-80">
                {editingAllSlides ? (
                  <Textarea
                    value={bulkEditText}
                    onChange={(e) => setBulkEditText(e.target.value)}
                    className="min-h-[320px] font-mono text-xs sm:text-sm whitespace-pre-wrap bg-transparent border-0 focus-visible:ring-0 p-0"
                  />
                ) : (
                  <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap">
                    {editableContent.map((slide, index) => 
                      `// Slide ${index + 1}\n${slide}\n\n`
                    ).join('')}
                  </pre>
                )}
              </ScrollArea>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {editingAllSlides ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveBulkEdit}
                  >
                    Save Changes
                    <Save className="ml-2 h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelBulkEdit}
                  >
                    Cancel
                    <X className="ml-2 h-3 w-3 text-red-600" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startBulkEdit}
                  >
                    Edit All
                    <Edit className="ml-2 h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(editableContent.map((slide, index) => 
                      `// Slide ${index + 1}\n${slide}\n\n`
                    ).join(''), "all-slides")}
                  >
                    {copiedStates["all-slides"] ? "Copied!" : "Copy All"}
                    <Copy className="ml-2 h-3 w-3" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={downloadAndOpenDesigner}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Download & Open Designer
                    <FileDown className="ml-2 h-3 w-3" />
                  </Button>
                  {onExport && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onExport}
                    >
                      Export
                      <Download className="ml-2 h-3 w-3" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
