"use client"


import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Palette,
  Wand2,
  Shuffle,
  Copy,
  Check,
  Sun,
  Moon,
  Droplets,
  Flame,
  Leaf,
  Snowflake,
  Sunset,
  CloudRain,
  X,
  Eye,
  EyeOff,
  ChevronLeft,
  GripHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorPalette } from "@/lib/carousel-designer-types"

const COLOR_HARMONIES = {
  complementary: "Complementary",
  analogous: "Analogous",
  triadic: "Triadic",
  splitComplementary: "Split Comp.",
  tetradic: "Tetradic",
  monochromatic: "Mono",
}

const MOOD_PRESETS = [
  { id: "professional", name: "Professional", icon: Sun, colors: { primary: "#2563eb", secondary: "#3b82f6", accent: "#0ea5e9", background: "#ffffff", text: "#1e293b", textSecondary: "#64748b" } },
  { id: "modern", name: "Modern Dark", icon: Moon, colors: { primary: "#8b5cf6", secondary: "#a78bfa", accent: "#c4b5fd", background: "#0f172a", text: "#f1f5f9", textSecondary: "#94a3b8" } },
  { id: "warm", name: "Warm", icon: Flame, colors: { primary: "#f97316", secondary: "#fb923c", accent: "#fbbf24", background: "#fffbeb", text: "#78350f", textSecondary: "#a16207" } },
  { id: "cool", name: "Cool", icon: Snowflake, colors: { primary: "#06b6d4", secondary: "#22d3ee", accent: "#67e8f9", background: "#ecfeff", text: "#164e63", textSecondary: "#0891b2" } },
  { id: "nature", name: "Nature", icon: Leaf, colors: { primary: "#16a34a", secondary: "#22c55e", accent: "#4ade80", background: "#f0fdf4", text: "#14532d", textSecondary: "#15803d" } },
  { id: "ocean", name: "Ocean", icon: Droplets, colors: { primary: "#0284c7", secondary: "#0ea5e9", accent: "#38bdf8", background: "#f0f9ff", text: "#0c4a6e", textSecondary: "#0369a1" } },
  { id: "sunset", name: "Sunset", icon: Sunset, colors: { primary: "#dc2626", secondary: "#f97316", accent: "#fbbf24", background: "#fef3c7", text: "#7c2d12", textSecondary: "#b45309" } },
  { id: "rainy", name: "Rainy", icon: CloudRain, colors: { primary: "#64748b", secondary: "#94a3b8", accent: "#cbd5e1", background: "#f8fafc", text: "#334155", textSecondary: "#64748b" } },
]

const CURATED_PALETTES = [
  { name: "Minimal Blue", colors: { primary: "#3b82f6", secondary: "#60a5fa", accent: "#93c5fd", background: "#ffffff", text: "#1e3a5f", textSecondary: "#64748b" } },
  { name: "Electric Purple", colors: { primary: "#7c3aed", secondary: "#8b5cf6", accent: "#a78bfa", background: "#faf5ff", text: "#4c1d95", textSecondary: "#7c3aed" } },
  { name: "Coral Dream", colors: { primary: "#f43f5e", secondary: "#fb7185", accent: "#fda4af", background: "#fff1f2", text: "#881337", textSecondary: "#be123c" } },
  { name: "Forest Green", colors: { primary: "#059669", secondary: "#10b981", accent: "#34d399", background: "#ecfdf5", text: "#064e3b", textSecondary: "#047857" } },
  { name: "Golden Hour", colors: { primary: "#d97706", secondary: "#f59e0b", accent: "#fbbf24", background: "#fffbeb", text: "#78350f", textSecondary: "#b45309" } },
  { name: "Midnight", colors: { primary: "#6366f1", secondary: "#818cf8", accent: "#a5b4fc", background: "#0f172a", text: "#e2e8f0", textSecondary: "#94a3b8" } },
  { name: "Rose Garden", colors: { primary: "#e11d48", secondary: "#f43f5e", accent: "#fb7185", background: "#fff1f2", text: "#9f1239", textSecondary: "#be123c" } },
  { name: "Arctic", colors: { primary: "#0891b2", secondary: "#06b6d4", accent: "#22d3ee", background: "#ecfeff", text: "#155e75", textSecondary: "#0e7490" } },
]

interface InlineCustomPaletteCreatorProps {
  currentPalette?: ColorPalette
  onApply: (palette: ColorPalette) => void
  onClose: () => void
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }
  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generateHarmony(baseHex: string, harmony: keyof typeof COLOR_HARMONIES): string[] {
  const { h, s, l } = hexToHSL(baseHex)
  const colors: string[] = [baseHex]
  switch (harmony) {
    case "complementary": colors.push(hslToHex((h + 180) % 360, s, l)); break
    case "analogous": colors.push(hslToHex((h + 30) % 360, s, l)); colors.push(hslToHex((h - 30 + 360) % 360, s, l)); break
    case "triadic": colors.push(hslToHex((h + 120) % 360, s, l)); colors.push(hslToHex((h + 240) % 360, s, l)); break
    case "splitComplementary": colors.push(hslToHex((h + 150) % 360, s, l)); colors.push(hslToHex((h + 210) % 360, s, l)); break
    case "tetradic": colors.push(hslToHex((h + 90) % 360, s, l)); colors.push(hslToHex((h + 180) % 360, s, l)); colors.push(hslToHex((h + 270) % 360, s, l)); break
    case "monochromatic": colors.push(hslToHex(h, s, Math.min(100, l + 20))); colors.push(hslToHex(h, s, Math.max(0, l - 20))); break
  }
  return colors
}

function generateRandomColor(): string {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
}

// Floating Preview Window Component
function FloatingPreview({ 
  colors, 
  isOpen, 
  onClose, 
  initialPosition 
}: { 
  colors: typeof MOOD_PRESETS[0]['colors']
  isOpen: boolean
  onClose: () => void
  initialPosition: { x: number; y: number } 
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [pos, setPos] = useState(initialPosition)
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null)

  useEffect(() => { 
    if (isOpen) setPos(initialPosition) 
  }, [isOpen, initialPosition])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragRef.current = { startX: e.clientX, startY: e.clientY, initialX: pos.x, initialY: pos.y }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return
      setPos({ 
        x: dragRef.current.initialX + e.clientX - dragRef.current.startX, 
        y: dragRef.current.initialY + e.clientY - dragRef.current.startY 
      })
    }
    const handleMouseUp = () => { 
      setIsDragging(false)
      dragRef.current = null 
    }
    if (isDragging) { 
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp) 
    }
    return () => { 
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp) 
    }
  }, [isDragging])

  if (!isOpen) return null

  return (
    <div 
      className="fixed z-[100] bg-popover border rounded-lg shadow-xl overflow-hidden" 
      style={{ left: pos.x, top: pos.y, width: 200 }}
    >
      <div 
        className={cn(
          "flex items-center justify-between px-2 py-1.5 bg-muted/50 border-b select-none", 
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )} 
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-medium">Preview</span>
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-muted" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="p-3" style={{ backgroundColor: colors.background }}>
        <div className="flex gap-1.5 mb-3">
          {[colors.primary, colors.secondary, colors.accent, colors.background].map((c, i) => (
            <div key={i} className="h-7 w-7 rounded-md shadow-sm border border-black/10" style={{ backgroundColor: c }} />
          ))}
        </div>
        <h4 className="text-xs font-semibold mb-0.5" style={{ color: colors.text }}>Sample Title</h4>
        <p className="text-[9px] mb-2 leading-tight" style={{ color: colors.textSecondary }}>
          This is how your content will appear.
        </p>
        <button 
          className="w-full text-[9px] py-1 rounded font-medium" 
          style={{ backgroundColor: colors.primary, color: colors.background }}
        >
          Sample Button
        </button>
      </div>
    </div>
  )
}

// Main Inline Component - replaces the palette grid
export function InlineCustomPaletteCreator({ currentPalette, onApply, onClose }: InlineCustomPaletteCreatorProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("presets")
  const [showPreview, setShowPreview] = useState(false)
  const [previewPosition, setPreviewPosition] = useState({ x: 350, y: 200 })
  const containerRef = useRef<HTMLDivElement>(null)
  
  const defaultColors = { 
    primary: "#3b82f6", 
    secondary: "#60a5fa", 
    accent: "#93c5fd", 
    background: "#ffffff", 
    text: "#1e3a5f", 
    textSecondary: "#64748b" 
  }
  
  const [customColors, setCustomColors] = useState({
    primary: currentPalette?.colors.primary || defaultColors.primary,
    secondary: currentPalette?.colors.secondary || defaultColors.secondary,
    accent: currentPalette?.colors.accent || defaultColors.accent,
    background: currentPalette?.colors.background || defaultColors.background,
    text: currentPalette?.colors.text || defaultColors.text,
    textSecondary: currentPalette?.colors.textSecondary || defaultColors.textSecondary,
  })
  
  const [paletteName, setPaletteName] = useState("My Custom Palette")
  const [selectedHarmony, setSelectedHarmony] = useState<keyof typeof COLOR_HARMONIES>("complementary")

  useEffect(() => { 
    if (containerRef.current && showPreview) { 
      const rect = containerRef.current.getBoundingClientRect()
      setPreviewPosition({ x: rect.right + 10, y: rect.top + 50 }) 
    } 
  }, [showPreview])
  
  useEffect(() => { 
    if (currentPalette) {
      setCustomColors({
        primary: currentPalette.colors.primary || defaultColors.primary,
        secondary: currentPalette.colors.secondary || defaultColors.secondary,
        accent: currentPalette.colors.accent || defaultColors.accent,
        background: currentPalette.colors.background || defaultColors.background,
        text: currentPalette.colors.text || defaultColors.text,
        textSecondary: currentPalette.colors.textSecondary || defaultColors.textSecondary,
      })
    }
  }, [currentPalette])

  const handleCopyColor = (color: string) => { 
    navigator.clipboard.writeText(color)
    setCopied(color)
    setTimeout(() => setCopied(null), 1500) 
  }
  
  const handleApplyMoodPreset = (preset: typeof MOOD_PRESETS[0]) => {
    setCustomColors(prev => ({ ...prev, ...preset.colors }))
  }
  
  const handleApplyCuratedPalette = (palette: typeof CURATED_PALETTES[0]) => {
    setCustomColors(prev => ({ ...prev, ...palette.colors }))
  }
  
  const handleGenerateHarmony = () => { 
    const harmonyColors = generateHarmony(customColors.primary, selectedHarmony)
    setCustomColors(prev => ({ 
      ...prev, 
      primary: harmonyColors[0], 
      secondary: harmonyColors[1] || prev.secondary, 
      accent: harmonyColors[2] || harmonyColors[1] || prev.accent 
    })) 
  }
  
  const handleRandomize = () => { 
    const baseColor = generateRandomColor()
    const { h, s } = hexToHSL(baseColor)
    setCustomColors({ 
      primary: baseColor, 
      secondary: hslToHex((h + 30) % 360, s, 60), 
      accent: hslToHex((h + 60) % 360, s, 70), 
      background: hslToHex(h, 10, 98), 
      text: hslToHex(h, s, 15), 
      textSecondary: hslToHex(h, s, 40) 
    }) 
  }
  
  const handleApply = () => { 
    onApply({ 
      id: `custom-${Date.now()}`, 
      name: paletteName, 
      category: "creative", 
      colors: customColors 
    })
    onClose() 
  }

  const ColorInput = ({ label, colorKey }: { label: string; colorKey: keyof typeof customColors }) => (
    <div className="flex items-center gap-2">
      <Input 
        type="color" 
        value={customColors[colorKey]} 
        onChange={(e) => setCustomColors(prev => ({ ...prev, [colorKey]: e.target.value }))} 
        className="h-6 w-6 cursor-pointer p-0.5 rounded shrink-0" 
      />
      <Label className="text-[10px] text-muted-foreground flex-1 min-w-0 truncate">{label}</Label>
      <Input 
        value={customColors[colorKey]} 
        onChange={(e) => setCustomColors(prev => ({ ...prev, [colorKey]: e.target.value }))} 
        className="w-[68px] h-6 font-mono text-[10px] px-1.5" 
        onFocus={(e) => e.target.select()} 
      />
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 shrink-0" 
        onClick={() => handleCopyColor(customColors[colorKey])}
      >
        {copied === customColors[colorKey] ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  )

  return (
    <>
      <div ref={containerRef} className="space-y-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="text-xs font-medium flex-1">Custom Palette</h4>
          <Button 
            variant={showPreview ? "secondary" : "ghost"} 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setShowPreview(!showPreview)} 
            title={showPreview ? "Hide Preview" : "Show Preview"}
          >
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-7">
            <TabsTrigger value="presets" className="text-[10px] px-1 h-6">Presets</TabsTrigger>
            <TabsTrigger value="custom" className="text-[10px] px-1 h-6">Custom</TabsTrigger>
            <TabsTrigger value="harmony" className="text-[10px] px-1 h-6">Harmony</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="mt-2 space-y-3">
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Moods</Label>
              <div className="grid grid-cols-4 gap-1">
                {MOOD_PRESETS.map((preset) => (
                  <button 
                    key={preset.id} 
                    className="flex flex-col items-center gap-0.5 p-1.5 rounded border hover:bg-muted/50 transition-colors" 
                    onClick={() => handleApplyMoodPreset(preset)} 
                    title={preset.name}
                  >
                    <preset.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[8px] text-muted-foreground truncate w-full text-center">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Curated</Label>
              <div className="grid grid-cols-2 gap-1">
                {CURATED_PALETTES.map((palette, idx) => (
                  <button 
                    key={idx} 
                    className="flex items-center gap-1.5 p-1.5 rounded border hover:bg-muted/50 transition-colors" 
                    onClick={() => handleApplyCuratedPalette(palette)}
                  >
                    <div className="flex -space-x-1">
                      {[palette.colors.primary, palette.colors.secondary, palette.colors.accent].map((c, i) => (
                        <div key={i} className="h-4 w-4 rounded-full border border-background" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[9px] truncate flex-1 text-left">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Colors</Label>
              <Button variant="ghost" size="sm" className="h-5 text-[9px] gap-1 px-1.5" onClick={handleRandomize}>
                <Shuffle className="h-3 w-3" />Random
              </Button>
            </div>
            <div className="space-y-1.5">
              <ColorInput label="Primary" colorKey="primary" />
              <ColorInput label="Secondary" colorKey="secondary" />
              <ColorInput label="Accent" colorKey="accent" />
              <ColorInput label="Background" colorKey="background" />
              <ColorInput label="Text" colorKey="text" />
            </div>
          </TabsContent>
          
          <TabsContent value="harmony" className="mt-2 space-y-2">
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Base Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="color" 
                  value={customColors.primary} 
                  onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))} 
                  className="h-7 w-10 cursor-pointer p-0.5" 
                />
                <Input 
                  value={customColors.primary} 
                  onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))} 
                  className="flex-1 h-7 font-mono text-xs" 
                  onFocus={(e) => e.target.select()} 
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Harmony Type</Label>
              <Select value={selectedHarmony} onValueChange={(v) => setSelectedHarmony(v as keyof typeof COLOR_HARMONIES)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(COLOR_HARMONIES).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full h-7 text-xs gap-1.5" onClick={handleGenerateHarmony}>
              <Wand2 className="h-3 w-3" />Generate Harmony
            </Button>
            <div className="flex gap-1 justify-center pt-1">
              {[customColors.primary, customColors.secondary, customColors.accent].map((c, i) => (
                <div 
                  key={i} 
                  className="h-8 w-8 rounded-lg border shadow-sm cursor-pointer hover:scale-110 transition-transform" 
                  style={{ backgroundColor: c }} 
                  onClick={() => handleCopyColor(c)} 
                  title={`Click to copy: ${c}`} 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="space-y-2">
          <Input 
            placeholder="Palette name..." 
            value={paletteName} 
            onChange={(e) => setPaletteName(e.target.value)} 
            className="h-7 text-xs" 
            onFocus={(e) => e.target.select()} 
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={onClose}>Cancel</Button>
            <Button size="sm" className="flex-1 h-7 text-xs gap-1" onClick={handleApply}>
              <Check className="h-3 w-3" />Apply
            </Button>
          </div>
        </div>
      </div>
      
      <FloatingPreview 
        colors={customColors} 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        initialPosition={previewPosition} 
      />
    </>
  )
}

// Trigger button to open the custom palette creator
export function CustomPaletteCreatorTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="w-full gap-2 h-8" onClick={onClick}>
      <Palette className="h-4 w-4" />
      Create Custom Palette
    </Button>
  )
}
