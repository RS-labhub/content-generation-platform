// ═══════════════════════════════════════════════════════════════════════════════
// Template: Elegant Beige Showcase
// Light professional template with warm beige tones and wavy patterns
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const elegantBeigeShowcase: CarouselTemplate = {
  id: "elegant-beige-showcase",
  name: "Elegant Beige Showcase",
  description: "Professional light template with warm beige tones and elegant wavy patterns",
  category: "editors-pick",
  isPremium: false,
  isCustom: false,
  palette: {
    id: "elegant-beige",
    name: "Elegant Beige",
    category: "professional",
    colors: {
      primary: "#1E293B",
      secondary: "#64748B",
      accent: "#8B7355",
      background: "#E8E3D8",
      text: "#1E293B",
      textSecondary: "#64748B",
    },
    gradient: { from: "#E8E3D8", to: "#D4CFC3", direction: "to-br" },
  },
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["light", "elegant", "professional", "beige"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    // Cover Slide
    {
      id: generateSlideId(),
      name: "Cover",
      order: 0,
      background: { type: "solid", color: "#E8E3D8" },
      elements: [
        // Wavy decorative lines
        createShapeElement("line", 0, 100, 1080, 2, "#1E293B", { opacity: 0.08 }),
        createShapeElement("line", 0, 180, 1080, 2, "#1E293B", { opacity: 0.08 }),
        createShapeElement("line", 0, 260, 1080, 2, "#1E293B", { opacity: 0.08 }),

        createTextElement(
          "AI DEV",
          80,
          420,
          920,
          65,
          {
            fontSize: 58,
            fontWeight: 800,
            color: "#1E293B",
            textAlign: "center",
            letterSpacing: 6,
          },
          "heading",
        ),
        createTextElement(
          "TOOLS",
          80,
          495,
          920,
          75,
          {
            fontSize: 68,
            fontWeight: 900,
            color: "#1E293B",
            textAlign: "center",
            letterSpacing: 8,
          },
          "heading",
        ),
        createShapeElement("line", 340, 590, 400, 3, "#8B7355", { opacity: 0.6 }),
        createTextElement(
          "December Edition • 2024",
          80,
          640,
          920,
          35,
          {
            fontSize: 22,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 3,
          },
          "text",
        ),
        // Decorative circles
        createShapeElement("circle", 850, 180, 180, 180, "#B8A694", { opacity: 0.15 }),
        createShapeElement("circle", 920, 950, 220, 220, "#B8A694", { opacity: 0.12 }),
      ],
    },
    // Tool 1: Cursor
    {
      id: generateSlideId(),
      name: "Tool 1 - Cursor",
      order: 1,
      background: { type: "solid", color: "#E8E3D8" },
      elements: [
        // Decorative wavy lines
        createShapeElement("line", 0, 50, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 90, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 130, 1080, 1, "#1E293B", { opacity: 0.06 }),

        // Large number badge
        createShapeElement("rounded-rectangle", 60, 180, 120, 120, "#1E293B", { borderRadius: 24 }),
        createTextElement(
          "1",
          60,
          210,
          120,
          80,
          {
            fontSize: 72,
            fontWeight: 900,
            color: "#E8E3D8",
            textAlign: "center",
          },
          "heading",
        ),

        // Tool name and description
        createTextElement(
          "CURSOR",
          220,
          200,
          780,
          55,
          {
            fontSize: 48,
            fontWeight: 800,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "heading",
        ),
        createShapeElement("line", 220, 270, 300, 3, "#1E293B", { opacity: 0.3 }),

        createTextElement(
          "AI-first code editor built for pair-programming with AI. Fork of VSCode with native AI integration.",
          80,
          320,
          920,
          80,
          {
            fontSize: 22,
            fontWeight: 400,
            color: "#1E293B",
            lineHeight: 1.6,
          },
          "text",
        ),

        // Famous For section
        createShapeElement("rounded-rectangle", 80, 440, 920, 180, "#D4CFC3", { borderRadius: 16, opacity: 0.6 }),
        createTextElement(
          "FAMOUS FOR:",
          120,
          475,
          840,
          28,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "Tab autocomplete, Cmd+K inline edits, AI chat with codebase context, and multi-file editing.",
          120,
          515,
          840,
          85,
          {
            fontSize: 20,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 1.7,
          },
          "text",
        ),

        // Key Points
        createShapeElement("rounded-rectangle", 80, 650, 920, 240, "#B8A694", { borderRadius: 16, opacity: 0.25 }),
        createTextElement(
          "• Smart tab autocomplete with context\n• Inline code generation and edits\n• Codebase-aware AI chat\n• Native VSCode compatibility",
          120,
          690,
          840,
          160,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 2,
          },
          "text",
        ),

        // Funding section
        createTextElement(
          "FUNDING:",
          80,
          940,
          920,
          25,
          {
            fontSize: 16,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "$60M Series A • Andreessen Horowitz, Index Ventures",
          80,
          975,
          920,
          30,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#1E293B",
          },
          "text",
        ),

        // URL with arrow
        createTextElement(
          "https://cursor.build",
          80,
          1200,
          840,
          30,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),
        // Arrow decoration
        createShapeElement("line", 960, 1215, 50, 3, "#8B7355", { opacity: 0.7 }),

        // Decorative circle
        createShapeElement("circle", 880, 450, 200, 200, "#8B7355", { opacity: 0.08 }),
      ],
    },
    // Tool 2: Vercel v0
    {
      id: generateSlideId(),
      name: "Tool 2 - Vercel v0",
      order: 2,
      background: { type: "solid", color: "#E8E3D8" },
      elements: [
        createShapeElement("line", 0, 50, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 90, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 130, 1080, 1, "#1E293B", { opacity: 0.06 }),

        createShapeElement("rounded-rectangle", 60, 180, 120, 120, "#1E293B", { borderRadius: 24 }),
        createTextElement(
          "2",
          60,
          210,
          120,
          80,
          {
            fontSize: 72,
            fontWeight: 900,
            color: "#E8E3D8",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "VERCEL V0",
          220,
          200,
          780,
          55,
          {
            fontSize: 48,
            fontWeight: 800,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "heading",
        ),
        createShapeElement("line", 220, 270, 300, 3, "#1E293B", { opacity: 0.3 }),

        createTextElement(
          "Generative UI platform that creates React components from text prompts. Ship production-ready code instantly.",
          80,
          320,
          920,
          80,
          {
            fontSize: 22,
            fontWeight: 400,
            color: "#1E293B",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 80, 440, 920, 180, "#D4CFC3", { borderRadius: 16, opacity: 0.6 }),
        createTextElement(
          "FAMOUS FOR:",
          120,
          475,
          840,
          28,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "Text-to-UI generation with React, shadcn/ui integration, and instant deployment to Vercel.",
          120,
          515,
          840,
          85,
          {
            fontSize: 20,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 1.7,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 80, 650, 920, 240, "#B8A694", { borderRadius: 16, opacity: 0.25 }),
        createTextElement(
          "• Generate React components from text\n• Built-in shadcn/ui components\n• One-click Vercel deployment\n• Iterative design refinement",
          120,
          690,
          840,
          160,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 2,
          },
          "text",
        ),

        createTextElement(
          "FUNDING:",
          80,
          940,
          920,
          25,
          {
            fontSize: 16,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "Vercel-backed • $150M+ total funding",
          80,
          975,
          920,
          30,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#1E293B",
          },
          "text",
        ),

        createTextElement(
          "https://v0.dev",
          80,
          1200,
          840,
          30,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),
        createShapeElement("line", 960, 1215, 50, 3, "#8B7355", { opacity: 0.7 }),

        createShapeElement("circle", 100, 800, 180, 180, "#8B7355", { opacity: 0.08 }),
      ],
    },
    // Tool 3: GitHub Copilot
    {
      id: generateSlideId(),
      name: "Tool 3 - GitHub Copilot",
      order: 3,
      background: { type: "solid", color: "#E8E3D8" },
      elements: [
        createShapeElement("line", 0, 50, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 90, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 130, 1080, 1, "#1E293B", { opacity: 0.06 }),

        createShapeElement("rounded-rectangle", 60, 180, 120, 120, "#1E293B", { borderRadius: 24 }),
        createTextElement(
          "3",
          60,
          210,
          120,
          80,
          {
            fontSize: 72,
            fontWeight: 900,
            color: "#E8E3D8",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "COPILOT",
          220,
          200,
          780,
          55,
          {
            fontSize: 48,
            fontWeight: 800,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "heading",
        ),
        createShapeElement("line", 220, 270, 300, 3, "#1E293B", { opacity: 0.3 }),

        createTextElement(
          "AI pair programmer that suggests code in real-time. Works across all major IDEs with GitHub integration.",
          80,
          320,
          920,
          80,
          {
            fontSize: 22,
            fontWeight: 400,
            color: "#1E293B",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 80, 440, 920, 180, "#D4CFC3", { borderRadius: 16, opacity: 0.6 }),
        createTextElement(
          "FAMOUS FOR:",
          120,
          475,
          840,
          28,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "Real-time code suggestions, multi-line completions, and chat interface for code explanations.",
          120,
          515,
          840,
          85,
          {
            fontSize: 20,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 1.7,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 80, 650, 920, 240, "#B8A694", { borderRadius: 16, opacity: 0.25 }),
        createTextElement(
          "• Real-time code suggestions\n• Works in all major IDEs\n• GitHub repository context\n• Multi-language support",
          120,
          690,
          840,
          160,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 2,
          },
          "text",
        ),

        createTextElement(
          "FUNDING:",
          80,
          940,
          920,
          25,
          {
            fontSize: 16,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "GitHub (Microsoft) • 1M+ paid subscribers",
          80,
          975,
          920,
          30,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#1E293B",
          },
          "text",
        ),

        createTextElement(
          "https://github.com/copilot",
          80,
          1200,
          840,
          30,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),
        createShapeElement("line", 960, 1215, 50, 3, "#8B7355", { opacity: 0.7 }),

        createShapeElement("circle", 850, 600, 240, 240, "#8B7355", { opacity: 0.08 }),
      ],
    },
    // Tool 4: Replit AI
    {
      id: generateSlideId(),
      name: "Tool 4 - Replit AI",
      order: 4,
      background: { type: "solid", color: "#E8E3D8" },
      elements: [
        createShapeElement("line", 0, 50, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 90, 1080, 1, "#1E293B", { opacity: 0.06 }),
        createShapeElement("line", 0, 130, 1080, 1, "#1E293B", { opacity: 0.06 }),

        createShapeElement("rounded-rectangle", 60, 180, 120, 120, "#1E293B", { borderRadius: 24 }),
        createTextElement(
          "4",
          60,
          210,
          120,
          80,
          {
            fontSize: 72,
            fontWeight: 900,
            color: "#E8E3D8",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "REPLIT AI",
          220,
          200,
          780,
          55,
          {
            fontSize: 48,
            fontWeight: 800,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "heading",
        ),
        createShapeElement("line", 220, 270, 300, 3, "#1E293B", { opacity: 0.3 }),

        createTextElement(
          "Cloud IDE with AI assistant that helps you code, debug, and deploy apps directly in the browser.",
          80,
          320,
          920,
          80,
          {
            fontSize: 22,
            fontWeight: 400,
            color: "#1E293B",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 80, 440, 920, 180, "#D4CFC3", { borderRadius: 16, opacity: 0.6 }),
        createTextElement(
          "FAMOUS FOR:",
          120,
          475,
          840,
          28,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "Browser-based development with AI code generation, instant deployment, and collaborative coding.",
          120,
          515,
          840,
          85,
          {
            fontSize: 20,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 1.7,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 80, 650, 920, 240, "#B8A694", { borderRadius: 16, opacity: 0.25 }),
        createTextElement(
          "• Full cloud development environment\n• AI-powered code generation\n• One-click deployment\n• Real-time collaboration",
          120,
          690,
          840,
          160,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
            lineHeight: 2,
          },
          "text",
        ),

        createTextElement(
          "FUNDING:",
          80,
          940,
          920,
          25,
          {
            fontSize: 16,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: 2,
          },
          "text",
        ),
        createTextElement(
          "$97M Series B • a16z, Coatue Management",
          80,
          975,
          920,
          30,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#1E293B",
          },
          "text",
        ),

        createTextElement(
          "https://replit.com",
          80,
          1200,
          840,
          30,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),
        createShapeElement("line", 960, 1215, 50, 3, "#8B7355", { opacity: 0.7 }),

        createShapeElement("circle", 120, 500, 160, 160, "#8B7355", { opacity: 0.08 }),
      ],
    },
    // Outro Slide
    {
      id: generateSlideId(),
      name: "Outro",
      order: 5,
      background: { type: "solid", color: "#E8E3D8" },
      elements: [
        createShapeElement("line", 0, 200, 1080, 2, "#1E293B", { opacity: 0.08 }),
        createShapeElement("line", 0, 280, 1080, 2, "#1E293B", { opacity: 0.08 }),

        createTextElement(
          "MORE COMING",
          80,
          520,
          920,
          60,
          {
            fontSize: 52,
            fontWeight: 800,
            color: "#1E293B",
            textAlign: "center",
            letterSpacing: 6,
          },
          "heading",
        ),
        createTextElement(
          "NEXT MONTH",
          80,
          590,
          920,
          65,
          {
            fontSize: 56,
            fontWeight: 900,
            color: "#1E293B",
            textAlign: "center",
            letterSpacing: 8,
          },
          "heading",
        ),

        createShapeElement("rounded-rectangle", 290, 720, 500, 90, "#1E293B", { borderRadius: 16 }),
        createTextElement(
          "@YourHandle",
          290,
          740,
          500,
          50,
          {
            fontSize: 34,
            fontWeight: 700,
            color: "#E8E3D8",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "Save • Share • Follow",
          80,
          880,
          920,
          35,
          {
            fontSize: 24,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 3,
          },
          "text",
        ),

        createShapeElement("circle", 100, 200, 120, 120, "#8B7355", { opacity: 0.1 }),
        createShapeElement("circle", 900, 1000, 180, 180, "#8B7355", { opacity: 0.1 }),
      ],
    },
  ],
}
