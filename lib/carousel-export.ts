"use client"

import jsPDF from "jspdf"
import { 
  CarouselTemplate, 
  Slide, 
  SlideElement, 
  TextElement, 
  ShapeElement,
  SlideBackground,
  GradientDirection,
  CAROUSEL_SIZES
} from "./carousel-designer-types"

// Export format types
export type ExportFormat = "png" | "jpg" | "jpeg" | "pdf"

export interface ExportOptions {
  format: ExportFormat
  slideIndices?: number[]
  scale?: number // Default 2 for high quality
  includeGrid?: boolean
  quality?: number // 0-1 for jpg/jpeg
}

// ─────────────────────────────────────────────────────────────────────────────────
// Color Conversion Utilities
// html2canvas doesn't support oklch colors, so we need to convert them
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Converts oklch color to hex/rgb that html2canvas can understand
 */
function convertOklchToHex(color: string): string {
  if (!color) return "#000000"
  
  // If it's already a valid color (hex, rgb, hsl), return as-is
  if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl")) {
    // For hsl, convert to rgb for better compatibility
    if (color.startsWith("hsl")) {
      return hslToHex(color)
    }
    return color
  }
  
  // Handle oklch colors
  if (color.startsWith("oklch")) {
    return oklchToHex(color)
  }
  
  // Handle CSS variable references - return a fallback
  if (color.startsWith("var(")) {
    return "#000000"
  }
  
  // Named colors or other formats - return as-is and hope for the best
  return color
}

/**
 * Convert oklch string to hex
 * oklch(L C H) where L is 0-1, C is 0-0.4+, H is 0-360
 */
function oklchToHex(oklch: string): string {
  try {
    // Parse oklch(0.5 0.2 180) or oklch(50% 0.2 180deg) format
    const match = oklch.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg)?)\s*(?:\/\s*([\d.]+%?))?\)/)
    if (!match) return "#000000"
    
    let L = parseFloat(match[1])
    let C = parseFloat(match[2])
    let H = parseFloat(match[3])
    
    // Handle percentage for L
    if (match[1].includes("%")) L /= 100
    
    // Handle percentage for C (usually not percentage but could be)
    if (match[2].includes("%")) C = C / 100 * 0.4
    
    // Convert OKLCH to sRGB (simplified approximation)
    // This is a simplified conversion - not perfectly accurate but good enough
    const hRad = (H * Math.PI) / 180
    
    // Convert to OKLab
    const a = C * Math.cos(hRad)
    const b = C * Math.sin(hRad)
    
    // Convert OKLab to linear sRGB (simplified)
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b
    
    const l = l_ * l_ * l_
    const m = m_ * m_ * m_
    const s = s_ * s_ * s_
    
    let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    
    // Clamp and convert to 0-255
    r = Math.max(0, Math.min(1, r))
    g = Math.max(0, Math.min(1, g))
    bl = Math.max(0, Math.min(1, bl))
    
    // Apply gamma correction
    r = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1/2.4) - 0.055
    g = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1/2.4) - 0.055
    bl = bl <= 0.0031308 ? 12.92 * bl : 1.055 * Math.pow(bl, 1/2.4) - 0.055
    
    // Convert to hex
    const toHex = (n: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, n * 255))).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(bl)}`
  } catch {
    return "#000000"
  }
}

/**
 * Convert HSL string to hex
 */
function hslToHex(hsl: string): string {
  try {
    const match = hsl.match(/hsl\(\s*([\d.]+)\s*,?\s*([\d.]+)%?\s*,?\s*([\d.]+)%?\s*(?:\/\s*([\d.]+%?))?\)/)
    if (!match) return "#000000"
    
    let h = parseFloat(match[1]) / 360
    let s = parseFloat(match[2]) / 100
    let l = parseFloat(match[3]) / 100
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  } catch {
    return "#000000"
  }
}

/**
 * Convert any color to a format Canvas API can handle
 */
export function convertColorForExport(color: string | undefined): string {
  if (!color) return "transparent"
  return convertOklchToHex(color)
}

// ─────────────────────────────────────────────────────────────────────────────────
// Gradient Direction Helper
// ─────────────────────────────────────────────────────────────────────────────────

export function getGradientAngle(direction: GradientDirection): string {
  const angles: Record<GradientDirection, string> = {
    "to-t": "0deg",
    "to-b": "180deg",
    "to-l": "270deg",
    "to-r": "90deg",
    "to-tl": "315deg",
    "to-tr": "45deg",
    "to-bl": "225deg",
    "to-br": "135deg",
  }
  return angles[direction] || "135deg"
}

// ─────────────────────────────────────────────────────────────────────────────────
// Pattern Generation
// ─────────────────────────────────────────────────────────────────────────────────

type PatternType = "dots" | "lines" | "grid" | "diagonal" | "cross" | "waves" | "circles" | "squares"

function generatePatternSVG(type: PatternType, color: string, scale: number, opacity: number): string {
  const size = 20 * scale
  const safeColor = convertColorForExport(color)
  
  const patterns: Record<PatternType, string> = {
    dots: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size/2}" cy="${size/2}" r="${size/8}" fill="${safeColor}" opacity="${opacity}"/></svg>`,
    lines: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="${size/2}" x2="${size}" y2="${size/2}" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/></svg>`,
    grid: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="${size}" y2="0" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/><line x1="0" y1="0" x2="0" y2="${size}" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/></svg>`,
    diagonal: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/></svg>`,
    cross: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><line x1="${size/2}" y1="0" x2="${size/2}" y2="${size}" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/><line x1="0" y1="${size/2}" x2="${size}" y2="${size/2}" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/></svg>`,
    waves: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><path d="M0,${size/2} Q${size/4},${size/4} ${size/2},${size/2} T${size},${size/2}" fill="none" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/></svg>`,
    circles: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="none" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/></svg>`,
    squares: `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="none" stroke="${safeColor}" stroke-width="1" opacity="${opacity}"/></svg>`,
  }
  
  const svg = patterns[type] || patterns.dots
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// ─────────────────────────────────────────────────────────────────────────────────
// Main Export Function - Pure Canvas API (no html2canvas dependency)
// ─────────────────────────────────────────────────────────────────────────────────

export async function exportCarouselSlides(
  template: CarouselTemplate,
  options: ExportOptions
): Promise<Blob[]> {
  const { format, slideIndices, scale = 2, includeGrid = false, quality = 0.95 } = options
  const size = CAROUSEL_SIZES[template.size]
  
  // Determine which slides to export
  const indicesToExport = slideIndices || template.slides.map((_, i) => i)
  
  const blobs: Blob[] = []
  
  // Use pure Canvas API for rendering - more reliable than html2canvas
  for (const slideIndex of indicesToExport) {
    const slide = template.slides[slideIndex]
    if (!slide) continue
    
    // Create canvas at the desired scale
    const canvas = document.createElement('canvas')
    canvas.width = size.width * scale
    canvas.height = size.height * scale
    const ctx = canvas.getContext('2d')!
    
    // Scale for high DPI
    ctx.scale(scale, scale)
    
    // Render slide to canvas
    await renderSlideToCanvas(ctx, slide, template, size, includeGrid)
    
    // Convert to blob
    const mimeType = format === "png" ? "image/png" : "image/jpeg"
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Failed to create blob"))
        },
        mimeType,
        format === "png" ? undefined : quality
      )
    })
    
    blobs.push(blob)
  }
  
  return blobs
}

/**
 * Render a slide directly to a Canvas 2D context
 */
async function renderSlideToCanvas(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  template: CarouselTemplate,
  size: { width: number; height: number },
  showGrid: boolean
): Promise<void> {
  // Clear canvas
  ctx.clearRect(0, 0, size.width, size.height)
  
  // Render background
  await renderBackgroundToCanvas(ctx, slide.background, size)
  
  // Render elements sorted by zIndex
  const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex)
  
  for (const element of sortedElements) {
    if (!element.visible) continue
    
    ctx.save()
    
    // Apply transform (rotation)
    if (element.rotation !== 0) {
      const centerX = element.x + element.width / 2
      const centerY = element.y + element.height / 2
      ctx.translate(centerX, centerY)
      ctx.rotate((element.rotation * Math.PI) / 180)
      ctx.translate(-centerX, -centerY)
    }
    
    // Apply opacity
    ctx.globalAlpha = element.opacity
    
    if (["text", "heading", "subheading", "body", "quote"].includes(element.type)) {
      await renderTextToCanvas(ctx, element as TextElement)
    } else if (element.type === "shape") {
      await renderShapeToCanvas(ctx, element as ShapeElement)
    }
    
    ctx.restore()
  }
  
  // Render grid if enabled
  if (showGrid) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
    ctx.lineWidth = 1
    for (let x = 0; x <= size.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, size.height)
      ctx.stroke()
    }
    for (let y = 0; y <= size.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(size.width, y)
      ctx.stroke()
    }
  }
}

/**
 * Render background to canvas
 */
async function renderBackgroundToCanvas(
  ctx: CanvasRenderingContext2D,
  bg: SlideBackground,
  size: { width: number; height: number }
): Promise<void> {
  if (bg.type === "solid") {
    ctx.fillStyle = convertColorForExport(bg.color) || "#FFFFFF"
    ctx.fillRect(0, 0, size.width, size.height)
  } else if (bg.type === "gradient" && bg.gradient) {
    const angle = parseFloat(getGradientAngle(bg.gradient.direction)) * Math.PI / 180
    const centerX = size.width / 2
    const centerY = size.height / 2
    const length = Math.sqrt(size.width * size.width + size.height * size.height) / 2
    
    const x0 = centerX - Math.cos(angle) * length
    const y0 = centerY - Math.sin(angle) * length
    const x1 = centerX + Math.cos(angle) * length
    const y1 = centerY + Math.sin(angle) * length
    
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
    gradient.addColorStop(0, convertColorForExport(bg.gradient.from))
    gradient.addColorStop(1, convertColorForExport(bg.gradient.to))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size.width, size.height)
  } else if (bg.type === "image" && bg.image?.src) {
    try {
      const img = await loadImage(bg.image.src)
      ctx.globalAlpha = bg.image.opacity ?? 1
      // Cover mode
      const imgRatio = img.width / img.height
      const canvasRatio = size.width / size.height
      let drawWidth, drawHeight, drawX, drawY
      if (imgRatio > canvasRatio) {
        drawHeight = size.height
        drawWidth = img.width * (size.height / img.height)
        drawX = (size.width - drawWidth) / 2
        drawY = 0
      } else {
        drawWidth = size.width
        drawHeight = img.height * (size.width / img.width)
        drawX = 0
        drawY = (size.height - drawHeight) / 2
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.globalAlpha = 1
    } catch (e) {
      // Fallback to white if image fails
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(0, 0, size.width, size.height)
    }
  } else {
    // Default white background
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, size.width, size.height)
  }
}

/**
 * Load an image from URL
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Wrap text to fit within a given width (emulates CSS white-space: pre-wrap)
 * This properly wraps text by words while preserving explicit line breaks
 */
function wrapText(
  ctx: CanvasRenderingContext2D, 
  text: string, 
  maxWidth: number, 
  letterSpacing: number
): string[] {
  const wrappedLines: string[] = []
  
  // First split by explicit newlines (preserving pre-wrap behavior)
  const paragraphs = text.split('\n')
  
  for (const paragraph of paragraphs) {
    // If empty paragraph (empty line), add empty string to preserve it
    if (paragraph === '') {
      wrappedLines.push('')
      continue
    }
    
    // Split paragraph into words
    const words = paragraph.split(/(\s+)/) // Split and keep whitespace
    let currentLine = ''
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine + word
      const testWidth = letterSpacing !== 0 
        ? measureTextWithLetterSpacing(ctx, testLine, letterSpacing)
        : ctx.measureText(testLine).width
      
      if (testWidth > maxWidth && currentLine !== '') {
        // Current line is full, push it and start new line
        wrappedLines.push(currentLine.trimEnd())
        currentLine = word.trimStart() // Start new line without leading whitespace
      } else {
        currentLine = testLine
      }
    }
    
    // Don't forget the last line
    if (currentLine !== '') {
      wrappedLines.push(currentLine.trimEnd())
    }
  }
  
  return wrappedLines
}

/**
 * Render text element to canvas with proper word wrapping
 */
async function renderTextToCanvas(ctx: CanvasRenderingContext2D, textEl: TextElement): Promise<void> {
  const { x, y, width, height, content, style, padding, backgroundColor, borderRadius } = textEl
  
  // Draw background if present
  const bgGradient = (textEl as any).bgGradient
  if (bgGradient?.enabled || backgroundColor) {
    ctx.save()
    
    // Create rounded rectangle path
    const r = borderRadius || 0
    
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, r)
    
    if (bgGradient?.enabled) {
      const angle = parseFloat(getGradientAngle(bgGradient.direction || "to-br")) * Math.PI / 180
      const centerX = x + width / 2
      const centerY = y + height / 2
      const length = Math.sqrt(width * width + height * height) / 2
      
      const x0 = centerX - Math.cos(angle) * length
      const y0 = centerY - Math.sin(angle) * length
      const x1 = centerX + Math.cos(angle) * length
      const y1 = centerY + Math.sin(angle) * length
      
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
      gradient.addColorStop(0, convertColorForExport(bgGradient.from))
      gradient.addColorStop(1, convertColorForExport(bgGradient.to))
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = convertColorForExport(backgroundColor)
    }
    
    ctx.fill()
    ctx.restore()
  }
  
  // Set up text styles
  const fontStyle = style.fontStyle || "normal"
  const fontWeight = style.fontWeight || 400
  const fontSize = style.fontSize || 16
  const fontFamily = style.fontFamily || "system-ui, -apple-system, sans-serif"
  
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.textBaseline = "top"
  
  // Handle text color or gradient
  const textGradient = (textEl as any).textGradient
  if (textGradient?.enabled) {
    const angle = parseFloat(getGradientAngle(textGradient.direction || "to-br")) * Math.PI / 180
    const centerX = x + width / 2
    const centerY = y + height / 2
    const length = Math.sqrt(width * width + height * height) / 2
    
    const x0 = centerX - Math.cos(angle) * length
    const y0 = centerY - Math.sin(angle) * length
    const x1 = centerX + Math.cos(angle) * length
    const y1 = centerY + Math.sin(angle) * length
    
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
    gradient.addColorStop(0, convertColorForExport(textGradient.from))
    gradient.addColorStop(1, convertColorForExport(textGradient.to))
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = convertColorForExport(style.color)
  }
  
  // Calculate text position with padding
  const paddingLeft = padding?.left || 0
  const paddingRight = padding?.right || 0
  const paddingTop = padding?.top || 0
  const textX = x + paddingLeft
  const textY = y + paddingTop
  const textWidth = width - paddingLeft - paddingRight
  
  // Handle text transform
  let displayText = content
  if (style.textTransform === "uppercase") {
    displayText = content.toUpperCase()
  } else if (style.textTransform === "lowercase") {
    displayText = content.toLowerCase()
  } else if (style.textTransform === "capitalize") {
    displayText = content.replace(/\b\w/g, c => c.toUpperCase())
  }
  
  // Handle letter spacing
  const letterSpacing = style.letterSpacing || 0
  const lineHeight = (style.lineHeight || 1.4) * fontSize
  
  // Wrap text to fit within container width (emulates CSS white-space: pre-wrap)
  const wrappedLines = wrapText(ctx, displayText, textWidth, letterSpacing)
  
  let currentY = textY
  
  for (const line of wrappedLines) {
    // Calculate line width for alignment
    const lineWidth = letterSpacing !== 0 
      ? measureTextWithLetterSpacing(ctx, line, letterSpacing)
      : ctx.measureText(line).width
    
    // Calculate starting X position based on alignment
    let drawX = textX
    if (style.textAlign === "center") {
      drawX = textX + (textWidth - lineWidth) / 2
    } else if (style.textAlign === "right") {
      drawX = textX + textWidth - lineWidth
    }
    
    if (letterSpacing !== 0) {
      // Draw character by character with letter spacing
      let charX = drawX
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        ctx.fillText(char, charX, currentY)
        charX += ctx.measureText(char).width + letterSpacing
      }
    } else {
      // Draw normally (reset textAlign since we calculated position manually)
      ctx.textAlign = "left"
      ctx.fillText(line, drawX, currentY)
    }
    
    currentY += lineHeight
  }
  
  // Handle text decoration
  if (style.textDecoration === "underline") {
    ctx.strokeStyle = ctx.fillStyle as string
    ctx.lineWidth = Math.max(1, fontSize / 12)
    
    // Draw underline for each line
    currentY = textY
    for (const line of wrappedLines) {
      const lineWidth = letterSpacing !== 0 
        ? measureTextWithLetterSpacing(ctx, line, letterSpacing)
        : ctx.measureText(line).width
      
      let lineX = textX
      if (style.textAlign === "center") {
        lineX = textX + (textWidth - lineWidth) / 2
      } else if (style.textAlign === "right") {
        lineX = textX + textWidth - lineWidth
      }
      
      ctx.beginPath()
      ctx.moveTo(lineX, currentY + fontSize + 2)
      ctx.lineTo(lineX + lineWidth, currentY + fontSize + 2)
      ctx.stroke()
      
      currentY += lineHeight
    }
  }
}

/**
 * Measure text width with letter spacing
 */
function measureTextWithLetterSpacing(ctx: CanvasRenderingContext2D, text: string, letterSpacing: number): number {
  let width = 0
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width
    if (i < text.length - 1) {
      width += letterSpacing
    }
  }
  return width
}

/**
 * Render shape element to canvas
 */
async function renderShapeToCanvas(ctx: CanvasRenderingContext2D, shapeEl: ShapeElement): Promise<void> {
  const { x, y, width, height, shapeType, fill, stroke, strokeWidth, strokeDasharray, borderRadius } = shapeEl
  
  ctx.save()
  
  // Set fill style
  const gradient = (shapeEl as any).gradient
  if (gradient?.enabled) {
    const angle = parseFloat(getGradientAngle(gradient.direction || "to-br")) * Math.PI / 180
    const centerX = x + width / 2
    const centerY = y + height / 2
    const length = Math.sqrt(width * width + height * height) / 2
    
    const x0 = centerX - Math.cos(angle) * length
    const y0 = centerY - Math.sin(angle) * length
    const x1 = centerX + Math.cos(angle) * length
    const y1 = centerY + Math.sin(angle) * length
    
    const grad = ctx.createLinearGradient(x0, y0, x1, y1)
    grad.addColorStop(0, convertColorForExport(gradient.from))
    grad.addColorStop(1, convertColorForExport(gradient.to))
    ctx.fillStyle = grad
  } else {
    ctx.fillStyle = convertColorForExport(fill)
  }
  
  // Set stroke style
  ctx.strokeStyle = convertColorForExport(stroke)
  ctx.lineWidth = strokeWidth || 0
  
  // Set dash pattern
  if (strokeDasharray) {
    const dashArray = strokeDasharray.split(',').map(s => parseFloat(s.trim()))
    ctx.setLineDash(dashArray)
  }
  
  // Draw shape based on type
  ctx.beginPath()
  
  switch (shapeType) {
    case "rectangle":
      ctx.rect(x, y, width, height)
      break
    case "rounded-rectangle":
      ctx.roundRect(x, y, width, height, borderRadius || 0)
      break
    case "circle":
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      break
    case "ellipse":
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      break
    case "triangle":
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x, y + height)
      ctx.closePath()
      break
    case "diamond":
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height / 2)
      ctx.lineTo(x + width / 2, y + height)
      ctx.lineTo(x, y + height / 2)
      ctx.closePath()
      break
    case "hexagon":
      const hx = width / 4
      ctx.moveTo(x + hx, y)
      ctx.lineTo(x + width - hx, y)
      ctx.lineTo(x + width, y + height / 2)
      ctx.lineTo(x + width - hx, y + height)
      ctx.lineTo(x + hx, y + height)
      ctx.lineTo(x, y + height / 2)
      ctx.closePath()
      break
    case "star":
      const cx = x + width / 2
      const cy = y + height / 2
      const outerR = Math.min(width, height) / 2
      const innerR = outerR * 0.4
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR
        const angle = (i * Math.PI) / 5 - Math.PI / 2
        const px = cx + r * Math.cos(angle)
        const py = cy + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      break
    case "line":
      ctx.moveTo(x, y + height / 2)
      ctx.lineTo(x + width, y + height / 2)
      break
    default:
      ctx.rect(x, y, width, height)
  }
  
  // Fill and stroke
  if (shapeType !== "line") {
    ctx.fill()
  }
  if (strokeWidth && strokeWidth > 0) {
    ctx.stroke()
  }
  
  ctx.restore()
  
  // Handle background image for shape
  if ((shapeEl as any).backgroundImage) {
    try {
      const img = await loadImage((shapeEl as any).backgroundImage)
      ctx.save()
      
      // Clip to shape
      ctx.beginPath()
      if (shapeType === "circle" || shapeType === "ellipse") {
        ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      } else if (shapeType === "rounded-rectangle") {
        ctx.roundRect(x, y, width, height, borderRadius || 0)
      } else {
        ctx.rect(x, y, width, height)
      }
      ctx.clip()
      
      // Draw image (cover mode)
      const imgRatio = img.width / img.height
      const shapeRatio = width / height
      let drawWidth, drawHeight, drawX, drawY
      if (imgRatio > shapeRatio) {
        drawHeight = height
        drawWidth = img.width * (height / img.height)
        drawX = x + (width - drawWidth) / 2
        drawY = y
      } else {
        drawWidth = width
        drawHeight = img.height * (width / img.width)
        drawX = x
        drawY = y + (height - drawHeight) / 2
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      
      ctx.restore()
    } catch (e) {
      // Ignore image load failures
    }
  }
}

/**
 * Export slides and trigger download
 * Returns the blobs that were downloaded
 */
export async function downloadCarouselSlides(
  template: CarouselTemplate,
  options: ExportOptions
): Promise<Blob[]> {
  const { format, slideIndices } = options
  const indicesToExport = slideIndices || template.slides.map((_, i) => i)
  
  try {
    const blobs = await exportCarouselSlides(template, options)
    const size = CAROUSEL_SIZES[template.size]
    
    if (format === "pdf") {
      // Create PDF with all slides
      const pdf = new jsPDF({
        orientation: size.width > size.height ? "landscape" : "portrait",
        unit: "px",
        format: [size.width, size.height],
      })
      
      for (let i = 0; i < blobs.length; i++) {
        if (i > 0) pdf.addPage([size.width, size.height])
        const imgData = URL.createObjectURL(blobs[i])
        pdf.addImage(imgData, "PNG", 0, 0, size.width, size.height)
        URL.revokeObjectURL(imgData)
      }
      
      pdf.save(`${template.name}-carousel.pdf`)
    } else {
      // Download individual images
      const ext = format === "png" ? "png" : "jpg"
      
      blobs.forEach((blob, i) => {
        const actualSlideIndex = indicesToExport[i]
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${template.name}-slide-${actualSlideIndex + 1}.${ext}`
        a.click()
        URL.revokeObjectURL(url)
      })
    }
    
    return blobs
  } catch (error) {
    console.error("Export error:", error)
    throw error
  }
}

/**
 * Parse page range string into array of slide indices
 * Supports formats like: "1", "1,3,5", "1-5", "1,3-5,7"
 */
export function parsePageRange(range: string, totalSlides: number): number[] {
  const indices: Set<number> = new Set()
  const parts = range.split(",").map(s => s.trim()).filter(Boolean)
  
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(s => parseInt(s.trim(), 10))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalSlides, end); i++) {
          indices.add(i - 1) // Convert to 0-indexed
        }
      }
    } else {
      const num = parseInt(part, 10)
      if (!isNaN(num) && num >= 1 && num <= totalSlides) {
        indices.add(num - 1) // Convert to 0-indexed
      }
    }
  }
  
  return Array.from(indices).sort((a, b) => a - b)
}
