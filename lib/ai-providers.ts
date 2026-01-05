import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createAnthropic } from "@ai-sdk/anthropic"

// ═══════════════════════════════════════════════════════════════════════════════
// AI Provider Configuration
// Centralized configuration for all AI providers, models, and client creation
// ═══════════════════════════════════════════════════════════════════════════════

export type AIProviderType = "groq" | "gemini" | "openai" | "anthropic"

// ─────────────────────────────────────────────────────────────────────────────
// Provider Models Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const AI_MODELS = {
  groq: {
    default: "llama-3.3-70b-versatile",
    fast: "llama-3.1-8b-instant",
    creative: "llama-3.3-70b-versatile",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", description: "Best for complex tasks" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", description: "Fastest responses" },
      { id: "llama-3.2-90b-vision-preview", name: "Llama 3.2 90B Vision", description: "Vision capabilities" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", description: "Great for coding" },
    ]
  },
  gemini: {
    default: "models/gemini-mini",
    fast: "models/gemini-mini",
    creative: "models/gemini-2.0-flash-thinking-exp",
    models: [
      { id: "models/gemini-mini", name: "Gemini Mini (free)", description: "Lightweight, low-cost / free option" },
      { id: "models/gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast and capable" },
      { id: "models/gemini-2.0-flash-thinking-exp", name: "Gemini 2.0 Flash Thinking", description: "Enhanced reasoning" },
      { id: "models/gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Best quality" },
    ]
  },
  openai: {
    default: "gpt-5.2",
    fast: "gpt-5-mini",
    creative: "gpt-5.1",
    models: [
      { id: "gpt-5", name: "GPT-5", description: "Most capable" },
      { id: "gpt-5-mini", name: "GPT-5 Mini", description: "Fast and affordable" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Great for long content" },
      { id: "o1", name: "o1", description: "Advanced reasoning" },
      { id: "o1-mini", name: "o1 Mini", description: "Fast reasoning" },
    ]
  },
  anthropic: {
    default: "claude-sonnet-4-5-20250929",
    fast: "claude-haiku-4-5-20251001",
    creative: "claude-sonnet-4-5-20250929",
    models: [
      { id: "claude-sonnet-4-5-20250929", name: "Claude 4.5 Sonnet", description: "Best balanced" },
      { id: "claude-haiku-4-5-20251001", name: "Claude 4.5 Haiku", description: "Fast and efficient" },
      { id: "claude-opus-4-5-20251101", name: "Claude 4.5 Opus", description: "Most capable" },
    ]
  }
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Pre-configured Clients (for server-side use with env keys)
// ─────────────────────────────────────────────────────────────────────────────

// GROQ client (uses env variable)
export const groqClient = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

// Gemini client (uses env variable)
export const geminiClient = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// ─────────────────────────────────────────────────────────────────────────────
// AI Model Factory
// Creates the appropriate AI model instance based on provider and settings
// ─────────────────────────────────────────────────────────────────────────────

export interface GetAIModelParams {
  provider: AIProviderType
  apiKey?: string
  model?: string
  useCase?: "default" | "fast" | "creative"
}

export function getAIModel({ provider, apiKey, model, useCase = "default" }: GetAIModelParams) {
  const providerModels = AI_MODELS[provider]
  const selectedModel = model || providerModels[useCase] || providerModels.default

  switch (provider) {
    case "groq":
      return groqClient.chat(selectedModel)

    case "gemini":
      return geminiClient(selectedModel)

    case "openai":
      if (!apiKey) throw new Error("OpenAI API key is required")
      const openai = createOpenAI({ apiKey })
      return openai(selectedModel)

    case "anthropic":
      if (!apiKey) throw new Error("Anthropic API key is required")
      const anthropic = createAnthropic({ apiKey })
      return anthropic(selectedModel)

    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Temperature Presets
// Different temperature values for different types of content generation
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPERATURE_PRESETS = {
  precise: 0.2,      // For factual content, summaries
  balanced: 0.4,     // For persona-driven content (60% style, 40% creativity)
  creative: 0.7,     // For creative writing, brainstorming
  experimental: 0.9, // For very creative/experimental content
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Platform Guidelines
// Centralized platform-specific guidelines for content generation
// ─────────────────────────────────────────────────────────────────────────────

export const PLATFORM_GUIDELINES = {
  linkedin: {
    name: "LinkedIn",
    description: "Professional network format, use line breaks, include relevant hashtags, encourage engagement",
    maxLength: "800-1300 characters",
    tone: "professional and engaging",
    formatting: "Use Unicode bold (𝗕𝗼𝗹𝗱) for emphasis, bullet points with • or ✦, proper line breaks",
    bestPractices: [
      "Start with a strong hook in the first line",
      "Use short paragraphs (1-3 sentences)",
      "Include a call-to-action",
      "Add 3-5 relevant hashtags at the end",
      "Ask a question to encourage engagement",
    ],
  },
  x: {
    name: "X (Twitter)",
    description: "Concise Twitter format, punchy and engaging",
    maxLength: "280 characters maximum",
    tone: "concise and impactful",
    formatting: "Keep it brief, use hashtags sparingly",
    bestPractices: [
      "Lead with the most important point",
      "Use active voice",
      "Include 1-2 hashtags max",
      "End with engagement hook",
    ],
  },
  reddit: {
    name: "Reddit",
    description: "Conversational Reddit format, detailed but engaging, use appropriate subreddit tone",
    maxLength: "moderate length, detailed explanation",
    tone: "conversational and informative",
    formatting: "Use markdown formatting, headers for sections",
    bestPractices: [
      "Be authentic and avoid corporate speak",
      "Provide value first, promote second",
      "Use TL;DR at the end for longer posts",
      "Engage in comments",
    ],
  },
  instagram: {
    name: "Instagram",
    description: "Visual-focused format with engaging captions, use relevant hashtags",
    maxLength: "2200 characters maximum",
    tone: "engaging and visual",
    formatting: "Use line breaks, emojis for visual appeal",
    bestPractices: [
      "Put key message in first 125 characters",
      "Use emojis strategically",
      "Add 15-30 hashtags",
      "Include a call-to-action",
    ],
  },
  facebook: {
    name: "Facebook",
    description: "Community-focused format, encourage discussion and sharing",
    maxLength: "500-600 characters for optimal engagement",
    tone: "friendly and community-oriented",
    formatting: "Use emojis, keep paragraphs short",
    bestPractices: [
      "Ask questions to encourage discussion",
      "Use personal stories",
      "Keep it conversational",
      "Include 1-3 hashtags max",
    ],
  },
  threads: {
    name: "Threads",
    description: "Thread-style format, conversational and engaging",
    maxLength: "500 characters per post",
    tone: "conversational and authentic",
    formatting: "Keep it brief and authentic",
    bestPractices: [
      "Be authentic and personal",
      "Share opinions and insights",
      "Engage with replies",
    ],
  },
  medium: {
    name: "Medium",
    description: "Article-style format with proper structure and depth",
    maxLength: "comprehensive article format",
    tone: "thoughtful and in-depth",
    formatting: "Use markdown, headers, and proper structure",
    bestPractices: [
      "Use compelling headlines",
      "Include subheadings",
      "Add relevant images",
      "Cite sources when relevant",
    ],
  },
  youtube: {
    name: "YouTube",
    description: "Detailed video descriptions with timestamps and links",
    maxLength: "comprehensive description up to 1000 characters",
    tone: "informative and engaging",
    formatting: "Use line breaks, timestamps, and links",
    bestPractices: [
      "Include keywords in first 200 characters",
      "Add timestamps for longer videos",
      "Include relevant links",
      "Add a call-to-action",
    ],
  },
  discord: {
    name: "Discord",
    description: "Community chat format, casual and interactive",
    maxLength: "2000 characters maximum",
    tone: "casual and community-focused",
    formatting: "Use markdown, emojis, and Discord-specific formatting",
    bestPractices: [
      "Keep it casual and friendly",
      "Use emojis appropriately",
      "Be responsive to replies",
    ],
  },
  tiktok: {
    name: "TikTok",
    description: "Short, catchy format for video descriptions, trending hashtags",
    maxLength: "150 characters maximum",
    tone: "trendy and energetic",
    formatting: "Keep it brief, use trending hashtags",
    bestPractices: [
      "Use trending hashtags",
      "Keep it short and punchy",
      "Include a hook",
    ],
  },
} as const

export type Platform = keyof typeof PLATFORM_GUIDELINES

// ─────────────────────────────────────────────────────────────────────────────
// Length Guidelines
// ─────────────────────────────────────────────────────────────────────────────

export const LENGTH_GUIDELINES = {
  small: {
    wordCount: "50-150 words",
    description: "Brief and punchy. Get to the point quickly with concise messaging.",
    emphasis: "Focus on one key idea or message",
  },
  medium: {
    wordCount: "150-300 words",
    description: "Balanced content with proper context and explanation.",
    emphasis: "Develop the main idea with supporting details",
  },
  large: {
    wordCount: "300-500 words",
    description: "In-depth discussion with comprehensive coverage of the topic.",
    emphasis: "Provide thorough analysis, examples, and detailed insights",
  },
} as const

export function getLengthGuideline(postLength: string, customWordCount?: number) {
  if (postLength === "custom" && customWordCount) {
    return {
      wordCount: `approximately ${customWordCount} words`,
      description: `Custom length targeting ${customWordCount} words. Adjust depth and detail accordingly.`,
      emphasis: "Match the specified word count while maintaining quality",
    }
  }
  return LENGTH_GUIDELINES[postLength as keyof typeof LENGTH_GUIDELINES] || LENGTH_GUIDELINES.medium
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Depth Guidelines (for carousels)
// ─────────────────────────────────────────────────────────────────────────────

export const DEPTH_GUIDELINES = {
  short: {
    description: "Brief overviews with key takeaways",
    slideContent: "2-3 short sentences or 3-4 bullet points per slide",
    detailLevel: "High-level concepts only, easy to scan quickly",
    approach: "Focus on the what, not the how or why",
  },
  technical: {
    description: "Balanced depth with professional insights",
    slideContent: "3-5 sentences or 4-6 bullet points per slide",
    detailLevel: "Moderate detail with context and explanations",
    approach: "Balance overview with practical insights and context",
  },
  "in-depth": {
    description: "Comprehensive coverage with detailed explanations",
    slideContent: "4-7 sentences or 5-8 bullet points per slide",
    detailLevel: "Thorough analysis with examples, data, and deep insights",
    approach: "Explain the what, how, and why with supporting evidence",
  },
} as const

export function getDepthGuideline(depth: string, customDescription?: string) {
  if (depth === "custom" && customDescription) {
    return {
      description: customDescription,
      slideContent: "Adjust content density based on custom requirements",
      detailLevel: customDescription,
      approach: "Follow the specified depth requirements while maintaining engagement",
    }
  }
  return DEPTH_GUIDELINES[depth as keyof typeof DEPTH_GUIDELINES] || DEPTH_GUIDELINES.technical
}
