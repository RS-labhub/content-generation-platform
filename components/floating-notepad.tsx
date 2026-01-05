"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  X,
  Plus,
  GripHorizontal,
  FileUp,
  Download,
  Trash2,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  FileText,
  MoreHorizontal,
  NotebookPen,
  BookOpen,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NotePage {
  id: string
  title: string
  content: string
  createdAt: Date
}

interface FloatingNotepadProps {
  isOpen: boolean
  onClose: () => void
  initialPosition?: { x: number; y: number }
}

// Simple markdown renderer
function renderMarkdown(text: string): string {
  let html = text
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold mt-2 mb-0.5">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mt-3 mb-0.5">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mt-2 mb-1">$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/\_\_(.*?)\_\_/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\_(.*?)\_/g, '<em class="italic">$1</em>')
    // Strikethrough
    .replace(/~~(.*?)~~/g, '<del class="line-through text-muted-foreground">$1</del>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted/50 rounded-md p-2 my-1.5 text-xs overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted/50 px-1 py-0.5 rounded text-xs">$1</code>')
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-2 border-primary/50 pl-3 my-1.5 text-muted-foreground italic">$1</blockquote>')
    // Unordered lists
    .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc leading-tight">$1</li>')
    .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc leading-tight">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal leading-tight">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-2 border-border" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary underline hover:no-underline">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="my-0.5">')
    .replace(/\n/g, '<br />')

  // Wrap in paragraph
  html = `<p class="my-0.5">${html}</p>`
  
  // Clean up empty paragraphs
  html = html.replace(/<p class="my-0.5"><\/p>/g, '')
  
  return html
}

export function FloatingNotepad({ isOpen, onClose, initialPosition }: FloatingNotepadProps) {
  const [pages, setPages] = useState<NotePage[]>([
    {
      id: "1",
      title: "Slide Notes",
      content: "# Welcome to the Notepad!\n\nUse this space to **plan your carousel content**.\n\n## Tips:\n- Write your slide headlines\n- Draft key points\n- Keep track of your story flow\n\n> Pro tip: You can use **markdown** formatting!",
      createdAt: new Date(),
    },
  ])
  const [activePageId, setActivePageId] = useState("1")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 100 })
  const [size, setSize] = useState({ width: 380, height: 450 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  
  const notepadRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const activePage = pages.find((p) => p.id === activePageId) || pages[0]

  // Smoother dragging logic using refs and RAF
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return
    e.preventDefault()
    setIsDragging(true)
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffsetRef.current.x))
      const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragOffsetRef.current.y))
      
      // Use RAF for smooth updates
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY })
      })
    }
    if (isResizing) {
      e.preventDefault()
      const newWidth = Math.max(320, Math.min(800, e.clientX - position.x))
      const newHeight = Math.max(350, Math.min(700, e.clientY - position.y))
      
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setSize({ width: newWidth, height: newHeight })
      })
    }
  }, [isDragging, isResizing, position, size.width, size.height])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  // Page management
  const addNewPage = () => {
    const newPage: NotePage = {
      id: Date.now().toString(),
      title: `Page ${pages.length + 1}`,
      content: "",
      createdAt: new Date(),
    }
    setPages([...pages, newPage])
    setActivePageId(newPage.id)
  }

  const deletePage = (pageId: string) => {
    if (pages.length === 1) return
    const newPages = pages.filter((p) => p.id !== pageId)
    setPages(newPages)
    if (activePageId === pageId) {
      setActivePageId(newPages[0].id)
    }
  }

  const updatePageContent = (content: string) => {
    setPages(pages.map((p) => (p.id === activePageId ? { ...p, content } : p)))
  }

  const updatePageTitle = (title: string) => {
    setPages(pages.map((p) => (p.id === activePageId ? { ...p, title } : p)))
  }

  // File operations
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const fileName = file.name.replace(/\.(md|txt)$/, "")
      
      const newPage: NotePage = {
        id: Date.now().toString(),
        title: fileName,
        content: content,
        createdAt: new Date(),
      }
      setPages([...pages, newPage])
      setActivePageId(newPage.id)
    }
    reader.readAsText(file)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadPage = () => {
    const blob = new Blob([activePage.content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activePage.title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllPages = () => {
    const allContent = pages
      .map((p) => `# ${p.title}\n\n${p.content}`)
      .join("\n\n---\n\n")
    const blob = new Blob([allContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "carousel-notes.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Navigate pages
  const goToPrevPage = () => {
    const currentIndex = pages.findIndex((p) => p.id === activePageId)
    if (currentIndex > 0) {
      setActivePageId(pages[currentIndex - 1].id)
    }
  }

  const goToNextPage = () => {
    const currentIndex = pages.findIndex((p) => p.id === activePageId)
    if (currentIndex < pages.length - 1) {
      setActivePageId(pages[currentIndex + 1].id)
    }
  }

  if (!isOpen) return null

  const currentPageIndex = pages.findIndex((p) => p.id === activePageId)

  return (
    <div
      ref={notepadRef}
      className={cn(
        "fixed z-[100] bg-background/95 backdrop-blur-md border-2 rounded-xl shadow-2xl flex flex-col",
        "border-amber-500/30 dark:border-amber-400/20",
        isDragging && "cursor-grabbing select-none",
        isMinimized && "!h-auto"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? "auto" : size.height,
        boxShadow: "0 0 30px rgba(251, 191, 36, 0.15), 0 10px 40px rgba(0, 0, 0, 0.3)",
        willChange: isDragging ? "transform" : "auto",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-yellow-500/20 border-b border-amber-500/20 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="h-4 w-4 text-amber-600/60 dark:text-amber-400/60" />
          <NotebookPen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Notepad</span>
          <span className="text-xs text-muted-foreground">
            ({currentPageIndex + 1}/{pages.length})
          </span>
        </div>
        
        <div className="flex items-center gap-1" data-no-drag>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-amber-500/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="z-[110]">{isMinimized ? "Expand" : "Minimize"}</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-red-500/20 hover:text-red-500"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="z-[110]">Close</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex items-center gap-1 px-2 py-1.5 bg-muted/30 border-b shrink-0" data-no-drag>
            <div className="flex-1 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={cn(
                      "group flex items-center gap-1 px-2 py-1 rounded-md text-xs cursor-pointer transition-all min-w-0",
                      page.id === activePageId
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setActivePageId(page.id)}
                  >
                    <FileText className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[80px]">{page.title}</span>
                    {pages.length > 1 && (
                      <button
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity ml-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePage(page.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 hover:bg-amber-500/20 hover:text-amber-600"
                  onClick={addNewPage}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-[110]">New Page</TooltipContent>
            </Tooltip>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-2 py-1.5 bg-muted/20 border-b shrink-0" data-no-drag>
            <div className="flex items-center gap-1">
              <Input
                value={activePage.title}
                onChange={(e) => updatePageTitle(e.target.value)}
                className="h-6 text-xs w-32 bg-transparent border-none focus-visible:ring-1"
                placeholder="Page title..."
              />
            </div>
            
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isPreviewMode ? "default" : "ghost"}
                    size="icon"
                    className={cn("h-6 w-6", isPreviewMode && "bg-amber-500/20 text-amber-600")}
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    {isPreviewMode ? <Edit3 className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[110]">
                  {isPreviewMode ? "Edit" : "Preview Markdown"}
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" data-no-drag>
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 z-[110]" data-no-drag>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadPage}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadAllPages}>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {pages.length > 1 && (
                    <DropdownMenuItem
                      onClick={() => deletePage(activePageId)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Page
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden" data-no-drag>
            {isPreviewMode ? (
              <ScrollArea className="h-full">
                <div
                  className="p-4 prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(activePage.content) }}
                />
              </ScrollArea>
            ) : (
              <Textarea
                value={activePage.content}
                onChange={(e) => updatePageContent(e.target.value)}
                className="h-full w-full resize-none border-none rounded-none bg-transparent focus-visible:ring-0 text-sm p-4 font-mono"
                placeholder="Start typing your notes here...&#10;&#10;You can use **markdown** formatting!"
              />
            )}
          </div>

          {/* Footer with navigation */}
          <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground shrink-0" data-no-drag>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={goToPrevPage}
                disabled={currentPageIndex === 0}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span>
                Page {currentPageIndex + 1} of {pages.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={goToNextPage}
                disabled={currentPageIndex === pages.length - 1}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <span>{activePage.content.length} chars</span>
          </div>

          {/* Resize Handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
            onMouseDown={(e) => {
              e.stopPropagation()
              setIsResizing(true)
            }}
          >
            <svg
              className="w-4 h-4 text-muted-foreground/40 group-hover:text-amber-500/60 transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
            </svg>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.txt,.markdown"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}

// Trigger button component
export function NotepadTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-amber-500/20 hover:text-amber-600"
          onClick={onClick}
        >
          <NotebookPen className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="z-[110]">Open Notepad</TooltipContent>
    </Tooltip>
  )
}
