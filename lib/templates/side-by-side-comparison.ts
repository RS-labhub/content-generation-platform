// ═══════════════════════════════════════════════════════════════════════════════
// Template: Side by Side Comparison
// Professional comparison template for evaluating two options head-to-head
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const sideBySideComparison: CarouselTemplate = {
  id: "side-by-side-comparison",
  name: "Side by Side Comparison",
  description: "Professional comparison template for evaluating two options head-to-head",
  category: "corporate",
  isPremium: false,
  isCustom: false,
  palette: {
    id: "comparison-blue",
    name: "Comparison Blue",
    category: "professional",
    colors: {
      primary: "#2C3E50",
      secondary: "#E8F4F8",
      accent: "#3498DB",
      background: "#FAFBFC",
      text: "#1A1A1A",
      textSecondary: "#64748B",
    },
    gradient: { from: "#FAFBFC", to: "#F8FAFC", direction: "to-br" },
  },
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["comparison", "professional", "light", "analysis"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    // Slide 1: Cover
    {
      id: generateSlideId(),
      name: "Cover",
      order: 0,
      background: { type: "solid", color: "#FAFBFC" },
      elements: [
        // Top decorative line
        createShapeElement("line", 0, 0, 1080, 8, "#3498DB"),

        // Split background colors
        createShapeElement("rectangle", 0, 180, 520, 900, "#E8F4F8", { opacity: 0.3 }),
        createShapeElement("rectangle", 560, 180, 520, 900, "#FFF4E6", { opacity: 0.3 }),

        // Divider line
        createShapeElement("line", 536, 180, 8, 900, "#CBD5E1", { opacity: 0.5 }),

        // VS Circle in center
        createShapeElement("circle", 440, 520, 200, 200, "#2C3E50"),
        createTextElement(
          "VS",
          440,
          570,
          200,
          80,
          {
            fontSize: 64,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        // Title
        createTextElement(
          "COMPARISON",
          80,
          100,
          920,
          60,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 3,
          },
          "text",
        ),
        createTextElement(
          "Feature Analysis",
          80,
          260,
          920,
          90,
          {
            fontSize: 56,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        // Subtitle
        createTextElement(
          "Making the right choice for your needs",
          80,
          380,
          920,
          50,
          {
            fontSize: 24,
            fontWeight: 400,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        // Footer brand
        createTextElement(
          "conductor.build",
          80,
          1240,
          920,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
          },
          "text",
        ),
      ],
    },

    // Slide 2: Option A vs Option B Introduction
    {
      id: generateSlideId(),
      name: "Introduction",
      order: 1,
      background: { type: "solid", color: "#FAFBFC" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 8, "#3498DB"),

        // Header
        createTextElement(
          "THE CONTENDERS",
          80,
          100,
          920,
          50,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 2,
          },
          "text",
        ),

        // Option A Section (Left)
        createShapeElement("rounded-rectangle", 80, 220, 440, 900, "#E8F4F8", { borderRadius: 24 }),

        // Logo placeholder for A
        createShapeElement("circle", 180, 280, 240, 240, "#3498DB"),
        createTextElement(
          "A",
          180,
          380,
          240,
          80,
          {
            fontSize: 72,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "Option A",
          140,
          560,
          320,
          60,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Traditional Approach",
          140,
          630,
          320,
          40,
          {
            fontSize: 20,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        // Option A Description
        createTextElement(
          "Established solution with proven track record. Widely adopted across industries with extensive documentation and community support.",
          120,
          720,
          360,
          120,
          {
            fontSize: 18,
            fontWeight: 400,
            color: "#475569",
            lineHeight: 1.7,
          },
          "text",
        ),

        // Stats for A
        createShapeElement("rounded-rectangle", 140, 880, 320, 180, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "15+",
          180,
          920,
          240,
          50,
          {
            fontSize: 40,
            fontWeight: 800,
            color: "#3498DB",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Years in Market",
          180,
          980,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        // Option B Section (Right)
        createShapeElement("rounded-rectangle", 560, 220, 440, 900, "#FFF4E6", { borderRadius: 24 }),

        // Logo placeholder for B
        createShapeElement("circle", 660, 280, 240, 240, "#F59E0B"),
        createTextElement(
          "B",
          660,
          380,
          240,
          80,
          {
            fontSize: 72,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "Option B",
          620,
          560,
          320,
          60,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Modern Alternative",
          620,
          630,
          320,
          40,
          {
            fontSize: 20,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        // Option B Description
        createTextElement(
          "Next-generation platform with cutting-edge features. Innovative approach designed for modern workflows and scalability.",
          600,
          720,
          360,
          120,
          {
            fontSize: 18,
            fontWeight: 400,
            color: "#475569",
            lineHeight: 1.7,
          },
          "text",
        ),

        // Stats for B
        createShapeElement("rounded-rectangle", 620, 880, 320, 180, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "3x",
          660,
          920,
          240,
          50,
          {
            fontSize: 40,
            fontWeight: 800,
            color: "#F59E0B",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Faster Setup",
          660,
          980,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "conductor.build",
          80,
          1240,
          920,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
          },
          "text",
        ),
      ],
    },

    // Slide 3: Pricing Comparison
    {
      id: generateSlideId(),
      name: "Pricing",
      order: 2,
      background: { type: "solid", color: "#FAFBFC" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 8, "#3498DB"),
        createShapeElement("line", 536, 100, 8, 1080, "#CBD5E1", { opacity: 0.5 }),

        createTextElement(
          "PRICING",
          80,
          100,
          920,
          50,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 2,
          },
          "text",
        ),

        // Option A Pricing
        createShapeElement("rounded-rectangle", 80, 200, 440, 900, "#E8F4F8", { borderRadius: 24 }),

        createTextElement(
          "Option A",
          140,
          250,
          320,
          50,
          {
            fontSize: 32,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        createShapeElement("rounded-rectangle", 180, 340, 240, 180, "#FFFFFF", { borderRadius: 20 }),
        createTextElement(
          "$49",
          200,
          380,
          200,
          80,
          {
            fontSize: 64,
            fontWeight: 800,
            color: "#3498DB",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "/month",
          200,
          460,
          200,
          30,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "INCLUDES:",
          140,
          580,
          320,
          40,
          {
            fontSize: 16,
            fontWeight: 700,
            color: "#3498DB",
            letterSpacing: 1,
          },
          "text",
        ),

        createShapeElement("circle", 160, 655, 10, 10, "#10B981"),
        createTextElement(
          "Up to 10 users",
          185,
          645,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 160, 715, 10, 10, "#10B981"),
        createTextElement(
          "Basic features",
          185,
          705,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 160, 775, 10, 10, "#10B981"),
        createTextElement(
          "Email support",
          185,
          765,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 160, 835, 10, 10, "#10B981"),
        createTextElement(
          "Monthly updates",
          185,
          825,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 160, 895, 10, 10, "#EF4444"),
        createTextElement(
          "Limited storage",
          185,
          885,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 160, 955, 10, 10, "#EF4444"),
        createTextElement(
          "No priority support",
          185,
          945,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        // Option B Pricing
        createShapeElement("rounded-rectangle", 560, 200, 440, 900, "#FFF4E6", { borderRadius: 24 }),

        createTextElement(
          "Option B",
          620,
          250,
          320,
          50,
          {
            fontSize: 32,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        createShapeElement("rounded-rectangle", 660, 340, 240, 180, "#FFFFFF", { borderRadius: 20 }),
        createTextElement(
          "$39",
          680,
          380,
          200,
          80,
          {
            fontSize: 64,
            fontWeight: 800,
            color: "#F59E0B",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "/month",
          680,
          460,
          200,
          30,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "INCLUDES:",
          620,
          580,
          320,
          40,
          {
            fontSize: 16,
            fontWeight: 700,
            color: "#F59E0B",
            letterSpacing: 1,
          },
          "text",
        ),

        createShapeElement("circle", 640, 655, 10, 10, "#10B981"),
        createTextElement(
          "Unlimited users",
          665,
          645,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 640, 715, 10, 10, "#10B981"),
        createTextElement(
          "All features",
          665,
          705,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 640, 775, 10, 10, "#10B981"),
        createTextElement(
          "24/7 chat support",
          665,
          765,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 640, 835, 10, 10, "#10B981"),
        createTextElement(
          "Weekly updates",
          665,
          825,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 640, 895, 10, 10, "#10B981"),
        createTextElement(
          "Unlimited storage",
          665,
          885,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 640, 955, 10, 10, "#10B981"),
        createTextElement(
          "Priority support",
          665,
          945,
          250,
          30,
          {
            fontSize: 17,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createTextElement(
          "conductor.build",
          80,
          1240,
          920,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
          },
          "text",
        ),
      ],
    },

    // Slide 4: Features Comparison
    {
      id: generateSlideId(),
      name: "Features",
      order: 3,
      background: { type: "solid", color: "#FAFBFC" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 8, "#3498DB"),
        createShapeElement("line", 536, 100, 8, 1080, "#CBD5E1", { opacity: 0.5 }),

        createTextElement(
          "FEATURES",
          80,
          100,
          920,
          50,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 2,
          },
          "text",
        ),

        // Option A Features
        createShapeElement("rounded-rectangle", 80, 200, 440, 900, "#E8F4F8", { borderRadius: 24 }),

        createTextElement(
          "Option A",
          140,
          250,
          320,
          50,
          {
            fontSize: 28,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        // Feature list A
        createShapeElement("rounded-rectangle", 120, 340, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "Dashboard Analytics",
          140,
          365,
          320,
          50,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 120, 460, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "Team Collaboration",
          140,
          485,
          320,
          50,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 120, 580, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "API Integration",
          140,
          605,
          320,
          50,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 120, 700, 360, 100, "#F1F5F9", { borderRadius: 16 }),
        createTextElement(
          "Advanced Reporting",
          140,
          715,
          320,
          30,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#94A3B8",
          },
          "text",
        ),
        createTextElement(
          "Limited",
          140,
          750,
          320,
          25,
          {
            fontSize: 15,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 120, 820, 360, 100, "#F1F5F9", { borderRadius: 16 }),
        createTextElement(
          "Custom Workflows",
          140,
          835,
          320,
          30,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#94A3B8",
          },
          "text",
        ),
        createTextElement(
          "Not Available",
          140,
          870,
          320,
          25,
          {
            fontSize: 15,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 120, 940, 360, 100, "#F1F5F9", { borderRadius: 16 }),
        createTextElement(
          "AI Automation",
          140,
          955,
          320,
          30,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#94A3B8",
          },
          "text",
        ),
        createTextElement(
          "Coming Soon",
          140,
          990,
          320,
          25,
          {
            fontSize: 15,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        // Option B Features
        createShapeElement("rounded-rectangle", 560, 200, 440, 900, "#FFF4E6", { borderRadius: 24 }),

        createTextElement(
          "Option B",
          620,
          250,
          320,
          50,
          {
            fontSize: 28,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        // Feature list B
        createShapeElement("rounded-rectangle", 600, 340, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "Dashboard Analytics",
          620,
          365,
          320,
          50,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 600, 460, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "Team Collaboration",
          620,
          485,
          320,
          50,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 600, 580, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "API Integration",
          620,
          605,
          320,
          50,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 600, 700, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "Advanced Reporting",
          620,
          715,
          320,
          30,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),
        createTextElement(
          "Full Access",
          620,
          750,
          320,
          25,
          {
            fontSize: 15,
            fontWeight: 500,
            color: "#10B981",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 600, 820, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "Custom Workflows",
          620,
          835,
          320,
          30,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),
        createTextElement(
          "Included",
          620,
          870,
          320,
          25,
          {
            fontSize: 15,
            fontWeight: 500,
            color: "#10B981",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 600, 940, 360, 100, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "AI Automation",
          620,
          955,
          320,
          30,
          {
            fontSize: 19,
            fontWeight: 600,
            color: "#2C3E50",
          },
          "text",
        ),
        createTextElement(
          "Available Now",
          620,
          990,
          320,
          25,
          {
            fontSize: 15,
            fontWeight: 500,
            color: "#10B981",
          },
          "text",
        ),

        createTextElement(
          "conductor.build",
          80,
          1240,
          920,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
          },
          "text",
        ),
      ],
    },

    // Slide 5: Pros & Cons
    {
      id: generateSlideId(),
      name: "Pros & Cons",
      order: 4,
      background: { type: "solid", color: "#FAFBFC" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 8, "#3498DB"),
        createShapeElement("line", 536, 100, 8, 1080, "#CBD5E1", { opacity: 0.5 }),

        createTextElement(
          "PROS & CONS",
          80,
          100,
          920,
          50,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 2,
          },
          "text",
        ),

        // Option A
        createShapeElement("rounded-rectangle", 80, 200, 440, 900, "#E8F4F8", { borderRadius: 24 }),

        createTextElement(
          "Option A",
          140,
          250,
          320,
          50,
          {
            fontSize: 28,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        // Pros
        createShapeElement("rounded-rectangle", 120, 340, 360, 360, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "PROS",
          140,
          370,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#10B981",
          },
          "text",
        ),

        createShapeElement("circle", 150, 445, 8, 8, "#10B981"),
        createTextElement(
          "Established & reliable",
          170,
          435,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 150, 495, 8, 8, "#10B981"),
        createTextElement(
          "Large community",
          170,
          485,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 150, 545, 8, 8, "#10B981"),
        createTextElement(
          "Extensive documentation",
          170,
          535,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 150, 595, 8, 8, "#10B981"),
        createTextElement(
          "Battle-tested features",
          170,
          585,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 150, 645, 8, 8, "#10B981"),
        createTextElement(
          "Enterprise ready",
          170,
          635,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        // Cons
        createShapeElement("rounded-rectangle", 120, 740, 360, 360, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "CONS",
          140,
          770,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#EF4444",
          },
          "text",
        ),

        createShapeElement("circle", 150, 845, 8, 8, "#EF4444"),
        createTextElement(
          "Higher cost",
          170,
          835,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 150, 895, 8, 8, "#EF4444"),
        createTextElement(
          "Slower innovation",
          170,
          885,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 150, 945, 8, 8, "#EF4444"),
        createTextElement(
          "Complex setup",
          170,
          935,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 150, 995, 8, 8, "#EF4444"),
        createTextElement(
          "Legacy UI/UX",
          170,
          985,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 150, 1045, 8, 8, "#EF4444"),
        createTextElement(
          "Limited user limits",
          170,
          1035,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        // Option B
        createShapeElement("rounded-rectangle", 560, 200, 440, 900, "#FFF4E6", { borderRadius: 24 }),

        createTextElement(
          "Option B",
          620,
          250,
          320,
          50,
          {
            fontSize: 28,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        // Pros
        createShapeElement("rounded-rectangle", 600, 340, 360, 360, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "PROS",
          620,
          370,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#10B981",
          },
          "text",
        ),

        createShapeElement("circle", 630, 445, 8, 8, "#10B981"),
        createTextElement(
          "Modern & intuitive",
          650,
          435,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 630, 495, 8, 8, "#10B981"),
        createTextElement(
          "Lower cost",
          650,
          485,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 630, 545, 8, 8, "#10B981"),
        createTextElement(
          "Faster setup (3x)",
          650,
          535,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 630, 595, 8, 8, "#10B981"),
        createTextElement(
          "AI-powered automation",
          650,
          585,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        createShapeElement("circle", 630, 645, 8, 8, "#10B981"),
        createTextElement(
          "Unlimited users",
          650,
          635,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#2C3E50",
          },
          "text",
        ),

        // Cons
        createShapeElement("rounded-rectangle", 600, 740, 360, 360, "#FFFFFF", { borderRadius: 16 }),
        createTextElement(
          "CONS",
          620,
          770,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#EF4444",
          },
          "text",
        ),

        createShapeElement("circle", 630, 845, 8, 8, "#EF4444"),
        createTextElement(
          "Newer to market",
          650,
          835,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 630, 895, 8, 8, "#EF4444"),
        createTextElement(
          "Smaller community",
          650,
          885,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 630, 945, 8, 8, "#EF4444"),
        createTextElement(
          "Less case studies",
          650,
          935,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createShapeElement("circle", 630, 995, 8, 8, "#EF4444"),
        createTextElement(
          "Growing pains",
          650,
          985,
          280,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#64748B",
          },
          "text",
        ),

        createTextElement(
          "conductor.build",
          80,
          1240,
          920,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
          },
          "text",
        ),
      ],
    },

    // Slide 6: Recommendation
    {
      id: generateSlideId(),
      name: "Recommendation",
      order: 5,
      background: { type: "solid", color: "#FAFBFC" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 8, "#3498DB"),

        createTextElement(
          "OUR RECOMMENDATION",
          80,
          120,
          920,
          50,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#64748B",
            textAlign: "center",
            letterSpacing: 2,
          },
          "text",
        ),

        createTextElement(
          "The Right Choice Depends On",
          80,
          200,
          920,
          70,
          {
            fontSize: 44,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "Your Specific Needs",
          80,
          280,
          920,
          50,
          {
            fontSize: 28,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        // Option A Card
        createShapeElement("rounded-rectangle", 80, 400, 440, 520, "#E8F4F8", { borderRadius: 24 }),

        createTextElement(
          "Choose Option A If:",
          120,
          450,
          360,
          50,
          {
            fontSize: 24,
            fontWeight: 700,
            color: "#3498DB",
          },
          "heading",
        ),

        createShapeElement("circle", 140, 545, 10, 10, "#3498DB"),
        createTextElement(
          "You need proven reliability",
          165,
          530,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 140, 605, 10, 10, "#3498DB"),
        createTextElement(
          "Enterprise compliance required",
          165,
          590,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 140, 665, 10, 10, "#3498DB"),
        createTextElement(
          "Budget is not a constraint",
          165,
          650,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 140, 725, 10, 10, "#3498DB"),
        createTextElement(
          "You value stability over innovation",
          165,
          710,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 140, 785, 10, 10, "#3498DB"),
        createTextElement(
          "Large community matters",
          165,
          770,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 140, 850, 320, 50, "#3498DB", { borderRadius: 25 }),
        createTextElement(
          "Best for Enterprise",
          140,
          862,
          320,
          26,
          {
            fontSize: 18,
            fontWeight: 600,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "text",
        ),

        // Option B Card
        createShapeElement("rounded-rectangle", 560, 400, 440, 520, "#FFF4E6", { borderRadius: 24 }),

        createTextElement(
          "Choose Option B If:",
          600,
          450,
          360,
          50,
          {
            fontSize: 24,
            fontWeight: 700,
            color: "#F59E0B",
          },
          "heading",
        ),

        createShapeElement("circle", 620, 545, 10, 10, "#F59E0B"),
        createTextElement(
          "You want modern features",
          645,
          530,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 620, 605, 10, 10, "#F59E0B"),
        createTextElement(
          "Fast setup is priority",
          645,
          590,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 620, 665, 10, 10, "#F59E0B"),
        createTextElement(
          "Cost-effectiveness matters",
          645,
          650,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 620, 725, 10, 10, "#F59E0B"),
        createTextElement(
          "You need AI automation",
          645,
          710,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("circle", 620, 785, 10, 10, "#F59E0B"),
        createTextElement(
          "Unlimited users required",
          645,
          770,
          320,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#2C3E50",
            lineHeight: 1.4,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 620, 850, 320, 50, "#F59E0B", { borderRadius: 25 }),
        createTextElement(
          "Best for Startups",
          620,
          862,
          320,
          26,
          {
            fontSize: 18,
            fontWeight: 600,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "conductor.build",
          80,
          1240,
          920,
          40,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
          },
          "text",
        ),
      ],
    },

    // Slide 7: Outro
    {
      id: generateSlideId(),
      name: "Outro",
      order: 6,
      background: { type: "solid", color: "#FAFBFC" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 8, "#3498DB"),

        // Background decorative elements
        createShapeElement("circle", -100, 900, 500, 500, "#3498DB", { opacity: 0.06 }),
        createShapeElement("circle", 680, -100, 500, 500, "#F59E0B", { opacity: 0.06 }),

        createTextElement(
          "READY TO DECIDE?",
          80,
          280,
          920,
          80,
          {
            fontSize: 56,
            fontWeight: 800,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "We're here to help you make the right choice",
          120,
          390,
          840,
          60,
          {
            fontSize: 26,
            fontWeight: 400,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        // CTA Box
        createShapeElement("rounded-rectangle", 240, 520, 600, 440, "#FFFFFF", { borderRadius: 24 }),

        createTextElement(
          "Get Expert Consultation",
          280,
          590,
          520,
          60,
          {
            fontSize: 32,
            fontWeight: 700,
            color: "#2C3E50",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "Schedule a free 30-minute call with our team to discuss which option fits your needs best.",
          300,
          680,
          480,
          80,
          {
            fontSize: 20,
            fontWeight: 400,
            color: "#64748B",
            textAlign: "center",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 390, 800, 300, 60, "#3498DB", { borderRadius: 30 }),
        createTextElement(
          "Book Your Call",
          390,
          815,
          300,
          30,
          {
            fontSize: 22,
            fontWeight: 600,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "conductor.build",
          390,
          890,
          300,
          40,
          {
            fontSize: 18,
            fontWeight: 600,
            color: "#3498DB",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "Thank you for comparing with us!",
          80,
          1100,
          920,
          40,
          {
            fontSize: 20,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
          },
          "text",
        ),
      ],
    },
  ],
}
