// ═══════════════════════════════════════════════════════════════════════════════
// LinkedIn Carousel Designer - Type Definitions
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// Size Configurations (LinkedIn Recommended Sizes)
// ─────────────────────────────────────────────────────────────────────────────────

export type CarouselSize = "square" | "portrait" | "landscape"

export const CAROUSEL_SIZES: Record<CarouselSize, { width: number; height: number; label: string; description: string }> = {
  square: { width: 1080, height: 1080, label: "Square (1:1)", description: "Best for LinkedIn feed" },
  portrait: { width: 1080, height: 1350, label: "Portrait (4:5)", description: "More vertical space" },
  landscape: { width: 1200, height: 628, label: "Landscape (1.91:1)", description: "Wide format" },
}

// ─────────────────────────────────────────────────────────────────────────────────
// Color System
// ─────────────────────────────────────────────────────────────────────────────────

export interface ColorPalette {
  id: string
  name: string
  category: "vibrant" | "professional" | "creative" | "minimal" | "dark" | "gradient"
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    textSecondary: string
  }
  gradient?: {
    from: string
    to: string
    direction: GradientDirection
  }
}

export type GradientDirection = 
  | "to-r" | "to-l" | "to-t" | "to-b" 
  | "to-tr" | "to-tl" | "to-br" | "to-bl"

export const VIBRANT_PALETTES: ColorPalette[] = [
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    category: "vibrant",
    colors: {
      primary: "#0077B6",
      secondary: "#00B4D8",
      accent: "#90E0EF",
      background: "#CAF0F8",
      text: "#03045E",
      textSecondary: "#023E8A",
    },
    gradient: { from: "#0077B6", to: "#00B4D8", direction: "to-br" },
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    category: "vibrant",
    colors: {
      primary: "#FF6B35",
      secondary: "#F7C59F",
      accent: "#EFEFD0",
      background: "#FFF8F0",
      text: "#2E1F27",
      textSecondary: "#7A4419",
    },
    gradient: { from: "#FF6B35", to: "#F7C59F", direction: "to-r" },
  },
  {
    id: "electric-purple",
    name: "Electric Purple",
    category: "vibrant",
    colors: {
      primary: "#7B2CBF",
      secondary: "#9D4EDD",
      accent: "#C77DFF",
      background: "#F3E8FF",
      text: "#240046",
      textSecondary: "#5A189A",
    },
    gradient: { from: "#7B2CBF", to: "#C77DFF", direction: "to-br" },
  },
  {
    id: "forest-green",
    name: "Forest Green",
    category: "vibrant",
    colors: {
      primary: "#2D6A4F",
      secondary: "#40916C",
      accent: "#74C69D",
      background: "#D8F3DC",
      text: "#1B4332",
      textSecondary: "#2D6A4F",
    },
    gradient: { from: "#2D6A4F", to: "#74C69D", direction: "to-br" },
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    category: "vibrant",
    colors: {
      primary: "#FF6B6B",
      secondary: "#FFA07A",
      accent: "#FFE66D",
      background: "#FFF5F5",
      text: "#2D3436",
      textSecondary: "#636E72",
    },
    gradient: { from: "#FF6B6B", to: "#FFE66D", direction: "to-r" },
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    category: "dark",
    colors: {
      primary: "#0D1B2A",
      secondary: "#1B263B",
      accent: "#415A77",
      background: "#0D1B2A",
      text: "#E0E1DD",
      textSecondary: "#778DA9",
    },
    gradient: { from: "#0D1B2A", to: "#415A77", direction: "to-br" },
  },
  {
    id: "professional-blue",
    name: "Professional Blue",
    category: "professional",
    colors: {
      primary: "#0A66C2",
      secondary: "#004182",
      accent: "#70B5F9",
      background: "#FFFFFF",
      text: "#000000",
      textSecondary: "#666666",
    },
    gradient: { from: "#0A66C2", to: "#004182", direction: "to-b" },
  },
  {
    id: "minimal-gray",
    name: "Minimal Gray",
    category: "minimal",
    colors: {
      primary: "#2D3436",
      secondary: "#636E72",
      accent: "#00B894",
      background: "#FFFFFF",
      text: "#2D3436",
      textSecondary: "#636E72",
    },
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    category: "professional",
    colors: {
      primary: "#D4A373",
      secondary: "#CCD5AE",
      accent: "#FAEDCD",
      background: "#FEFAE0",
      text: "#3D405B",
      textSecondary: "#6D6875",
    },
    gradient: { from: "#D4A373", to: "#CCD5AE", direction: "to-r" },
  },
  {
    id: "neon-pink",
    name: "Neon Pink",
    category: "creative",
    colors: {
      primary: "#FF006E",
      secondary: "#FB5607",
      accent: "#FFBE0B",
      background: "#1A1A2E",
      text: "#FFFFFF",
      textSecondary: "#E0E0E0",
    },
    gradient: { from: "#FF006E", to: "#FFBE0B", direction: "to-r" },
  },
  {
    id: "tech-cyan",
    name: "Tech Cyan",
    category: "creative",
    colors: {
      primary: "#00F5D4",
      secondary: "#00BBF9",
      accent: "#9B5DE5",
      background: "#16213E",
      text: "#FFFFFF",
      textSecondary: "#A0A0A0",
    },
    gradient: { from: "#00F5D4", to: "#9B5DE5", direction: "to-r" },
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    category: "creative",
    colors: {
      primary: "#B76E79",
      secondary: "#C9A9A6",
      accent: "#F4E4E4",
      background: "#FFF9F9",
      text: "#2D2D2D",
      textSecondary: "#666666",
    },
    gradient: { from: "#B76E79", to: "#F4E4E4", direction: "to-br" },
  },
]

// ─────────────────────────────────────────────────────────────────────────────────
// Typography System
// ─────────────────────────────────────────────────────────────────────────────────

export interface FontFamily {
  id: string
  name: string
  value: string
  category: "sans" | "serif" | "display" | "mono"
  weights: number[]
}

export const FONT_FAMILIES: FontFamily[] = [
  { id: "inter", name: "Inter", value: "'Inter', sans-serif", category: "sans", weights: [400, 500, 600, 700, 800, 900] },
  { id: "poppins", name: "Poppins", value: "'Poppins', sans-serif", category: "sans", weights: [400, 500, 600, 700, 800] },
  { id: "montserrat", name: "Montserrat", value: "'Montserrat', sans-serif", category: "sans", weights: [400, 500, 600, 700, 800, 900] },
  { id: "roboto", name: "Roboto", value: "'Roboto', sans-serif", category: "sans", weights: [400, 500, 700, 900] },
  { id: "open-sans", name: "Open Sans", value: "'Open Sans', sans-serif", category: "sans", weights: [400, 600, 700, 800] },
  { id: "playfair", name: "Playfair Display", value: "'Playfair Display', serif", category: "serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: "merriweather", name: "Merriweather", value: "'Merriweather', serif", category: "serif", weights: [400, 700, 900] },
  { id: "lora", name: "Lora", value: "'Lora', serif", category: "serif", weights: [400, 500, 600, 700] },
  { id: "bebas", name: "Bebas Neue", value: "'Bebas Neue', sans-serif", category: "display", weights: [400] },
  { id: "oswald", name: "Oswald", value: "'Oswald', sans-serif", category: "display", weights: [400, 500, 600, 700] },
  { id: "raleway", name: "Raleway", value: "'Raleway', sans-serif", category: "sans", weights: [400, 500, 600, 700, 800] },
  { id: "source-code", name: "Source Code Pro", value: "'Source Code Pro', monospace", category: "mono", weights: [400, 500, 600, 700] },
]

export type TextAlignment = "left" | "center" | "right" | "justify"

export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  textAlign: TextAlignment
  color: string
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize"
  textDecoration?: "none" | "underline" | "line-through"
  fontStyle?: "normal" | "italic"
  opacity?: number
}

// ─────────────────────────────────────────────────────────────────────────────────
// Element Types
// ─────────────────────────────────────────────────────────────────────────────────

export type ElementType = 
  | "text" 
  | "heading" 
  | "subheading"
  | "body"
  | "bullet-list"
  | "numbered-list"
  | "quote"
  | "shape" 
  | "image" 
  | "icon"
  | "divider"
  | "badge"
  | "progress-bar"
  | "avatar"
  | "logo"
  | "qr-code"
  | "group"

export type ShapeType = 
  | "rectangle" 
  | "rounded-rectangle" 
  | "circle" 
  | "ellipse" 
  | "triangle" 
  | "diamond"
  | "hexagon"
  | "star"
  | "arrow"
  | "line"
  | "curved-line"
  | "blob"

// Stroke cap and arrow types
export type StrokeCap = "none" | "round" | "square"
export type StrokeArrow = "none" | "line-arrow" | "triangle-arrow" | "reversed-triangle" | "circle-arrow" | "diamond-arrow"

// Layout and positioning for groups
export type AlignmentType = "start" | "center" | "end" | "stretch" | "space-between" | "space-around" | "space-evenly"
export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse"

export interface Spacing {
  top: number
  right: number
  bottom: number
  left: number
}

export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked: boolean
  visible: boolean
  zIndex: number
  // Margin for positioning relative to other elements
  margin?: Spacing
  // Group ID if element belongs to a group
  groupId?: string
}

export interface TextElement extends BaseElement {
  type: "text" | "heading" | "subheading" | "body" | "quote"
  content: string
  style: TextStyle
  padding: { top: number; right: number; bottom: number; left: number }
  backgroundColor?: string
  borderRadius?: number
}

export interface ListElement extends BaseElement {
  type: "bullet-list" | "numbered-list"
  items: string[]
  style: TextStyle
  bulletColor?: string
  bulletStyle?: "disc" | "circle" | "square" | "arrow" | "check" | "star"
  spacing: number
}

export interface ShapeElement extends BaseElement {
  type: "shape"
  shapeType: ShapeType
  fill: string
  stroke: string
  strokeWidth: number
  // Stroke styling options
  strokeCap?: StrokeCap
  strokeDasharray?: string // e.g., "5,5" for dashed
  strokeArrowStart?: StrokeArrow
  strokeArrowEnd?: StrokeArrow
  // Padding inside the shape
  padding?: Spacing
  borderRadius?: number
  gradient?: {
    enabled: boolean
    from: string
    to: string
    direction: GradientDirection
  }
  shadow?: {
    enabled: boolean
    x: number
    y: number
    blur: number
    color: string
  }
  // Sticker properties
  isSticker?: boolean
  stickerIcon?: string
  stickerColor?: string
}

export interface ImageElement extends BaseElement {
  type: "image" | "avatar" | "logo"
  src: string
  alt: string
  objectFit: "cover" | "contain" | "fill" | "none"
  borderRadius: number
  border?: {
    width: number
    color: string
    style: "solid" | "dashed" | "dotted"
  }
  filter?: {
    brightness: number
    contrast: number
    saturation: number
    blur: number
    grayscale: number
  }
}

export interface IconElement extends BaseElement {
  type: "icon"
  iconName: string
  iconLibrary: "lucide" | "heroicons" | "feather"
  color: string
  strokeWidth: number
}

export interface DividerElement extends BaseElement {
  type: "divider"
  style: "solid" | "dashed" | "dotted" | "gradient"
  color: string
  thickness: number
  direction: "horizontal" | "vertical"
}

export interface BadgeElement extends BaseElement {
  type: "badge"
  text: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  padding: { horizontal: number; vertical: number }
  style: TextStyle
}

export interface ProgressBarElement extends BaseElement {
  type: "progress-bar"
  progress: number
  backgroundColor: string
  fillColor: string
  borderRadius: number
  showLabel: boolean
  labelPosition: "inside" | "outside"
}

// Group element for grouping multiple elements together
export interface GroupElement extends BaseElement {
  type: "group"
  childIds: string[] // IDs of child elements
  // Padding inside the group
  padding?: Spacing
  // Layout properties for children
  layout?: {
    direction: FlexDirection
    alignItems: AlignmentType
    justifyContent: AlignmentType
    gap: number
    wrap?: boolean
  }
  // Visual properties
  backgroundColor?: string
  borderRadius?: number
  border?: {
    width: number
    color: string
    style: "solid" | "dashed" | "dotted"
  }
}

export type SlideElement = 
  | TextElement 
  | ListElement 
  | ShapeElement 
  | ImageElement 
  | IconElement 
  | DividerElement 
  | BadgeElement 
  | ProgressBarElement
  | GroupElement

// ─────────────────────────────────────────────────────────────────────────────────
// Slide Definition
// ─────────────────────────────────────────────────────────────────────────────────

export interface SlideBackground {
  type: "solid" | "gradient" | "image" | "pattern"
  color?: string
  gradient?: {
    from: string
    to: string
    direction: GradientDirection
  }
  image?: {
    src: string
    opacity: number
    blur: number
    overlay?: string
  }
  pattern?: {
    type: "dots" | "lines" | "grid" | "diagonal" | "waves" | "zigzag" | "crosshatch" | "circles"
    color: string
    opacity: number
    scale: number
  }
}

export interface Slide {
  id: string
  name: string
  elements: SlideElement[]
  background: SlideBackground
  order: number
}

// ─────────────────────────────────────────────────────────────────────────────────
// Template Definition
// ─────────────────────────────────────────────────────────────────────────────────

export type TemplateCategory = 
  | "minimal" 
  | "bold" 
  | "corporate" 
  | "creative" 
  | "educational" 
  | "storytelling"
  | "data-driven"
  | "personal-brand"
  | "tips-tricks"
  | "case-study"
  | "vibrant"
  | "gradient"
  | "social-engagement"
  | "editors-pick"
  | "descriptive-carousel"
  | "trending-product"
  | "featured"

export interface CarouselTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  thumbnail?: string
  isPremium: boolean
  isCustom: boolean
  palette: ColorPalette
  size: CarouselSize
  slides: Slide[]
  defaultFonts: {
    heading: string
    body: string
  }
  tags: string[]
  createdAt: number
  updatedAt: number
  // Canvas margins - prevent objects from going beyond these boundaries
  canvasMargins?: Spacing
}

// ─────────────────────────────────────────────────────────────────────────────────
// Designer State
// ─────────────────────────────────────────────────────────────────────────────────

export interface DesignerState {
  template: CarouselTemplate | null
  currentSlideIndex: number
  selectedElementId: string | null
  zoom: number
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  history: {
    past: CarouselTemplate[]
    future: CarouselTemplate[]
  }
  clipboard: SlideElement | null
  isDirty: boolean
}

// ─────────────────────────────────────────────────────────────────────────────────
// Export Options
// ─────────────────────────────────────────────────────────────────────────────────

export type ExportFormat = "png" | "pdf" | "jpg"

export interface ExportOptions {
  format: ExportFormat
  quality: number // 0.1 to 1.0
  scale: number // 1 = original, 2 = 2x resolution
  includeAllSlides: boolean
  selectedSlides?: number[]
  fileName: string
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI Content Integration
// ─────────────────────────────────────────────────────────────────────────────────

export interface AICarouselContent {
  title: string
  subtitle?: string
  slides: {
    heading: string
    body?: string
    bullets?: string[]
    quote?: string
    statistic?: { value: string; label: string }
  }[]
  callToAction?: string
  hashtags?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────────
// Utility Types
// ─────────────────────────────────────────────────────────────────────────────────

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export interface Transform {
  position: Position
  size: Size
  rotation: number
  scale: number
}
