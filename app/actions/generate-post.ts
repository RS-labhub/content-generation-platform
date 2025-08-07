"use server";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic"

// Initialize GROQ (OpenAI-compatible) and Gemini clients
const groqClient = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const geminiClient = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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
  provider: "groq" | "gemini" | "openai" | "anthropic"
  apiKey?: string
  model?: string
}

// Update the GenerateContentDiagramParams interface
export interface GenerateContentDiagramParams {
  content: string
  diagramType: string
  provider: "groq" | "gemini" | "openai" | "anthropic"
  apiKey?: string
  model?: string
}

// Update the generatePost function to handle new providers
export async function generatePost({ platform, style, keywords, content, provider, apiKey, model }: GeneratePostParams) {
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

    // Rest of the function remains the same...
    const platformGuidelines = {
      linkedin: {
        description:
          "Professional network format, use line breaks, include relevant hashtags, encourage engagement",
        maxLength: "1300 characters",
        tone: "professional and engaging",
      },
      x: {
        description: "Concise Twitter format, punchy and engaging",
        maxLength: "280 characters maximum",
        tone: "concise and impactful",
      },
      reddit: {
        description:
          "Conversational Reddit format, detailed but engaging, use appropriate subreddit tone",
        maxLength: "moderate length, detailed explanation",
        tone: "conversational and informative",
      },
      instagram: {
        description:
          "Visual-focused format with engaging captions, use relevant hashtags",
        maxLength: "2200 characters maximum",
        tone: "engaging and visual",
      },
      facebook: {
        description:
          "Community-focused format, encourage discussion and sharing",
        maxLength: "500-600 characters for optimal engagement",
        tone: "friendly and community-oriented",
      },
      tiktok: {
        description:
          "Short, catchy format for video descriptions, trending hashtags",
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
    };

    const platformInfo =
      platformGuidelines[platform as keyof typeof platformGuidelines] ||
      platformGuidelines.linkedin;

    const prompt = `
You are an expert social media content creator. Generate a ${platform} post based on the following:

Platform: ${platform}
Custom Style: ${style}
Keywords to emphasize: ${keywords}

Platform Guidelines: ${platformInfo.description}
Length Requirement: ${platformInfo.maxLength}
Platform Tone: ${platformInfo.tone}

Source Content:
${content}

Instructions:
1. Transform the source content into a ${platform}-optimized post
2. Follow the custom style approach: "${style}"
3. Emphasize and naturally incorporate these keywords: "${keywords}"
4. Respect the platform's ${platformInfo.maxLength} requirement
5. Use a ${platformInfo.tone} tone
6. Include relevant hashtags where appropriate for the platform
7. Ensure it's engaging and platform-appropriate
8. If the source content is unorganized, structure it clearly
9. Make sure the post feels authentic to the platform's culture

Generate only the final post content, ready to publish:
`

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
    cleaned = cleaned.replace(/\`\`\`mermaid\n?/gi, "").replace(/\`\`\`/g, "")

    const lines = cleaned.split("\n")
    const diagramStartIndex = lines.findIndex((line) =>
      /^flowchart\s+(TD|TB|BT|RL|LR)/i.test(line.trim())
    )

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
