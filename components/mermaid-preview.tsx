"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MermaidPreviewProps {
  chart: string
  className?: string
}

export function MermaidPreview({ chart, className = "" }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(true)
  const [zoom, setZoom] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !chart) return

      setIsRendering(true)
      setError(null)

      try {
        // Initialize mermaid with configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
          },
        })

        // Generate a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        
        // Clear previous content
        containerRef.current.innerHTML = ""

        // Render the diagram
        const { svg } = await mermaid.render(id, chart)
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err)
        setError(err instanceof Error ? err.message : "Failed to render diagram")
      } finally {
        setIsRendering(false)
      }
    }

    renderDiagram()
  }, [chart])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const handleDownload = async () => {
    if (!containerRef.current) return

    try {
      const svgElement = containerRef.current.querySelector("svg")
      if (!svgElement) {
        throw new Error("No SVG found to download")
      }

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement
      
      // Get the dimensions
      const bbox = svgElement.getBBox()
      const width = bbox.width || 800
      const height = bbox.height || 600

      // Set viewBox and dimensions for better quality
      clonedSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${width} ${height}`)
      clonedSvg.setAttribute("width", (width * 2).toString()) // 2x for high quality
      clonedSvg.setAttribute("height", (height * 2).toString())
      clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

      // Serialize the SVG to string
      const svgData = new XMLSerializer().serializeToString(clonedSvg)
      
      // Create a data URL from SVG (this avoids CORS issues)
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`

      // Create canvas for PNG export
      const canvas = document.createElement("canvas")
      const scale = 2 // 2x resolution for better quality
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext("2d", { willReadFrequently: false })

      if (!ctx) {
        throw new Error("Failed to get canvas context")
      }

      // Create an image from the SVG data URL
      const img = new Image()
      
      img.onload = () => {
        try {
          // Set white background
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Draw the image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          // Convert to PNG and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `mermaid-diagram-${Date.now()}.png`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              
              toast({
                title: "Diagram Downloaded",
                description: "High-quality PNG saved successfully",
              })
            }
          }, "image/png", 1.0)
        } catch (err) {
          console.error("Canvas drawing error:", err)
          toast({
            title: "Download Failed",
            description: "Failed to create PNG image",
            variant: "destructive",
          })
        }
      }

      img.onerror = () => {
        toast({
          title: "Download Failed",
          description: "Failed to load SVG image",
          variant: "destructive",
        })
      }

      // Use data URL to avoid CORS issues
      img.src = svgDataUrl
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download diagram",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
        <p className="text-sm text-red-600">Failed to render diagram: {error}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Control Bar */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
        {/* Download Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          disabled={isRendering}
          className="h-7 w-7 bg-background/80 backdrop-blur-sm border border-border/50"
          title="Download PNG"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>

        {/* Zoom Controls */}
        <div className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="h-7 w-7"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            disabled={zoom === 1}
            className="h-7 w-7"
            title="Reset Zoom"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="h-7 w-7"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-20">
          <div className="text-sm text-muted-foreground">Rendering diagram...</div>
        </div>
      )}
      
      {/* Scrollable container with proper overflow handling */}
      <div 
        ref={scrollContainerRef}
        className="overflow-auto rounded-lg bg-background/50 max-h-[600px] cursor-grab active:cursor-grabbing" 
        style={{ minHeight: "200px" }}
      >
        <div
          className="inline-block"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-in-out",
            minWidth: zoom > 1 ? `${100 * zoom}%` : "100%",
            minHeight: zoom > 1 ? `${100 * zoom}%` : "100%"
          }}
        >
          <div
            ref={containerRef}
            className="mermaid-container p-4"
          />
        </div>
      </div>
    </div>
  )
}
