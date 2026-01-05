"use server"

import { generateText } from "ai"
import {
  getAIModel,
  getDepthGuideline,
  TEMPERATURE_PRESETS,
  type AIProviderType,
} from "@/lib/ai-providers"
import type { PersonaData, ContextData } from "./generate-post"

// ═══════════════════════════════════════════════════════════════════════════════
// Types and Interfaces
// ═══════════════════════════════════════════════════════════════════════════════

export interface GenerateLinkedInCarouselParams {
  platform: string
  style: string
  keywords: string
  content: string
  slideCount: number
  includeIntro: boolean
  includeOutro: boolean
  carouselTheme: string
  slideFormat: string
  carouselDepth?: string
  customDepthDescription?: string
  provider: AIProviderType
  apiKey?: string
  model?: string
  persona?: PersonaData
  context?: ContextData
  userInstructions?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════

function buildPersonaContext(persona: PersonaData): string {
  let context = ""
  
  if (persona.instructions) {
    context += `\n📋 Persona Instructions: ${persona.instructions}`
  }

  if (persona.sentiment) {
    const s = persona.sentiment
    context += `\n\n🎭 PERSONA VOICE:
• Emotional tone: ${s.dominant} (${s.positive}% positive, ${s.negative}% negative, ${s.neutral}% neutral)`

    if (s.styleCharacteristics) {
      const style = s.styleCharacteristics
      context += `
• Sentence length: ~${style.avgSentenceLength} words
• Formality: ${style.formalityLevel}
• Uses emojis: ${style.usesEmojis ? 'Yes' : 'No'}
• Uses hashtags: ${style.usesHashtags ? 'Yes' : 'No'}`

      if (style.writingPatterns) {
        const p = style.writingPatterns
        context += `
• Vocabulary: ${p.vocabularyLevel}
${p.uniquePhrases?.length ? `• Signature phrases: "${p.uniquePhrases.slice(0, 3).join('", "')}"` : ''}`
      }

      if (style.formattingPatterns) {
        const f = style.formattingPatterns
        context += `
• Bold style: ${f.usesBoldUnicode ? 'Unicode bold (𝗕𝗼𝗹𝗱)' : 'Standard'}
${f.bulletStyles?.length ? `• Bullets: ${f.bulletStyles.join(' ')}` : ''}
${f.specialCharacters?.length ? `• Special chars: ${f.specialCharacters.slice(0, 8).join(' ')}` : ''}`
      }
    }
  }

  return context
}

function buildBrandContext(contextData: ContextData): string {
  return `
🏢 BRAND CONTEXT:
• Name: ${contextData.name}
• Category: ${contextData.category}
${contextData.description ? `• Description: ${contextData.description}` : ''}

📋 Key Information:
${contextData.data.rawContent.slice(0, 1500)}${contextData.data.rawContent.length > 1500 ? '...' : ''}

${contextData.analysis?.keyTopics?.length ? `🏷️ Topics: ${contextData.analysis.keyTopics.join(', ')}` : ''}
${contextData.analysis?.contentSummary ? `💡 Summary: ${contextData.analysis.contentSummary}` : ''}

⚠️ Keep all content consistent with this brand context.`
}

function cleanupSlide(slide: string): string {
  return slide.trim()
    .replace(/^```(?:json)?\s*/g, '')
    .replace(/\s*```$/g, '')
    .replace(/^\s*\/\*\s*---\s*Slide\s*\d+\s*---\s*\*\/\s*/gi, '')
    .replace(/^Slide\s*\d+\s*[:.]\s*/gi, '')
    .replace(/^\d+\s*[:.]\s*/g, '')
    .replace(/^\*\*Slide\s*\d+\*\*:?\s*/gi, '')
    .replace(/^\[Slide\s*\d+\]\s*/gi, '')
    .trim()
}

function parseCarouselResponse(text: string): string[] {
  let slides: string[] = []

  // Try to find and parse JSON array
  const jsonMatch = text.match(/\[\s*"[\s\S]*"\s*\]/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        slides = parsed.map(cleanupSlide).filter(s => s.length > 0)
        if (slides.length > 0) return slides
      }
    } catch {
      // Continue to fallback methods
    }
  }

  // Try direct JSON parse
  try {
    const parsed = JSON.parse(text.trim())
    if (Array.isArray(parsed)) {
      slides = parsed.map(cleanupSlide).filter(s => s.length > 0)
      if (slides.length > 0) return slides
    }
  } catch {
    // Continue to fallback methods
  }

  // Try pattern-based extraction
  const slideRegex = /(?:\/\*\s*---\s*Slide\s*\d+\s*---\s*\*\/|Slide\s*\d+:|^\d+[.:]|\*\*Slide\s*\d+\*\*:?|\[Slide\s*\d+\])/gm
  const parts = text.split(slideRegex).filter(Boolean).map(cleanupSlide)
  
  if (parts.length > 0 && parts[0].length < 10) {
    parts.shift()
  }
  
  slides = parts.filter(s => s.length > 10 && !s.includes('[') && !s.includes(']'))
  
  if (slides.length > 0) return slides

  // Last resort: split by double newlines
  const lines = text.split(/\n\n+/).filter(line => {
    const clean = cleanupSlide(line)
    return clean.length > 15 && !clean.includes('```') && !clean.includes('/*')
  })

  return lines.map(cleanupSlide)
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Carousel Generation Function
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateLinkedInCarousel({
  platform,
  style,
  keywords,
  content,
  slideCount,
  includeIntro,
  includeOutro,
  carouselTheme,
  slideFormat,
  carouselDepth = "technical",
  customDepthDescription,
  provider,
  apiKey,
  model,
  persona,
  context: contextData,
  userInstructions,
}: GenerateLinkedInCarouselParams) {
  try {
    // Get AI model from centralized config
    const aiModel = getAIModel({
      provider,
      apiKey,
      model,
      useCase: "creative",
    })

    // Get depth guidelines
    const depthInfo = getDepthGuideline(carouselDepth, customDepthDescription)

    // ─────────────────────────────────────────────────────────────────────────
    // Build the Carousel Prompt
    // ─────────────────────────────────────────────────────────────────────────

    let prompt = `You are an expert LinkedIn carousel creator who designs viral, engaging slide decks that drive massive engagement and provide real value.

═══════════════════════════════════════════════════════════════
📊 CAROUSEL SPECIFICATIONS
═══════════════════════════════════════════════════════════════

• Total slides: ${slideCount}
${includeIntro ? '• Include: Attention-grabbing intro slide' : ''}
${includeOutro ? '• Include: Strong CTA outro slide' : ''}
• Theme: ${carouselTheme}
• Format: ${slideFormat}
• Style: ${style}

═══════════════════════════════════════════════════════════════
📏 CONTENT DEPTH: ${carouselDepth.toUpperCase()}
═══════════════════════════════════════════════════════════════

• Description: ${depthInfo.description}
• Content per slide: ${depthInfo.slideContent}
• Detail level: ${depthInfo.detailLevel}
• Approach: ${depthInfo.approach}
${carouselDepth === 'custom' && customDepthDescription ? `• Custom requirements: ${customDepthDescription}` : ''}

═══════════════════════════════════════════════════════════════
🎯 YOUR TASK
═══════════════════════════════════════════════════════════════

${userInstructions ? `
📣 USER'S SPECIFIC INSTRUCTIONS:
"${userInstructions}"

^^^ Use these instructions to guide the angle and focus of your carousel.
` : ''}

SOURCE CONTENT:
"""
${content}
"""

${keywords ? `🔑 KEYWORDS TO INCORPORATE: ${keywords}` : ''}`

    // Add persona context if available
    if (persona) {
      prompt += `

═══════════════════════════════════════════════════════════════
👤 PERSONA: ${persona.name}
═══════════════════════════════════════════════════════════════
${buildPersonaContext(persona)}

📚 WRITING STYLE REFERENCE (learn style, don't copy):
"""
${persona.rawContent.slice(0, 2000)}${persona.rawContent.length > 2000 ? '...' : ''}
"""

Apply this persona's voice to all slides.`
    }

    // Add brand context if available
    if (contextData) {
      prompt += `

═══════════════════════════════════════════════════════════════
🏢 BRAND CONTEXT
═══════════════════════════════════════════════════════════════
${buildBrandContext(contextData)}`
    }

    // Slide structure and quality guidelines
    prompt += `

═══════════════════════════════════════════════════════════════
📋 SLIDE STRUCTURE REQUIREMENTS
═══════════════════════════════════════════════════════════════

${includeIntro ? `
🎬 INTRO SLIDE (Slide 1):
• Bold, attention-grabbing headline
• Create curiosity or promise value
• Make them WANT to swipe
• Example hooks: "Stop doing X", "The truth about Y", "How I Z"
` : ''}

📑 CONTENT SLIDES (Slides ${includeIntro ? '2' : '1'}-${slideCount - (includeOutro ? 1 : 0)}):
• Clear headline for each slide
• ${depthInfo.slideContent}
• One main idea per slide
• Visual hierarchy: headline → key points → supporting detail
• Use bullets, numbers, or short paragraphs
• Make each slide valuable standalone

${includeOutro ? `
🎯 OUTRO SLIDE (Slide ${slideCount}):
• Summarize key takeaway OR
• Clear call-to-action (follow, comment, share, save)
• Include relevant hashtags (3-5)
• End with engagement question
` : ''}

═══════════════════════════════════════════════════════════════
✨ QUALITY REQUIREMENTS
═══════════════════════════════════════════════════════════════

Each slide MUST:
☑ Have a clear, compelling headline
☑ Provide genuine value or insight  
☑ Flow naturally to the next slide
☑ Be scannable (not walls of text)
☑ Use consistent formatting throughout

AVOID:
• Generic filler content
• Repetitive points across slides
• Overly long slides that lose attention
• Weak headlines that don't hook
• Missing the promised value

═══════════════════════════════════════════════════════════════
📤 OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

Return EXACTLY ${slideCount} slides as a JSON array of strings.
Each array element = complete text for one slide.
NO slide numbers, NO "Slide X:" prefixes, NO markdown code blocks.

Example format:
["Slide 1 content here", "Slide 2 content here", "Slide 3 content here"]

Generate the ${slideCount}-slide LinkedIn carousel now as a JSON array:`

    // Generate the carousel
    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature: persona ? TEMPERATURE_PRESETS.balanced : 0.5,
    })

    // Parse the response
    const carouselSlides = parseCarouselResponse(text)

    if (carouselSlides.length === 0) {
      return {
        success: false,
        error: "Failed to parse carousel slides from the response. Please try again.",
      }
    }

    return { success: true, carousel: carouselSlides }
  } catch (error) {
    console.error("Carousel generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
