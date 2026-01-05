// ═══════════════════════════════════════════════════════════════════════════════
// Template: Descriptive Carousel
// Professional descriptive content carousel with 10 slides
// Perfect for educational content, step-by-step guides, and storytelling
// ═══════════════════════════════════════════════════════════════════════════════

import type { CarouselTemplate } from "../carousel-designer-types"
import {
  createTextElement,
  createShapeElement,
  generateSlideId,
  createSwipeIndicator,
  SWIPE_TEXTS,
} from "./template-helpers"

export const descriptiveCarouselTemplate: CarouselTemplate = {
  id: "descriptive-carousel",
  name: "Descriptive Carousel",
  description:
    "Professional descriptive content with engaging visuals. Perfect for educational content and storytelling.",
  category: "descriptive-carousel",
  isPremium: false,
  isCustom: false,
  palette: {
    id: "navy-professional",
    name: "Navy Professional",
    category: "professional",
    colors: {
      primary: "#1E3A8A",
      secondary: "#3B82F6",
      accent: "#60A5FA",
      background: "#F8FAFC",
      text: "#0F172A",
      textSecondary: "#475569",
    },
  },
  size: "portrait",
  defaultFonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  tags: ["descriptive", "educational", "storytelling", "professional", "featured"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    {
      id: generateSlideId(),
      name: "Cover",
      order: 0,
      background: { type: "solid", color: "#1E3A8A" },
      elements: [
        createShapeElement("circle", -100, -100, 400, 400, "#3B82F6", { opacity: 0.15, zIndex: 0 }),
        createShapeElement("circle", 800, 900, 450, 450, "#60A5FA", { opacity: 0.1, zIndex: 0 }),

        createTextElement(
          "PROFESSIONAL GUIDE",
          60,
          450,
          960,
          60,
          { fontSize: 24, fontWeight: 600, textAlign: "center", color: "#93C5FD", letterSpacing: 6 },
          "text",
        ),
        createTextElement(
          "MASTER YOUR\nTOPIC HERE",
          60,
          540,
          960,
          180,
          { fontSize: 68, fontWeight: 800, textAlign: "center", color: "#FFFFFF", lineHeight: 1.1 },
          "heading",
        ),
        createTextElement(
          "A complete guide to help you succeed",
          60,
          760,
          960,
          40,
          { fontSize: 22, fontWeight: 400, textAlign: "center", color: "rgba(255,255,255,0.85)" },
          "subheading",
        ),

        createShapeElement("circle", 460, 920, 60, 60, "#FFFFFF", { zIndex: 2 }),
        createTextElement(
          "@yourhandle",
          60,
          1010,
          960,
          30,
          { fontSize: 18, fontWeight: 500, textAlign: "center", color: "rgba(255,255,255,0.75)" },
          "text",
        ),

        createSwipeIndicator("Swipe to begin →", 60, 1220, 960, "rgba(255,255,255,0.6)", 16, "center"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Introduction",
      order: 1,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rectangle", 0, 0, 1080, 8, "#1E3A8A"),

        createTextElement(
          "HERE'S THE THING",
          60,
          200,
          960,
          50,
          { fontSize: 22, fontWeight: 700, color: "#1E3A8A", letterSpacing: 2 },
          "text",
        ),

        createTextElement(
          "Most people struggle\nwith this topic because\nthey don't know where\nto start.",
          60,
          300,
          960,
          300,
          { fontSize: 48, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 },
          "heading",
        ),

        createTextElement(
          "But I'm going to show you exactly how to do it in the next few slides.",
          60,
          650,
          960,
          100,
          { fontSize: 26, fontWeight: 400, color: "#475569", lineHeight: 1.6 },
          "body",
        ),

        createSwipeIndicator(SWIPE_TEXTS.next, 60, 1220, 960, "#475569", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Step 1",
      order: 2,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 100, 120, 120, "#1E3A8A", { borderRadius: 24 }),
        createTextElement(
          "01",
          75,
          125,
          90,
          70,
          { fontSize: 48, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text",
        ),

        createTextElement(
          "Start with the\nfoundation",
          60,
          260,
          960,
          150,
          { fontSize: 52, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 },
          "heading",
        ),

        createShapeElement("line", 60, 430, 120, 6, "#3B82F6"),

        createTextElement(
          "Before you can build anything great, you need a solid foundation. Here's what you need to focus on:",
          60,
          480,
          960,
          100,
          { fontSize: 24, fontWeight: 400, color: "#475569", lineHeight: 1.6 },
          "body",
        ),

        createShapeElement("rounded-rectangle", 60, 620, 960, 70, "#FFFFFF", {
          borderRadius: 12,
          stroke: "#E0F2F1",
          strokeWidth: 2,
        }),
        createTextElement(
          "Understand the core concepts first",
          100,
          640,
          880,
          30,
          { fontSize: 20, fontWeight: 500, color: "#0F172A" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 60, 710, 960, 70, "#FFFFFF", {
          borderRadius: 12,
          stroke: "#E0F2F1",
          strokeWidth: 2,
        }),
        createTextElement(
          "Don't skip the basics",
          100,
          730,
          880,
          30,
          { fontSize: 20, fontWeight: 500, color: "#0F172A" },
          "text",
        ),

        createSwipeIndicator(SWIPE_TEXTS.keepSwiping, 60, 1220, 960, "#475569", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Step 2",
      order: 3,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 100, 120, 120, "#3B82F6", { borderRadius: 24 }),
        createTextElement(
          "02",
          75,
          125,
          90,
          70,
          { fontSize: 48, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text",
        ),

        createTextElement(
          "Practice\nconsistently",
          60,
          260,
          960,
          150,
          { fontSize: 52, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 },
          "heading",
        ),

        createShapeElement("line", 60, 430, 120, 6, "#1E3A8A"),

        createTextElement(
          "Consistency beats intensity. Small daily actions compound into massive results over time.",
          60,
          480,
          960,
          100,
          { fontSize: 24, fontWeight: 400, color: "#475569", lineHeight: 1.6 },
          "body",
        ),

        createShapeElement("rounded-rectangle", 60, 620, 300, 200, "#1E3A8A", { borderRadius: 16 }),
        createTextElement(
          "DAILY",
          110,
          660,
          200,
          50,
          { fontSize: 36, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text",
        ),
        createTextElement(
          "15 MIN",
          110,
          710,
          200,
          50,
          { fontSize: 32, fontWeight: 600, textAlign: "center", color: "#93C5FD" },
          "text",
        ),

        createTextElement(
          "Even 15 minutes a day\ncan transform your skills\nin just a few months.",
          400,
          640,
          620,
          150,
          { fontSize: 22, fontWeight: 500, color: "#0F172A", lineHeight: 1.5 },
          "body",
        ),

        createSwipeIndicator(SWIPE_TEXTS.moreToGo, 60, 1220, 960, "#475569", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Step 3",
      order: 4,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 100, 120, 120, "#60A5FA", { borderRadius: 24 }),
        createTextElement(
          "03",
          75,
          125,
          90,
          70,
          { fontSize: 48, fontWeight: 800, textAlign: "center", color: "#0F172A" },
          "text",
        ),

        createTextElement(
          "Get feedback\nand iterate",
          60,
          260,
          960,
          150,
          { fontSize: 52, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 },
          "heading",
        ),

        createShapeElement("line", 60, 430, 120, 6, "#3B82F6"),

        createTextElement(
          "You can't improve what you don't measure. Seek feedback actively and use it to get better.",
          60,
          480,
          960,
          100,
          { fontSize: 24, fontWeight: 400, color: "#475569", lineHeight: 1.6 },
          "body",
        ),

        createShapeElement("rounded-rectangle", 60, 620, 960, 180, "#1E3A8A", { borderRadius: 16 }),
        createTextElement(
          '"Feedback is the breakfast of champions."',
          100,
          660,
          880,
          60,
          { fontSize: 28, fontWeight: 600, textAlign: "center", color: "#FFFFFF", lineHeight: 1.4 },
          "text",
        ),
        createTextElement(
          "— Ken Blanchard",
          100,
          740,
          880,
          30,
          { fontSize: 18, fontWeight: 400, textAlign: "center", color: "rgba(255,255,255,0.8)" },
          "text",
        ),

        createSwipeIndicator(SWIPE_TEXTS.continueReading, 60, 1220, 960, "#475569", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Step 4",
      order: 5,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 100, 120, 120, "#1E3A8A", { borderRadius: 24 }),
        createTextElement(
          "04",
          75,
          125,
          90,
          70,
          { fontSize: 48, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text",
        ),

        createTextElement(
          "Learn from\nthe experts",
          60,
          260,
          960,
          150,
          { fontSize: 52, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 },
          "heading",
        ),

        createShapeElement("line", 60, 430, 120, 6, "#3B82F6"),

        createTextElement(
          "Don't reinvent the wheel. Study those who've already mastered what you're trying to learn.",
          60,
          480,
          960,
          100,
          { fontSize: 24, fontWeight: 400, color: "#475569", lineHeight: 1.6 },
          "body",
        ),

        createShapeElement("rounded-rectangle", 110, 620, 220, 180, "#FFFFFF", {
          borderRadius: 16,
          stroke: "#E0F2F1",
          strokeWidth: 2,
        }),
        createTextElement(
          "Read",
          110,
          660,
          220,
          100,
          { fontSize: 48, fontWeight: 700, textAlign: "center", color: "#1E3A8A" },
          "text",
        ),
        createTextElement(
          "Books & Articles",
          110,
          760,
          220,
          30,
          { fontSize: 16, fontWeight: 500, textAlign: "center", color: "#0F172A" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 360, 620, 220, 180, "#FFFFFF", {
          borderRadius: 16,
          stroke: "#E0F2F1",
          strokeWidth: 2,
        }),
        createTextElement(
          "Listen",
          360,
          660,
          220,
          100,
          { fontSize: 48, fontWeight: 700, textAlign: "center", color: "#1E3A8A" },
          "text",
        ),
        createTextElement(
          "Podcasts & Talks",
          360,
          760,
          220,
          30,
          { fontSize: 16, fontWeight: 500, textAlign: "center", color: "#0F172A" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 610, 620, 220, 180, "#FFFFFF", {
          borderRadius: 16,
          stroke: "#E0F2F1",
          strokeWidth: 2,
        }),
        createTextElement(
          "Network",
          610,
          660,
          220,
          100,
          { fontSize: 48, fontWeight: 700, textAlign: "center", color: "#1E3A8A" },
          "text",
        ),
        createTextElement(
          "Connect & Learn",
          610,
          760,
          220,
          30,
          { fontSize: 16, fontWeight: 500, textAlign: "center", color: "#0F172A" },
          "text",
        ),

        createSwipeIndicator(SWIPE_TEXTS.swipeForMore, 60, 1220, 960, "#475569", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Step 5",
      order: 6,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createShapeElement("rounded-rectangle", 60, 100, 120, 120, "#3B82F6", { borderRadius: 24 }),
        createTextElement(
          "05",
          75,
          125,
          90,
          70,
          { fontSize: 48, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "text",
        ),

        createTextElement(
          "Share your\nknowledge",
          60,
          260,
          960,
          150,
          { fontSize: 52, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 },
          "heading",
        ),

        createShapeElement("line", 60, 430, 120, 6, "#1E3A8A"),

        createTextElement(
          "Teaching others is the fastest way to solidify your own understanding. Share what you learn!",
          60,
          480,
          960,
          100,
          { fontSize: 24, fontWeight: 400, color: "#475569", lineHeight: 1.6 },
          "body",
        ),

        createShapeElement("rounded-rectangle", 60, 620, 960, 180, "#1E3A8A", { borderRadius: 16 }),
        createTextElement("90%", 100, 640, 300, 120, { fontSize: 80, fontWeight: 800, color: "#FFFFFF" }, "text"),
        createTextElement(
          "retention rate when you\nteach what you learn\nvs 10% from reading alone",
          420,
          660,
          560,
          120,
          { fontSize: 22, fontWeight: 500, color: "#FFFFFF", lineHeight: 1.5 },
          "body",
        ),

        createSwipeIndicator(SWIPE_TEXTS.almostThere, 60, 1220, 960, "#475569", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Takeaways",
      order: 7,
      background: { type: "solid", color: "#1E3A8A" },
      elements: [
        createTextElement(
          "KEY TAKEAWAYS",
          60,
          150,
          960,
          50,
          { fontSize: 24, fontWeight: 700, textAlign: "center", color: "#93C5FD", letterSpacing: 4 },
          "text",
        ),

        createTextElement(
          "Let's recap what\nwe've learned:",
          60,
          220,
          960,
          120,
          { fontSize: 42, fontWeight: 700, textAlign: "center", color: "#FFFFFF", lineHeight: 1.2 },
          "heading",
        ),

        createShapeElement("rounded-rectangle", 60, 390, 960, 100, "rgba(255,255,255,0.15)", { borderRadius: 16 }),
        createTextElement(
          "1.  Build a strong foundation first",
          100,
          420,
          880,
          40,
          { fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 60, 510, 960, 100, "rgba(255,255,255,0.15)", { borderRadius: 16 }),
        createTextElement(
          "2.  Practice consistently every day",
          100,
          540,
          880,
          40,
          { fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 60, 630, 960, 100, "rgba(255,255,255,0.15)", { borderRadius: 16 }),
        createTextElement(
          "3.  Get feedback and improve",
          100,
          660,
          880,
          40,
          { fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 60, 750, 960, 100, "rgba(255,255,255,0.15)", { borderRadius: 16 }),
        createTextElement(
          "4.  Learn from experts",
          100,
          780,
          880,
          40,
          { fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 60, 870, 960, 100, "rgba(255,255,255,0.15)", { borderRadius: 16 }),
        createTextElement(
          "5.  Share your knowledge",
          100,
          900,
          880,
          40,
          { fontSize: 24, fontWeight: 600, color: "#FFFFFF" },
          "text",
        ),

        createSwipeIndicator(SWIPE_TEXTS.lastOne, 60, 1220, 960, "rgba(255,255,255,0.7)", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Engagement",
      order: 8,
      background: { type: "solid", color: "#F8FAFC" },
      elements: [
        createTextElement(
          "Found this helpful?",
          60,
          300,
          960,
          60,
          { fontSize: 42, fontWeight: 700, textAlign: "center", color: "#0F172A" },
          "heading",
        ),

        createTextElement(
          "Show some love:",
          60,
          400,
          960,
          40,
          { fontSize: 24, fontWeight: 500, textAlign: "center", color: "#475569" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 140, 500, 250, 120, "#1E3A8A", { borderRadius: 16 }),
        createTextElement(
          "Like",
          140,
          540,
          250,
          50,
          { fontSize: 36, fontWeight: 700, textAlign: "center", color: "#FFFFFF" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 420, 500, 250, 120, "#3B82F6", { borderRadius: 16 }),
        createTextElement(
          "Comment",
          420,
          540,
          250,
          50,
          { fontSize: 36, fontWeight: 700, textAlign: "center", color: "#FFFFFF" },
          "text",
        ),

        createShapeElement("rounded-rectangle", 700, 500, 250, 120, "#60A5FA", { borderRadius: 16 }),
        createTextElement(
          "Share",
          700,
          540,
          250,
          50,
          { fontSize: 36, fontWeight: 700, textAlign: "center", color: "#0F172A" },
          "text",
        ),

        createTextElement(
          "Save this post for later",
          60,
          700,
          960,
          40,
          { fontSize: 22, fontWeight: 500, textAlign: "center", color: "#475569" },
          "text",
        ),

        createSwipeIndicator("One more →", 60, 1220, 960, "#475569", 16, "right"),
      ],
    },

    {
      id: generateSlideId(),
      name: "Follow CTA",
      order: 9,
      background: {
        type: "gradient",
        gradient: { from: "#1E3A8A", to: "#3B82F6", direction: "to-br" },
        color: "#1E3A8A",
      },
      elements: [
        createShapeElement("circle", -100, 900, 400, 400, "#60A5FA", { opacity: 0.2 }),
        createShapeElement("circle", 800, -100, 350, 350, "#FFFFFF", { opacity: 0.1 }),

        createTextElement(
          "FOLLOW FOR MORE",
          60,
          400,
          960,
          50,
          { fontSize: 24, fontWeight: 600, textAlign: "center", color: "#93C5FD", letterSpacing: 6 },
          "text",
        ),

        createTextElement(
          "@yourhandle",
          60,
          480,
          960,
          80,
          { fontSize: 56, fontWeight: 800, textAlign: "center", color: "#FFFFFF" },
          "heading",
        ),

        createTextElement(
          "Daily tips on productivity,\ngrowth, and success",
          60,
          600,
          960,
          80,
          { fontSize: 26, fontWeight: 400, textAlign: "center", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 },
          "body",
        ),

        createShapeElement("rounded-rectangle", 340, 750, 400, 70, "#FFFFFF", { borderRadius: 35 }),
        createTextElement(
          "FOLLOW",
          340,
          765,
          400,
          40,
          { fontSize: 22, fontWeight: 700, textAlign: "center", color: "#1E3A8A" },
          "text",
        ),

        createTextElement(
          "Turn on notifications to never miss a post",
          60,
          880,
          960,
          30,
          { fontSize: 16, fontWeight: 400, textAlign: "center", color: "rgba(255,255,255,0.7)" },
          "text",
        ),
      ],
    },
  ],
}
