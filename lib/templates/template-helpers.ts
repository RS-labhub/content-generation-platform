// ═══════════════════════════════════════════════════════════════════════════════
// Template Helper Functions
// Shared utilities for creating carousel template elements
// ═══════════════════════════════════════════════════════════════════════════════

import type { TextElement, ShapeElement } from "../carousel-designer-types"

// ─────────────────────────────────────────────────────────────────────────────────
// ID Generators
// ─────────────────────────────────────────────────────────────────────────────────

let elementIdCounter = 0
export const generateElementId = () => `element-${++elementIdCounter}`
export const generateSlideId = () => `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Reset counter (useful for testing)
export const resetElementIdCounter = () => {
  elementIdCounter = 0
}

// ─────────────────────────────────────────────────────────────────────────────────
// Element Creators
// ─────────────────────────────────────────────────────────────────────────────────

export const createTextElement = (
  content: string,
  x: number,
  y: number,
  width: number,
  height: number,
  style: Partial<TextElement["style"]>,
  type: TextElement["type"] = "text",
  extras: Partial<TextElement> = {}
): TextElement => ({
  id: generateElementId(),
  type,
  content,
  x,
  y,
  width,
  height,
  rotation: 0,
  opacity: 1,
  locked: false,
  visible: true,
  zIndex: 1,
  style: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
    textAlign: "left",
    color: "#000000",
    ...style,
  },
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  ...extras,
})

export const createShapeElement = (
  shapeType: ShapeElement["shapeType"],
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  extras: Partial<ShapeElement> = {}
): ShapeElement => ({
  id: generateElementId(),
  type: "shape",
  shapeType,
  x,
  y,
  width,
  height,
  rotation: 0,
  opacity: 1,
  locked: false,
  visible: true,
  zIndex: 0,
  fill,
  stroke: "transparent",
  strokeWidth: 0,
  ...extras,
})

// ─────────────────────────────────────────────────────────────────────────────────
// Swipe Indicator Helpers
// Creates consistent "swipe" indicators for carousels
// ─────────────────────────────────────────────────────────────────────────────────

export const createSwipeIndicator = (
  text: string,
  x: number,
  y: number,
  width: number,
  color: string,
  fontSize: number = 16,
  align: "left" | "center" | "right" = "right"
): TextElement => createTextElement(
  text,
  x, y, width, 30,
  { fontSize, fontWeight: 500, textAlign: align, color, opacity: 0.8 },
  "text"
)

// Common swipe text variations
export const SWIPE_TEXTS = {
  swipeLeft: "← Swipe left",
  swipeRight: "Swipe right →",
  swipe: "Swipe →",
  next: "Next →",
  keepSwiping: "Keep swiping →",
  moreToGo: "More to go →",
  almostThere: "Almost there →",
  lastOne: "Last one! →",
  swipeForMore: "Swipe for more →",
  continueReading: "Continue reading →",
}
