// ═══════════════════════════════════════════════════════════════════════════════
// Template: Bold Impact
// High contrast, attention-grabbing design
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { VIBRANT_PALETTES } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const boldImpactTemplate: CarouselTemplate = {
  id: "bold-impact",
  name: "Bold Impact",
  description: "High contrast design that grabs attention. Perfect for announcements and key insights.",
  category: "bold",
  isPremium: false,
  isCustom: false,
  palette: VIBRANT_PALETTES.find(p => p.id === "midnight-blue")!,
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["bold", "dark", "impactful", "contrast"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    {
      id: generateSlideId(),
      name: "Cover",
      order: 0,
      background: {
        type: "gradient",
        gradient: { from: "#0D1B2A", to: "#1B263B", direction: "to-br" },
      },
      elements: [
        createShapeElement("circle", -100, -100, 400, 400, "#415A77", { opacity: 0.2 }),
        createShapeElement("circle", 800, 950, 400, 400, "#415A77", { opacity: 0.15 }),
        createShapeElement("line", 60, 350, 80, 4, "#778DA9"),
        createTextElement(
          "BOLD\nSTATEMENT\nHERE",
          60, 400, 960, 350,
          { fontSize: 72, fontWeight: 800, lineHeight: 1.1, textAlign: "left", color: "#FFFFFF", textTransform: "uppercase" },
          "heading"
        ),
        createShapeElement("line", 60, 800, 300, 2, "#778DA9"),
        createTextElement(
          "A powerful subtitle that supports your message",
          60, 840, 960, 80,
          { fontSize: 22, fontWeight: 400, textAlign: "left", color: "#778DA9" },
          "subheading"
        ),
        createTextElement(
          "@yourhandle",
          60, 1260, 960, 30,
          { fontSize: 16, fontWeight: 500, textAlign: "left", color: "#778DA9" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Key Point",
      order: 1,
      background: { type: "solid", color: "#0D1B2A" },
      elements: [
        createShapeElement("rectangle", 0, 0, 8, 1350, "#778DA9"),
        createTextElement(
          "KEY INSIGHT",
          60, 80, 400, 35,
          { fontSize: 13, fontWeight: 600, letterSpacing: 4, color: "#778DA9", textTransform: "uppercase" },
          "text"
        ),
        createShapeElement("line", 60, 140, 60, 3, "#778DA9"),
        createTextElement(
          "The Main Point\nYou Want to Make",
          60, 200, 960, 180,
          { fontSize: 48, fontWeight: 800, lineHeight: 1.2, color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Supporting details and explanation that gives context to your main point. Be specific and data-driven when possible.",
          60, 440, 960, 220,
          { fontSize: 24, fontWeight: 400, lineHeight: 1.7, color: "#E0E1DD" },
          "body"
        ),
        createShapeElement("rounded-rectangle", 60, 720, 960, 160, "#1B263B", { borderRadius: 12 }),
        createTextElement(
          "Remember",
          100, 760, 880, 30,
          { fontSize: 14, fontWeight: 600, letterSpacing: 2, color: "#778DA9", textTransform: "uppercase" },
          "text"
        ),
        createTextElement(
          "A key takeaway that reinforces your point",
          100, 800, 880, 50,
          { fontSize: 20, fontWeight: 500, color: "#FFFFFF" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Statistic",
      order: 2,
      background: { type: "solid", color: "#1B263B" },
      elements: [
        createTextElement(
          "87%",
          60, 400, 960, 220,
          { fontSize: 160, fontWeight: 900, textAlign: "center", color: "#778DA9" },
          "text"
        ),
        createTextElement(
          "of professionals agree with this statement",
          60, 640, 960, 70,
          { fontSize: 28, fontWeight: 500, textAlign: "center", color: "#E0E1DD" },
          "text"
        ),
        createShapeElement("line", 390, 760, 300, 2, "#415A77"),
        createTextElement(
          "Source: Your Research Study, 2024",
          60, 800, 960, 30,
          { fontSize: 14, fontWeight: 400, textAlign: "center", color: "#778DA9" },
          "text"
        ),
      ],
    },
  ],
}
