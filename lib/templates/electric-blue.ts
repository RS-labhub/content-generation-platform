// ═══════════════════════════════════════════════════════════════════════════════
// Template: Electric Blue
// Vibrant blue with electric accents - 7 slides
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const electricBlueTemplate: CarouselTemplate = {
  id: "electric-blue",
  name: "Electric Blue",
  description: "Vibrant blue tones with electric accents for tech and innovation content.",
  category: "vibrant",
  isPremium: false,
  isCustom: false,
  palette: {
    id: "electric-tech",
    name: "Electric Tech",
    category: "vibrant",
    colors: {
      primary: "#2563EB",
      secondary: "#3B82F6",
      accent: "#60A5FA",
      background: "#F8FAFC",
      text: "#0F172A",
      textSecondary: "#475569",
    },
    gradient: { from: "#2563EB", to: "#3B82F6", direction: "to-r" },
  },
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["vibrant", "blue", "tech", "modern", "electric"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    {
      id: generateSlideId(),
      name: "Intro",
      order: 0,
      background: { type: "gradient", gradient: { from: "#2563EB", to: "#4F46E5", direction: "to-br" }, color: "#2563EB" },
      elements: [
        createShapeElement("circle", 600, -200, 800, 800, "#60A5FA", { opacity: 0.15 }),
        createShapeElement("circle", -200, 800, 600, 600, "#FFFFFF", { opacity: 0.08 }),
        createTextElement(
          "POWER UP YOUR",
          60, 450, 960, 50,
          { fontSize: 28, fontWeight: 600, textAlign: "center", color: "#93C5FD", letterSpacing: 6 },
          "text"
        ),
        createTextElement(
          "KNOWLEDGE",
          60, 520, 960, 120,
          { fontSize: 72, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Slide to learn more",
          60, 700, 960, 40,
          { fontSize: 22, fontWeight: 500, textAlign: "center", color: "rgba(255,255,255,0.8)" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Insight 1",
      order: 1,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 80, 120, 120, "#2563EB", { borderRadius: 24 }),
        createTextElement(
          "01",
          60, 105, 120, 70,
          { fontSize: 44, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
        createTextElement(
          "First Insight",
          60, 260, 960, 80,
          { fontSize: 48, fontWeight: 800, color: "#0F172A" },
          "heading"
        ),
        createTextElement(
          "Share your first key insight here. Be specific and provide value.",
          60, 380, 960, 180,
          { fontSize: 26, fontWeight: 400, color: "#475569", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 620, 960, 4, "#60A5FA", { borderRadius: 2 }),
      ],
    },
    {
      id: generateSlideId(),
      name: "Insight 2",
      order: 2,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 80, 120, 120, "#3B82F6", { borderRadius: 24 }),
        createTextElement(
          "02",
          60, 105, 120, 70,
          { fontSize: 44, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
        createTextElement(
          "Second Insight",
          60, 260, 960, 80,
          { fontSize: 48, fontWeight: 800, color: "#0F172A" },
          "heading"
        ),
        createTextElement(
          "Build upon your narrative with this second point. Keep momentum going.",
          60, 380, 960, 180,
          { fontSize: 26, fontWeight: 400, color: "#475569", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 620, 960, 4, "#2563EB", { borderRadius: 2 }),
      ],
    },
    {
      id: generateSlideId(),
      name: "Insight 3",
      order: 3,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 80, 120, 120, "#4F46E5", { borderRadius: 24 }),
        createTextElement(
          "03",
          60, 105, 120, 70,
          { fontSize: 44, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
        createTextElement(
          "Third Insight",
          60, 260, 960, 80,
          { fontSize: 48, fontWeight: 800, color: "#0F172A" },
          "heading"
        ),
        createTextElement(
          "Drive your message home with this final insight. Make it memorable.",
          60, 380, 960, 180,
          { fontSize: 26, fontWeight: 400, color: "#475569", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 620, 960, 4, "#60A5FA", { borderRadius: 2 }),
      ],
    },
    {
      id: generateSlideId(),
      name: "Stats",
      order: 4,
      background: { type: "gradient", gradient: { from: "#0F172A", to: "#1E293B", direction: "to-b" }, color: "#0F172A" },
      elements: [
        createTextElement(
          "3X",
          60, 400, 960, 200,
          { fontSize: 160, fontWeight: 800, textAlign: "center", color: "#60A5FA" },
          "heading"
        ),
        createTextElement(
          "More effective than the alternative",
          60, 620, 960, 60,
          { fontSize: 28, fontWeight: 500, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Pro Tips",
      order: 5,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createTextElement(
          "PRO TIPS",
          60, 100, 960, 50,
          { fontSize: 22, fontWeight: 700, color: "#2563EB", letterSpacing: 4 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 200, 960, 120, "#FFFFFF", { borderRadius: 16, stroke: "#E2E8F0", strokeWidth: 2 }),
        createTextElement(
          "First actionable tip here",
          120, 235, 860, 50,
          { fontSize: 22, fontWeight: 500, color: "#0F172A" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 360, 960, 120, "#FFFFFF", { borderRadius: 16, stroke: "#E2E8F0", strokeWidth: 2 }),
        createTextElement(
          "Second actionable tip here",
          120, 395, 860, 50,
          { fontSize: 22, fontWeight: 500, color: "#0F172A" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 520, 960, 120, "#FFFFFF", { borderRadius: 16, stroke: "#E2E8F0", strokeWidth: 2 }),
        createTextElement(
          "Third actionable tip here",
          120, 555, 860, 50,
          { fontSize: 22, fontWeight: 500, color: "#0F172A" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Outro",
      order: 6,
      background: { type: "gradient", gradient: { from: "#4F46E5", to: "#2563EB", direction: "to-br" }, color: "#4F46E5" },
      elements: [
        createTextElement(
          "FOLLOW FOR MORE",
          60, 480, 960, 50,
          { fontSize: 24, fontWeight: 600, textAlign: "center", color: "#93C5FD", letterSpacing: 6 },
          "text"
        ),
        createTextElement(
          "@yourhandle",
          60, 550, 960, 80,
          { fontSize: 52, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Like  |  Share  |  Comment",
          60, 700, 960, 50,
          { fontSize: 22, fontWeight: 500, textAlign: "center", color: "rgba(255,255,255,0.9)" },
          "text"
        ),
      ],
    },
  ],
}
