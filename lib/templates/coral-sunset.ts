// ═══════════════════════════════════════════════════════════════════════════════
// Template: Coral Sunset
// Warm coral and orange tones - 6 slides
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const coralSunsetTemplate: CarouselTemplate = {
  id: "coral-sunset",
  name: "Coral Sunset",
  description: "Warm coral and orange tones that evoke energy and creativity.",
  category: "vibrant",
  isPremium: false,
  isCustom: false,
  palette: {
    id: "coral-warm",
    name: "Coral Warm",
    category: "vibrant",
    colors: {
      primary: "#F97316",
      secondary: "#FB923C",
      accent: "#FDBA74",
      background: "#FFFBF7",
      text: "#1C1917",
      textSecondary: "#57534E",
    },
    gradient: { from: "#F97316", to: "#FB923C", direction: "to-br" },
  },
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["vibrant", "warm", "coral", "energetic", "creative"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    {
      id: generateSlideId(),
      name: "Intro",
      order: 0,
      background: { type: "gradient", gradient: { from: "#F97316", to: "#FB923C", direction: "to-br" }, color: "#F97316" },
      elements: [
        createShapeElement("circle", 700, -100, 500, 500, "#FDBA74", { opacity: 0.25 }),
        createShapeElement("circle", -100, 900, 400, 400, "#FFFFFF", { opacity: 0.15 }),
        createShapeElement("line", 60, 480, 80, 3, "#FFFFFF"),
        createTextElement(
          "YOUR\nAMAZING\nTITLE",
          60, 520, 960, 320,
          { fontSize: 76, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 },
          "heading"
        ),
        createTextElement(
          "A subtitle that hooks your audience",
          60, 900, 960, 45,
          { fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.9)" },
          "text"
        ),
        createTextElement(
          "@yourhandle",
          60, 1250, 960, 30,
          { fontSize: 18, fontWeight: 600, textAlign: "right", color: "rgba(255,255,255,0.8)" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Content 1",
      order: 1,
      background: { type: "solid", color: "#FFFBF7" },
      elements: [
        createShapeElement("rounded-rectangle", 0, 0, 1080, 180, "#F97316", { borderRadius: 0 }),
        createTextElement(
          "Point 01",
          60, 65, 300, 50,
          { fontSize: 28, fontWeight: 700, color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "The Main Idea",
          60, 260, 960, 80,
          { fontSize: 48, fontWeight: 800, color: "#1C1917" },
          "heading"
        ),
        createTextElement(
          "Explain your concept here with clarity and purpose. Make every word count.",
          60, 380, 960, 180,
          { fontSize: 26, fontWeight: 400, color: "#57534E", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("circle", 800, 1000, 200, 200, "#FDBA74", { opacity: 0.4 }),
      ],
    },
    {
      id: generateSlideId(),
      name: "Content 2",
      order: 2,
      background: { type: "solid", color: "#FFFBF7" },
      elements: [
        createShapeElement("rounded-rectangle", 0, 0, 1080, 180, "#FB923C", { borderRadius: 0 }),
        createTextElement(
          "Point 02",
          60, 65, 300, 50,
          { fontSize: 28, fontWeight: 700, color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "The Second Insight",
          60, 260, 960, 80,
          { fontSize: 48, fontWeight: 800, color: "#1C1917" },
          "heading"
        ),
        createTextElement(
          "Build upon your first point. Create a logical flow that keeps readers engaged.",
          60, 380, 960, 180,
          { fontSize: 26, fontWeight: 400, color: "#57534E", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("circle", -50, 1050, 200, 200, "#F97316", { opacity: 0.25 }),
      ],
    },
    {
      id: generateSlideId(),
      name: "Content 3",
      order: 3,
      background: { type: "solid", color: "#FFFBF7" },
      elements: [
        createShapeElement("rounded-rectangle", 0, 0, 1080, 180, "#FDBA74", { borderRadius: 0 }),
        createTextElement(
          "Point 03",
          60, 65, 300, 50,
          { fontSize: 28, fontWeight: 700, color: "#1C1917" },
          "heading"
        ),
        createTextElement(
          "The Final Piece",
          60, 260, 960, 80,
          { fontSize: 48, fontWeight: 800, color: "#1C1917" },
          "heading"
        ),
        createTextElement(
          "Conclude your argument strongly. Leave your audience with something to remember.",
          60, 380, 960, 180,
          { fontSize: 26, fontWeight: 400, color: "#57534E", lineHeight: 1.7 },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Quote",
      order: 4,
      background: { type: "solid", color: "#1C1917" },
      elements: [
        createShapeElement("line", 100, 400, 4, 200, "#F97316"),
        createTextElement(
          "A memorable quote that ties everything together beautifully.",
          140, 400, 860, 250,
          { fontSize: 36, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.6 },
          "text"
        ),
        createShapeElement("line", 140, 700, 200, 4, "#FB923C"),
      ],
    },
    {
      id: generateSlideId(),
      name: "Outro",
      order: 5,
      background: { type: "gradient", gradient: { from: "#FB923C", to: "#F97316", direction: "to-b" }, color: "#FB923C" },
      elements: [
        createTextElement(
          "Thanks for reading",
          60, 500, 960, 80,
          { fontSize: 46, fontWeight: 700, textAlign: "center", color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Follow for more insights",
          60, 600, 960, 50,
          { fontSize: 26, fontWeight: 500, textAlign: "center", color: "rgba(255,255,255,0.9)" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 340, 720, 400, 70, "#FFFFFF", { borderRadius: 10 }),
        createTextElement(
          "@yourhandle",
          340, 735, 400, 40,
          { fontSize: 24, fontWeight: 700, textAlign: "center", color: "#F97316" },
          "text"
        ),
      ],
    },
  ],
}
