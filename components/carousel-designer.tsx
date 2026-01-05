"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { HelpDialog } from "@/components/help-dialog"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { InlineCustomPaletteCreator, CustomPaletteCreatorTrigger } from "@/components/custom-palette-creator"
import { FloatingNotepad, NotepadTrigger } from "@/components/floating-notepad"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Plus, Minus, ZoomIn, ZoomOut, Undo, Redo, Copy, Trash2, Download, Upload, 
  Layers, Type, Square, Circle, Image as ImageIcon, Palette, Settings2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreVertical, Eye, EyeOff, Lock, Unlock,
  Move, RotateCw, Grid3X3, Sparkles, FileDown, FileImage, FileText,
  Layout, Wand2, Save, FolderOpen, PlusCircle, Play, Maximize2,
  ArrowUp, ArrowDown, Grip, Star, CheckCircle, List, Hash, Quote,
  Triangle, Hexagon, Pentagon, Minus as LineIcon, TrendingUp,
  Diamond, Octagon, RectangleHorizontal, Link, ImagePlus,
  Sun, Moon,
  Group, Ungroup, // For grouping feature
  AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter,
  AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart, AlignVerticalJustifyEnd,
  // Additional icons for stickers/shapes
  ArrowRight, ArrowLeft, ArrowUpRight, ArrowDownRight,
  Heart, ThumbsUp, ThumbsDown, Award, Trophy, Target,
  Zap, Rocket, Lightbulb, Flag, Bookmark, Bell,
  MessageCircle, MessageSquare, Mail, Send,
  Check, X, AlertCircle, Info, HelpCircle,
  Users, User, UserPlus, Briefcase, Building2,
  Calendar, Clock, Timer, TrendingDown,
  BarChart2, PieChart, Activity, Percent,
  Shield, Key, Lock as LockIcon, Verified,
  Globe, MapPin, Navigation, Compass,
  Phone, Smartphone, Laptop, Monitor,
  Cloud, CloudUpload, CloudDownload,
  Folder, File, FileCheck, FilePlus,
  CreditCard, DollarSign, Banknote,
  Gift, Package, ShoppingCart, ShoppingBag,
  Music, Video, Camera, Mic,
  Coffee, Utensils, Home, Car
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CarouselTemplate,
  Slide,
  SlideElement,
  TextElement,
  ShapeElement,
  ImageElement,
  ColorPalette,
  VIBRANT_PALETTES,
  FONT_FAMILIES,
  CAROUSEL_SIZES,
  CarouselSize,
  ExportOptions,
  TextStyle,
  SlideBackground,
  GradientDirection,
  ShapeType,
  StrokeCap,
  StrokeArrow,
  GroupElement,
  Spacing,
  AlignmentType,
  FlexDirection,
} from "@/lib/carousel-designer-types"

// AutoSelectInput - Input that auto-selects content on focus
const AutoSelectInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  (props, ref) => {
    return (
      <Input
        {...props}
        ref={ref}
        onFocus={(e) => {
          e.target.select()
          props.onFocus?.(e)
        }}
      />
    )
  }
)
AutoSelectInput.displayName = "AutoSelectInput"

// Stroke cap options for UI
const STROKE_CAP_OPTIONS: { id: StrokeCap; name: string; icon: string }[] = [
  { id: "none", name: "None", icon: "—" },
  { id: "round", name: "Round", icon: "●" },
  { id: "square", name: "Square", icon: "■" },
]

// Stroke arrow options for UI
const STROKE_ARROW_OPTIONS: { id: StrokeArrow; name: string; icon: string }[] = [
  { id: "none", name: "None", icon: "—" },
  { id: "line-arrow", name: "Line arrow", icon: "←" },
  { id: "triangle-arrow", name: "Triangle arrow", icon: "◀" },
  { id: "reversed-triangle", name: "Reversed triangle", icon: "▶" },
  { id: "circle-arrow", name: "Circle arrow", icon: "●" },
  { id: "diamond-arrow", name: "Diamond arrow", icon: "◆" },
]

// Text transform options for UI
const TEXT_TRANSFORM_OPTIONS: { id: TextStyle["textTransform"]; name: string; icon: string }[] = [
  { id: "none", name: "None", icon: "Aa" },
  { id: "uppercase", name: "Uppercase", icon: "AA" },
  { id: "lowercase", name: "Lowercase", icon: "aa" },
  { id: "capitalize", name: "Capitalize", icon: "Aa" },
]

// Shape type definitions for UI
const SHAPE_TYPES: { id: ShapeType; name: string; icon: typeof Square }[] = [
  { id: "rectangle", name: "Rectangle", icon: Square },
  { id: "rounded-rectangle", name: "Rounded Rectangle", icon: RectangleHorizontal },
  { id: "circle", name: "Circle", icon: Circle },
  { id: "ellipse", name: "Ellipse", icon: Circle },
  { id: "triangle", name: "Triangle", icon: Triangle },
  { id: "diamond", name: "Diamond", icon: Diamond },
  { id: "hexagon", name: "Hexagon", icon: Hexagon },
  { id: "star", name: "Star", icon: Star },
  { id: "line", name: "Line", icon: LineIcon },
  { id: "arrow", name: "Arrow", icon: ArrowRight },
]

// Sticker categories for professional templates
type StickerCategory = "arrows" | "badges" | "icons" | "social" | "business" | "misc"

interface StickerDef {
  id: string
  name: string
  icon: typeof Square
  category: StickerCategory
  defaultColor: string
}

const STICKER_CATEGORIES: { id: StickerCategory; name: string }[] = [
  { id: "arrows", name: "Arrows" },
  { id: "badges", name: "Badges" },
  { id: "icons", name: "Icons" },
  { id: "social", name: "Social" },
  { id: "business", name: "Business" },
  { id: "misc", name: "Misc" },
]

const STICKERS: StickerDef[] = [
  // Arrows
  { id: "arrow-right", name: "Arrow Right", icon: ArrowRight, category: "arrows", defaultColor: "#000000" },
  { id: "arrow-left", name: "Arrow Left", icon: ArrowLeft, category: "arrows", defaultColor: "#000000" },
  { id: "arrow-up", name: "Arrow Up", icon: ArrowUp, category: "arrows", defaultColor: "#000000" },
  { id: "arrow-down", name: "Arrow Down", icon: ArrowDown, category: "arrows", defaultColor: "#000000" },
  { id: "arrow-up-right", name: "Arrow Up Right", icon: ArrowUpRight, category: "arrows", defaultColor: "#000000" },
  { id: "arrow-down-right", name: "Arrow Down Right", icon: ArrowDownRight, category: "arrows", defaultColor: "#000000" },
  { id: "trending-up", name: "Trending Up", icon: TrendingUp, category: "arrows", defaultColor: "#22C55E" },
  { id: "trending-down", name: "Trending Down", icon: TrendingDown, category: "arrows", defaultColor: "#EF4444" },
  
  // Badges/Awards
  { id: "check-circle", name: "Check Circle", icon: CheckCircle, category: "badges", defaultColor: "#22C55E" },
  { id: "check", name: "Checkmark", icon: Check, category: "badges", defaultColor: "#22C55E" },
  { id: "x-mark", name: "X Mark", icon: X, category: "badges", defaultColor: "#EF4444" },
  { id: "star", name: "Star", icon: Star, category: "badges", defaultColor: "#F59E0B" },
  { id: "award", name: "Award", icon: Award, category: "badges", defaultColor: "#F59E0B" },
  { id: "trophy", name: "Trophy", icon: Trophy, category: "badges", defaultColor: "#F59E0B" },
  { id: "verified", name: "Verified", icon: Verified, category: "badges", defaultColor: "#3B82F6" },
  { id: "shield", name: "Shield", icon: Shield, category: "badges", defaultColor: "#3B82F6" },
  
  // Icons
  { id: "lightbulb", name: "Lightbulb", icon: Lightbulb, category: "icons", defaultColor: "#F59E0B" },
  { id: "zap", name: "Lightning", icon: Zap, category: "icons", defaultColor: "#F59E0B" },
  { id: "rocket", name: "Rocket", icon: Rocket, category: "icons", defaultColor: "#8B5CF6" },
  { id: "target", name: "Target", icon: Target, category: "icons", defaultColor: "#EF4444" },
  { id: "flag", name: "Flag", icon: Flag, category: "icons", defaultColor: "#EF4444" },
  { id: "bookmark", name: "Bookmark", icon: Bookmark, category: "icons", defaultColor: "#3B82F6" },
  { id: "bell", name: "Bell", icon: Bell, category: "icons", defaultColor: "#F59E0B" },
  { id: "info", name: "Info", icon: Info, category: "icons", defaultColor: "#3B82F6" },
  { id: "alert", name: "Alert", icon: AlertCircle, category: "icons", defaultColor: "#F59E0B" },
  { id: "help", name: "Help", icon: HelpCircle, category: "icons", defaultColor: "#6B7280" },
  
  // Social
  { id: "heart", name: "Heart", icon: Heart, category: "social", defaultColor: "#EF4444" },
  { id: "thumbs-up", name: "Thumbs Up", icon: ThumbsUp, category: "social", defaultColor: "#3B82F6" },
  { id: "thumbs-down", name: "Thumbs Down", icon: ThumbsDown, category: "social", defaultColor: "#6B7280" },
  { id: "message-circle", name: "Comment", icon: MessageCircle, category: "social", defaultColor: "#3B82F6" },
  { id: "message-square", name: "Message", icon: MessageSquare, category: "social", defaultColor: "#3B82F6" },
  { id: "send", name: "Send", icon: Send, category: "social", defaultColor: "#3B82F6" },
  { id: "users", name: "Users", icon: Users, category: "social", defaultColor: "#6B7280" },
  { id: "user", name: "User", icon: User, category: "social", defaultColor: "#6B7280" },
  
  // Business
  { id: "briefcase", name: "Briefcase", icon: Briefcase, category: "business", defaultColor: "#6B7280" },
  { id: "building", name: "Building", icon: Building2, category: "business", defaultColor: "#6B7280" },
  { id: "calendar", name: "Calendar", icon: Calendar, category: "business", defaultColor: "#3B82F6" },
  { id: "clock", name: "Clock", icon: Clock, category: "business", defaultColor: "#6B7280" },
  { id: "bar-chart", name: "Bar Chart", icon: BarChart2, category: "business", defaultColor: "#3B82F6" },
  { id: "pie-chart", name: "Pie Chart", icon: PieChart, category: "business", defaultColor: "#8B5CF6" },
  { id: "percent", name: "Percent", icon: Percent, category: "business", defaultColor: "#22C55E" },
  { id: "dollar", name: "Dollar", icon: DollarSign, category: "business", defaultColor: "#22C55E" },
  
  // Misc
  { id: "globe", name: "Globe", icon: Globe, category: "misc", defaultColor: "#3B82F6" },
  { id: "map-pin", name: "Location", icon: MapPin, category: "misc", defaultColor: "#EF4444" },
  { id: "gift", name: "Gift", icon: Gift, category: "misc", defaultColor: "#EC4899" },
  { id: "coffee", name: "Coffee", icon: Coffee, category: "misc", defaultColor: "#92400E" },
  { id: "home", name: "Home", icon: Home, category: "misc", defaultColor: "#6B7280" },
  { id: "laptop", name: "Laptop", icon: Laptop, category: "misc", defaultColor: "#6B7280" },
]

// Group stickers by category for UI
const PROFESSIONAL_STICKERS = STICKER_CATEGORIES.map(cat => ({
  category: cat.name,
  stickers: STICKERS.filter(s => s.category === cat.id)
}))

// Pattern type definitions
type PatternType = "dots" | "lines" | "grid" | "diagonal" | "waves" | "zigzag" | "crosshatch" | "circles"
const PATTERN_TYPES: { id: PatternType; name: string }[] = [
  { id: "dots", name: "Dots" },
  { id: "lines", name: "Lines" },
  { id: "grid", name: "Grid" },
  { id: "diagonal", name: "Diagonal" },
  { id: "waves", name: "Waves" },
  { id: "zigzag", name: "Zigzag" },
  { id: "crosshatch", name: "Crosshatch" },
  { id: "circles", name: "Circles" },
]

import {
  PROFESSIONAL_TEMPLATES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_STYLES,
  getTemplateById,
  filterTemplatesByCategory,
  getTemplatesByStyle,
  createBlankTemplate,
  duplicateTemplate,
} from "@/lib/carousel-templates"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// ─────────────────────────────────────────────────────────────────────────────────
// Helper: Scale template elements for different dimensions
// Scales element positions and sizes proportionally when changing carousel size
// Uses uniform scaling to prevent distortion and repositions elements to fit
// ─────────────────────────────────────────────────────────────────────────────────

const scaleTemplateForSize = (
  template: CarouselTemplate, 
  targetSize: CarouselSize,
  sourceSize?: CarouselSize // Optional: specify source size explicitly
): CarouselTemplate => {
  const target = CAROUSEL_SIZES[targetSize]
  // Use provided source size, or fall back to template's current size
  const source = CAROUSEL_SIZES[sourceSize || template.size]
  
  // If source and target are the same, just update the size
  if (source.width === target.width && source.height === target.height) {
    return { ...template, size: targetSize }
  }
  
  // Calculate scale factors from source size to target size
  const scaleX = target.width / source.width
  const scaleY = target.height / source.height
  
  // Use the minimum scale factor to ensure content fits (uniform scaling)
  const uniformScale = Math.min(scaleX, scaleY)
  
  // Calculate the scaled content area dimensions
  const scaledContentWidth = source.width * uniformScale
  const scaledContentHeight = source.height * uniformScale
  
  // Calculate offsets to center the scaled content in the new canvas
  const offsetX = (target.width - scaledContentWidth) / 2
  const offsetY = (target.height - scaledContentHeight) / 2
  
  // Helper to check if element is a full-canvas background element
  const isFullCanvasElement = (el: SlideElement) => {
    // Element is considered "full canvas" if it covers most of the source canvas
    const coversWidth = el.width >= source.width * 0.9
    const coversHeight = el.height >= source.height * 0.9
    const startsNearOrigin = el.x <= source.width * 0.1 && el.y <= source.height * 0.1
    return coversWidth && coversHeight && startsNearOrigin
  }
  
  // Scale elements in each slide
  const scaledSlides: Slide[] = template.slides.map(slide => ({
    ...slide,
    elements: slide.elements.map(element => {
      // Check if this is a full-canvas background element (like background shapes)
      if (isFullCanvasElement(element)) {
        // For full-canvas elements, scale to fill the target canvas
        const scaledElement = {
          ...element,
          x: 0,
          y: 0,
          width: target.width,
          height: target.height,
        }
        
        // Scale stroke width for shapes
        if (element.type === "shape") {
          const shapeElement = scaledElement as ShapeElement
          if (shapeElement.strokeWidth) {
            shapeElement.strokeWidth = Math.round(shapeElement.strokeWidth * uniformScale)
          }
          if (shapeElement.borderRadius) {
            shapeElement.borderRadius = Math.round(shapeElement.borderRadius * uniformScale)
          }
        }
        
        return scaledElement
      }
      
      // For regular elements, scale uniformly and center
      const scaledElement = {
        ...element,
        x: Math.round(element.x * uniformScale + offsetX),
        y: Math.round(element.y * uniformScale + offsetY),
        width: Math.round(element.width * uniformScale),
        height: Math.round(element.height * uniformScale),
      }
      
      // Ensure elements stay within bounds
      scaledElement.x = Math.max(0, Math.min(scaledElement.x, target.width - scaledElement.width))
      scaledElement.y = Math.max(0, Math.min(scaledElement.y, target.height - scaledElement.height))
      
      // Scale font size for text elements
      if (element.type === "text" || element.type === "heading" || element.type === "subheading" || element.type === "body") {
        const textElement = scaledElement as TextElement
        textElement.style = {
          ...textElement.style,
          fontSize: Math.round((textElement.style?.fontSize || 24) * uniformScale),
        }
        // Also scale padding if present
        if (textElement.padding) {
          textElement.padding = {
            top: Math.round(textElement.padding.top * uniformScale),
            right: Math.round(textElement.padding.right * uniformScale),
            bottom: Math.round(textElement.padding.bottom * uniformScale),
            left: Math.round(textElement.padding.left * uniformScale),
          }
        }
      }
      
      // Scale stroke width for shapes
      if (element.type === "shape") {
        const shapeElement = scaledElement as ShapeElement
        if (shapeElement.strokeWidth) {
          shapeElement.strokeWidth = Math.round(shapeElement.strokeWidth * uniformScale)
        }
        if (shapeElement.borderRadius) {
          shapeElement.borderRadius = Math.round(shapeElement.borderRadius * uniformScale)
        }
      }
      
      return scaledElement
    }),
  }))
  
  return {
    ...template,
    size: targetSize,
    slides: scaledSlides,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════════════════════════════════════════

interface TemplatePickerProps {
  onSelect: (template: CarouselTemplate) => void
  onCreateNew: () => void
}

function TemplatePicker({ onSelect, onCreateNew }: TemplatePickerProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const templates = filterTemplatesByCategory(activeCategory)

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Create Custom Option */}
      <div 
        className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
        onClick={onCreateNew}
      >
        <PlusCircle className="h-12 w-12 mx-auto mb-3 text-primary/50" />
        <h3 className="font-semibold text-lg">Create Custom Template</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Start from scratch with a blank canvas
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => onSelect(template)}
          >
            {/* Template Preview */}
            <div 
              className="aspect-square relative"
              style={{
                background: template.slides[0]?.background?.type === "gradient" && template.slides[0]?.background?.gradient
                  ? `linear-gradient(${getGradientAngle(template.slides[0].background.gradient.direction)}, ${template.slides[0].background.gradient.from}, ${template.slides[0].background.gradient.to})`
                  : (template.slides[0]?.background?.color || template.palette?.colors?.background || "#FFFFFF"),
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <Type className="h-8 w-8 mx-auto mb-2 opacity-50" style={{ color: template.palette.colors.text }} />
                  <span className="text-xs font-medium opacity-75" style={{ color: template.palette.colors.text }}>
                    {template.name}
                  </span>
                </div>
              </div>
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary">
                  Use Template
                </Button>
              </div>
            </div>
            {/* Template Info */}
            <div className="p-3 bg-card">
              <h4 className="font-medium text-sm truncate">{template.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{template.description}</p>
              <div className="flex gap-1 mt-2">
                {template.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function for gradient angle
function getGradientAngle(direction: GradientDirection): string {
  const angles: Record<GradientDirection, string> = {
    "to-r": "90deg",
    "to-l": "270deg",
    "to-t": "0deg",
    "to-b": "180deg",
    "to-tr": "45deg",
    "to-tl": "315deg",
    "to-br": "135deg",
    "to-bl": "225deg",
  }
  return angles[direction]
}

// Color Picker Component with RGBA support
interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
  showAlpha?: boolean
}

// Helper: Convert hex to RGBA
function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: result[4] ? parseInt(result[4], 16) / 255 : 1,
    }
  }
  // Try parsing rgba format
  const rgbaMatch = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(hex)
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
    }
  }
  return { r: 0, g: 0, b: 0, a: 1 }
}

// Helper: Convert RGBA to string
function rgbaToString(r: number, g: number, b: number, a: number): string {
  if (a === 1) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`
}

function ColorPicker({ color, onChange, label, showAlpha = true }: ColorPickerProps) {
  const presetColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FF6B35", "#0A66C2", "#7B2CBF", "#2D6A4F",
    "#FF6B6B", "#00F5D4", "#B76E79", "#0077B6", "#F7C59F", "#9D4EDD",
  ]

  const rgba = hexToRgba(color)
  const [r, setR] = useState(rgba.r)
  const [g, setG] = useState(rgba.g)
  const [b, setB] = useState(rgba.b)
  const [a, setA] = useState(rgba.a)

  // Sync with external color changes
  useEffect(() => {
    const newRgba = hexToRgba(color)
    setR(newRgba.r)
    setG(newRgba.g)
    setB(newRgba.b)
    setA(newRgba.a)
  }, [color])

  const updateColor = (newR: number, newG: number, newB: number, newA: number) => {
    setR(newR)
    setG(newG)
    setB(newB)
    setA(newA)
    onChange(rgbaToString(newR, newG, newB, newA))
  }

  // Get hex color for the native color picker (without alpha)
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <div 
            className="h-4 w-4 rounded border"
            style={{ backgroundColor: color }}
          />
          <span className="truncate">{label || color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-1">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "h-6 w-6 rounded border transition-transform hover:scale-110",
                  color === presetColor && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  const rgba = hexToRgba(presetColor)
                  updateColor(rgba.r, rgba.g, rgba.b, a)
                }}
              />
            ))}
          </div>
          <Separator />
          <div className="flex gap-2">
            <Input
              type="color"
              value={hexColor}
              onChange={(e) => {
                const rgba = hexToRgba(e.target.value)
                updateColor(rgba.r, rgba.g, rgba.b, a)
              }}
              className="w-12 h-8 p-0 border-0"
            />
            <AutoSelectInput
              value={color}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 h-8"
            />
          </div>
          {/* RGBA Controls */}
          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-center block">R</Label>
              <AutoSelectInput
                type="number"
                min={0}
                max={255}
                value={r}
                onChange={(e) => updateColor(Math.min(255, Math.max(0, Number(e.target.value))), g, b, a)}
                className="h-8 text-center px-1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-center block">G</Label>
              <AutoSelectInput
                type="number"
                min={0}
                max={255}
                value={g}
                onChange={(e) => updateColor(r, Math.min(255, Math.max(0, Number(e.target.value))), b, a)}
                className="h-8 text-center px-1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-center block">B</Label>
              <AutoSelectInput
                type="number"
                min={0}
                max={255}
                value={b}
                onChange={(e) => updateColor(r, g, Math.min(255, Math.max(0, Number(e.target.value))), a)}
                className="h-8 text-center px-1"
              />
            </div>
            {showAlpha && (
              <div className="space-y-1">
                <Label className="text-xs text-center block">A</Label>
                <AutoSelectInput
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={a.toFixed(2)}
                  onChange={(e) => updateColor(r, g, b, Math.min(1, Math.max(0, Number(e.target.value))))}
                  className="h-8 text-center px-1"
                />
              </div>
            )}
          </div>
          {showAlpha && (
            <div className="space-y-1">
              <Label className="text-xs">Opacity ({Math.round(a * 100)}%)</Label>
              <Slider
                value={[a * 100]}
                onValueChange={([v]) => updateColor(r, g, b, v / 100)}
                min={0}
                max={100}
                step={1}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Spacing Control Component (for padding/margin)
interface SpacingControlProps {
  label: string
  value: Spacing
  onChange: (spacing: Spacing) => void
  maxValue?: number
}

function SpacingControl({ label, value, onChange, maxValue = 100 }: SpacingControlProps) {
  const [linked, setLinked] = useState(
    value.top === value.right && value.right === value.bottom && value.bottom === value.left
  )

  const updateAll = (newValue: number) => {
    onChange({ top: newValue, right: newValue, bottom: newValue, left: newValue })
  }

  const updateSingle = (side: keyof Spacing, newValue: number) => {
    onChange({ ...value, [side]: newValue })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={linked ? "default" : "outline"}
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setLinked(!linked)
                if (!linked) {
                  // When linking, set all to the top value
                  updateAll(value.top)
                }
              }}
            >
              <Link className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{linked ? "Unlink values" : "Link all values"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {linked ? (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">All sides ({value.top}px)</Label>
          <Slider
            value={[value.top]}
            onValueChange={([v]) => updateAll(v)}
            min={0}
            max={maxValue}
            step={1}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <ChevronUp className="h-3 w-3" /> Top
            </Label>
            <AutoSelectInput
              type="number"
              min={0}
              max={maxValue}
              value={value.top}
              onChange={(e) => updateSingle("top", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <ChevronRight className="h-3 w-3" /> Right
            </Label>
            <AutoSelectInput
              type="number"
              min={0}
              max={maxValue}
              value={value.right}
              onChange={(e) => updateSingle("right", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <ChevronDown className="h-3 w-3" /> Bottom
            </Label>
            <AutoSelectInput
              type="number"
              min={0}
              max={maxValue}
              value={value.bottom}
              onChange={(e) => updateSingle("bottom", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <ChevronLeft className="h-3 w-3" /> Left
            </Label>
            <AutoSelectInput
              type="number"
              min={0}
              max={maxValue}
              value={value.left}
              onChange={(e) => updateSingle("left", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Palette Picker Component
interface PalettePickerProps {
  selected: ColorPalette
  onSelect: (palette: ColorPalette) => void
  originalPalette?: ColorPalette | null
}

function PalettePicker({ selected, onSelect, originalPalette }: PalettePickerProps) {
  const [showCustomCreator, setShowCustomCreator] = React.useState(false)
  
  // When showing custom creator, render the inline component
  if (showCustomCreator) {
    return (
      <InlineCustomPaletteCreator
        currentPalette={selected}
        onApply={onSelect}
        onClose={() => setShowCustomCreator(false)}
      />
    )
  }
  
  // Default view: palette grid
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {VIBRANT_PALETTES.map((palette) => (
          <button
            key={palette.id}
            className={cn(
              "p-2 rounded-lg border transition-all hover:shadow-md",
              selected.id === palette.id && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(palette)}
          >
            <div className="flex gap-1 mb-2">
              {Object.values(palette.colors).slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs font-medium">{palette.name}</span>
          </button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <CustomPaletteCreatorTrigger onClick={() => setShowCustomCreator(true)} />
        
        {originalPalette && selected.id !== originalPalette.id && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSelect(originalPalette)}
              >
                <Undo className="h-4 w-4 mr-1" />
                Revert
              </Button>
            </TooltipTrigger>
            <TooltipContent>Revert to original template palette</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

// Pattern Generator Helper - creates SVG patterns
function generatePatternSVG(
  type: PatternType,
  color: string,
  scale: number = 1,
  opacity: number = 0.3
): string {
  const size = 20 * scale
  const halfSize = size / 2
  
  // Create SVG patterns with proper encoding
  const createSvg = (content: string, width: number = size, height: number = size) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${content}</svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }
  
  switch (type) {
    case "dots":
      return createSvg(`<circle cx='${halfSize}' cy='${halfSize}' r='${size * 0.15}' fill='${color}' fill-opacity='${opacity}'/>`)
    case "lines":
      return createSvg(`<line x1='0' y1='${halfSize}' x2='${size}' y2='${halfSize}' stroke='${color}' stroke-width='${size * 0.1}' stroke-opacity='${opacity}'/>`)
    case "grid":
      return createSvg(`<path d='M ${size} 0 L 0 0 0 ${size}' fill='none' stroke='${color}' stroke-width='${size * 0.05}' stroke-opacity='${opacity}'/>`)
    case "diagonal":
      return createSvg(`<line x1='0' y1='0' x2='${size}' y2='${size}' stroke='${color}' stroke-width='${size * 0.08}' stroke-opacity='${opacity}'/>`)
    case "waves":
      return createSvg(`<path d='M 0 ${halfSize} Q ${halfSize} 0 ${size} ${halfSize} T ${size * 2} ${halfSize}' fill='none' stroke='${color}' stroke-width='${size * 0.1}' stroke-opacity='${opacity}'/>`, size * 2, size)
    case "zigzag":
      return createSvg(`<path d='M 0 ${halfSize} L ${halfSize * 0.5} 0 L ${halfSize * 1.5} ${size} L ${size} ${halfSize}' fill='none' stroke='${color}' stroke-width='${size * 0.08}' stroke-opacity='${opacity}'/>`)
    case "crosshatch":
      return createSvg(`<line x1='0' y1='0' x2='${size}' y2='${size}' stroke='${color}' stroke-width='${size * 0.05}' stroke-opacity='${opacity}'/><line x1='${size}' y1='0' x2='0' y2='${size}' stroke='${color}' stroke-width='${size * 0.05}' stroke-opacity='${opacity}'/>`)
    case "circles":
      return createSvg(`<circle cx='${halfSize}' cy='${halfSize}' r='${size * 0.35}' fill='none' stroke='${color}' stroke-width='${size * 0.08}' stroke-opacity='${opacity}'/>`)
    default:
      return createSvg(`<circle cx='${halfSize}' cy='${halfSize}' r='${size * 0.15}' fill='${color}' fill-opacity='${opacity}'/>`)
  }
}

// Pattern Picker Component
interface PatternPickerProps {
  pattern: { type: PatternType; color: string; scale: number; opacity: number } | null
  onChange: (pattern: { type: PatternType; color: string; scale: number; opacity: number } | null) => void
}

function PatternPicker({ pattern, onChange }: PatternPickerProps) {
  const [enabled, setEnabled] = useState(!!pattern)
  const [type, setType] = useState<PatternType>(pattern?.type || "dots")
  const [color, setColor] = useState(pattern?.color || "#000000")
  const [scale, setScale] = useState(pattern?.scale || 1)
  const [opacity, setOpacity] = useState(pattern?.opacity || 0.3)

  useEffect(() => {
    if (enabled) {
      onChange({ type, color, scale, opacity })
    } else {
      onChange(null)
    }
  }, [enabled, type, color, scale, opacity])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Enable Pattern</Label>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
      
      {enabled && (
        <>
          {/* Pattern Preview */}
          <div 
            className="h-16 rounded border"
            style={{
              backgroundColor: '#f0f0f0',
              backgroundImage: generatePatternSVG(type, color, scale, opacity),
            }}
          />
          
          {/* Pattern Type */}
          <div className="space-y-1">
            <Label className="text-xs">Pattern Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as PatternType)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PATTERN_TYPES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Pattern Color */}
          <div className="space-y-1">
            <Label className="text-xs">Pattern Color</Label>
            <ColorPicker color={color} onChange={setColor} showAlpha={false} />
          </div>
          
          {/* Scale */}
          <div className="space-y-1">
            <Label className="text-xs">Scale ({scale.toFixed(1)}x)</Label>
            <Slider
              value={[scale]}
              onValueChange={([v]) => setScale(v)}
              min={0.5}
              max={3}
              step={0.1}
            />
          </div>
          
          {/* Opacity */}
          <div className="space-y-1">
            <Label className="text-xs">Opacity ({Math.round(opacity * 100)}%)</Label>
            <Slider
              value={[opacity * 100]}
              onValueChange={([v]) => setOpacity(v / 100)}
              min={5}
              max={100}
              step={5}
            />
          </div>
        </>
      )}
    </div>
  )
}

// Layers Panel Component with Element Previews
interface LayersPanelProps {
  elements: SlideElement[]
  selectedElementId: string | null
  selectedElementIds: Set<string>
  onSelectElement: (id: string) => void
  onUpdateElement: (elementId: string, updates: Partial<SlideElement>) => void
  onReorderElements: (fromIndex: number, toIndex: number) => void
}

function LayersPanel({
  elements,
  selectedElementId,
  selectedElementIds,
  onSelectElement,
  onUpdateElement,
  onReorderElements,
}: LayersPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  
  // Sort elements by zIndex (highest first for layer view)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex)
  
  const renderElementPreview = (element: SlideElement) => {
    const isSelected = element.id === selectedElementId || selectedElementIds.has(element.id)
    const isGrouped = Boolean(element.groupId)
    
    // Generate preview based on element type
    const getPreviewContent = () => {
      switch (element.type) {
        case "text":
        case "heading":
        case "subheading":
        case "body":
        case "quote": {
          const textEl = element as TextElement
          return (
            <div 
              className="w-full h-full flex items-center justify-center p-1 overflow-hidden"
              style={{
                fontFamily: textEl.style.fontFamily,
                fontSize: Math.min(10, textEl.style.fontSize * 0.2),
                fontWeight: textEl.style.fontWeight,
                color: textEl.style.color,
                textAlign: textEl.style.textAlign as any,
              }}
            >
              <span className="truncate text-[8px] leading-tight">
                {textEl.content.substring(0, 50)}
              </span>
            </div>
          )
        }
        case "shape": {
          const shapeEl = element as ShapeElement
          if (shapeEl.isSticker && shapeEl.stickerIcon) {
            // For stickers, try to render the icon
            const iconName = shapeEl.stickerIcon
            return (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ color: shapeEl.fill }}
              >
                <span className="text-lg">{iconName === "ArrowRight" ? "→" : iconName === "Heart" ? "♥" : "◆"}</span>
              </div>
            )
          }
          // For shapes, show a colored preview
          return (
            <div 
              className="w-full h-full flex items-center justify-center"
            >
              {shapeEl.shapeType === "circle" || shapeEl.shapeType === "ellipse" ? (
                <div 
                  className="w-8 h-8 rounded-full border"
                  style={{ 
                    backgroundColor: shapeEl.fill,
                    borderColor: shapeEl.stroke,
                    borderWidth: shapeEl.strokeWidth > 0 ? 1 : 0,
                  }}
                />
              ) : shapeEl.shapeType === "triangle" ? (
                <div 
                  className="w-0 h-0"
                  style={{
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderBottom: `20px solid ${shapeEl.fill}`,
                  }}
                />
              ) : shapeEl.shapeType === "line" || shapeEl.shapeType === "arrow" ? (
                <div className="flex items-center justify-center w-full">
                  <div 
                    className="h-0.5 w-10"
                    style={{ backgroundColor: shapeEl.stroke || shapeEl.fill }}
                  />
                  {shapeEl.shapeType === "arrow" && (
                    <div className="text-xs" style={{ color: shapeEl.stroke || shapeEl.fill }}>→</div>
                  )}
                </div>
              ) : (
                <div 
                  className="w-10 h-8 border"
                  style={{ 
                    backgroundColor: shapeEl.fill,
                    borderColor: shapeEl.stroke,
                    borderWidth: shapeEl.strokeWidth > 0 ? 1 : 0,
                    borderRadius: shapeEl.shapeType === "rounded-rectangle" ? 4 : 0,
                  }}
                />
              )}
            </div>
          )
        }
        case "image": {
          const imgEl = element as ImageElement
          return (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              {imgEl.src ? (
                <img 
                  src={imgEl.src} 
                  alt="" 
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )
        }
        default:
          return (
            <div className="w-full h-full flex items-center justify-center">
              <Square className="h-4 w-4 text-muted-foreground" />
            </div>
          )
      }
    }
    
    const getElementLabel = () => {
      switch (element.type) {
        case "text":
        case "heading":
        case "subheading":
        case "body":
        case "quote":
          return (element as TextElement).content.substring(0, 20) + ((element as TextElement).content.length > 20 ? "..." : "")
        case "shape":
          const shapeEl = element as ShapeElement
          if (shapeEl.isSticker) return shapeEl.stickerIcon || "Sticker"
          return shapeEl.shapeType.replace("-", " ")
        case "image":
          return "Image"
        default:
          return element.type
      }
    }
    
    return (
      <div
        key={element.id}
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all hover:bg-accent",
          isSelected && "ring-2 ring-primary bg-primary/5",
          isGrouped && "border-blue-500/50",
          !element.visible && "opacity-50"
        )}
        onClick={() => onSelectElement(element.id)}
        draggable
        onDragStart={() => setDraggedIndex(sortedElements.indexOf(element))}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (draggedIndex !== null) {
            const toIndex = sortedElements.indexOf(element)
            if (draggedIndex !== toIndex) {
              onReorderElements(
                elements.indexOf(sortedElements[draggedIndex]),
                elements.indexOf(sortedElements[toIndex])
              )
            }
          }
          setDraggedIndex(null)
        }}
      >
        {/* Drag Handle */}
        <div className="cursor-grab text-muted-foreground">
          <Grip className="h-4 w-4" />
        </div>
        
        {/* Preview Thumbnail */}
        <div className="w-12 h-12 bg-muted rounded border flex-shrink-0 overflow-hidden">
          {getPreviewContent()}
        </div>
        
        {/* Element Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate capitalize">
            {element.type}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {getElementLabel()}
          </p>
          {isGrouped && (
            <div className="flex items-center gap-1 mt-0.5">
              <Group className="h-2.5 w-2.5 text-blue-500" />
              <span className="text-[9px] text-blue-500">Grouped</span>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateElement(element.id, { visible: !element.visible })
                }}
              >
                {element.visible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {element.visible ? "Hide" : "Show"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateElement(element.id, { locked: !element.locked })
                }}
              >
                {element.locked ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Unlock className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {element.locked ? "Unlock" : "Lock"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    )
  }
  
  if (elements.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No elements yet</p>
        <p className="text-[10px] mt-1">Add elements from the left panel</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-2 p-2">
      {sortedElements.map(renderElementPreview)}
    </div>
  )
}

// Slide Canvas Component
interface SlideCanvasProps {
  slide: Slide
  template: CarouselTemplate
  selectedElementId: string | null
  selectedElementIds: Set<string> // Multi-selection
  onSelectElement: (id: string | null, addToSelection?: boolean) => void
  onUpdateElement: (elementId: string, updates: Partial<SlideElement>) => void
  zoom: number
  showGrid: boolean
  showGuides?: boolean
  previewMode?: boolean
}

function SlideCanvas({ 
  slide, 
  template, 
  selectedElementId, 
  selectedElementIds,
  onSelectElement,
  onUpdateElement,
  zoom, 
  showGrid,
  showGuides = true,
  previewMode = false
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const size = CAROUSEL_SIZES[template.size]
  const scaleFactor = zoom / 100
  
  // State for inline text editing
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const editInputRef = useRef<HTMLTextAreaElement>(null)
  
  // Alignment guides state
  const [guides, setGuides] = useState<{ x?: number; y?: number; centerX?: boolean; centerY?: boolean }>({})

  const renderBackground = (bg: SlideBackground): React.CSSProperties => {
    if (bg.type === "solid") {
      return { backgroundColor: bg.color }
    }
    if (bg.type === "gradient" && bg.gradient) {
      return {
        backgroundImage: `linear-gradient(${getGradientAngle(bg.gradient.direction)}, ${bg.gradient.from}, ${bg.gradient.to})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    if (bg.type === "image" && bg.image) {
      return {
        backgroundImage: `url(${bg.image.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }
    if (bg.type === "pattern" && bg.pattern) {
      const patternSvg = generatePatternSVG(
        bg.pattern.type as PatternType, 
        bg.pattern.color, 
        bg.pattern.scale, 
        bg.pattern.opacity
      )
      return {
        backgroundColor: bg.color || "#FFFFFF",
        backgroundImage: patternSvg,
      }
    }
    return { backgroundColor: "#FFFFFF" }
  }

  const draggingRef = useRef<null | {
    id: string
    startX: number
    startY: number
    elStartX: number
    elStartY: number
  }>(null)

  const resizingRef = useRef<null | {
    id: string
    handle: string
    startX: number
    startY: number
    startW: number
    startH: number
    startElX: number
    startElY: number
    startFontSize?: number
    ctrlKey?: boolean // Track if Ctrl was held during resize start
  }>(null)

  const rotatingRef = useRef<null | {
    id: string
    centerX: number
    centerY: number
    startAngle: number
    elStartRotation: number
  }>(null)

  // pointer move/up handlers attached to window so drag continues even if pointer leaves canvas
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const dr = draggingRef.current
      const rr = resizingRef.current
      const rot = rotatingRef.current
      if (!dr && !rr && !rot) return
      const sf = scaleFactor

      // Handle rotation
      if (rot) {
        const element = slide.elements.find(el => el.id === rot.id)
        if (element) {
          const rect = canvasRef.current?.getBoundingClientRect()
          if (rect) {
            const elementCenterX = rect.left + (element.x + element.width / 2) * sf
            const elementCenterY = rect.top + (element.y + element.height / 2) * sf
            const currentAngle = Math.atan2(e.clientY - elementCenterY, e.clientX - elementCenterX) * (180 / Math.PI)
            const deltaAngle = currentAngle - rot.startAngle
            let newRotation = Math.round(rot.elStartRotation + deltaAngle)
            // Normalize to 0-360
            while (newRotation < 0) newRotation += 360
            while (newRotation >= 360) newRotation -= 360
            // Snap to 45 degree increments if close
            const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315]
            for (const snapAngle of snapAngles) {
              if (Math.abs(newRotation - snapAngle) < 5) {
                newRotation = snapAngle
                break
              }
            }
            onUpdateElement(rot.id, { rotation: newRotation })
          }
        }
        return
      }

      if (dr) {
        const dx = (e.clientX - dr.startX) / sf
        const dy = (e.clientY - dr.startY) / sf
        let newX = Math.max(0, Math.round(dr.elStartX + dx))
        let newY = Math.max(0, Math.round(dr.elStartY + dy))
        
        // Calculate element center
        const element = slide.elements.find(el => el.id === dr.id)
        if (element && showGuides) {
          const centerX = newX + element.width / 2
          const centerY = newY + element.height / 2
          const canvasCenterX = size.width / 2
          const canvasCenterY = size.height / 2
          
          // Snap to center with 10px threshold
          const snapThreshold = 10
          const newGuides: typeof guides = {}
          
          if (Math.abs(centerX - canvasCenterX) < snapThreshold) {
            newX = canvasCenterX - element.width / 2
            newGuides.x = canvasCenterX
            newGuides.centerX = true
          }
          if (Math.abs(centerY - canvasCenterY) < snapThreshold) {
            newY = canvasCenterY - element.height / 2
            newGuides.y = canvasCenterY
            newGuides.centerY = true
          }
          setGuides(newGuides)
        }
        
        onUpdateElement(dr.id, { x: newX, y: newY })
      }

      if (rr) {
        const dx = (e.clientX - rr.startX) / sf
        const dy = (e.clientY - rr.startY) / sf
        let newW = Math.max(10, Math.round(rr.startW + dx))
        let newH = Math.max(10, Math.round(rr.startH + dy))
        let newX = rr.startElX
        let newY = rr.startElY
        // SE and NW simple behaviors
        if (rr.handle === "nw") {
          newW = Math.max(10, Math.round(rr.startW - dx))
          newH = Math.max(10, Math.round(rr.startH - dy))
          newX = Math.round(rr.startElX + dx)
          newY = Math.round(rr.startElY + dy)
        }
        
        // Calculate scale factor for text elements
        const element = slide.elements.find(el => el.id === rr.id)
        const isTextElement = element && ["text", "heading", "subheading", "body", "quote"].includes(element.type)
        
        // Check if Ctrl is currently held (allows toggle during drag)
        const ctrlHeld = e.ctrlKey || e.metaKey
        
        if (isTextElement && rr.startFontSize) {
          const textEl = element as TextElement
          
          if (ctrlHeld) {
            // Ctrl held: Only resize frame, keep font size unchanged
            onUpdateElement(rr.id, { 
              x: newX, 
              y: newY, 
              width: newW, 
              height: newH,
            })
          } else {
            // Normal resize: Scale font size proportionally based on width change
            const widthScale = newW / rr.startW
            const newFontSize = Math.round(rr.startFontSize * widthScale)
            // Clamp font size to reasonable bounds (min 8, max 500)
            const clampedFontSize = Math.max(8, Math.min(500, newFontSize))
            onUpdateElement(rr.id, { 
              x: newX, 
              y: newY, 
              width: newW, 
              height: newH,
              style: { ...textEl.style, fontSize: clampedFontSize }
            } as Partial<TextElement>)
          }
        } else {
          onUpdateElement(rr.id, { x: newX, y: newY, width: newW, height: newH })
        }
      }
    }

    const onPointerUp = () => {
      draggingRef.current = null
      resizingRef.current = null
      rotatingRef.current = null
      setGuides({}) // Clear guides when drag ends
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [scaleFactor, onUpdateElement, showGuides, slide.elements, size.width, size.height])

  const renderElement = (element: SlideElement) => {
    if (previewMode && !element.visible) return null
    
    // Check if element is in multi-selection or is the single selected element
    const isSelected = !previewMode && (element.id === selectedElementId || selectedElementIds.has(element.id))
    const isGrouped = Boolean(element.groupId)
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: element.x * scaleFactor,
      top: element.y * scaleFactor,
      width: element.width * scaleFactor,
      height: element.height * scaleFactor,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      zIndex: element.zIndex,
      cursor: previewMode ? "default" : (element.locked ? "default" : "move"),
    }

    if (!element.visible) return null

    const handleClick = (e: React.MouseEvent) => {
      if (previewMode) return
      e.stopPropagation()
      if (!element.locked) {
        // Ctrl+click to add/remove from multi-selection
        onSelectElement(element.id, e.ctrlKey || e.metaKey)
      }
    }

    const onElementPointerDown = (e: React.PointerEvent) => {
      if (previewMode) return
      // start drag unless pointer is on a resize handle
      const target = e.target as HTMLElement
      if (element.locked) return
      
      if (target.dataset && target.dataset.handle) {
        // Handle rotation
        if (target.dataset.handle === 'rotate') {
          const rect = canvasRef.current?.getBoundingClientRect()
          if (rect) {
            const elementCenterX = rect.left + (element.x + element.width / 2) * scaleFactor
            const elementCenterY = rect.top + (element.y + element.height / 2) * scaleFactor
            const startAngle = Math.atan2(e.clientY - elementCenterY, e.clientX - elementCenterX) * (180 / Math.PI)
            rotatingRef.current = {
              id: element.id,
              centerX: elementCenterX,
              centerY: elementCenterY,
              startAngle,
              elStartRotation: element.rotation,
            }
          }
          const targetEl = e.target as Element
          if (typeof (targetEl as any).setPointerCapture === 'function') {
            ;(targetEl as any).setPointerCapture((e as any).pointerId)
          }
          return
        }
        
        // start resizing
        const isTextEl = ["text", "heading", "subheading", "body", "quote"].includes(element.type)
        const startFontSize = isTextEl ? (element as TextElement).style.fontSize : undefined
        
        resizingRef.current = {
          id: element.id,
          handle: target.dataset.handle,
          startX: e.clientX,
          startY: e.clientY,
          startW: element.width,
          startH: element.height,
          startElX: element.x,
          startElY: element.y,
          startFontSize,
        }
        const targetEl = e.target as Element
        if (typeof (targetEl as any).setPointerCapture === 'function') {
          ;(targetEl as any).setPointerCapture((e as any).pointerId)
        }
        return
      }

      draggingRef.current = {
        id: element.id,
        startX: e.clientX,
        startY: e.clientY,
        elStartX: element.x,
        elStartY: element.y,
      }
      const targetEl2 = e.target as Element
      if (typeof (targetEl2 as any).setPointerCapture === 'function') {
        ;(targetEl2 as any).setPointerCapture((e as any).pointerId)
      }
    }

    // Render based on element type
    switch (element.type) {
      case "text":
      case "heading":
      case "subheading":
      case "body":
      case "quote": {
        const textEl = element as TextElement
        const isEditing = editingTextId === element.id
        
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              fontFamily: textEl.style.fontFamily,
              fontSize: textEl.style.fontSize * scaleFactor,
              fontWeight: textEl.style.fontWeight,
              lineHeight: textEl.style.lineHeight,
              letterSpacing: textEl.style.letterSpacing,
              textAlign: textEl.style.textAlign,
              color: textEl.style.color,
              textTransform: textEl.style.textTransform,
              textDecoration: textEl.style.textDecoration,
              fontStyle: textEl.style.fontStyle,
              backgroundColor: textEl.backgroundColor,
              borderRadius: textEl.borderRadius,
              padding: `${textEl.padding.top * scaleFactor}px ${textEl.padding.right * scaleFactor}px ${textEl.padding.bottom * scaleFactor}px ${textEl.padding.left * scaleFactor}px`,
              whiteSpace: "pre-wrap",
              overflow: isEditing ? "visible" : "hidden",
            }}
            onClick={handleClick}
            onPointerDown={!isEditing ? onElementPointerDown : undefined}
            onDoubleClick={(e) => {
              if (previewMode || element.locked) return
              e.stopPropagation()
              setEditingTextId(element.id)
              setTimeout(() => editInputRef.current?.focus(), 0)
            }}
            className={cn(
                "transition-shadow",
                isSelected && !isGrouped && "ring-2 ring-primary ring-offset-2",
                isSelected && isGrouped && "ring-2 ring-blue-500 ring-offset-2"
              )}
            >
              {isEditing ? (
                <textarea
                  ref={editInputRef}
                  value={textEl.content}
                  onChange={(e) => onUpdateElement(element.id, { content: e.target.value } as Partial<TextElement>)}
                  onBlur={() => setEditingTextId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setEditingTextId(null)
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                    textAlign: 'inherit',
                    color: 'inherit',
                    padding: 0,
                  }}
                  autoFocus
                />
              ) : textEl.content}
              {/* Resize handles and rotation handle */}
              {isSelected && !isEditing && (
                <>
                  <div data-handle="nw" style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, background: '#fff', border: '1px solid #ccc', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} />
                  <div data-handle="se" style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#fff', border: '1px solid #ccc', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} />
                  {/* Rotation handle */}
                  <div 
                    data-handle="rotate"
                    style={{ 
                      position: 'absolute', 
                      left: '50%', 
                      top: -30, 
                      width: 16, 
                      height: 16, 
                      marginLeft: -8,
                      background: '#fff', 
                      border: '2px solid #3b82f6', 
                      borderRadius: '50%', 
                      cursor: 'grab',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Rotate"
                  >
                    <RotateCw style={{ width: 10, height: 10, color: '#3b82f6' }} />
                  </div>
                  {/* Line connecting to rotation handle */}
                  <div style={{ position: 'absolute', left: '50%', top: -20, width: 1, height: 20, background: '#3b82f6', marginLeft: -0.5, zIndex: 9 }} />
                </>
              )}
            </div>
        )
      }
      case "shape": {
        const shapeEl = element as ShapeElement
        
        // SVG shapes for non-rectangular types
        const renderShapeSVG = () => {
          const w = element.width * scaleFactor
          const h = element.height * scaleFactor
          const fill = (shapeEl as any).backgroundImage ? `url(#img-${element.id})` : shapeEl.fill
          const stroke = shapeEl.stroke
          const strokeWidth = shapeEl.strokeWidth * scaleFactor
          
          switch (shapeEl.shapeType) {
            case "triangle":
              return (
                <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                  {(shapeEl as any).backgroundImage && (
                    <defs>
                      <pattern id={`img-${element.id}`} patternUnits="userSpaceOnUse" width={w} height={h}>
                        <image href={(shapeEl as any).backgroundImage} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
                      </pattern>
                    </defs>
                  )}
                  <polygon 
                    points={`${w/2},0 ${w},${h} 0,${h}`} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={strokeWidth}
                  />
                </svg>
              )
            case "diamond":
              return (
                <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                  {(shapeEl as any).backgroundImage && (
                    <defs>
                      <pattern id={`img-${element.id}`} patternUnits="userSpaceOnUse" width={w} height={h}>
                        <image href={(shapeEl as any).backgroundImage} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
                      </pattern>
                    </defs>
                  )}
                  <polygon 
                    points={`${w/2},0 ${w},${h/2} ${w/2},${h} 0,${h/2}`} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={strokeWidth}
                  />
                </svg>
              )
            case "hexagon":
              return (
                <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                  {(shapeEl as any).backgroundImage && (
                    <defs>
                      <pattern id={`img-${element.id}`} patternUnits="userSpaceOnUse" width={w} height={h}>
                        <image href={(shapeEl as any).backgroundImage} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
                      </pattern>
                    </defs>
                  )}
                  <polygon 
                    points={`${w*0.25},0 ${w*0.75},0 ${w},${h/2} ${w*0.75},${h} ${w*0.25},${h} 0,${h/2}`} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={strokeWidth}
                  />
                </svg>
              )
            case "star":
              const cx = w / 2
              const cy = h / 2
              const outerR = Math.min(w, h) / 2
              const innerR = outerR * 0.4
              const points: string[] = []
              for (let i = 0; i < 10; i++) {
                const r = i % 2 === 0 ? outerR : innerR
                const angle = (Math.PI / 5) * i - Math.PI / 2
                points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`)
              }
              return (
                <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                  {(shapeEl as any).backgroundImage && (
                    <defs>
                      <pattern id={`img-${element.id}`} patternUnits="userSpaceOnUse" width={w} height={h}>
                        <image href={(shapeEl as any).backgroundImage} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
                      </pattern>
                    </defs>
                  )}
                  <polygon 
                    points={points.join(' ')} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={strokeWidth}
                  />
                </svg>
              )
            case "ellipse":
              return (
                <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                  {(shapeEl as any).backgroundImage && (
                    <defs>
                      <pattern id={`img-${element.id}`} patternUnits="userSpaceOnUse" width={w} height={h}>
                        <image href={(shapeEl as any).backgroundImage} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
                      </pattern>
                    </defs>
                  )}
                  <ellipse 
                    cx={w/2} 
                    cy={h/2} 
                    rx={w/2 - strokeWidth/2} 
                    ry={h/2 - strokeWidth/2} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={strokeWidth}
                  />
                </svg>
              )
            case "line":
              return (
                <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                  <line 
                    x1={0} 
                    y1={h/2} 
                    x2={w} 
                    y2={h/2} 
                    stroke={shapeEl.fill} 
                    strokeWidth={Math.max(strokeWidth, 2)}
                  />
                </svg>
              )
            default:
              return null
          }
        }
        
        // Calculate gradient background for shapes
        const getShapeBackground = (): React.CSSProperties => {
          const styles: React.CSSProperties = {}
          
          // Priority: backgroundImage > gradient > solid fill
          if ((shapeEl as any).backgroundImage) {
            styles.backgroundImage = `url(${(shapeEl as any).backgroundImage})`
            styles.backgroundSize = 'cover'
            styles.backgroundPosition = 'center'
          } else if (shapeEl.gradient?.enabled) {
            styles.backgroundImage = `linear-gradient(${getGradientAngle(shapeEl.gradient.direction)}, ${shapeEl.gradient.from}, ${shapeEl.gradient.to})`
          } else {
            styles.backgroundColor = shapeEl.fill
          }
          
          // Add pattern overlay if present
          if ((shapeEl as any).pattern) {
            const pattern = (shapeEl as any).pattern
            const patternSvg = generatePatternSVG(pattern.type, pattern.color, pattern.scale, pattern.opacity)
            if (styles.backgroundImage) {
              styles.backgroundImage = `${patternSvg}, ${styles.backgroundImage}`
            } else {
              styles.backgroundImage = patternSvg
            }
          }
          
          return styles
        }
        
        // For rectangle, rounded-rectangle, and circle, use CSS
        if (["rectangle", "rounded-rectangle", "circle"].includes(shapeEl.shapeType)) {
          const shapeBackground = getShapeBackground()
          
          // Get sticker icon component if this is a sticker
          const getStickerIcon = () => {
            if (!shapeEl.isSticker || !shapeEl.stickerIcon) return null
            
            const allStickers = PROFESSIONAL_STICKERS.flatMap(cat => cat.stickers)
            const sticker = allStickers.find(s => s.id === shapeEl.stickerIcon)
            if (!sticker) return null
            
            const IconComponent = sticker.icon
            const iconSize = Math.min(element.width, element.height) * 0.6 * scaleFactor
            const iconColor = shapeEl.stickerColor || '#FFFFFF'
            
            return (
              <IconComponent 
                style={{ 
                  width: iconSize, 
                  height: iconSize, 
                  color: iconColor,
                  pointerEvents: 'none'
                }} 
              />
            )
          }
          
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                ...shapeBackground,
                border: shapeEl.strokeWidth > 0 ? `${shapeEl.strokeWidth * scaleFactor}px solid ${shapeEl.stroke}` : undefined,
                borderRadius: shapeEl.shapeType === "circle" ? "50%" : 
                             shapeEl.shapeType === "rounded-rectangle" ? (shapeEl.borderRadius || 8) * scaleFactor : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPointerDown={onElementPointerDown}
              onClick={handleClick}
              className={cn(
                "transition-shadow",
                isSelected && !previewMode && !isGrouped && "ring-2 ring-primary ring-offset-2",
                isSelected && !previewMode && isGrouped && "ring-2 ring-blue-500 ring-offset-2"
              )}
            >
              {getStickerIcon()}
              {!previewMode && isSelected && (
                <>
                  <div data-handle="nw" style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, background: '#fff', border: '1px solid #ccc', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} />
                  <div data-handle="se" style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#fff', border: '1px solid #ccc', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} />
                  {/* Rotation handle */}
                  <div 
                    data-handle="rotate"
                    style={{ 
                      position: 'absolute', 
                      left: '50%', 
                      top: -30, 
                      width: 16, 
                      height: 16, 
                      marginLeft: -8,
                      background: '#fff', 
                      border: '2px solid #3b82f6', 
                      borderRadius: '50%', 
                      cursor: 'grab',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Rotate"
                  >
                    <RotateCw style={{ width: 10, height: 10, color: '#3b82f6' }} />
                  </div>
                  <div style={{ position: 'absolute', left: '50%', top: -20, width: 1, height: 20, background: '#3b82f6', marginLeft: -0.5, zIndex: 9 }} />
                </>
              )}
            </div>
          )
        }
        
        // For other shapes, use SVG
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              overflow: 'visible',
            }}
            onPointerDown={onElementPointerDown}
            onClick={handleClick}
            className={cn(
              "transition-shadow",
              isSelected && !previewMode && !isGrouped && "ring-2 ring-primary ring-offset-2",
              isSelected && !previewMode && isGrouped && "ring-2 ring-blue-500 ring-offset-2"
            )}
          >
            {renderShapeSVG()}
            {!previewMode && isSelected && (
              <>
                <div data-handle="nw" style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, background: '#fff', border: '1px solid #ccc', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} />
                <div data-handle="se" style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#fff', border: '1px solid #ccc', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} />
                {/* Rotation handle */}
                <div 
                  data-handle="rotate"
                  style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: -30, 
                    width: 16, 
                    height: 16, 
                    marginLeft: -8,
                    background: '#fff', 
                    border: '2px solid #3b82f6', 
                    borderRadius: '50%', 
                    cursor: 'grab',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Rotate"
                >
                  <RotateCw style={{ width: 10, height: 10, color: '#3b82f6' }} />
                </div>
                <div style={{ position: 'absolute', left: '50%', top: -20, width: 1, height: 20, background: '#3b82f6', marginLeft: -0.5, zIndex: 9 }} />
              </>
            )}
          </div>
        )
      }
      default:
        return (
          <div
            key={element.id}
            style={baseStyle}
            onPointerDown={onElementPointerDown}
            onClick={handleClick}
            className={cn(
              "bg-muted/50 flex items-center justify-center transition-shadow",
              isSelected && !previewMode && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <span className="text-xs text-muted-foreground">{element.type}</span>
          </div>
        )
    }
  }

  return (
    <div 
      ref={canvasRef}
      className="relative mx-auto shadow-2xl"
      style={{
        width: size.width * scaleFactor,
        height: size.height * scaleFactor,
        overflow: 'hidden', // Clip content that goes out of canvas
        ...renderBackground(slide.background),
      }}
      onClick={() => !previewMode && onSelectElement(null)}
    >
      {/* Grid Overlay */}
      {showGrid && !previewMode && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * scaleFactor}px ${20 * scaleFactor}px`,
          }}
        />
      )}
      
      {/* Center Alignment Guides */}
      {showGuides && !previewMode && guides.centerX && (
        <div 
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: (size.width / 2) * scaleFactor - 1,
            width: 2,
            backgroundColor: '#3b82f6',
            zIndex: 9999,
          }}
        />
      )}
      {showGuides && !previewMode && guides.centerY && (
        <div 
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: (size.height / 2) * scaleFactor - 1,
            height: 2,
            backgroundColor: '#3b82f6',
            zIndex: 9999,
          }}
        />
      )}
      
      {/* Elements */}
      {slide.elements.map(renderElement)}
    </div>
  )
}

// Element Properties Panel
interface ElementPropertiesProps {
  element: SlideElement | null
  template: CarouselTemplate
  onUpdate: (updates: Partial<SlideElement>) => void
  onDelete: () => void
  onDuplicate: () => void
  onGroup?: () => void
  onUngroup?: () => void
  onAlign?: (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => void
  canGroup?: boolean
  canUngroup?: boolean
}

function ElementProperties({ 
  element, 
  template, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onGroup,
  onUngroup,
  onAlign,
  canGroup = false,
  canUngroup = false,
}: ElementPropertiesProps) {
  const [activeTab, setActiveTab] = useState<"properties" | "position">("properties")
  
  if (!element) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Layout className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select an element to edit its properties</p>
      </div>
    )
  }

  const isTextElement = ["text", "heading", "subheading", "body", "quote"].includes(element.type)
  const textElement = isTextElement ? element as TextElement : null

  return (
    <div className="flex flex-col h-full">
      {/* Tab Switcher */}
      <div className="p-2 border-b">
        <div className="flex gap-1 bg-muted rounded-md p-1">
          <Button
            variant={activeTab === "properties" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("properties")}
          >
            <Settings2 className="h-4 w-4 mr-1" />
            Properties
          </Button>
          <Button
            variant={activeTab === "position" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("position")}
          >
            <Move className="h-4 w-4 mr-1" />
            Position
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Element Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* Group/Ungroup Actions */}
          {(canGroup || canUngroup) && (
            <div className="flex gap-2">
              {canGroup && onGroup && (
                <Button variant="outline" size="sm" className="flex-1" onClick={onGroup}>
                  <Group className="h-4 w-4 mr-1" />
                  Group
                </Button>
              )}
              {canUngroup && onUngroup && (
                <Button variant="outline" size="sm" className="flex-1" onClick={onUngroup}>
                  <Ungroup className="h-4 w-4 mr-1" />
                  Ungroup
                </Button>
              )}
            </div>
          )}

          {/* Alignment Controls (for groups or multi-selection) */}
          {(canGroup || canUngroup) && onAlign && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Alignment</Label>
              <div className="grid grid-cols-3 gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAlign("left")}>
                      <AlignHorizontalJustifyStart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Left</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAlign("center")}>
                      <AlignHorizontalJustifyCenter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Center</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAlign("right")}>
                      <AlignHorizontalJustifyEnd className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Right</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAlign("top")}>
                      <AlignVerticalJustifyStart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Top</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAlign("middle")}>
                      <AlignVerticalJustifyCenter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Middle</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAlign("bottom")}>
                      <AlignVerticalJustifyEnd className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Bottom</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          <Separator />

          {/* Position Tab Content */}
          {activeTab === "position" && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Move className="h-4 w-4" />
                Position & Size
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">X</Label>
                  <AutoSelectInput
                    type="number"
                    value={element.x}
                    onChange={(e) => onUpdate({ x: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Y</Label>
                  <AutoSelectInput
                    type="number"
                    value={element.y}
                    onChange={(e) => onUpdate({ y: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Width</Label>
                  <AutoSelectInput
                    type="number"
                    value={element.width}
                    onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Height</Label>
                  <AutoSelectInput
                    type="number"
                    value={element.height}
                    onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Rotation ({element.rotation}°)</Label>
                <Slider
                  value={[element.rotation]}
                  onValueChange={([v]) => onUpdate({ rotation: v })}
                  min={0}
                  max={360}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Opacity ({Math.round(element.opacity * 100)}%)</Label>
                <Slider
                  value={[element.opacity * 100]}
                  onValueChange={([v]) => onUpdate({ opacity: v / 100 })}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              {/* Layer Controls */}
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Layer
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onUpdate({ zIndex: element.zIndex + 1 })}
                  >
                    <ArrowUp className="h-4 w-4 mr-1" />
                    Forward
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onUpdate({ zIndex: Math.max(0, element.zIndex - 1) })}
                  >
                    <ArrowDown className="h-4 w-4 mr-1" />
                    Backward
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={element.locked ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onUpdate({ locked: !element.locked })}
                  >
                    {element.locked ? <Lock className="h-4 w-4 mr-1" /> : <Unlock className="h-4 w-4 mr-1" />}
                    {element.locked ? "Locked" : "Unlocked"}
                  </Button>
                  <Button
                    variant={!element.visible ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onUpdate({ visible: !element.visible })}
                  >
                    {element.visible ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                    {element.visible ? "Visible" : "Hidden"}
                  </Button>
                </div>

                {/* Group Status Indicator */}
                {element.groupId && (
                  <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-md border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-500">
                      <Group className="h-4 w-4" />
                      <span className="text-xs font-medium">Grouped</span>
                    </div>
                    {onUngroup && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-blue-500 hover:text-blue-600"
                        onClick={onUngroup}
                      >
                        <Ungroup className="h-3 w-3 mr-1" />
                        Ungroup
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Properties Tab Content */}
          {activeTab === "properties" && (
            <>
              {/* Text Properties */}
              {textElement && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Text Properties
                  </h4>
                  
                  {/* Content */}
                  <div>
                    <Label className="text-xs">Content</Label>
                    <Textarea
                      value={textElement.content}
                      onChange={(e) => onUpdate({ content: e.target.value } as Partial<TextElement>)}
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Font Family */}
                  <div>
                    <Label className="text-xs">Font Family</Label>
                    <Select
                      value={textElement.style.fontFamily}
                      onValueChange={(v) => onUpdate({ 
                        style: { ...textElement.style, fontFamily: v } 
                      } as Partial<TextElement>)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map((font) => (
                          <SelectItem key={font.id} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Text Transform (Casing) */}
                  <div>
                    <Label className="text-xs">Text Case</Label>
                    <div className="flex gap-1 mt-1">
                      {TEXT_TRANSFORM_OPTIONS.map(({ id, name, icon }) => (
                        <Tooltip key={id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={textElement.style.textTransform === id || (!textElement.style.textTransform && id === "none") ? "default" : "outline"}
                              size="sm"
                              className="h-8 px-3 text-xs font-mono"
                              onClick={() => onUpdate({ 
                                style: { ...textElement.style, textTransform: id } 
                              } as Partial<TextElement>)}
                            >
                              {icon}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>{name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>

                  {/* Font Size & Weight */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Font Size</Label>
                      <AutoSelectInput
                        type="number"
                        value={textElement.style.fontSize}
                        onChange={(e) => onUpdate({ 
                          style: { ...textElement.style, fontSize: Number(e.target.value) } 
                        } as Partial<TextElement>)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Font Weight</Label>
                      <Select
                        value={String(textElement.style.fontWeight)}
                        onValueChange={(v) => onUpdate({ 
                          style: { ...textElement.style, fontWeight: Number(v) } 
                        } as Partial<TextElement>)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[300, 400, 500, 600, 700, 800, 900].map((w) => (
                            <SelectItem key={w} value={String(w)}>
                              {w}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <Label className="text-xs">Alignment</Label>
                    <div className="flex gap-1 mt-1">
                      {[
                        { value: "left", icon: AlignLeft },
                        { value: "center", icon: AlignCenter },
                        { value: "right", icon: AlignRight },
                        { value: "justify", icon: AlignJustify },
                      ].map(({ value, icon: Icon }) => (
                        <Button
                          key={value}
                          variant={textElement.style.textAlign === value ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdate({ 
                            style: { ...textElement.style, textAlign: value as TextStyle["textAlign"] } 
                          } as Partial<TextElement>)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <Label className="text-xs">Text Color</Label>
                    <ColorPicker
                      color={textElement.style.color}
                      onChange={(c) => onUpdate({ 
                        style: { ...textElement.style, color: c } 
                      } as Partial<TextElement>)}
                    />
                  </div>

                  {/* Line Height & Letter Spacing */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Line Height</Label>
                      <AutoSelectInput
                        type="number"
                        step={0.1}
                        value={textElement.style.lineHeight}
                        onChange={(e) => onUpdate({ 
                          style: { ...textElement.style, lineHeight: Number(e.target.value) } 
                        } as Partial<TextElement>)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Letter Spacing</Label>
                      <AutoSelectInput
                        type="number"
                        value={textElement.style.letterSpacing}
                        onChange={(e) => onUpdate({ 
                          style: { ...textElement.style, letterSpacing: Number(e.target.value) } 
                        } as Partial<TextElement>)}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Text Background Color */}
                  <div>
                    <Label className="text-xs">Background Color</Label>
                    <ColorPicker
                      color={textElement.backgroundColor || "transparent"}
                      onChange={(c) => onUpdate({ 
                        backgroundColor: c === "transparent" ? undefined : c 
                      } as Partial<TextElement>)}
                    />
                    {textElement.backgroundColor && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-1 h-7 text-xs"
                        onClick={() => onUpdate({ backgroundColor: undefined } as Partial<TextElement>)}
                      >
                        Remove Background
                      </Button>
                    )}
                  </div>

                  {/* Border Radius (for background) */}
                  {textElement.backgroundColor && (
                    <div className="space-y-2">
                      <Label className="text-xs">Background Radius ({textElement.borderRadius || 0}px)</Label>
                      <Slider
                        value={[textElement.borderRadius || 0]}
                        onValueChange={([v]) => onUpdate({ borderRadius: v } as Partial<TextElement>)}
                        min={0}
                        max={30}
                        step={1}
                      />
                    </div>
                  )}

                  <Separator />

                  {/* Padding Control */}
                  <SpacingControl
                    label="Padding"
                    value={textElement.padding}
                    onChange={(padding) => onUpdate({ padding } as Partial<TextElement>)}
                    maxValue={50}
                  />

                  {/* Margin Control */}
                  <SpacingControl
                    label="Margin"
                    value={textElement.margin || { top: 0, right: 0, bottom: 0, left: 0 }}
                    onChange={(margin) => onUpdate({ margin } as Partial<TextElement>)}
                    maxValue={100}
                  />
                </div>
              )}

              {/* Shape Properties */}
              {element.type === "shape" && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Shape Properties
                  </h4>
                  
                  {/* Shape Type */}
                  <div className="space-y-2">
                    <Label className="text-xs">Shape Type</Label>
                    <Select
                      value={(element as ShapeElement).shapeType}
                      onValueChange={(v) => onUpdate({ shapeType: v } as Partial<ShapeElement>)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHAPE_TYPES.map((shape) => (
                          <SelectItem key={shape.id} value={shape.id}>
                            <div className="flex items-center gap-2">
                              <shape.icon className="h-4 w-4" />
                              {shape.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">
                      {(element as ShapeElement).isSticker ? "Background Color" : "Fill Color"}
                    </Label>
                    <ColorPicker
                      color={(element as ShapeElement).fill}
                      onChange={(c) => onUpdate({ fill: c } as Partial<ShapeElement>)}
                    />
                  </div>
                  
                  {/* Image Background for Shape */}
                  <div className="space-y-2">
                    <Label className="text-xs">Image Background (URL)</Label>
                    <Input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={(element as any).backgroundImage || ''}
                      onChange={(e) => onUpdate({ backgroundImage: e.target.value || undefined } as any)}
                      className="h-9"
                    />
                  </div>
                  
                  {/* Upload Image from Device */}
                  <div className="space-y-2">
                    <Label className="text-xs">Or upload from device</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-9 text-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            onUpdate({ backgroundImage: event.target?.result as string } as any)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Stroke Color</Label>
                    <ColorPicker
                      color={(element as ShapeElement).stroke}
                      onChange={(c) => onUpdate({ stroke: c } as Partial<ShapeElement>)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Stroke Width ({(element as ShapeElement).strokeWidth}px)</Label>
                    <Slider
                      value={[(element as ShapeElement).strokeWidth]}
                      onValueChange={([v]) => onUpdate({ strokeWidth: v } as Partial<ShapeElement>)}
                      min={0}
                      max={20}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* Stroke Cap */}
                  {(element as ShapeElement).strokeWidth > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs">Stroke Cap</Label>
                      <Select
                        value={(element as ShapeElement).strokeCap || "none"}
                        onValueChange={(v) => onUpdate({ strokeCap: v as StrokeCap } as Partial<ShapeElement>)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STROKE_CAP_OPTIONS.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              <div className="flex items-center gap-2">
                                <span className="w-4 text-center">{opt.icon}</span>
                                {opt.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Stroke Arrow Start */}
                  {(element as ShapeElement).strokeWidth > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs">Arrow Start</Label>
                      <Select
                        value={(element as ShapeElement).strokeArrowStart || "none"}
                        onValueChange={(v) => onUpdate({ strokeArrowStart: v as StrokeArrow } as Partial<ShapeElement>)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STROKE_ARROW_OPTIONS.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              <div className="flex items-center gap-2">
                                <span className="w-4 text-center">{opt.icon}</span>
                                {opt.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Stroke Arrow End */}
                  {(element as ShapeElement).strokeWidth > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs">Arrow End</Label>
                      <Select
                        value={(element as ShapeElement).strokeArrowEnd || "none"}
                        onValueChange={(v) => onUpdate({ strokeArrowEnd: v as StrokeArrow } as Partial<ShapeElement>)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STROKE_ARROW_OPTIONS.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              <div className="flex items-center gap-2">
                                <span className="w-4 text-center">{opt.icon}</span>
                                {opt.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Stroke Dash Pattern */}
                  {(element as ShapeElement).strokeWidth > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs">Stroke Style</Label>
                      <Select
                        value={(element as ShapeElement).strokeDasharray || "solid"}
                        onValueChange={(v) => onUpdate({ strokeDasharray: v === "solid" ? undefined : v } as Partial<ShapeElement>)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-0.5 bg-current" />
                              Solid
                            </div>
                          </SelectItem>
                          <SelectItem value="5,5">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-0.5 bg-current" style={{ borderTop: "2px dashed currentColor" }} />
                              Dashed
                            </div>
                          </SelectItem>
                          <SelectItem value="2,2">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-0.5 bg-current" style={{ borderTop: "2px dotted currentColor" }} />
                              Dotted
                            </div>
                          </SelectItem>
                          <SelectItem value="10,5,2,5">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-0.5 border-t-2 border-dashed" />
                              Dash-Dot
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {(element as ShapeElement).shapeType === "rounded-rectangle" && (
                    <div className="space-y-2">
                      <Label className="text-xs">Border Radius ({(element as ShapeElement).borderRadius || 8}px)</Label>
                      <Slider
                        value={[(element as ShapeElement).borderRadius || 8]}
                        onValueChange={([v]) => onUpdate({ borderRadius: v } as Partial<ShapeElement>)}
                        min={0}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  )}

                  <Separator />

                  {/* Gradient Fill for Shapes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Gradient Fill</Label>
                      <Switch
                        checked={(element as ShapeElement).gradient?.enabled || false}
                        onCheckedChange={(checked) => onUpdate({ 
                          gradient: checked 
                            ? { enabled: true, from: (element as ShapeElement).fill, to: "#ffffff", direction: "to-br" as GradientDirection }
                            : { enabled: false, from: "", to: "", direction: "to-br" as GradientDirection }
                        } as Partial<ShapeElement>)}
                      />
                    </div>
                    {(element as ShapeElement).gradient?.enabled && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">From</Label>
                            <ColorPicker
                              color={(element as ShapeElement).gradient?.from || "#000000"}
                              onChange={(c) => onUpdate({ 
                                gradient: { ...(element as ShapeElement).gradient!, from: c }
                              } as Partial<ShapeElement>)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">To</Label>
                            <ColorPicker
                              color={(element as ShapeElement).gradient?.to || "#ffffff"}
                              onChange={(c) => onUpdate({ 
                                gradient: { ...(element as ShapeElement).gradient!, to: c }
                              } as Partial<ShapeElement>)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Direction</Label>
                          <Select
                            value={(element as ShapeElement).gradient?.direction || "to-br"}
                            onValueChange={(v) => onUpdate({ 
                              gradient: { ...(element as ShapeElement).gradient!, direction: v as GradientDirection }
                            } as Partial<ShapeElement>)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="to-t">↑ To Top</SelectItem>
                              <SelectItem value="to-b">↓ To Bottom</SelectItem>
                              <SelectItem value="to-l">← To Left</SelectItem>
                              <SelectItem value="to-r">→ To Right</SelectItem>
                              <SelectItem value="to-tl">↖ To Top Left</SelectItem>
                              <SelectItem value="to-tr">↗ To Top Right</SelectItem>
                              <SelectItem value="to-bl">↙ To Bottom Left</SelectItem>
                              <SelectItem value="to-br">↘ To Bottom Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Pattern Overlay for Shapes */}
                  <div className="space-y-3">
                    <Label className="text-xs font-medium">Pattern Overlay</Label>
                    <PatternPicker
                      pattern={(element as any).pattern || null}
                      onChange={(pattern) => onUpdate({ pattern } as any)}
                    />
                  </div>

                  <Separator />

                  {/* Padding & Margin for Shapes */}
                  <SpacingControl
                    label="Padding"
                    value={(element as ShapeElement).padding || { top: 0, right: 0, bottom: 0, left: 0 }}
                    onChange={(padding) => onUpdate({ padding } as Partial<ShapeElement>)}
                    maxValue={100}
                  />

                  <SpacingControl
                    label="Margin"
                    value={(element as ShapeElement).margin || { top: 0, right: 0, bottom: 0, left: 0 }}
                    onChange={(margin) => onUpdate({ margin } as Partial<ShapeElement>)}
                    maxValue={100}
                  />

                  {/* Sticker Icon Color (only for stickers) */}
                  {(element as ShapeElement).isSticker && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Sticker Properties
                        </h4>
                        <div className="space-y-2">
                          <Label className="text-xs">Icon Color</Label>
                          <ColorPicker
                            color={(element as ShapeElement).stickerColor || '#FFFFFF'}
                            onChange={(c) => onUpdate({ stickerColor: c } as Partial<ShapeElement>)}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tip: Use Fill Color for background, Icon Color for the symbol
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Carousel Designer Component
// ═══════════════════════════════════════════════════════════════════════════════

interface CarouselDesignerProps {
  initialContent?: string[]
  onSave?: (template: CarouselTemplate) => void
  onExport?: (format: "png" | "pdf", slides: Blob[]) => void
}

export function CarouselDesigner({ initialContent, onSave, onExport }: CarouselDesignerProps) {
  // State
  const [showTemplatePicker, setShowTemplatePicker] = useState(true)
  const [template, setTemplate] = useState<CarouselTemplate | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set()) // Multi-selection
  const [zoom, setZoom] = useState(50)
  const [showGrid, setShowGrid] = useState(false)
  const [exportWithGrid, setExportWithGrid] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isBottomBarExpanded, setIsBottomBarExpanded] = useState(true)
  const [history, setHistory] = useState<CarouselTemplate[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isExporting, setIsExporting] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [clipboard, setClipboard] = useState<SlideElement[]>([]) // For copy/paste
  const [originalTemplate, setOriginalTemplate] = useState<CarouselTemplate | null>(null) // Store original for scaling
  const [templateStyle, setTemplateStyle] = useState<string>("professional") // Template style category
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentSlide = template?.slides[currentSlideIndex]
  const selectedElement = currentSlide?.elements.find(el => el.id === selectedElementId) || null

  // Keyboard shortcuts (Delete key to remove element)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }
      
      // Delete - remove selected element(s)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const elementsToDelete = selectedElementIds.size > 0 
          ? Array.from(selectedElementIds) 
          : (selectedElementId ? [selectedElementId] : [])
        
        if (elementsToDelete.length > 0 && template) {
          e.preventDefault()
          const newTemplate: CarouselTemplate = {
            ...template,
            updatedAt: Date.now(),
            slides: template.slides.map((slide, i) => {
              if (i !== currentSlideIndex) return slide
              return {
                ...slide,
                elements: slide.elements.filter(el => !elementsToDelete.includes(el.id)),
              }
            }),
          }
          setTemplate(newTemplate)
          setSelectedElementId(null)
          setSelectedElementIds(new Set())
          saveToHistory(newTemplate)
        }
      }
      
      // Ctrl+A - Select all elements
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        if (currentSlide) {
          const allIds = currentSlide.elements.map(el => el.id)
          setSelectedElementIds(new Set(allIds))
          if (allIds.length > 0) setSelectedElementId(allIds[0])
        }
      }
      
      // Ctrl+C - Copy
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault()
        const elementsToCopy = selectedElementIds.size > 0
          ? currentSlide?.elements.filter(el => selectedElementIds.has(el.id)) || []
          : (selectedElement ? [selectedElement] : [])
        
        if (elementsToCopy.length > 0) {
          setClipboard(elementsToCopy.map(el => ({ ...el })))
        }
      }
      
      // Ctrl+X - Cut
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault()
        const elementsToCut = selectedElementIds.size > 0
          ? currentSlide?.elements.filter(el => selectedElementIds.has(el.id)) || []
          : (selectedElement ? [selectedElement] : [])
        
        if (elementsToCut.length > 0 && template) {
          setClipboard(elementsToCut.map(el => ({ ...el })))
          const cutIds = new Set(elementsToCut.map(el => el.id))
          const newTemplate: CarouselTemplate = {
            ...template,
            updatedAt: Date.now(),
            slides: template.slides.map((slide, i) => {
              if (i !== currentSlideIndex) return slide
              return {
                ...slide,
                elements: slide.elements.filter(el => !cutIds.has(el.id)),
              }
            }),
          }
          setTemplate(newTemplate)
          setSelectedElementId(null)
          setSelectedElementIds(new Set())
          saveToHistory(newTemplate)
        }
      }
      
      // Ctrl+V - Paste
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault()
        if (clipboard.length > 0 && template) {
          const pastedElements = clipboard.map((el, idx) => ({
            ...el,
            id: `element-${Date.now()}-${idx}`,
            x: el.x + 20,
            y: el.y + 20,
            zIndex: (currentSlide?.elements.length || 0) + idx,
          }))
          
          const newTemplate: CarouselTemplate = {
            ...template,
            updatedAt: Date.now(),
            slides: template.slides.map((slide, i) => {
              if (i !== currentSlideIndex) return slide
              return {
                ...slide,
                elements: [...slide.elements, ...pastedElements],
              }
            }),
          }
          setTemplate(newTemplate)
          const newIds = new Set(pastedElements.map(el => el.id))
          setSelectedElementIds(newIds)
          setSelectedElementId(pastedElements[0].id)
          saveToHistory(newTemplate)
        }
      }
      
      // Ctrl+D - Duplicate
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        const elementsToDuplicate = selectedElementIds.size > 0
          ? currentSlide?.elements.filter(el => selectedElementIds.has(el.id)) || []
          : (selectedElement ? [selectedElement] : [])
        
        if (elementsToDuplicate.length > 0 && template) {
          const duplicatedElements = elementsToDuplicate.map((el, idx) => ({
            ...el,
            id: `element-${Date.now()}-${idx}`,
            x: el.x + 30,
            y: el.y + 30,
            zIndex: (currentSlide?.elements.length || 0) + idx,
          }))
          
          const newTemplate: CarouselTemplate = {
            ...template,
            updatedAt: Date.now(),
            slides: template.slides.map((slide, i) => {
              if (i !== currentSlideIndex) return slide
              return {
                ...slide,
                elements: [...slide.elements, ...duplicatedElements],
              }
            }),
          }
          setTemplate(newTemplate)
          const newIds = new Set(duplicatedElements.map(el => el.id))
          setSelectedElementIds(newIds)
          setSelectedElementId(duplicatedElements[0].id)
          saveToHistory(newTemplate)
        }
      }
      
      // Ctrl+Z - Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      
      // Ctrl+Shift+Z or Ctrl+Y - Redo
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault()
        handleRedo()
      }
      
      // Escape - Deselect all
      if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedElementId(null)
        setSelectedElementIds(new Set())
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, selectedElementIds, selectedElement, template, currentSlide, currentSlideIndex, clipboard])

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setTemplate(history[historyIndex - 1])
    }
  }, [historyIndex, history])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setTemplate(history[historyIndex + 1])
    }
  }, [historyIndex, history])

  // Template Selection
  const handleSelectTemplate = (selectedTemplate: CarouselTemplate, keepSize?: boolean) => {
    let newTemplate = duplicateTemplate(selectedTemplate)
    // Store the original template for proper scaling
    setOriginalTemplate(JSON.parse(JSON.stringify(newTemplate)))
    // If keepSize is true, maintain current size and scale template elements
    if (keepSize && template && template.size !== selectedTemplate.size) {
      newTemplate = scaleTemplateForSize(newTemplate, template.size, selectedTemplate.size)
    }
    setTemplate(newTemplate)
    setShowTemplatePicker(false)
    setHistory([newTemplate])
    setHistoryIndex(0)
  }

  const handleCreateNew = () => {
    const newTemplate = createBlankTemplate()
    setOriginalTemplate(JSON.parse(JSON.stringify(newTemplate)))
    setTemplate(newTemplate)
    setShowTemplatePicker(false)
    setHistory([newTemplate])
    setHistoryIndex(0)
  }

  // History Management
  const saveToHistory = useCallback((newTemplate: CarouselTemplate) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, newTemplate]
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  // Apply color palette to all elements
  const handleApplyPalette = (palette: ColorPalette) => {
    if (!template) return
    
    const newTemplate: CarouselTemplate = {
      ...template,
      palette,
      updatedAt: Date.now(),
      slides: template.slides.map(slide => ({
        ...slide,
        background: slide.background.type === "solid" 
          ? { ...slide.background, color: palette.colors.background }
          : slide.background,
        elements: slide.elements.map(el => {
          if (el.type === "heading" || el.type === "text" || el.type === "subheading" || el.type === "body" || el.type === "quote") {
            const textEl = el as TextElement
            const isHeading = el.type === "heading"
            return {
              ...textEl,
              style: {
                ...textEl.style,
                color: isHeading ? palette.colors.text : palette.colors.textSecondary || palette.colors.text,
              }
            } as TextElement
          }
          if (el.type === "shape") {
            const shapeEl = el as ShapeElement
            // Determine if this is a primary or accent shape based on current color
            const isPrimary = shapeEl.fill === template.palette.colors.primary
            const isSecondary = shapeEl.fill === template.palette.colors.secondary
            const isAccent = shapeEl.fill === template.palette.colors.accent
            return {
              ...shapeEl,
              fill: isPrimary ? palette.colors.primary : 
                    isSecondary ? palette.colors.secondary :
                    isAccent ? palette.colors.accent : shapeEl.fill,
            } as ShapeElement
          }
          return el
        }),
      })),
    }
    setTemplate(newTemplate)
    saveToHistory(newTemplate)
  }

  // Element Management
  const handleUpdateElement = (elementId: string, updates: Partial<SlideElement>) => {
    if (!template || !currentSlide) return

    // Find the element being updated
    const element = currentSlide.elements.find(el => el.id === elementId)
    if (!element) return

    // Check if this is a position update and element is part of a group
    const isPositionUpdate = 'x' in updates || 'y' in updates
    const groupId = element.groupId

    let newTemplate: CarouselTemplate

    if (isPositionUpdate && groupId) {
      // Calculate the delta movement
      const deltaX = ('x' in updates ? updates.x! : element.x) - element.x
      const deltaY = ('y' in updates ? updates.y! : element.y) - element.y

      // Move all elements in the group by the same delta
      newTemplate = {
        ...template,
        updatedAt: Date.now(),
        slides: template.slides.map((slide, i) => {
          if (i !== currentSlideIndex) return slide
          return {
            ...slide,
            elements: slide.elements.map(el => {
              if (el.groupId === groupId) {
                return {
                  ...el,
                  x: el.x + deltaX,
                  y: el.y + deltaY,
                  // Apply other updates only to the target element
                  ...(el.id === elementId ? updates : {}),
                } as SlideElement
              }
              return el
            }),
          }
        }),
      }
    } else {
      // Standard update for single element
      newTemplate = {
        ...template,
        updatedAt: Date.now(),
        slides: template.slides.map((slide, i) => {
          if (i !== currentSlideIndex) return slide
          return {
            ...slide,
            elements: slide.elements.map(el => {
              if (el.id !== elementId) return el
              return { ...el, ...updates } as SlideElement
            }),
          }
        }),
      }
    }
    
    setTemplate(newTemplate)
    saveToHistory(newTemplate)
  }

  const handleDeleteElement = () => {
    if (!template || !selectedElementId) return

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          elements: slide.elements.filter(el => el.id !== selectedElementId),
        }
      }),
    }
    setTemplate(newTemplate)
    setSelectedElementId(null)
    saveToHistory(newTemplate)
  }

  const handleDuplicateElement = () => {
    if (!template || !selectedElement) return

    const newElement: SlideElement = {
      ...selectedElement,
      id: `element-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
    }

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          elements: [...slide.elements, newElement],
        }
      }),
    }
    setTemplate(newTemplate)
    setSelectedElementId(newElement.id)
    saveToHistory(newTemplate)
  }

  // Group selected elements
  const handleGroupElements = useCallback(() => {
    if (!template || !currentSlide || selectedElementIds.size < 2) return

    const selectedIds = Array.from(selectedElementIds)
    const groupId = `group-${Date.now()}`

    // Simply assign the same groupId to all selected elements - keep their absolute positions
    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          elements: slide.elements.map(el => {
            if (selectedIds.includes(el.id)) {
              return { ...el, groupId }
            }
            return el
          }),
        }
      }),
    }

    setTemplate(newTemplate)
    setSelectedElementIds(new Set(selectedIds)) // Keep all selected
    saveToHistory(newTemplate)
  }, [template, currentSlide, selectedElementIds, currentSlideIndex, saveToHistory])

  // Ungroup selected elements
  const handleUngroupElements = useCallback(() => {
    if (!template || !currentSlide) return

    // Get group IDs from selected elements
    const selectedIds = selectedElementId 
      ? [selectedElementId, ...Array.from(selectedElementIds)]
      : Array.from(selectedElementIds)
    
    const groupIdsToUngroup = new Set<string>()
    currentSlide.elements.forEach(el => {
      if (selectedIds.includes(el.id) && el.groupId) {
        groupIdsToUngroup.add(el.groupId)
      }
    })

    if (groupIdsToUngroup.size === 0) return

    // Remove groupId from all elements in those groups
    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          elements: slide.elements.map(el => {
            if (el.groupId && groupIdsToUngroup.has(el.groupId)) {
              const { groupId, ...rest } = el
              return rest as SlideElement
            }
            return el
          }),
        }
      }),
    }

    setTemplate(newTemplate)
    saveToHistory(newTemplate)
  }, [template, currentSlide, selectedElementId, selectedElementIds, currentSlideIndex, saveToHistory])

  // Align selected elements
  const handleAlignElements = useCallback((alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!template || !currentSlide || selectedElementIds.size < 2) return

    const selectedIds = Array.from(selectedElementIds)
    const elementsToAlign = currentSlide.elements.filter(el => selectedIds.includes(el.id))
    
    if (elementsToAlign.length < 2) return

    // Calculate bounding box of all selected elements
    const minX = Math.min(...elementsToAlign.map(el => el.x))
    const minY = Math.min(...elementsToAlign.map(el => el.y))
    const maxX = Math.max(...elementsToAlign.map(el => el.x + el.width))
    const maxY = Math.max(...elementsToAlign.map(el => el.y + el.height))

    const updatedElements = currentSlide.elements.map(el => {
      if (!selectedIds.includes(el.id)) return el

      let newX = el.x
      let newY = el.y

      switch (alignment) {
        case "left":
          newX = minX
          break
        case "center":
          newX = minX + (maxX - minX - el.width) / 2
          break
        case "right":
          newX = maxX - el.width
          break
        case "top":
          newY = minY
          break
        case "middle":
          newY = minY + (maxY - minY - el.height) / 2
          break
        case "bottom":
          newY = maxY - el.height
          break
      }

      return { ...el, x: newX, y: newY }
    })

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          elements: updatedElements,
        }
      }),
    }

    setTemplate(newTemplate)
    saveToHistory(newTemplate)
  }, [template, currentSlide, selectedElementIds, currentSlideIndex, saveToHistory])

  // Keyboard shortcut for grouping (Ctrl+G)
  useEffect(() => {
    const handleGroupKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }
      
      // Ctrl+G - Group/Ungroup elements
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault()
        // Check if any selected element is already grouped
        const selectedElements = currentSlide?.elements.filter(el => 
          selectedElementIds.has(el.id) || el.id === selectedElementId
        ) || []
        const hasGroupedElements = selectedElements.some(el => el.groupId)
        
        if (hasGroupedElements) {
          handleUngroupElements()
        } else if (selectedElementIds.size >= 2) {
          handleGroupElements()
        }
      }
    }
    
    window.addEventListener('keydown', handleGroupKeyDown)
    return () => window.removeEventListener('keydown', handleGroupKeyDown)
  }, [selectedElementId, selectedElementIds, currentSlide, handleGroupElements, handleUngroupElements])

  // Helper to estimate text dimensions based on font size and content
  const estimateTextDimensions = (content: string, fontSize: number, fontWeight: number = 400) => {
    // Approximate character width as 0.6 of font size (varies by font)
    const avgCharWidth = fontSize * 0.55
    const width = Math.max(100, Math.min(600, content.length * avgCharWidth + 20))
    // Height based on line height (1.4) plus some padding
    const height = Math.max(fontSize * 1.5, fontSize * 1.4 + 10)
    return { width: Math.round(width), height: Math.round(height) }
  }

  // Add Element
  const handleAddElement = (type: "text" | "heading" | "shape", shapeType?: ShapeType) => {
    if (!template) return

    let newElement: SlideElement

    if (type === "text" || type === "heading") {
      const content = type === "heading" ? "New Heading" : "New Text"
      const fontSize = type === "heading" ? 48 : 24
      const fontWeight = type === "heading" ? 700 : 400
      const { width, height } = estimateTextDimensions(content, fontSize, fontWeight)
      
      newElement = {
        id: `element-${Date.now()}`,
        type,
        content,
        x: 100,
        y: 100,
        width,
        height,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: currentSlide?.elements.length || 0,
        style: {
          fontFamily: template.defaultFonts[type === "heading" ? "heading" : "body"],
          fontSize,
          fontWeight,
          lineHeight: 1.4,
          letterSpacing: 0,
          textAlign: "left",
          color: template.palette.colors.text,
        },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      } as TextElement
    } else {
      const selectedShapeType = shapeType || "rectangle"
      newElement = {
        id: `element-${Date.now()}`,
        type: "shape",
        shapeType: selectedShapeType,
        x: 100,
        y: 100,
        width: selectedShapeType === "line" ? 300 : 200,
        height: selectedShapeType === "line" ? 4 : 200,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: currentSlide?.elements.length || 0,
        fill: template.palette.colors.primary,
        stroke: "transparent",
        strokeWidth: 0,
        borderRadius: selectedShapeType === "rounded-rectangle" ? 16 : undefined,
      } as ShapeElement
    }

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          elements: [...slide.elements, newElement],
        }
      }),
    }
    setTemplate(newTemplate)
    setSelectedElementId(newElement.id)
    saveToHistory(newTemplate)
  }

  // Add Sticker/Icon
  const handleAddSticker = (sticker: StickerDef) => {
    if (!template) return

    // Create a shape element that represents the sticker/icon
    const newElement: ShapeElement = {
      id: `element-${Date.now()}`,
      type: "shape",
      shapeType: "rounded-rectangle", // Base shape for sticker background
      x: 150,
      y: 150,
      width: 80,
      height: 80,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: currentSlide?.elements.length || 0,
      fill: template.palette.colors.primary, // Background color
      stroke: "transparent",
      strokeWidth: 0,
      borderRadius: 16,
      isSticker: true,
      stickerIcon: sticker.id,
      stickerColor: "#FFFFFF", // Icon color (white by default for contrast)
    }

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          elements: [...slide.elements, newElement],
        }
      }),
    }
    setTemplate(newTemplate)
    setSelectedElementId(newElement.id)
    saveToHistory(newTemplate)
  }

  // Slide Management
  const handleAddSlide = () => {
    if (!template) return

    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      name: `Slide ${template.slides.length + 1}`,
      order: template.slides.length,
      background: { type: "solid", color: template.palette.colors.background },
      elements: [],
    }

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: [...template.slides, newSlide],
    }
    setTemplate(newTemplate)
    setCurrentSlideIndex(newTemplate.slides.length - 1)
    saveToHistory(newTemplate)
  }

  const handleDuplicateSlide = (index: number) => {
    if (!template) return

    const slideToDuplicate = template.slides[index]
    const newSlide: Slide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}`,
      name: `${slideToDuplicate.name} (Copy)`,
      order: index + 1,
      elements: slideToDuplicate.elements.map(el => ({
        ...el,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    }

    const slides = [...template.slides]
    slides.splice(index + 1, 0, newSlide)
    
    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides,
    }
    setTemplate(newTemplate)
    setCurrentSlideIndex(index + 1)
    saveToHistory(newTemplate)
  }

  const handleDeleteSlide = (index: number) => {
    if (!template || template.slides.length <= 1) return

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.filter((_, i) => i !== index),
    }
    setTemplate(newTemplate)
    if (currentSlideIndex >= newTemplate.slides.length) {
      setCurrentSlideIndex(newTemplate.slides.length - 1)
    }
    saveToHistory(newTemplate)
  }

  // Reorder slides (drag and drop)
  const handleReorderSlides = (fromIndex: number, toIndex: number) => {
    if (!template) return
    if (fromIndex === toIndex) return
    const slides = [...template.slides]
    const [moved] = slides.splice(fromIndex, 1)
    slides.splice(toIndex, 0, moved)
    const newTemplate: CarouselTemplate = { ...template, updatedAt: Date.now(), slides }
    setTemplate(newTemplate)
    setCurrentSlideIndex(Math.max(0, Math.min(toIndex, slides.length - 1)))
    saveToHistory(newTemplate)
  }

  // Background Management
  const handleUpdateBackground = (updates: Partial<SlideBackground>) => {
    if (!template || !currentSlide) return

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        if (i !== currentSlideIndex) return slide
        return {
          ...slide,
          background: { ...slide.background, ...updates } as SlideBackground,
        }
      }),
    }
    setTemplate(newTemplate)
    saveToHistory(newTemplate)
  }

  // Export Functions
  const exportSlides = async (format: "png" | "pdf") => {
    if (!template) return
    setIsExporting(true)

    try {
      const blobs: Blob[] = []
      const size = CAROUSEL_SIZES[template.size]

      // Create a temporary container for rendering
      const container = document.createElement("div")
      container.style.position = "fixed"
      container.style.left = "-9999px"
      container.style.top = "-9999px"
      document.body.appendChild(container)

      for (let i = 0; i < template.slides.length; i++) {
        const slide = template.slides[i]
        
        // Create slide element
        const slideEl = document.createElement("div")
        slideEl.style.width = `${size.width}px`
        slideEl.style.height = `${size.height}px`
        slideEl.style.position = "relative"
        
        // Set background
        if (slide.background.type === "solid") {
          slideEl.style.backgroundColor = slide.background.color || "#FFFFFF"
        } else if (slide.background.type === "gradient" && slide.background.gradient) {
          slideEl.style.background = `linear-gradient(${getGradientAngle(slide.background.gradient.direction)}, ${slide.background.gradient.from}, ${slide.background.gradient.to})`
        }

        // Add grid overlay if exportWithGrid is enabled
        if (exportWithGrid) {
          const gridOverlay = document.createElement("div")
          gridOverlay.style.position = "absolute"
          gridOverlay.style.inset = "0"
          gridOverlay.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`
          gridOverlay.style.backgroundSize = "20px 20px"
          gridOverlay.style.pointerEvents = "none"
          gridOverlay.style.zIndex = "9999"
          slideEl.appendChild(gridOverlay)
        }

        // Render elements
        slide.elements.forEach(element => {
          if (!element.visible) return

          const el = document.createElement("div")
          el.style.position = "absolute"
          el.style.left = `${element.x}px`
          el.style.top = `${element.y}px`
          el.style.width = `${element.width}px`
          el.style.height = `${element.height}px`
          el.style.transform = `rotate(${element.rotation}deg)`
          el.style.opacity = String(element.opacity)
          el.style.zIndex = String(element.zIndex)

          if (["text", "heading", "subheading", "body", "quote"].includes(element.type)) {
            const textEl = element as TextElement
            el.style.fontFamily = textEl.style.fontFamily
            el.style.fontSize = `${textEl.style.fontSize}px`
            el.style.fontWeight = String(textEl.style.fontWeight)
            el.style.lineHeight = String(textEl.style.lineHeight)
            el.style.letterSpacing = `${textEl.style.letterSpacing}px`
            el.style.textAlign = textEl.style.textAlign
            el.style.color = textEl.style.color
            el.style.whiteSpace = "pre-wrap"
            el.innerText = textEl.content
          } else if (element.type === "shape") {
            const shapeEl = element as ShapeElement
            el.style.backgroundColor = shapeEl.fill
            if (shapeEl.strokeWidth > 0) {
              el.style.border = `${shapeEl.strokeWidth}px solid ${shapeEl.stroke}`
            }
            if (shapeEl.shapeType === "circle") {
              el.style.borderRadius = "50%"
            } else if (shapeEl.shapeType === "rounded-rectangle" && shapeEl.borderRadius) {
              el.style.borderRadius = `${shapeEl.borderRadius}px`
            }
          }

          slideEl.appendChild(el)
        })

        container.appendChild(slideEl)

        // Capture as canvas
        const canvas = await html2canvas(slideEl, {
          width: size.width,
          height: size.height,
          scale: 2,
          useCORS: true,
          allowTaint: true,
        })

        // Convert to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), format === "png" ? "image/png" : "image/jpeg", 0.95)
        })
        blobs.push(blob)

        container.removeChild(slideEl)
      }

      document.body.removeChild(container)

      if (format === "pdf") {
        // Create PDF
        const pdf = new jsPDF({
          orientation: size.width > size.height ? "landscape" : "portrait",
          unit: "px",
          format: [size.width, size.height],
        })

        for (let i = 0; i < blobs.length; i++) {
          if (i > 0) pdf.addPage([size.width, size.height])
          const imgData = URL.createObjectURL(blobs[i])
          pdf.addImage(imgData, "PNG", 0, 0, size.width, size.height)
        }

        pdf.save(`${template.name}-carousel.pdf`)
      } else {
        // Download individual PNGs
        blobs.forEach((blob, i) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${template.name}-slide-${i + 1}.png`
          a.click()
          URL.revokeObjectURL(url)
        })
      }

      onExport?.(format, blobs)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsExporting(false)
      setShowExportDialog(false)
    }
  }

  // Fill with AI Content
  const handleFillWithAI = () => {
    if (!template || !initialContent || initialContent.length === 0) return

    const newTemplate: CarouselTemplate = {
      ...template,
      updatedAt: Date.now(),
      slides: template.slides.map((slide, i) => {
        const content = initialContent[i] || ""
        const textElements = slide.elements.filter(
          el => ["text", "heading", "subheading", "body", "quote"].includes(el.type)
        )

        // Find heading and body elements
        const headingEl = textElements.find(el => el.type === "heading")
        const bodyEl = textElements.find(el => el.type === "body" || el.type === "text")

        // Split content into heading and body
        const lines = content.split("\n").filter(l => l.trim())
        const heading = lines[0] || ""
        const body = lines.slice(1).join("\n") || content

        return {
          ...slide,
          elements: slide.elements.map(el => {
            if (el.id === headingEl?.id) {
              return { ...el, content: heading } as TextElement
            }
            if (el.id === bodyEl?.id) {
              return { ...el, content: body } as TextElement
            }
            return el
          }),
        }
      }),
    }

    setTemplate(newTemplate)
    saveToHistory(newTemplate)
  }

  // Render Template Picker (full screen dialog style)
  if (showTemplatePicker) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              Choose a Template
            </h1>
            <p className="text-sm text-muted-foreground">
              Select from 10 professional templates or create your own custom design
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <HelpDialog />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <TemplatePicker onSelect={handleSelectTemplate} onCreateNew={handleCreateNew} />
        </div>
      </div>
    )
  }

  if (!template) return null

  // Get templates for current style
  const availableTemplates = templateStyle === "create-your-own" 
    ? [] 
    : getTemplatesByStyle(templateStyle)

  // Main Designer UI
  return (
    <TooltipProvider>
      <div className="flex flex-col h-full min-h-0 overflow-hidden bg-background">
        {/* Top Toolbar (compact, template & size selectors + controls) */}
        <div className="flex items-center justify-between p-2 border-b bg-muted/30 gap-4">
          <div className="flex items-center gap-3">
            {/* Template Style select */}
            <Select
              value={templateStyle}
              onValueChange={(v) => {
                setTemplateStyle(v)
                if (v === "create-your-own") {
                  handleCreateNew()
                }
              }}
            >
              <SelectTrigger className="h-8 w-44">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>{style.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Template select */}
            {templateStyle !== "create-your-own" && (
              <Select
                value={template?.id || ""}
                onValueChange={(v) => {
                  const t = getTemplateById(v)
                  if (t) handleSelectTemplate(t)
                }}
              >
                <SelectTrigger className="h-8 w-52">
                  <SelectValue placeholder="Select template">
                    {template ? PROFESSIONAL_TEMPLATES.find(t => t.id === template.id)?.name || template.name : "Select template"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Size select */}
            <Select
              value={template?.size || "square"}
              onValueChange={(v) => {
                if (!template) return
                const newSize = v as CarouselSize
                const oldSize = template.size
                if (oldSize === newSize) return
                
                // Always scale from original template to prevent compounding
                if (originalTemplate) {
                  const scaledTemplate = scaleTemplateForSize(
                    JSON.parse(JSON.stringify(originalTemplate)), 
                    newSize, 
                    originalTemplate.size
                  )
                  // Preserve current slide content/edits by merging
                  // Keep the scaled positions but any new elements added
                  setTemplate(scaledTemplate)
                  saveToHistory(scaledTemplate)
                } else {
                  // Fallback if no original
                  const newTemplate = scaleTemplateForSize(template, newSize, oldSize)
                  setTemplate(newTemplate)
                  saveToHistory(newTemplate)
                }
              }}
            >
              <SelectTrigger className="h-8 w-40">
                <SelectValue>
                  {template?.size ? `${template.size} (${CAROUSEL_SIZES[template.size].width}x${CAROUSEL_SIZES[template.size].height})` : "Select size"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CAROUSEL_SIZES) as CarouselSize[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {k} ({CAROUSEL_SIZES[k].width}x{CAROUSEL_SIZES[k].height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}>
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom & Grid */}
            <div className="flex items-center gap-1 bg-muted rounded-md px-2 py-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.max(25, z - 10))}>
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(z => Math.min(150, z + 10))}>
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={showGrid ? "default" : "ghost"} size="icon" onClick={() => setShowGrid(!showGrid)}>
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Grid</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={previewMode ? "default" : "ghost"} size="icon" onClick={() => setPreviewMode(!previewMode)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{previewMode ? "Exit Preview" : "Preview Mode"}</TooltipContent>
            </Tooltip>
            {showGrid && (
              <div className="flex items-center gap-2 ml-2">
                <Label className="text-xs">Export with grid</Label>
                <Switch checked={exportWithGrid} onCheckedChange={setExportWithGrid} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {initialContent && initialContent.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleFillWithAI}>
                <Wand2 className="h-4 w-4 mr-1" />
                Fill with AI Content
              </Button>
            )}
            {/* Separate PNG / PDF buttons */}
            <Button size="sm" onClick={() => exportSlides("png")} disabled={isExporting}>
              <FileImage className="h-4 w-4 mr-1" />{isExporting ? "..." : "PNG"}
            </Button>
            <Button size="sm" onClick={() => exportSlides("pdf")} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-1" />{isExporting ? "..." : "PDF"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => document.documentElement.classList.toggle('dark')}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <HelpDialog />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar - Properties & Tools */}
          <div className={cn("w-80 border-r bg-muted/10 flex flex-col min-h-0", previewMode && "hidden")}>
            <div className="p-4 border-b shrink-0 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Properties & Tools</h3>
              <div className="flex items-center gap-1">
                <NotepadTrigger onClick={() => setIsNotepadOpen(true)} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Keyboard Shortcuts</h4>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Copy</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + C</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paste</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + V</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cut</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + X</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duplicate</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + D</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Select All</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + A</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Undo</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + Z</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Redo</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + Shift + Z</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delete</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Delete / Backspace</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deselect</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Escape</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Group/Ungroup</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + G</kbd>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Multi-select</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + Click</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resize frame only</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl + Drag</kbd>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-[10px] text-muted-foreground italic">
                        Tip: Resizing text normally scales font size. Hold Ctrl while resizing to only change the frame size.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              </div>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Add Elements</h4>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full justify-start h-10" onClick={() => handleAddElement("heading")}>
                      <Type className="h-4 w-4 mr-3" />
                      Heading
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-10" onClick={() => handleAddElement("text")}>
                      <Type className="h-4 w-4 mr-3 opacity-60" />
                      Text
                    </Button>
                    
                    {/* Shape Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start h-10">
                          <Square className="h-4 w-4 mr-3" />
                          Add Shape
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {SHAPE_TYPES.map((shape) => (
                          <DropdownMenuItem key={shape.id} onClick={() => handleAddElement("shape", shape.id)}>
                            <shape.icon className="h-4 w-4 mr-2" />
                            {shape.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Stickers/Icons Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start h-10">
                          <Sparkles className="h-4 w-4 mr-3" />
                          Add Sticker/Icon
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
                        {PROFESSIONAL_STICKERS.map((category) => (
                          <div key={category.category}>
                            <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                              {category.category}
                            </DropdownMenuLabel>
                            {category.stickers.map((sticker) => (
                              <DropdownMenuItem 
                                key={sticker.id} 
                                onClick={() => handleAddSticker(sticker)}
                              >
                                <sticker.icon className="h-4 w-4 mr-2" />
                                {sticker.name}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slide Background</h4>
                  <Tabs defaultValue="solid" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-9">
                      <TabsTrigger value="solid" className="text-xs">Solid</TabsTrigger>
                      <TabsTrigger value="gradient" className="text-xs">Gradient</TabsTrigger>
                      <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
                      <TabsTrigger value="pattern" className="text-xs">Pattern</TabsTrigger>
                    </TabsList>
                    <TabsContent value="solid" className="space-y-3 mt-3">
                      <ColorPicker
                        color={currentSlide?.background.type === "solid" ? currentSlide.background.color || "#FFFFFF" : "#FFFFFF"}
                        onChange={(c) => handleUpdateBackground({ type: "solid", color: c })}
                        label="Background Color"
                      />
                    </TabsContent>
                    <TabsContent value="gradient" className="space-y-3 mt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">From</Label>
                          <ColorPicker
                            color={currentSlide?.background.type === "gradient" && currentSlide.background.gradient ? currentSlide.background.gradient.from : template.palette.colors.primary}
                            onChange={(c) => {
                              const existing = currentSlide?.background.type === "gradient" ? currentSlide.background.gradient : null
                              handleUpdateBackground({ 
                                type: "gradient", 
                                gradient: { 
                                  from: c, 
                                  to: existing?.to || template.palette.colors.secondary, 
                                  direction: (existing?.direction as GradientDirection) || "to-br" 
                                } 
                              })
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">To</Label>
                          <ColorPicker
                            color={currentSlide?.background.type === "gradient" && currentSlide.background.gradient ? currentSlide.background.gradient.to : template.palette.colors.secondary}
                            onChange={(c) => {
                              const existing = currentSlide?.background.type === "gradient" ? currentSlide.background.gradient : null
                              handleUpdateBackground({ 
                                type: "gradient", 
                                gradient: { 
                                  from: existing?.from || template.palette.colors.primary, 
                                  to: c, 
                                  direction: (existing?.direction as GradientDirection) || "to-br" 
                                } 
                              })
                            }}
                          />
                        </div>
                      </div>
                      {/* Gradient Direction */}
                      <div className="space-y-2">
                        <Label className="text-xs">Direction</Label>
                        <Select
                          value={currentSlide?.background.type === "gradient" && currentSlide.background.gradient ? currentSlide.background.gradient.direction : "to-br"}
                          onValueChange={(v) => {
                            const existing = currentSlide?.background.type === "gradient" ? currentSlide.background.gradient : null
                            handleUpdateBackground({ 
                              type: "gradient", 
                              gradient: { 
                                from: existing?.from || template.palette.colors.primary, 
                                to: existing?.to || template.palette.colors.secondary, 
                                direction: v as GradientDirection 
                              } 
                            })
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to-t">↑ To Top</SelectItem>
                            <SelectItem value="to-b">↓ To Bottom</SelectItem>
                            <SelectItem value="to-l">← To Left</SelectItem>
                            <SelectItem value="to-r">→ To Right</SelectItem>
                            <SelectItem value="to-tl">↖ To Top Left</SelectItem>
                            <SelectItem value="to-tr">↗ To Top Right</SelectItem>
                            <SelectItem value="to-bl">↙ To Bottom Left</SelectItem>
                            <SelectItem value="to-br">↘ To Bottom Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    <TabsContent value="image" className="space-y-3 mt-3">
                      <Input
                        type="text"
                        placeholder="Image URL"
                        value={currentSlide?.background.type === "image" && currentSlide.background.image ? currentSlide.background.image.src : ""}
                        onChange={(e) => handleUpdateBackground({ 
                          type: "image", 
                          image: { src: e.target.value, opacity: 1, blur: 0 } 
                        })}
                        className="h-9"
                      />
                      {/* File Upload for Image */}
                      <div className="space-y-2">
                        <Label className="text-xs">Or upload from device</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          className="h-9 text-xs"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                handleUpdateBackground({ 
                                  type: "image", 
                                  image: { src: event.target?.result as string, opacity: 1, blur: 0 } 
                                })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Enter URL or upload an image</p>
                    </TabsContent>
                    <TabsContent value="pattern" className="space-y-3 mt-3">
                      <div className="space-y-3">
                        <ColorPicker
                          color={currentSlide?.background.color || "#FFFFFF"}
                          onChange={(c) => handleUpdateBackground({ 
                            type: "pattern", 
                            color: c,
                            pattern: currentSlide?.background.pattern || { type: "dots", color: "#000000", opacity: 0.3, scale: 1 }
                          })}
                          label="Base Color"
                        />
                        <PatternPicker
                          pattern={currentSlide?.background.pattern || null}
                          onChange={(pattern) => {
                            if (pattern) {
                              handleUpdateBackground({ 
                                type: "pattern", 
                                color: currentSlide?.background.color || "#FFFFFF",
                                pattern 
                              })
                            } else {
                              handleUpdateBackground({ 
                                type: "solid", 
                                color: currentSlide?.background.color || "#FFFFFF"
                              })
                            }
                          }}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Separator className="my-2" />

                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color Palette</h4>
                  <PalettePicker
                    selected={template.palette}
                    onSelect={handleApplyPalette}
                    originalPalette={originalTemplate?.palette}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Main Canvas Area - Shows all slides in preview mode */}
          <div className="flex-1 overflow-auto bg-muted/50" key={`canvas-${template.size}`}>
            <div className="min-w-max min-h-full flex items-center justify-center p-8">
            {previewMode ? (
              <ScrollArea className="w-full h-full">
                <div className="flex flex-wrap gap-6 justify-center p-4">
                  {template.slides.map((slide, index) => (
                    <div 
                      key={slide.id} 
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                      onClick={() => {
                        setCurrentSlideIndex(index)
                        setPreviewMode(false)
                      }}
                    >
                      <div className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Slide {index + 1}
                      </div>
                      <div className="ring-2 ring-transparent group-hover:ring-primary rounded-lg transition-all">
                        <SlideCanvas
                          slide={slide}
                          template={template}
                          selectedElementId={null}
                          selectedElementIds={new Set()}
                          onSelectElement={() => {}}
                          onUpdateElement={() => {}}
                          zoom={Math.min(zoom, 30)}
                          showGrid={false}
                          showGuides={false}
                          previewMode={true}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to edit
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : currentSlide ? (
              <SlideCanvas
                slide={currentSlide}
                template={template}
                selectedElementId={selectedElementId}
                selectedElementIds={selectedElementIds}
                onSelectElement={(id, addToSelection) => {
                  if (id === null) {
                    // Clicked on empty canvas - clear all selections
                    setSelectedElementId(null)
                    setSelectedElementIds(new Set())
                  } else {
                    // Check if selected element is part of a group
                    const element = currentSlide.elements.find(el => el.id === id)
                    const groupId = element?.groupId
                    
                    if (groupId && !addToSelection) {
                      // Element is part of a group - select all group members
                      const groupMembers = currentSlide.elements
                        .filter(el => el.groupId === groupId)
                        .map(el => el.id)
                      setSelectedElementId(id)
                      setSelectedElementIds(new Set(groupMembers))
                    } else if (addToSelection) {
                      // Ctrl+click - toggle in multi-selection
                      setSelectedElementIds(prev => {
                        const newSet = new Set(prev)
                        if (newSet.has(id)) {
                          newSet.delete(id)
                          // If removing the primary selection, pick another
                          if (selectedElementId === id) {
                            const remaining = Array.from(newSet)
                            setSelectedElementId(remaining.length > 0 ? remaining[0] : null)
                          }
                        } else {
                          newSet.add(id)
                          // Also add current selection if not in set
                          if (selectedElementId && !newSet.has(selectedElementId)) {
                            newSet.add(selectedElementId)
                          }
                        }
                        return newSet
                      })
                      setSelectedElementId(id)
                    } else {
                      // Normal click - single selection
                      setSelectedElementId(id)
                      setSelectedElementIds(new Set([id]))
                    }
                  }
                }}
                onUpdateElement={handleUpdateElement}
                zoom={zoom}
                showGrid={showGrid}
                showGuides={!previewMode}
                previewMode={previewMode}
              />
            ) : null}
            </div>
          </div>

          {/* Right Sidebar - Element Properties & Layers */}
          <div className={cn("w-80 border-l bg-muted/10 flex flex-col min-h-0", previewMode && "hidden")}>
            <Tabs defaultValue="properties" className="flex flex-col h-full">
              <div className="p-2 border-b shrink-0">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="properties" className="text-xs">
                    <Settings2 className="h-3 w-3 mr-1" />
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="layers" className="text-xs">
                    <Layers className="h-3 w-3 mr-1" />
                    Layers
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <ElementProperties
                      element={selectedElement}
                      template={template}
                      onUpdate={(updates) => selectedElementId && handleUpdateElement(selectedElementId, updates)}
                      onDelete={handleDeleteElement}
                      onDuplicate={handleDuplicateElement}
                      onGroup={handleGroupElements}
                      onUngroup={handleUngroupElements}
                      onAlign={handleAlignElements}
                      canGroup={selectedElementIds.size >= 2 && !currentSlide?.elements.some(el => selectedElementIds.has(el.id) && el.groupId)}
                      canUngroup={Boolean(selectedElement?.groupId || (currentSlide?.elements.some(el => selectedElementIds.has(el.id) && el.groupId)))}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="layers" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <LayersPanel
                    elements={currentSlide?.elements || []}
                    selectedElementId={selectedElementId}
                    selectedElementIds={selectedElementIds}
                    onSelectElement={(id) => {
                      // Check if element is part of a group
                      const element = currentSlide?.elements.find(el => el.id === id)
                      const groupId = element?.groupId
                      
                      if (groupId) {
                        // Select all group members
                        const groupMembers = currentSlide?.elements
                          .filter(el => el.groupId === groupId)
                          .map(el => el.id) || []
                        setSelectedElementId(id)
                        setSelectedElementIds(new Set(groupMembers))
                      } else {
                        setSelectedElementId(id)
                        setSelectedElementIds(new Set([id]))
                      }
                    }}
                    onUpdateElement={handleUpdateElement}
                    onReorderElements={(fromIndex, toIndex) => {
                      if (!template || !currentSlide) return
                      
                      const elements = [...currentSlide.elements]
                      const [removed] = elements.splice(fromIndex, 1)
                      elements.splice(toIndex, 0, removed)
                      
                      // Update zIndex based on new order
                      const updatedElements = elements.map((el, idx) => ({
                        ...el,
                        zIndex: idx,
                      }))
                      
                      const newTemplate: CarouselTemplate = {
                        ...template,
                        updatedAt: Date.now(),
                        slides: template.slides.map((slide, i) => {
                          if (i !== currentSlideIndex) return slide
                          return { ...slide, elements: updatedElements }
                        }),
                      }
                      setTemplate(newTemplate)
                      saveToHistory(newTemplate)
                    }}
                  />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Bottom Slide Navigator (Collapsible) */}
        <div className={cn("border-t bg-muted/30 transition-all", previewMode && "hidden")}>
          {/* Collapse Toggle Button */}
          <div 
            className="flex items-center justify-center py-1 cursor-pointer hover:bg-muted/50 border-b"
            onClick={() => setIsBottomBarExpanded(!isBottomBarExpanded)}
          >
            {isBottomBarExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground ml-1">
              {isBottomBarExpanded ? "Collapse" : `Expand (${template.slides.length} slides)`}
            </span>
          </div>
          
          {isBottomBarExpanded && (
            <div className="p-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setCurrentSlideIndex(i => Math.max(0, i - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <ScrollArea className="flex-1">
                  <div className="flex gap-2 pb-2">
                    {template.slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", String(index))
                          e.dataTransfer.effectAllowed = "move"
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const from = Number(e.dataTransfer.getData("text/plain"))
                          handleReorderSlides(from, index)
                        }}
                        className={cn(
                          "relative group shrink-0 cursor-pointer rounded border-2 transition-all",
                          index === currentSlideIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
                        )}
                        onClick={() => setCurrentSlideIndex(index)}
                      >
                        <div
                        className="w-24 h-24 rounded"
                        style={{
                          ...(slide.background.type === "image" && slide.background.image?.src
                            ? {
                                backgroundImage: `url(${slide.background.image.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }
                            : slide.background.type === "gradient" && slide.background.gradient
                            ? {
                                backgroundImage: `linear-gradient(${getGradientAngle(slide.background.gradient.direction)}, ${slide.background.gradient.from}, ${slide.background.gradient.to})`,
                              }
                            : {
                                backgroundColor: slide.background.color || "#FFFFFF",
                              }),
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium opacity-50">{index + 1}</span>
                        </div>
                      </div>
                      <div className="absolute left-1 top-1 opacity-50">
                        <Grip className="h-4 w-4" />
                      </div>
                      {/* Hover buttons: Duplicate and Delete */}
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateSlide(index)
                          }}
                          title="Duplicate Slide"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {template.slides.length > 1 && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-5 w-5"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSlide(index)
                            }}
                            title="Delete Slide"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-24 h-24 shrink-0"
                    onClick={handleAddSlide}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <Button variant="ghost" size="icon" onClick={() => setCurrentSlideIndex(i => Math.min(template.slides.length - 1, i + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          )}
        </div>
      </div>
      
      {/* Floating Notepad */}
      <FloatingNotepad
        isOpen={isNotepadOpen}
        onClose={() => setIsNotepadOpen(false)}
        initialPosition={{ x: window.innerWidth - 420, y: 100 }}
      />
    </TooltipProvider>
  )
}
