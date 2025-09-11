"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createAnthropic } from "@ai-sdk/anthropic"

// Initialize GROQ (OpenAI-compatible) and Gemini clients
const groqClient = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

const geminiClient = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// Add after the existing client initializations
const openaiClient = createOpenAI({
  apiKey: "", // Will be set dynamically
})

const anthropicClient = createAnthropic({
  apiKey: "", // Will be set dynamically
})

// Update the GeneratePostParams interface
export interface GeneratePostParams {
  platform: string
  style: string
  keywords: string
  content: string
  contentType?: string
  provider: "groq" | "gemini" | "openai" | "anthropic"
  apiKey?: string
  model?: string
  persona?: {
    name: string
    rawContent: string
    instructions?: string
    sentiment?: {
      positive: number
      negative: number
      neutral: number
      dominant: string
      keywords?: string[]
      styleCharacteristics?: {
        avgSentenceLength: number
        usesEmojis: boolean
        usesHashtags: boolean
        formalityLevel: 'formal' | 'casual' | 'mixed'
        punctuationStyle: string[]
        writingPatterns?: {
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
        formattingPatterns?: {
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
      }
    }
  } // Updated to accept persona data object
  context?: {
    name: string
    description?: string
    category: string
    data: {
      structured: Record<string, any>
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
    }
  } // Brand/company context data
}

// Update the GenerateContentDiagramParams interface
export interface GenerateContentDiagramParams {
  content: string
  diagramType: string
  provider: "groq" | "gemini" | "openai" | "anthropic"
  apiKey?: string
  model?: string
}

// Define the interface for LinkedIn Carousel generation
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
  provider: "groq" | "gemini" | "openai" | "anthropic"
  apiKey?: string
  model?: string
  persona?: {
    name: string
    rawContent: string
    instructions?: string
    sentiment?: {
      positive: number
      negative: number
      neutral: number
      dominant: string
      keywords?: string[]
      styleCharacteristics?: any
    }
  }
  context?: {
    name: string
    description?: string
    category: string
    data: {
      structured: Record<string, any>
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
    }
  }
}

// Update the generatePost function to handle new providers and use persona data
export async function generatePost({
  platform,
  style,
  keywords,
  content,
  contentType,
  provider,
  apiKey,
  model,
  persona,
  context: contextData,
}: GeneratePostParams) {
  try {
    let aiModel

    switch (provider) {
      case "groq":
        aiModel = groqClient.chat("llama-3.3-70b-versatile")
        break
      case "gemini":
        aiModel = geminiClient("models/gemini-2.0-flash")
        break
      case "openai":
        if (!apiKey) throw new Error("OpenAI API key is required")
        const openai = createOpenAI({ apiKey })
        aiModel = openai(model || "gpt-4")
        break
      case "anthropic":
        if (!apiKey) throw new Error("Anthropic API key is required")
        const anthropic = createAnthropic({ apiKey })
        aiModel = anthropic(model || "claude-3-5-sonnet-20241022")
        break
      default:
        throw new Error("Unsupported provider")
    }

    // Get persona training data if persona is specified
    let personaTrainingData = ""
    let personaInstructions = ""
    let sentimentContext = ""
    let styleGuidance = ""
    let patternGuidance = ""
    if (persona) {
      personaTrainingData = persona.rawContent
      personaInstructions = persona.instructions || ""
      if (persona.sentiment) {
        sentimentContext = `\n\nSentiment Profile: This persona tends to be ${persona.sentiment.dominant} (${persona.sentiment.positive}% positive, ${persona.sentiment.negative}% negative, ${persona.sentiment.neutral}% neutral). Match this emotional tone in your writing.`
        
        if (persona.sentiment.styleCharacteristics) {
          const style = persona.sentiment.styleCharacteristics
          styleGuidance = `\n\nStyle Characteristics to Match:
- Average sentence length: ${style.avgSentenceLength} words
- Formality level: ${style.formalityLevel}
- Uses emojis: ${style.usesEmojis ? 'Yes' : 'No'}
- Uses hashtags: ${style.usesHashtags ? 'Yes' : 'No'}
- Punctuation patterns: ${style.punctuationStyle.join(', ') || 'standard'}
`

          if (style.writingPatterns) {
            const patterns = style.writingPatterns
            patternGuidance = `\n\nEXACT WRITING PATTERNS TO REPLICATE:
${patterns.contractionsUsed.length > 0 ? `- Use these contractions: ${patterns.contractionsUsed.join(', ')}` : ''}
${patterns.uniquePhrases.length > 0 ? `- Incorporate similar phrases to: "${patterns.uniquePhrases.join('", "')}"` : ''}
${patterns.sentenceStarters.length > 0 ? `- Start sentences like: "${patterns.sentenceStarters.join('", "')}"` : ''}
${patterns.sentenceEnders.length > 0 ? `- End sentences like: "${patterns.sentenceEnders.join('", "')}"` : ''}
- Vocabulary level: ${patterns.vocabularyLevel}
${patterns.personalPronouns.length > 0 ? `- Use pronouns: ${patterns.personalPronouns.join(', ')}` : ''}
${patterns.transitionWords.length > 0 ? `- Use transitions: ${patterns.transitionWords.join(', ')}` : ''}
${patterns.questionPatterns.length > 0 ? `- Ask questions like: "${patterns.questionPatterns.join('", "')}"` : ''}
${patterns.exclamationPatterns.length > 0 ? `- Use exclamations like: "${patterns.exclamationPatterns.join('", "')}"` : ''}
`
          }

          if (style.formattingPatterns) {
            const formatting = style.formattingPatterns
            const formattingGuidance = `\n\nFORMATTING PATTERNS TO REPLICATE:
${formatting.bulletStyles.length > 0 ? `- Use these bullet styles: ${formatting.bulletStyles.join(', ')}` : ''}
${formatting.headerStyles.length > 0 ? `- Header styles: ${formatting.headerStyles.join(', ')}` : ''}
${formatting.emphasisPatterns.length > 0 ? `- Emphasis patterns: ${formatting.emphasisPatterns.join(', ')}` : ''}
${formatting.listStructures.length > 0 ? `- List structures: ${formatting.listStructures.join(', ')}` : ''}
${formatting.specialCharacters.length > 0 ? `- Special characters/emojis: ${formatting.specialCharacters.slice(0, 15).join(' ')}` : ''}
${formatting.linkPatterns.length > 0 ? `- Link formatting: ${formatting.linkPatterns.join(', ')}` : ''}
${formatting.calloutPatterns.length > 0 ? `- Callout patterns: ${formatting.calloutPatterns.join(', ')}` : ''}
${formatting.structuralMarkers.length > 0 ? `- Section separators: ${formatting.structuralMarkers.join(', ')}` : ''}
- Indentation style: ${formatting.indentationStyle}
- Uses bold Unicode formatting: ${formatting.usesBoldUnicode ? 'Yes' : 'No'}
- Uses Markdown syntax: ${formatting.usesMarkdownSyntax ? 'Yes' : 'No'}
- Uses HTML elements: ${formatting.usesHTMLElements ? 'Yes' : 'No'}

CRITICAL FORMATTING REQUIREMENTS:
${formatting.usesBoldUnicode ? '✅ Use Unicode bold formatting (𝗕𝗼𝗹𝗱 text) for headers and emphasis' : ''}
${formatting.bulletStyles.includes('•') ? '✅ Use bullet points with • symbol' : ''}
${formatting.bulletStyles.includes('✦') ? '✅ Use special bullet points with ✦ symbol' : ''}
${formatting.bulletStyles.includes('→') ? '✅ Use arrow bullets with → symbol' : ''}
${formatting.emphasisPatterns.includes('double-asterisk') ? '✅ Use **bold text** for emphasis' : ''}
${formatting.listStructures.includes('bullet-lists') ? '✅ Structure content with bullet point lists' : ''}
${formatting.listStructures.includes('numbered-lists') ? '✅ Use numbered lists where appropriate' : ''}
${formatting.specialCharacters.length > 0 ? '✅ Include relevant emojis and symbols naturally' : ''}
${formatting.structuralMarkers.includes('triple-dash') ? '✅ Use --- for section breaks' : ''}
`
            patternGuidance += formattingGuidance
          }
        }
      }
    }

    const platformGuidelines = {
      linkedin: {
        description: "Professional network format, use line breaks, include relevant hashtags, encourage engagement",
        maxLength: "1300 characters",
        tone: "professional and engaging",
      },
      x: {
        description: "Concise Twitter format, punchy and engaging",
        maxLength: "280 characters maximum",
        tone: "concise and impactful",
      },
      reddit: {
        description: "Conversational Reddit format, detailed but engaging, use appropriate subreddit tone",
        maxLength: "moderate length, detailed explanation",
        tone: "conversational and informative",
      },
      instagram: {
        description: "Visual-focused format with engaging captions, use relevant hashtags",
        maxLength: "2200 characters maximum",
        tone: "engaging and visual",
      },
      facebook: {
        description: "Community-focused format, encourage discussion and sharing",
        maxLength: "500-600 characters for optimal engagement",
        tone: "friendly and community-oriented",
      },
      tiktok: {
        description: "Short, catchy format for video descriptions, trending hashtags",
        maxLength: "150 characters maximum",
        tone: "trendy and energetic",
      },
      youtube: {
        description: "Detailed video descriptions with timestamps and links",
        maxLength: "comprehensive description up to 1000 characters",
        tone: "informative and engaging",
      },
      medium: {
        description: "Article-style format with proper structure and depth",
        maxLength: "comprehensive article format",
        tone: "thoughtful and in-depth",
      },
      discord: {
        description: "Community chat format, casual and interactive",
        maxLength: "2000 characters maximum",
        tone: "casual and community-focused",
      },
      threads: {
        description: "Thread-style format, conversational and engaging",
        maxLength: "500 characters per post",
        tone: "conversational and authentic",
      },
    }

    const platformInfo = platformGuidelines[platform as keyof typeof platformGuidelines] || platformGuidelines.linkedin

    // Build the prompt with persona training data if available
    let prompt = `
You are an expert social media content creator. Generate a ${platform} post based on the following:

Platform: ${platform}
${!personaTrainingData ? `Custom Style: ${style}` : ""}
Keywords to emphasize: ${keywords}
${contentType ? `Content Type: ${contentType}` : ""}

Platform Guidelines: ${platformInfo.description}
Length Requirement: ${platformInfo.maxLength}
Platform Tone: ${platformInfo.tone}

Source Content:
${content}

Instructions:
1. Transform the source content into a ${platform}-optimized post
${!personaTrainingData ? `2. Follow the custom style approach: "${style}"` : ""}
${personaTrainingData ? "2. Follow the persona style and instructions provided below" : ""}
3. Emphasize and naturally incorporate these keywords: "${keywords}"
${contentType ? `4. Structure the content as a ${contentType.replace('-', ' ')} - use appropriate format and tone for this content type` : ""}
4. Respect the platform's ${platformInfo.maxLength} requirement
5. Use a ${platformInfo.tone} tone
6. Include relevant hashtags where appropriate for the platform
7. Ensure it's engaging and platform-appropriate
8. If the source content is unorganized, structure it clearly
9. Make sure the post feels authentic to the platform's culture`

    // Add persona training data to the prompt if available
    if (personaTrainingData) {
      prompt += `

PERSONA STYLE ANALYSIS & APPLICATION:
${personaInstructions ? `Custom Instructions: ${personaInstructions}` : ""}${sentimentContext}${styleGuidance}${patternGuidance}

CRITICAL: The following examples are for STYLE LEARNING ONLY. Do NOT copy, quote, or reuse any content from these examples. Instead, analyze and adopt their writing characteristics:

WRITING STYLE EXAMPLES:
${personaTrainingData}

STYLE ANALYSIS TASKS:
1. Analyze the sentence structure patterns (short vs long sentences, punctuation style)
2. Identify vocabulary choices (formal/casual, technical/simple, unique expressions)
3. Note the tone and personality (enthusiastic, professional, conversational, humorous)
4. Observe formatting patterns (use of emojis, line breaks, capitalization)
5. Study how ideas are presented and organized
6. Notice the level of detail and explanation style

CONTENT CREATION REQUIREMENTS:
Write about: "${content}"

STEP-BY-STEP APPROACH:
1. Read the source content: "${content}"
2. Study the writing patterns provided above
3. Write COMPLETELY NEW content about the source material
4. Apply the exact writing patterns while discussing the new topic

MANDATORY STYLE MATCHING:
- Use the EXACT sentence length patterns shown
- Copy the formality level and vocabulary complexity
- Replicate the punctuation style precisely
- Use similar contractions and phrase structures
- Match the pronoun usage patterns
- Apply the same transition word style
- Mirror the question and exclamation patterns
- Maintain the same emotional tone

FORBIDDEN ACTIONS:
❌ Copying ANY content from the training examples
❌ Mentioning topics from the training examples
❌ Using phrases like "as I mentioned" or "like I said"
❌ Writing in a generic AI style
❌ Ignoring the specific patterns provided

REQUIRED ACTIONS:
✅ Write about "${content}" ONLY
✅ Sound exactly like the person who wrote the training examples
✅ Use their exact writing rhythm and style
✅ Apply their vocabulary choices and sentence structures
✅ Match their personality perfectly
✅ Create content that feels authentically human and personal

QUALITY CHECK:
The final post should read as if the same person who wrote the training examples sat down and wrote about "${content}" in their natural style. It should NOT sound like AI trying to copy a style - it should BE that style applied to new content.

Generate the ${platform} post now:`
    }

    // Add context data to the prompt if available
    if (contextData) {
      prompt += `

BRAND/COMPANY CONTEXT INFORMATION:
Context Name: ${contextData.name}
Context Category: ${contextData.category}${contextData.description ? `
Context Description: ${contextData.description}` : ""}

BACKGROUND INFORMATION:
${contextData.data.rawContent}
${contextData.analysis?.contentSummary ? `
Key Summary: ${contextData.analysis.contentSummary}` : ""}
${contextData.analysis?.keyTopics ? `
Key Topics: ${contextData.analysis.keyTopics.join(", ")}` : ""}
${contextData.analysis?.entities ? `
Key Entities: ${contextData.analysis.entities.join(", ")}` : ""}

CONTEXT APPLICATION REQUIREMENTS:
1. Use the above brand/company information to create relevant, targeted content
2. Ensure all claims and information are consistent with the provided context
3. Reference specific products, services, values, or information from the context when relevant
4. Make the content feel authentic to this brand/company
5. Do NOT invent or assume information not provided in the context
6. Use the context to add specificity and authenticity to your content
7. Align the content with the brand's category (${contextData.category}) and focus

CONTENT ALIGNMENT:
Write content that reflects this ${contextData.category} context while discussing: "${content}"
Make sure the post feels like it comes from someone who knows this company/brand intimately.`
    }

    prompt += `

Generate only the final post content, ready to publish:`

    const { text } = await generateText({
      model: aiModel,
      prompt,
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

// Update the generateContentDiagram function similarly
export async function generateContentDiagram({
  content,
  diagramType,
  provider,
  apiKey,
  model,
}: GenerateContentDiagramParams) {
  try {
    let aiModel

    switch (provider) {
      case "groq":
        aiModel = groqClient.chat("llama3-70b-8192")
        break
      case "gemini":
        aiModel = geminiClient("models/gemini-1.5-pro-latest")
        break
      case "openai":
        if (!apiKey) throw new Error("OpenAI API key is required")
        const openai = createOpenAI({ apiKey })
        aiModel = openai(model || "gpt-4")
        break
      case "anthropic":
        if (!apiKey) throw new Error("Anthropic API key is required")
        const anthropic = createAnthropic({ apiKey })
        aiModel = anthropic(model || "claude-3-5-sonnet-20241022")
        break
      default:
        throw new Error("Unsupported provider")
    }

    // Rest of the function remains the same with the updated model...
    const prompt = `
You are an expert at creating Mermaid diagrams. Create a ${diagramType} diagram based on the content provided.

Content: "${content}"

CRITICAL FORMATTING RULES - FOLLOW EXACTLY:

1. ALWAYS start with: flowchart TD
2. Use ONLY alphanumeric identifiers (A, B, C, D1, D2, etc.) - NEVER use quotes around identifiers
3. Use square brackets with quotes for labels: A["Label Text"]
4. Connect using identifiers only: A --> B (NOT "A" --> "B")

CORRECT FORMAT EXAMPLE:
flowchart TD
    A["Main Topic"] --> B["Branch 1"]
    A --> C["Branch 2"]
    B --> B1["Sub-item 1"]
    B --> B2["Sub-item 2"]
    C --> C1["Sub-item 1"]
    C --> C2["Sub-item 2"]

WRONG FORMATS TO AVOID:
- "A" --> "B" (quoted identifiers)
- A["Label"] --> "B["Label2"] (mixed format)
- A[""Label""] (double quotes in labels)

STRUCTURE GUIDELINES:
1. Start with main concept as A
2. Create 3-5 primary branches (B, C, D, E)
3. Add sub-items using numbered identifiers (B1, B2, C1, C2)
4. Keep labels concise but descriptive
5. Ensure logical flow and relationships

Generate ONLY the Mermaid diagram code following the exact format above:
`

    const { text } = await generateText({ model: aiModel, prompt })

    // Clean up the response (same as before)
    let cleaned = text.trim()
    cleaned = cleaned.replace(/```mermaid\n?/gi, "").replace(/```/g, "")

    const lines = cleaned.split("\n")
    const diagramStartIndex = lines.findIndex((line) => /^flowchart\s+(TD|TB|BT|RL|LR)/i.test(line.trim()))

    if (diagramStartIndex !== -1) {
      const diagramLines = []
      for (let i = diagramStartIndex; i < lines.length; i++) {
        const line = lines[i].trim()
        if (/^(Let me know|If you need|I'm here|Hope that helps|Feel free)/i.test(line)) break
        if (line === "") continue
        diagramLines.push(line)
      }
      cleaned = diagramLines.join("\n")
    }

    cleaned = cleaned.replace(/^(Let me know|Hope this helps|I'm here.*)/gim, "").trim()

    if (!/^flowchart\s+(TD|TB|BT|RL|LR)/i.test(cleaned)) {
      cleaned = `flowchart TD\n${cleaned}`
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
