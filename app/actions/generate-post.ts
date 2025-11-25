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
      keyInsights?: string[]
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
      keyInsights?: string[]
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
        aiModel = groqClient.chat("llama-3.1-8b-instant")
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
        aiModel = anthropic(model || "claude-sonnet-4-5-20250929")
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
        maxLength: "800-1100 characters",
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

CRITICAL FORMATTING REQUIREMENT:
⚠️ You MUST use proper formatting throughout your response:
• For ${platform === 'LinkedIn' || platform === 'X' || platform === 'Instagram' || platform === 'Facebook' ? 'SOCIAL MEDIA platforms, use Unicode bold formatting (𝗕𝗼𝗹𝗱) instead of **markdown bold**' : 'Markdown formatting with **bold**'}
• Use Unicode bold characters: 𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭 𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇 for emphasis
• Use special bullet symbols: ✦ → • for lists (not markdown * or -)
• Use proper line breaks between sections for readability
• For headings, use Unicode bold text, not markdown ## syntax
• The output should paste perfectly into ${platform} without any special formatting markers
• Make it ready to copy-paste directly - no conversion needed

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
8. If the source content is unorganized, structure it clearly with Markdown formatting
9. Make sure the post feels authentic to the platform's culture`

    // Add persona training data to the prompt if available
    if (personaTrainingData) {
      prompt += `

╔══════════════════════════════════════════════════════════════╗
║  PERSONA-DRIVEN CONTENT GENERATION (60% Style / 40% Creative) ║
╚══════════════════════════════════════════════════════════════╝

⚙️ GENERATION PARAMETERS:
• Temperature: 0.4 (Balanced creativity with strict style adherence)
• Style Weight: 60% - Match persona writing patterns exactly
• Creative Weight: 40% - Allow natural pattern variations and topic adaptation

${personaInstructions ? `📋 PERSONA INSTRUCTIONS: ${personaInstructions}` : ""}${sentimentContext}${styleGuidance}${patternGuidance}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WRITING STYLE REFERENCE EXAMPLES (FOR PATTERN LEARNING ONLY):

⚠️ CRITICAL: These examples demonstrate STYLE ONLY. Never copy content, topics, or specific phrases from these examples.

${personaTrainingData}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 YOUR CONTENT TOPIC: "${content}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 STYLE ANALYSIS & REPLICATION CHECKLIST (60% PRIORITY):

1. 🔤 SENTENCE STRUCTURE (CRITICAL - 15%):
   - Analyze and match the exact sentence length distribution
   - Replicate short vs long sentence rhythm
   - Copy the flow and cadence of ideas

2. 📝 FORMATTING PATTERNS (CRITICAL - 15%):
   - Mirror heading styles, bullet points, and line breaks
   - Use identical emphasis techniques (bold Unicode, emojis, symbols)
   - Match list structures and visual organization
   - Apply the same indentation and spacing patterns

3. 🗣️ TONE & VOICE (CRITICAL - 15%):
   - Capture the emotional energy and enthusiasm level
   - Match formality/informality balance
   - Replicate personality quirks and characteristic expressions
   - Maintain the same conversational style

4. 🎨 VOCABULARY & LANGUAGE (CRITICAL - 15%):
   - Use similar vocabulary complexity level
   - Apply the same technical vs casual language balance
   - Include characteristic words and phrases
   - Match pronoun usage patterns (I, we, you)
   - Use similar transition words and connectors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 CREATIVE ADAPTATION ALLOWANCE (40% PRIORITY):

1. 💡 CONTENT ADAPTATION (20%):
   - Adapt style to the new topic naturally
   - Find relevant examples and context
   - Connect ideas in ways that fit the new content
   - Adjust emphasis based on topic importance

2. 🔄 PATTERN MATCHING (20%):
   - Recognize content patterns and structure
   - Apply topic-appropriate organization
   - Use domain-specific terminology where needed
   - Balance style consistency with content clarity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ EXECUTION PROTOCOL:

STEP 1 - STYLE DEEP DIVE (60% Focus):
→ Study the reference examples intensely
→ Identify the "signature" writing markers
→ Note the unique characteristics that make this style recognizable
→ Internalize the rhythm, flow, and personality

STEP 2 - CONTENT PLANNING (40% Focus):
→ Understand the new topic: "${content}"
→ Plan how to present this topic
→ Identify key points to emphasize
→ Consider platform requirements: ${platform}

STEP 3 - WRITE WITH STYLE PRIORITY:
→ Start writing in the exact persona voice
→ Apply all formatting patterns observed
→ Maintain the sentence structure rhythm
→ Use the same tone and energy level
→ Let the persona's style guide every word choice

STEP 4 - QUALITY VERIFICATION:
→ Does it SOUND like the persona wrote it?
→ Are formatting patterns identical?
→ Is the tone and energy level matched?
→ Would someone recognize this as the persona's writing?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 ABSOLUTE PROHIBITIONS:

❌ Copying ANY phrases, sentences, or content from reference examples
❌ Mentioning topics from the reference examples
❌ Generic AI writing style (formal, robotic, overly structured)
❌ Ignoring formatting patterns (bold Unicode, bullets, emojis)
❌ Deviating from the established tone and personality
❌ Using disclaimers or meta-commentary
❌ Writing in a different voice or style

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ MANDATORY REQUIREMENTS:

✓ Write ONLY about: "${content}"
✓ Sound indistinguishable from the reference persona
✓ Match ALL formatting patterns (Unicode bold, bullets, emojis, spacing)
✓ Use the EXACT sentence structure and rhythm
✓ Maintain the same energy and enthusiasm level
✓ Apply identical vocabulary and language patterns
✓ Create content that feels 100% authentic to the persona
✓ Make it platform-appropriate for: ${platform}
✓ Use proper Markdown formatting (**bold**, ## headings, - bullets, etc.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 FORMATTING REQUIREMENTS:
• Use Unicode bold characters (𝗔𝗕𝗖 𝗮𝗯𝗰) for ALL emphasis and headings - NOT markdown **bold**
• Use special bullets: ✦ → • instead of markdown * or -
• Add proper line breaks between paragraphs for readability
• Output should paste perfectly into ${platform} without markdown syntax
• If persona uses special Unicode formatting, replicate it exactly
• Remember: The goal is copy-paste ready content for social media

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 FINAL GOAL: 
Create a ${platform} post about "${content}" that is indistinguishable from the persona's authentic writing. A reader familiar with this persona should NOT be able to tell this was AI-generated. It should capture their essence completely.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 BEGIN GENERATION NOW - Channel the persona completely and write the ${platform} post:`
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
${contextData.analysis?.keyInsights?.length ? `
Key Insights:
- ${contextData.analysis.keyInsights.slice(0, 4).join("\n- ")}` : ""}
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

    // Use temperature 0.4 for balanced creativity and persona matching
    // 0.4 allows for pattern recognition while maintaining persona style
    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature: 0.4, // Low temperature for 60% persona style adherence, with 40% creativity for pattern matching
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
        aiModel = groqClient.chat("llama-3.1-8b-instant")
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
        aiModel = anthropic(model || "claude-sonnet-4-5-20250929")
        break
      default:
        throw new Error("Unsupported provider")
    }

    // Rest of the function remains the same with the updated model...
    let prompt = ""
    
    // Generate appropriate prompt based on diagram type
    switch (diagramType) {
      case "flowchart":
      case "process":
      case "workflow":
        prompt = `
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
        break

      case "mindmap":
        prompt = `
You are an expert at creating Mermaid diagrams. Create a mindmap diagram based on the content provided.

Content: "${content}"

CRITICAL FORMATTING RULES FOR MINDMAP:

1. ALWAYS start with: mindmap
2. Start with root concept, then indent with 2 spaces for each level
3. Use simple text, no special characters or quotes for node names
4. Use indentation to show hierarchy

CORRECT FORMAT EXAMPLE:
mindmap
  root((Central Idea))
    Topic 1
      Subtopic 1.1
      Subtopic 1.2
    Topic 2
      Subtopic 2.1
      Subtopic 2.2
    Topic 3
      Subtopic 3.1

STRUCTURE GUIDELINES:
1. Start with central concept in double parentheses: root((Central Idea))
2. Create 3-5 main branches with 2 space indentation
3. Add 2-3 sub-items per branch with 4 space indentation
4. Keep labels concise and clear
5. Use meaningful, related concepts

Generate ONLY the Mermaid mindmap code following the exact format above:
`
        break

      case "timeline":
        prompt = `
You are an expert at creating Mermaid diagrams. Create a timeline diagram based on the content provided.

Content: "${content}"

CRITICAL FORMATTING RULES FOR TIMELINE:

1. ALWAYS start with: timeline
2. Add a title on the next line
3. List events chronologically with simple format: Year/Date : Event description

CORRECT FORMAT EXAMPLE:
timeline
    title Project Timeline
    2023-01 : Project Kickoff
    2023-03 : Requirements Complete
    2023-06 : Development Phase
    2023-09 : Testing Phase
    2023-12 : Launch

STRUCTURE GUIDELINES:
1. Add a meaningful title line
2. Use chronological order
3. Use year, year-month, or specific dates
4. Keep event descriptions concise
5. Include 5-10 key milestones

Generate ONLY the Mermaid timeline code following the exact format above:
`
        break

      case "hierarchy":
        prompt = `
You are an expert at creating Mermaid diagrams. Create a hierarchy/organization diagram based on the content provided.

Content: "${content}"

CRITICAL FORMATTING RULES FOR HIERARCHY:

1. ALWAYS start with: graph TD
2. Use alphanumeric identifiers (A, B, C, etc.)
3. Use square brackets for labels: A["Label"]
4. Use --> for connections showing hierarchy
5. Arrange from top to bottom

CORRECT FORMAT EXAMPLE:
graph TD
    A["CEO"] --> B["VP Engineering"]
    A --> C["VP Sales"]
    A --> D["VP Operations"]
    B --> B1["Engineering Manager"]
    B --> B2["QA Manager"]
    C --> C1["Sales Manager"]

STRUCTURE GUIDELINES:
1. Start with the top-level entity
2. Create logical hierarchical branches
3. Use consistent indentation and structure
4. Keep labels clear and concise
5. Show reporting structure clearly

Generate ONLY the Mermaid hierarchy diagram code following the exact format above:
`
        break

      default:
        // Default to flowchart for unknown types
        prompt = `
You are an expert at creating Mermaid diagrams. Create a flowchart diagram based on the content provided.

Content: "${content}"

CRITICAL FORMATTING RULES - FOLLOW EXACTLY:

1. ALWAYS start with: flowchart TD
2. Use ONLY alphanumeric identifiers (A, B, C, D1, D2, etc.) - NEVER use quotes around identifiers
3. Use square brackets with quotes for labels: A["Label Text"]
4. Connect using identifiers only: A --> B (NOT "A" --> "B")

Generate ONLY the Mermaid diagram code following the exact format above:
`
    }

    const { text } = await generateText({ model: aiModel, prompt })

    // Clean up the response
    let cleaned = text.trim()
    cleaned = cleaned.replace(/```mermaid\n?/gi, "").replace(/```/g, "")

    const lines = cleaned.split("\n")
    
    // Determine the pattern to look for based on diagram type
    let diagramStartPattern: RegExp
    let defaultStart: string
    
    switch (diagramType) {
      case "mindmap":
        diagramStartPattern = /^mindmap/i
        defaultStart = "mindmap"
        break
      case "timeline":
        diagramStartPattern = /^timeline/i
        defaultStart = "timeline"
        break
      case "hierarchy":
        diagramStartPattern = /^graph\s+(TD|TB|BT|RL|LR)/i
        defaultStart = "graph TD"
        break
      default:
        diagramStartPattern = /^flowchart\s+(TD|TB|BT|RL|LR)/i
        defaultStart = "flowchart TD"
    }
    
    const diagramStartIndex = lines.findIndex((line) => diagramStartPattern.test(line.trim()))

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

    // Add default start if not present
    if (!diagramStartPattern.test(cleaned)) {
      cleaned = `${defaultStart}\n${cleaned}`
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
