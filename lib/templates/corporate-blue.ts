// ═══════════════════════════════════════════════════════════════════════════════
// Template: Corporate Blue
// LinkedIn-native blue theme, perfect for B2B content
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { VIBRANT_PALETTES } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const corporateBlueTemplate: CarouselTemplate = {
  id: "corporate-blue",
  name: "Corporate Blue",
  description: "LinkedIn-native blue theme that feels professional and trustworthy. Ideal for B2B content.",
  category: "corporate",
  isPremium: false,
  isCustom: false,
  palette: VIBRANT_PALETTES.find(p => p.id === "professional-blue")!,
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["corporate", "linkedin", "professional", "b2b"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    {
      id: generateSlideId(),
      name: "Cover",
      order: 0,
      background: {
        type: "gradient",
        gradient: { from: "#0A66C2", to: "#004182", direction: "to-b" },
      },
      elements: [
        createShapeElement("rounded-rectangle", 60, 80, 140, 44, "rgba(255,255,255,0.15)", { borderRadius: 22 }),
        createTextElement(
          "GUIDE",
          60, 88, 140, 30,
          { fontSize: 13, fontWeight: 600, letterSpacing: 3, color: "#FFFFFF", textAlign: "center", textTransform: "uppercase" },
          "text"
        ),
        createTextElement(
          "Complete Guide to\nProfessional Success",
          60, 450, 960, 220,
          { fontSize: 52, fontWeight: 700, lineHeight: 1.2, textAlign: "center", color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "5 actionable strategies to elevate your career",
          60, 700, 960, 50,
          { fontSize: 22, fontWeight: 400, textAlign: "center", color: "#B3D4FC" },
          "subheading"
        ),
        createShapeElement("line", 440, 820, 200, 2, "rgba(255,255,255,0.3)"),
        createTextElement(
          "Your Name | Your Title",
          60, 1220, 960, 30,
          { fontSize: 16, fontWeight: 500, textAlign: "center", color: "rgba(255,255,255,0.8)" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Point 1",
      order: 1,
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        createShapeElement("rectangle", 0, 0, 1080, 120, "#0A66C2"),
        createTextElement(
          "STRATEGY 1 OF 5",
          60, 45, 400, 35,
          { fontSize: 13, fontWeight: 600, letterSpacing: 3, color: "#B3D4FC", textTransform: "uppercase" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 880, 30, 140, 60, "#004182", { borderRadius: 8 }),
        createTextElement(
          "01",
          880, 42, 140, 40,
          { fontSize: 32, fontWeight: 700, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
        createTextElement(
          "Strategy Title Here",
          60, 200, 960, 80,
          { fontSize: 40, fontWeight: 700, color: "#0A66C2" },
          "heading"
        ),
        createShapeElement("line", 60, 300, 80, 4, "#0A66C2"),
        createTextElement(
          "Detailed explanation of this strategy. Include specific examples and actionable steps that your audience can implement immediately.",
          60, 360, 960, 220,
          { fontSize: 24, fontWeight: 400, lineHeight: 1.7, color: "#374151" },
          "body"
        ),
        createShapeElement("rounded-rectangle", 60, 640, 960, 140, "#F0F7FF", { borderRadius: 12 }),
        createTextElement(
          "Pro Tip",
          100, 680, 880, 30,
          { fontSize: 14, fontWeight: 600, letterSpacing: 2, color: "#0A66C2", textTransform: "uppercase" },
          "text"
        ),
        createTextElement(
          "Add a practical tip here that provides immediate value",
          100, 720, 880, 40,
          { fontSize: 18, fontWeight: 500, color: "#1F2937" },
          "text"
        ),
      ],
    },
    {
      id: generateSlideId(),
      name: "Call to Action",
      order: 2,
      background: { type: "solid", color: "#0A66C2" },
      elements: [
        createTextElement(
          "Found this valuable?",
          60, 420, 960, 70,
          { fontSize: 44, fontWeight: 700, textAlign: "center", color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Repost to help others in your network",
          60, 520, 960, 50,
          { fontSize: 24, fontWeight: 400, textAlign: "center", color: "#B3D4FC" },
          "text"
        ),
        createTextElement(
          "Comment your thoughts below",
          60, 580, 960, 50,
          { fontSize: 24, fontWeight: 400, textAlign: "center", color: "#B3D4FC" },
          "text"
        ),
        createTextElement(
          "Follow for more insights",
          60, 640, 960, 50,
          { fontSize: 24, fontWeight: 400, textAlign: "center", color: "#B3D4FC" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 340, 780, 400, 60, "#FFFFFF", { borderRadius: 8 }),
        createTextElement(
          "Follow",
          340, 795, 400, 35,
          { fontSize: 18, fontWeight: 600, textAlign: "center", color: "#0A66C2" },
          "text"
        ),
        createTextElement(
          "@yourhandle",
          60, 1220, 960, 30,
          { fontSize: 18, fontWeight: 500, textAlign: "center", color: "#B3D4FC" },
          "text"
        ),
      ],
    },
  ],
}
