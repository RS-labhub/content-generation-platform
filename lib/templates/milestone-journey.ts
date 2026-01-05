// ═══════════════════════════════════════════════════════════════════════════════
// Template: Milestone Journey
// Timeline template showcasing company growth and achievements
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import { generateSlideId, createTextElement, createShapeElement } from "./template-helpers"

export const milestoneJourney: CarouselTemplate = {
  id: "milestone-journey",
  name: "Milestone Journey",
  description: "Timeline template showcasing company growth, achievements, and success story",
  category: "storytelling",
  isPremium: false,
  isCustom: false,
  palette: {
    id: "milestone-green",
    name: "Milestone Green",
    category: "professional",
    colors: {
      primary: "#1E293B",
      secondary: "#F1F5F9",
      accent: "#10B981",
      background: "#FFFFFF",
      text: "#0F172A",
      textSecondary: "#64748B",
    },
    gradient: { from: "#FFFFFF", to: "#F8FAFC", direction: "to-br" },
  },
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["timeline", "growth", "professional", "light"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    // Slide 1: Cover
    {
      id: generateSlideId(),
      name: "Cover",
      order: 0,
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        // Background gradient circles
        createShapeElement("circle", -100, 100, 600, 600, "#10B981", { opacity: 0.08 }),
        createShapeElement("circle", 580, 800, 700, 700, "#3B82F6", { opacity: 0.08 }),

        // Top accent bar
        createShapeElement("line", 0, 0, 1080, 12, "#10B981"),

        // Main badge
        createShapeElement("rounded-rectangle", 340, 420, 400, 180, "#F0FDF4", { borderRadius: 90 }),
        createShapeElement("rounded-rectangle", 360, 440, 360, 140, "#10B981", { borderRadius: 70 }),
        createTextElement(
          "2024",
          360,
          480,
          360,
          60,
          {
            fontSize: 52,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        // Title
        createTextElement(
          "OUR JOURNEY",
          80,
          180,
          920,
          50,
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
          "Growth Story",
          80,
          260,
          920,
          90,
          {
            fontSize: 64,
            fontWeight: 800,
            color: "#1E293B",
            textAlign: "center",
          },
          "heading",
        ),

        // Subtitle
        createTextElement(
          "From humble beginnings to industry leader",
          120,
          660,
          840,
          60,
          {
            fontSize: 24,
            fontWeight: 400,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        // Stats row
        createShapeElement("rounded-rectangle", 120, 820, 260, 160, "#F8FAFC", { borderRadius: 20 }),
        createTextElement(
          "50K+",
          160,
          860,
          180,
          50,
          {
            fontSize: 40,
            fontWeight: 800,
            color: "#10B981",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Users",
          160,
          920,
          180,
          30,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 410, 820, 260, 160, "#F8FAFC", { borderRadius: 20 }),
        createTextElement(
          "$10M",
          450,
          860,
          180,
          50,
          {
            fontSize: 40,
            fontWeight: 800,
            color: "#10B981",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Revenue",
          450,
          920,
          180,
          30,
          {
            fontSize: 18,
            fontWeight: 500,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 700, 820, 260, 160, "#F8FAFC", { borderRadius: 20 }),
        createTextElement(
          "4 Years",
          740,
          860,
          180,
          50,
          {
            fontSize: 40,
            fontWeight: 800,
            color: "#10B981",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Operating",
          740,
          920,
          180,
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

    // Slide 2: 2020 - The Beginning
    {
      id: generateSlideId(),
      name: "2020 - Foundation",
      order: 1,
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        // Top accent bar
        createShapeElement("line", 0, 0, 1080, 12, "#3B82F6"),

        // Timeline vertical line
        createShapeElement("line", 180, 200, 6, 900, "#E2E8F0"),

        // Year badge
        createShapeElement("circle", 100, 280, 160, 160, "#3B82F6"),
        createTextElement(
          "2020",
          100,
          330,
          160,
          60,
          {
            fontSize: 32,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        // Title
        createTextElement(
          "THE BEGINNING",
          320,
          200,
          680,
          50,
          {
            fontSize: 24,
            fontWeight: 700,
            color: "#1E293B",
          },
          "heading",
        ),
        createTextElement(
          "Company Founded",
          320,
          260,
          680,
          60,
          {
            fontSize: 42,
            fontWeight: 800,
            color: "#1E293B",
          },
          "heading",
        ),

        // Description
        createTextElement(
          "Started as a small team with a big vision to revolutionize the industry. Founded by experienced professionals passionate about solving real problems.",
          320,
          360,
          680,
          100,
          {
            fontSize: 20,
            fontWeight: 400,
            color: "#64748B",
            lineHeight: 1.6,
          },
          "text",
        ),

        // Key achievements box
        createShapeElement("rounded-rectangle", 320, 500, 680, 420, "#F8FAFC", { borderRadius: 20 }),
        createTextElement(
          "KEY MILESTONES",
          360,
          540,
          600,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#3B82F6",
            letterSpacing: 1,
          },
          "text",
        ),

        // Milestone items
        createShapeElement("circle", 360, 620, 12, 12, "#10B981"),
        createTextElement(
          "Secured seed funding of $500K",
          390,
          605,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 700, 12, 12, "#10B981"),
        createTextElement(
          "Launched MVP with core features",
          390,
          685,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 780, 12, 12, "#10B981"),
        createTextElement(
          "Onboarded first 100 beta users",
          390,
          765,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 860, 12, 12, "#10B981"),
        createTextElement(
          "Built team of 5 dedicated members",
          390,
          845,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        // Stats
        createShapeElement("rounded-rectangle", 320, 980, 320, 120, "#3B82F6", { borderRadius: 16 }),
        createTextElement(
          "100+",
          360,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Beta Users",
          360,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#E0E7FF",
            textAlign: "center",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 680, 980, 320, 120, "#10B981", { borderRadius: 16 }),
        createTextElement(
          "$500K",
          720,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Seed Funding",
          720,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#D1FAE5",
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

    // Slide 3: 2021 - Growth Phase
    {
      id: generateSlideId(),
      name: "2021 - Growth",
      order: 2,
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 12, "#F59E0B"),
        createShapeElement("line", 180, 200, 6, 900, "#E2E8F0"),

        createShapeElement("circle", 100, 280, 160, 160, "#F59E0B"),
        createTextElement(
          "2021",
          100,
          330,
          160,
          60,
          {
            fontSize: 32,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "RAPID GROWTH",
          320,
          200,
          680,
          50,
          {
            fontSize: 24,
            fontWeight: 700,
            color: "#1E293B",
          },
          "heading",
        ),
        createTextElement(
          "Market Expansion",
          320,
          260,
          680,
          60,
          {
            fontSize: 42,
            fontWeight: 800,
            color: "#1E293B",
          },
          "heading",
        ),

        createTextElement(
          "Achieved product-market fit and began aggressive expansion. Doubled our team size and launched new features based on user feedback.",
          320,
          360,
          680,
          100,
          {
            fontSize: 20,
            fontWeight: 400,
            color: "#64748B",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 500, 680, 420, "#FFFBEB", { borderRadius: 20 }),
        createTextElement(
          "KEY MILESTONES",
          360,
          540,
          600,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#F59E0B",
            letterSpacing: 1,
          },
          "text",
        ),

        createShapeElement("circle", 360, 620, 12, 12, "#10B981"),
        createTextElement(
          "Raised Series A funding of $5M",
          390,
          605,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 700, 12, 12, "#10B981"),
        createTextElement(
          "Grew to 5,000 active users",
          390,
          685,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 780, 12, 12, "#10B981"),
        createTextElement(
          "Launched enterprise tier",
          390,
          765,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 860, 12, 12, "#10B981"),
        createTextElement(
          "Expanded team to 20 members",
          390,
          845,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 980, 320, 120, "#F59E0B", { borderRadius: 16 }),
        createTextElement(
          "5,000+",
          360,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Active Users",
          360,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#FEF3C7",
            textAlign: "center",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 680, 980, 320, 120, "#10B981", { borderRadius: 16 }),
        createTextElement(
          "$5M",
          720,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Series A",
          720,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#D1FAE5",
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

    // Slide 4: 2022 - Scale
    {
      id: generateSlideId(),
      name: "2022 - Scale",
      order: 3,
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 12, "#8B5CF6"),
        createShapeElement("line", 180, 200, 6, 900, "#E2E8F0"),

        createShapeElement("circle", 100, 280, 160, 160, "#8B5CF6"),
        createTextElement(
          "2022",
          100,
          330,
          160,
          60,
          {
            fontSize: 32,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "SCALING UP",
          320,
          200,
          680,
          50,
          {
            fontSize: 24,
            fontWeight: 700,
            color: "#1E293B",
          },
          "heading",
        ),
        createTextElement(
          "International Reach",
          320,
          260,
          680,
          60,
          {
            fontSize: 42,
            fontWeight: 800,
            color: "#1E293B",
          },
          "heading",
        ),

        createTextElement(
          "Expanded into global markets and established international partnerships. Launched multilingual support and regional data centers.",
          320,
          360,
          680,
          100,
          {
            fontSize: 20,
            fontWeight: 400,
            color: "#64748B",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 500, 680, 420, "#FAF5FF", { borderRadius: 20 }),
        createTextElement(
          "KEY MILESTONES",
          360,
          540,
          600,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#8B5CF6",
            letterSpacing: 1,
          },
          "text",
        ),

        createShapeElement("circle", 360, 620, 12, 12, "#10B981"),
        createTextElement(
          "Reached 25,000 customers globally",
          390,
          605,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 700, 12, 12, "#10B981"),
        createTextElement(
          "Achieved $2M monthly recurring revenue",
          390,
          685,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 780, 12, 12, "#10B981"),
        createTextElement(
          "Opened offices in 3 countries",
          390,
          765,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 860, 12, 12, "#10B981"),
        createTextElement(
          "Team grew to 50 employees",
          390,
          845,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 980, 320, 120, "#8B5CF6", { borderRadius: 16 }),
        createTextElement(
          "25K+",
          360,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Customers",
          360,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#EDE9FE",
            textAlign: "center",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 680, 980, 320, 120, "#10B981", { borderRadius: 16 }),
        createTextElement(
          "$2M",
          720,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "MRR",
          720,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#D1FAE5",
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

    // Slide 5: 2023 - Leadership
    {
      id: generateSlideId(),
      name: "2023 - Leadership",
      order: 4,
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 12, "#EF4444"),
        createShapeElement("line", 180, 200, 6, 900, "#E2E8F0"),

        createShapeElement("circle", 100, 280, 160, 160, "#EF4444"),
        createTextElement(
          "2023",
          100,
          330,
          160,
          60,
          {
            fontSize: 32,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "MARKET LEADER",
          320,
          200,
          680,
          50,
          {
            fontSize: 24,
            fontWeight: 700,
            color: "#1E293B",
          },
          "heading",
        ),
        createTextElement(
          "Industry Recognition",
          320,
          260,
          680,
          60,
          {
            fontSize: 42,
            fontWeight: 800,
            color: "#1E293B",
          },
          "heading",
        ),

        createTextElement(
          "Became the go-to solution in our industry. Recognized by major publications and received multiple awards for innovation and customer satisfaction.",
          320,
          360,
          680,
          100,
          {
            fontSize: 20,
            fontWeight: 400,
            color: "#64748B",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 500, 680, 420, "#FEF2F2", { borderRadius: 20 }),
        createTextElement(
          "KEY MILESTONES",
          360,
          540,
          600,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#EF4444",
            letterSpacing: 1,
          },
          "text",
        ),

        createShapeElement("circle", 360, 620, 12, 12, "#10B981"),
        createTextElement(
          "Surpassed 50,000 active customers",
          390,
          605,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 700, 12, 12, "#10B981"),
        createTextElement(
          "Won 'Best Innovation' award",
          390,
          685,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 780, 12, 12, "#10B981"),
        createTextElement(
          "Launched AI-powered features",
          390,
          765,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 860, 12, 12, "#10B981"),
        createTextElement(
          "Featured in TechCrunch & Forbes",
          390,
          845,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 980, 320, 120, "#EF4444", { borderRadius: 16 }),
        createTextElement(
          "50K+",
          360,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Customers",
          360,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#FEE2E2",
            textAlign: "center",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 680, 980, 320, 120, "#10B981", { borderRadius: 16 }),
        createTextElement(
          "$10M",
          720,
          1010,
          240,
          40,
          {
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),
        createTextElement(
          "Revenue",
          720,
          1055,
          240,
          30,
          {
            fontSize: 16,
            fontWeight: 500,
            color: "#D1FAE5",
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

    // Slide 6: 2024 - Future Vision
    {
      id: generateSlideId(),
      name: "2024 - Future",
      order: 5,
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        createShapeElement("line", 0, 0, 1080, 12, "#10B981"),
        createShapeElement("line", 180, 200, 6, 900, "#E2E8F0"),

        createShapeElement("circle", 100, 280, 160, 160, "#10B981"),
        createTextElement(
          "2024",
          100,
          330,
          160,
          60,
          {
            fontSize: 32,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "LOOKING AHEAD",
          320,
          200,
          680,
          50,
          {
            fontSize: 24,
            fontWeight: 700,
            color: "#1E293B",
          },
          "heading",
        ),
        createTextElement(
          "The Next Chapter",
          320,
          260,
          680,
          60,
          {
            fontSize: 42,
            fontWeight: 800,
            color: "#1E293B",
          },
          "heading",
        ),

        createTextElement(
          "Continuing our mission to innovate and serve our customers better. Exciting new features and partnerships are on the horizon.",
          320,
          360,
          680,
          100,
          {
            fontSize: 20,
            fontWeight: 400,
            color: "#64748B",
            lineHeight: 1.6,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 500, 680, 420, "#F0FDF4", { borderRadius: 20 }),
        createTextElement(
          "COMING SOON",
          360,
          540,
          600,
          40,
          {
            fontSize: 18,
            fontWeight: 700,
            color: "#10B981",
            letterSpacing: 1,
          },
          "text",
        ),

        createShapeElement("circle", 360, 620, 12, 12, "#10B981"),
        createTextElement(
          "Advanced AI automation features",
          390,
          605,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 700, 12, 12, "#10B981"),
        createTextElement(
          "Mobile app launch for iOS & Android",
          390,
          685,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 780, 12, 12, "#10B981"),
        createTextElement(
          "Strategic partnerships with industry leaders",
          390,
          765,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("circle", 360, 860, 12, 12, "#10B981"),
        createTextElement(
          "Expansion to new market verticals",
          390,
          845,
          580,
          40,
          {
            fontSize: 19,
            fontWeight: 500,
            color: "#1E293B",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 320, 980, 680, 120, "#10B981", { borderRadius: 16 }),
        createTextElement(
          "Join us on this journey",
          360,
          1010,
          600,
          60,
          {
            fontSize: 28,
            fontWeight: 700,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "heading",
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
      background: { type: "solid", color: "#FFFFFF" },
      elements: [
        createShapeElement("circle", -100, 100, 600, 600, "#10B981", { opacity: 0.08 }),
        createShapeElement("circle", 580, 800, 700, 700, "#3B82F6", { opacity: 0.08 }),

        createShapeElement("line", 0, 0, 1080, 12, "#10B981"),

        createTextElement(
          "THANK YOU",
          80,
          320,
          920,
          80,
          {
            fontSize: 64,
            fontWeight: 800,
            color: "#1E293B",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "For being part of our journey",
          120,
          430,
          840,
          60,
          {
            fontSize: 28,
            fontWeight: 400,
            color: "#64748B",
            textAlign: "center",
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 240, 560, 600, 300, "#F0FDF4", { borderRadius: 24 }),

        createTextElement(
          "Get Started Today",
          280,
          620,
          520,
          60,
          {
            fontSize: 32,
            fontWeight: 700,
            color: "#1E293B",
            textAlign: "center",
          },
          "heading",
        ),

        createTextElement(
          "Join 50,000+ customers who trust us with their success",
          300,
          700,
          480,
          60,
          {
            fontSize: 20,
            fontWeight: 400,
            color: "#64748B",
            textAlign: "center",
            lineHeight: 1.5,
          },
          "text",
        ),

        createShapeElement("rounded-rectangle", 390, 790, 300, 50, "#10B981", { borderRadius: 25 }),
        createTextElement(
          "conductor.build",
          390,
          800,
          300,
          30,
          {
            fontSize: 20,
            fontWeight: 600,
            color: "#FFFFFF",
            textAlign: "center",
          },
          "text",
        ),

        createTextElement(
          "Follow us for more updates",
          80,
          980,
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
  ],
}
