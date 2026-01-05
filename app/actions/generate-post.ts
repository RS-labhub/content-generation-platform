"use server"

import { generateText } from "ai"
import {
  getAIModel,
  PLATFORM_GUIDELINES,
  getLengthGuideline,
  TEMPERATURE_PRESETS,
  type AIProviderType,
  type Platform,
} from "@/lib/ai-providers"

// ═══════════════════════════════════════════════════════════════════════════════
// Types and Interfaces
// ═══════════════════════════════════════════════════════════════════════════════

export interface PersonaData {
  name: string
  rawContent: string
  instructions?: string
  sentiment?: {
    positive: number
    negative: number
    neutral: number
    dominant: string
    keywords?: string[]
    styleCharacteristics?: StyleCharacteristics
  }
}

export interface StyleCharacteristics {
  avgSentenceLength: number
  usesEmojis: boolean
  usesHashtags: boolean
  formalityLevel: 'formal' | 'casual' | 'mixed'
  punctuationStyle: string[]
  writingPatterns?: WritingPatterns
  formattingPatterns?: FormattingPatterns
}

export interface WritingPatterns {
  contractionsUsed: string[]
  uniquePhrases: string[]
  sentenceStarters: string[]
  sentenceEnders: string[]
  vocabularyLevel: 'simple' | 'intermediate' | 'advanced' | 'mixed'
  personalPronouns: string[]
  transitionWords: string[]
  questionPatterns: string[]
  exclamationPatterns: string[]
}

export interface FormattingPatterns {
  bulletStyles: string[]
  headerStyles: string[]
  emphasisPatterns: string[]
  listStructures: string[]
  specialCharacters: string[]
  linkPatterns: string[]
  calloutPatterns: string[]
  indentationStyle: string
  usesBoldUnicode: boolean
  usesMarkdownSyntax: boolean
  usesHTMLElements: boolean
  structuralMarkers: string[]
}

export interface ContextData {
  name: string
  description?: string
  category: string
  data: {
    structured: Record<string, unknown>
    rawContent: string
    metadata: {
      dataType: string
      fileCount: number
      totalSize: number
      lastUpdated: string
    }
  }
  analysis?: {
    keyTopics: string[]
    entities: string[]
    dataCategories: string[]
    contentSummary: string
    keyInsights?: string[]
  }
}

export interface GeneratePostParams {
  platform: string
  style: string
  keywords: string
  content: string
  contentType?: string
  postLength?: string
  customWordCount?: number
  provider: AIProviderType
  apiKey?: string
  model?: string
  persona?: PersonaData
  context?: ContextData
  userInstructions?: string // User's chat message for how to create the post from source
}

export interface GenerateContentDiagramParams {
  content: string
  diagramType: string
  provider: AIProviderType
  apiKey?: string
  model?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════

function buildPersonaStyleContext(persona: PersonaData): string {
  let styleContext = ""
  
  if (!persona.sentiment) return styleContext

  const sentiment = persona.sentiment
  styleContext += `\n\n📊 PERSONA EMOTIONAL PROFILE:
• Dominant tone: ${sentiment.dominant} 
• Sentiment balance: ${sentiment.positive}% positive, ${sentiment.negative}% negative, ${sentiment.neutral}% neutral
• Match this emotional resonance in your writing\n`

  if (sentiment.styleCharacteristics) {
    const style = sentiment.styleCharacteristics
    styleContext += `\n🎨 WRITING STYLE DNA:
• Sentence rhythm: ~${style.avgSentenceLength} words per sentence
• Formality: ${style.formalityLevel}
• Emoji usage: ${style.usesEmojis ? '✓ Uses emojis naturally' : '✗ No emojis'}
• Hashtag style: ${style.usesHashtags ? '✓ Incorporates hashtags' : '✗ No hashtags'}
• Punctuation flair: ${style.punctuationStyle?.join(', ') || 'standard'}\n`

    if (style.writingPatterns) {
      const patterns = style.writingPatterns
      styleContext += `\n✍️ LINGUISTIC FINGERPRINT:
${patterns.contractionsUsed?.length > 0 ? `• Contractions: ${patterns.contractionsUsed.slice(0, 5).join(', ')}` : ''}
${patterns.uniquePhrases?.length > 0 ? `• Signature phrases: "${patterns.uniquePhrases.slice(0, 3).join('", "')}"` : ''}
${patterns.sentenceStarters?.length > 0 ? `• Opens with: "${patterns.sentenceStarters.slice(0, 3).join('", "')}"` : ''}
${patterns.transitionWords?.length > 0 ? `• Transitions: ${patterns.transitionWords.slice(0, 5).join(', ')}` : ''}
• Vocabulary complexity: ${patterns.vocabularyLevel}
${patterns.personalPronouns?.length > 0 ? `• Voice pronouns: ${patterns.personalPronouns.join(', ')}` : ''}\n`
    }

    if (style.formattingPatterns) {
      const fmt = style.formattingPatterns
      styleContext += `\n📝 VISUAL FORMATTING:
${fmt.bulletStyles?.length > 0 ? `• Bullet style: ${fmt.bulletStyles.join(' ')}` : ''}
${fmt.emphasisPatterns?.length > 0 ? `• Emphasis: ${fmt.emphasisPatterns.join(', ')}` : ''}
${fmt.specialCharacters?.length > 0 ? `• Special chars: ${fmt.specialCharacters.slice(0, 10).join(' ')}` : ''}
• Bold Unicode: ${fmt.usesBoldUnicode ? '✓ Yes (use 𝗕𝗼𝗹𝗱 text)' : '✗ No'}
• Markdown: ${fmt.usesMarkdownSyntax ? '✓ Yes' : '✗ No'}
${fmt.structuralMarkers?.length > 0 ? `• Section breaks: ${fmt.structuralMarkers.join(', ')}` : ''}\n`
    }
  }

  return styleContext
}

function buildContextSection(contextData: ContextData): string {
  return `
🏢 BRAND/COMPANY CONTEXT:
Name: ${contextData.name}
Category: ${contextData.category}
${contextData.description ? `Description: ${contextData.description}` : ''}

📋 Background Information:
${contextData.data.rawContent.slice(0, 2000)}${contextData.data.rawContent.length > 2000 ? '...' : ''}

${contextData.analysis?.contentSummary ? `💡 Summary: ${contextData.analysis.contentSummary}` : ''}
${contextData.analysis?.keyTopics?.length ? `🏷️ Key Topics: ${contextData.analysis.keyTopics.join(', ')}` : ''}
${contextData.analysis?.keyInsights?.length ? `
🔍 Key Insights:
${contextData.analysis.keyInsights.slice(0, 4).map(i => `• ${i}`).join('\n')}` : ''}

⚠️ CONTEXT RULES:
• Reference specific products/services from this context when relevant
• Keep claims consistent with provided information
• Do NOT invent information not in the context
• Make content feel authentic to this brand`
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Post Generation Function
// ═══════════════════════════════════════════════════════════════════════════════

export async function generatePost({
  platform,
  style,
  keywords,
  content,
  contentType,
  postLength = "medium",
  customWordCount,
  provider,
  apiKey,
  model,
  persona,
  context: contextData,
  userInstructions,
}: GeneratePostParams) {
  try {
    // Get AI model from centralized config
    const aiModel = getAIModel({ 
      provider, 
      apiKey, 
      model, 
      useCase: "creative" 
    })

    // Get platform and length guidelines
    const platformKey = platform.toLowerCase() as Platform
    const platformInfo = PLATFORM_GUIDELINES[platformKey] || PLATFORM_GUIDELINES.linkedin
    const lengthInfo = getLengthGuideline(postLength, customWordCount)

    // Build persona context if available
    const personaStyleContext = persona ? buildPersonaStyleContext(persona) : ""
    const personaInstructions = persona?.instructions || ""

    // ─────────────────────────────────────────────────────────────────────────
    // Build the Enhanced Prompt
    // ─────────────────────────────────────────────────────────────────────────

    let prompt = `You are a world-class social media content creator who crafts viral, engaging posts that resonate deeply with audiences. You never sound like AI - your writing feels authentic, personal, and compelling.

═══════════════════════════════════════════════════════════════
📍 PLATFORM: ${platformInfo.name}
═══════════════════════════════════════════════════════════════

📋 PLATFORM REQUIREMENTS:
• Character limit: ${platformInfo.maxLength}
• Tone: ${platformInfo.tone}
• Format: ${platformInfo.formatting}

🎯 BEST PRACTICES FOR ${platformInfo.name.toUpperCase()}:
${platformInfo.bestPractices.map(bp => `• ${bp}`).join('\n')}

═══════════════════════════════════════════════════════════════
📝 CONTENT LENGTH
═══════════════════════════════════════════════════════════════

Target: ${lengthInfo.wordCount}
Style: ${lengthInfo.description}
Focus: ${lengthInfo.emphasis}
${postLength === 'custom' && customWordCount ? `⚠️ STRICT: Aim for exactly ${customWordCount} words` : ''}

═══════════════════════════════════════════════════════════════
🎯 YOUR TASK
═══════════════════════════════════════════════════════════════

${userInstructions ? `
📣 USER'S SPECIFIC INSTRUCTIONS:
"${userInstructions}"

^^^ IMPORTANT: Use the above instructions to guide HOW you transform the source content into a post. The user is telling you what angle, focus, or style they want.
` : ''}

SOURCE CONTENT TO TRANSFORM:
"""
${content}
"""

${keywords ? `🔑 KEYWORDS TO NATURALLY INCORPORATE: ${keywords}` : ''}
${contentType ? `📄 CONTENT TYPE: ${contentType.replace('-', ' ')} - structure accordingly` : ''}
${!persona ? `✨ WRITING STYLE: ${style}` : ''}`

    // Add persona section if available
    if (persona) {
      prompt += `

═══════════════════════════════════════════════════════════════
👤 PERSONA MODE: ${persona.name}
═══════════════════════════════════════════════════════════════

${personaInstructions ? `📋 Persona Instructions: ${personaInstructions}` : ''}
${personaStyleContext}

📚 WRITING STYLE REFERENCE (analyze the style, DON'T copy content):
"""
${persona.rawContent.slice(0, 3000)}${persona.rawContent.length > 3000 ? '...' : ''}
"""

🎯 PERSONA EXECUTION:
1. Study the reference for: sentence structure, tone, vocabulary, formatting
2. Capture the "voice" - the unique personality that comes through
3. Apply this voice to the NEW topic (source content above)
4. NEVER copy phrases or content from the reference
5. Make it indistinguishable from the persona's authentic writing
6. Match their energy, formatting quirks, and communication style`
    }

    // Add brand context if available
    if (contextData) {
      prompt += `

═══════════════════════════════════════════════════════════════
🏢 BRAND CONTEXT
═══════════════════════════════════════════════════════════════
${buildContextSection(contextData)}`
    }

    // Final formatting instructions
    const isSocialPlatform = ['linkedin', 'facebook', 'instagram', 'threads'].includes(platform.toLowerCase())
    
    prompt += `

═══════════════════════════════════════════════════════════════
📋 OUTPUT FORMAT REQUIREMENTS
═══════════════════════════════════════════════════════════════

${isSocialPlatform ? `
✅ USE Unicode formatting for social media (COPY-PASTE READY):
• Bold text: Use 𝗕𝗼𝗹𝗱 𝗨𝗻𝗶𝗰𝗼𝗱𝗲 characters (NOT markdown ** or HTML)
• Bullets: Use • ✦ → ▸ (NOT markdown - or *)  
• Line breaks: Add blank lines between paragraphs for readability
• Emphasis: Use 𝗯𝗼𝗹𝗱 or 𝘪𝘵𝘢𝘭𝘪𝘤 Unicode when needed
• The output must paste directly into ${platformInfo.name} perfectly
` : `
✅ Use appropriate formatting for ${platformInfo.name}
`}

🚀 QUALITY CHECKLIST - Your post MUST have:
☑ A HOOK in the first line that stops the scroll (question, bold statement, surprising fact)
☑ Value-driven content that educates, inspires, or entertains
☑ Clear visual structure with proper spacing
☑ Authentic voice that sounds human, not robotic
☑ A clear call-to-action or engagement prompt at the end
☑ Platform-appropriate length (${lengthInfo.wordCount})
${keywords ? `☑ Keywords naturally woven in: ${keywords}` : ''}

═══════════════════════════════════════════════════════════════
🚫 COMMON MISTAKES TO AVOID
═══════════════════════════════════════════════════════════════

DO NOT:
• Start with "In today's fast-paced world..." or similar clichés
• Use generic AI phrases like "Let's dive in" or "Here's the thing"
• Write walls of text without line breaks
• Sound corporate, robotic, or overly formal
• Use markdown syntax (**bold**, ## headers) in social posts
• Forget the call-to-action
• Be preachy or lecture the reader
• Use buzzwords without substance

DO:
• Start with something that makes people stop scrolling
• Write like you're talking to a friend (but professionally)
• Use specific examples and real insights
• Show personality and authenticity
• Make every sentence earn its place

═══════════════════════════════════════════════════════════════

Now generate the ${platformInfo.name} post. Output ONLY the final post content, ready to copy and publish:`

    // Generate the post
    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature: persona ? TEMPERATURE_PRESETS.balanced : TEMPERATURE_PRESETS.creative,
    })

    return {
      success: true,
      post: text.trim(),
      provider,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error generating post:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate post. Please try again.",
      provider,
      timestamp: new Date().toISOString(),
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Content Diagram Generation
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateContentDiagram({
  content,
  diagramType,
  provider,
  apiKey,
  model,
}: GenerateContentDiagramParams) {
  try {
    const aiModel = getAIModel({ provider, apiKey, model, useCase: "default" })

    const diagramPrompts: Record<string, string> = {
      flowchart: `You are an expert at creating Mermaid flowchart diagrams.

CONTENT TO VISUALIZE:
"""
${content}
"""

Create a flowchart using this EXACT format:

flowchart TD
    A["Main Topic"] --> B["Branch 1"]
    A --> C["Branch 2"]
    B --> B1["Sub-item 1"]
    B --> B2["Sub-item 2"]

CRITICAL RULES:
1. Start with: flowchart TD
2. Use alphanumeric IDs only (A, B, C, B1, B2)
3. Labels in square brackets with quotes: A["Label"]
4. Connections: A --> B (no quotes around IDs)
5. Create 3-5 main branches with 2-3 sub-items each

Output ONLY the Mermaid code:`,

      mindmap: `You are an expert at creating Mermaid mindmap diagrams.

CONTENT TO VISUALIZE:
"""
${content}
"""

Create a mindmap using this EXACT format:

mindmap
  root((Central Idea))
    Topic 1
      Subtopic 1.1
      Subtopic 1.2
    Topic 2
      Subtopic 2.1

CRITICAL RULES:
1. Start with: mindmap
2. Root uses double parentheses: root((Title))
3. Use 2-space indentation for each level
4. No special characters or quotes in node names
5. Create 3-5 main topics with 2-3 subtopics each

Output ONLY the Mermaid code:`,

      timeline: `You are an expert at creating Mermaid timeline diagrams.

CONTENT TO VISUALIZE:
"""
${content}
"""

Create a timeline using this EXACT format:

timeline
    title Timeline Title
    2024-01 : First Event
    2024-03 : Second Event
    2024-06 : Third Event

CRITICAL RULES:
1. Start with: timeline
2. Add title on the next line
3. Use format: Date : Event description
4. List events chronologically
5. Include 5-8 key milestones

Output ONLY the Mermaid code:`,

      hierarchy: `You are an expert at creating Mermaid hierarchy diagrams.

CONTENT TO VISUALIZE:
"""
${content}
"""

Create a hierarchy diagram using this EXACT format:

graph TD
    A["Top Level"] --> B["Level 2 Item 1"]
    A --> C["Level 2 Item 2"]
    B --> B1["Level 3 Item"]

CRITICAL RULES:
1. Start with: graph TD
2. Use alphanumeric IDs (A, B, C, B1)
3. Labels in square brackets: A["Label"]
4. Show clear parent-child relationships
5. Create logical hierarchy structure

Output ONLY the Mermaid code:`,
    }

    const prompt = diagramPrompts[diagramType] || diagramPrompts.flowchart

    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature: TEMPERATURE_PRESETS.precise,
    })

    // Clean up the response
    let cleaned = text.trim()
      .replace(/```mermaid\n?/gi, "")
      .replace(/```\n?/g, "")
      .replace(/^(Let me know|Hope this helps|I'm here|Here's|Here is).*$/gim, "")
      .trim()

    // Ensure proper diagram start
    const diagramStarts: Record<string, { pattern: RegExp; default: string }> = {
      mindmap: { pattern: /^mindmap/i, default: "mindmap" },
      timeline: { pattern: /^timeline/i, default: "timeline" },
      hierarchy: { pattern: /^graph\s+(TD|TB|BT|RL|LR)/i, default: "graph TD" },
      flowchart: { pattern: /^flowchart\s+(TD|TB|BT|RL|LR)/i, default: "flowchart TD" },
      process: { pattern: /^flowchart\s+(TD|TB|BT|RL|LR)/i, default: "flowchart TD" },
      workflow: { pattern: /^flowchart\s+(TD|TB|BT|RL|LR)/i, default: "flowchart TD" },
    }

    const config = diagramStarts[diagramType] || diagramStarts.flowchart
    if (!config.pattern.test(cleaned)) {
      cleaned = `${config.default}\n${cleaned}`
    }

    return {
      success: true,
      diagram: cleaned,
      provider,
    }
  } catch (error) {
    console.error("Error generating content diagram:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate diagram.",
      provider,
    }
  }
}
