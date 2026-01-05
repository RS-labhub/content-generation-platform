// ═══════════════════════════════════════════════════════════════════════════════
// Template: Neon Vibrant
// Bold neon colors with dark background - Professional modern design
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const neonVibrantTemplate: CarouselTemplate = {
  id: "neon-vibrant",
  name: "Neon Vibrant",
  description: "Bold neon colors on dark backgrounds. Eye-catching design for maximum engagement.",
  category: "vibrant",
  isPremium: false,
  isCustom: false,
  palette: {
    id: "neon-dark",
    name: "Neon Dark",
    category: "vibrant",
    colors: {
      primary: "#FF006E",
      secondary: "#00F5D4",
      accent: "#FFE66D",
      background: "#0A0A0A",
      text: "#FFFFFF",
      textSecondary: "#B0B0B0",
    },
    gradient: { from: "#FF006E", to: "#00F5D4", direction: "to-br" },
  },
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["vibrant", "neon", "bold", "dark", "modern"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    // Intro Slide
    {
      id: generateSlideId(),
      name: "Intro",
      order: 0,
      background: { type: "solid", color: "#0A0A0A" },
      elements: [
        createShapeElement("circle", -200, -200, 500, 500, "#FF006E", { opacity: 0.15, zIndex: 1 }),
        createShapeElement("circle", 700, 900, 500, 500, "#00F5D4", { opacity: 0.1, zIndex: 1 }),
        createShapeElement("line", 60, 400, 80, 3, "#FF006E"),
        createTextElement(
          "YOUR BOLD\nTITLE HERE",
          60, 460, 960, 220,
          { fontSize: 64, fontWeight: 800, textAlign: "left", color: "#FFFFFF", lineHeight: 1.1 },
          "heading"
        ),
        createTextElement(
          "Swipe to discover",
          60, 720, 960, 40,
          { fontSize: 20, fontWeight: 500, color: "#00F5D4" },
          "text"
        ),
        createTextElement(
          "@yourhandle",
          60, 1260, 960, 30,
          { fontSize: 16, fontWeight: 500, color: "#B0B0B0" },
          "text"
        ),
      ],
    },
    // Content Slide 1
    {
      id: generateSlideId(),
      name: "Point 1",
      order: 1,
      background: { type: "solid", color: "#0A0A0A" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 80, 100, 50, "#FF006E", { borderRadius: 8, zIndex: 2 }),
        createTextElement(
          "01",
          60, 90, 100, 35,
          { fontSize: 24, fontWeight: 700, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
        createShapeElement("line", 60, 200, 60, 3, "#FF006E"),
        createTextElement(
          "First Key Point",
          60, 260, 960, 80,
          { fontSize: 44, fontWeight: 700, color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Explain your first point here. Make it impactful and memorable. Use strong language that resonates with your audience.",
          60, 380, 960, 220,
          { fontSize: 24, fontWeight: 400, color: "#B0B0B0", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 680, 960, 150, "#141414", { borderRadius: 12 }),
        createTextElement(
          "Key Insight",
          100, 720, 880, 30,
          { fontSize: 14, fontWeight: 600, letterSpacing: 2, color: "#00F5D4", textTransform: "uppercase" },
          "text"
        ),
        createTextElement(
          "A memorable takeaway from this point",
          100, 760, 880, 50,
          { fontSize: 20, fontWeight: 500, color: "#FFFFFF" },
          "text"
        ),
      ],
    },
    // Content Slide 2
    {
      id: generateSlideId(),
      name: "Point 2",
      order: 2,
      background: { type: "solid", color: "#0A0A0A" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 80, 100, 50, "#00F5D4", { borderRadius: 8, zIndex: 2 }),
        createTextElement(
          "02",
          60, 90, 100, 35,
          { fontSize: 24, fontWeight: 700, textAlign: "center", color: "#0A0A0A" },
          "text"
        ),
        createShapeElement("line", 60, 200, 60, 3, "#00F5D4"),
        createTextElement(
          "Second Key Point",
          60, 260, 960, 80,
          { fontSize: 44, fontWeight: 700, color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Your second insight goes here. Break down complex ideas into simple, digestible pieces.",
          60, 380, 960, 220,
          { fontSize: 24, fontWeight: 400, color: "#B0B0B0", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 680, 960, 150, "#141414", { borderRadius: 12 }),
        createTextElement(
          "Key Insight",
          100, 720, 880, 30,
          { fontSize: 14, fontWeight: 600, letterSpacing: 2, color: "#FF006E", textTransform: "uppercase" },
          "text"
        ),
        createTextElement(
          "Another important takeaway",
          100, 760, 880, 50,
          { fontSize: 20, fontWeight: 500, color: "#FFFFFF" },
          "text"
        ),
      ],
    },
    // Content Slide 3
    {
      id: generateSlideId(),
      name: "Point 3",
      order: 3,
      background: { type: "solid", color: "#0A0A0A" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 80, 100, 50, "#FFE66D", { borderRadius: 8, zIndex: 2 }),
        createTextElement(
          "03",
          60, 90, 100, 35,
          { fontSize: 24, fontWeight: 700, textAlign: "center", color: "#0A0A0A" },
          "text"
        ),
        createShapeElement("line", 60, 200, 60, 3, "#FFE66D"),
        createTextElement(
          "Third Key Point",
          60, 260, 960, 80,
          { fontSize: 44, fontWeight: 700, color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Continue building your narrative. Each slide should flow naturally to the next.",
          60, 380, 960, 220,
          { fontSize: 24, fontWeight: 400, color: "#B0B0B0", lineHeight: 1.7 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 680, 960, 150, "#141414", { borderRadius: 12 }),
        createTextElement(
          "Key Insight",
          100, 720, 880, 30,
          { fontSize: 14, fontWeight: 600, letterSpacing: 2, color: "#00F5D4", textTransform: "uppercase" },
          "text"
        ),
        createTextElement(
          "The final key insight",
          100, 760, 880, 50,
          { fontSize: 20, fontWeight: 500, color: "#FFFFFF" },
          "text"
        ),
      ],
    },
    // Quote Slide
    {
      id: generateSlideId(),
      name: "Quote",
      order: 4,
      background: {
        type: "gradient",
        gradient: { from: "#FF006E", to: "#7B2CBF", direction: "to-br" },
        color: "#FF006E",
      },
      elements: [
        createShapeElement("line", 60, 380, 80, 4, "rgba(255,255,255,0.5)"),
        createTextElement(
          "Add a powerful quote here that reinforces your message",
          60, 440, 960, 260,
          { fontSize: 40, fontWeight: 600, textAlign: "left", color: "#FFFFFF", lineHeight: 1.4 },
          "text"
        ),
        createShapeElement("line", 60, 740, 200, 2, "rgba(255,255,255,0.3)"),
        createTextElement(
          "Author Name",
          60, 780, 960, 40,
          { fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.8)" },
          "text"
        ),
      ],
    },
    // Stats Slide
    {
      id: generateSlideId(),
      name: "Stats",
      order: 5,
      background: { type: "solid", color: "#0A0A0A" },
      elements: [
        createTextElement(
          "87%",
          60, 400, 960, 220,
          { fontSize: 140, fontWeight: 800, textAlign: "center", color: "#00F5D4" },
          "heading"
        ),
        createTextElement(
          "of professionals agree with this statistic",
          60, 640, 960, 70,
          { fontSize: 26, fontWeight: 400, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
        createShapeElement("line", 390, 760, 300, 2, "#FF006E"),
        createTextElement(
          "Source: Your Source Here",
          60, 800, 960, 30,
          { fontSize: 14, fontWeight: 400, textAlign: "center", color: "#B0B0B0" },
          "text"
        ),
      ],
    },
    // Summary Slide
    {
      id: generateSlideId(),
      name: "Summary",
      order: 6,
      background: { type: "solid", color: "#0A0A0A" },
      elements: [
        createTextElement(
          "KEY TAKEAWAYS",
          60, 120, 960, 50,
          { fontSize: 18, fontWeight: 700, textAlign: "center", color: "#00F5D4", letterSpacing: 4 },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 240, 960, 100, "#141414", { borderRadius: 12 }),
        createTextElement(
          "First key takeaway point",
          100, 275, 880, 35,
          { fontSize: 22, fontWeight: 500, color: "#FFFFFF" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 360, 960, 100, "#141414", { borderRadius: 12 }),
        createTextElement(
          "Second key takeaway point",
          100, 395, 880, 35,
          { fontSize: 22, fontWeight: 500, color: "#FFFFFF" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 60, 480, 960, 100, "#141414", { borderRadius: 12 }),
        createTextElement(
          "Third key takeaway point",
          100, 515, 880, 35,
          { fontSize: 22, fontWeight: 500, color: "#FFFFFF" },
          "text"
        ),
      ],
    },
    // Outro/CTA Slide
    {
      id: generateSlideId(),
      name: "Outro",
      order: 7,
      background: {
        type: "gradient",
        gradient: { from: "#0A0A0A", to: "#141414", direction: "to-b" },
        color: "#0A0A0A",
      },
      elements: [
        createShapeElement("circle", 340, 200, 400, 400, "#FF006E", { opacity: 0.1 }),
        createTextElement(
          "Found this helpful?",
          60, 420, 960, 60,
          { fontSize: 36, fontWeight: 700, textAlign: "center", color: "#FFFFFF" },
          "heading"
        ),
        createTextElement(
          "Like  |  Comment  |  Share",
          60, 510, 960, 50,
          { fontSize: 22, fontWeight: 500, textAlign: "center", color: "#00F5D4" },
          "text"
        ),
        createTextElement(
          "Follow for more content",
          60, 580, 960, 40,
          { fontSize: 20, fontWeight: 400, textAlign: "center", color: "#B0B0B0" },
          "text"
        ),
        createShapeElement("rounded-rectangle", 340, 700, 400, 60, "#FF006E", { borderRadius: 8 }),
        createTextElement(
          "Follow",
          340, 715, 400, 35,
          { fontSize: 18, fontWeight: 600, textAlign: "center", color: "#FFFFFF" },
          "text"
        ),
        createTextElement(
          "@yourhandle",
          60, 1260, 960, 30,
          { fontSize: 16, fontWeight: 500, textAlign: "center", color: "#B0B0B0" },
          "text"
        ),
      ],
    },
  ],
}
