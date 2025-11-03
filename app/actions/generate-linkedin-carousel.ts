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

// Add the LinkedIn carousel generation function
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
  provider,
  apiKey,
  model,
  persona,
  context: contextData,
}: GenerateLinkedInCarouselParams) {
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
        }
      }
    }

    // Set up a prompt for generating a LinkedIn carousel
    let prompt = `You are a professional LinkedIn content creator specializing in creating high-quality carousel posts that drive engagement. 

SOURCE CONTENT: 
"""
${content}
"""

TASK:
Create a ${slideCount}-slide LinkedIn carousel based on the source content. Follow these requirements:

1. Create exactly ${slideCount} individual slides${includeIntro ? ", including an attention-grabbing intro slide" : ""}${includeOutro ? " and a strong CTA outro slide" : ""}
2. Theme: ${carouselTheme}
3. Format: ${slideFormat}
4. Slides should be succinct and visually imaginable
5. Each slide should have a clear headline and supporting content
6. Naturally incorporate these keywords: ${keywords}
7. Maintain a cohesive narrative flow throughout the carousel
8. Use a ${style} style approach
9. Include relevant hashtags in the outro slide
10. Make the content SEO-friendly and optimized for LinkedIn's algorithm
11. Ensure each slide stands alone but also flows into the next
`

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
- Apply the exact writing patterns while creating carousel slides
- Maintain the same emotional tone
- Use similar sentence structures and vocabulary complexity
- Match the formality level shown in examples
`
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
1. Use the above brand/company information to create relevant, targeted carousel slides
2. Ensure all claims and information are consistent with the provided context
3. Reference specific products, services, values, or information from the context when relevant
4. Make the content feel authentic to this brand/company
5. Do NOT invent or assume information not provided in the context
6. Align the content with the brand's category (${contextData.category}) and focus
`
    }

    prompt += `

IMPORTANT OUTPUT FORMAT INSTRUCTIONS:
Return ONLY the final carousel slides as a JSON array of strings, with each array element containing the complete text for one slide.
Do not include any explanations, introductions, or additional text.
Do not include slide numbers, "Slide X" prefixes, or any other metadata in the slide content.
The output must be valid JSON that can be parsed directly.

Example output format:
["This is the content for slide 1", "This is the content for slide 2", "This is the content for slide 3"]

Generate the LinkedIn carousel slides now as a plain JSON array with no additional formatting or code blocks:`

    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature: 0.4, // Low temperature for 60% persona style adherence, with 40% creativity for pattern matching
    })
    
    // Clean up function for individual slides
    const cleanupSlide = (slide: string): string => {
      return slide.trim()
        .replace(/^```(?:json)?\s*/g, '')              // Remove opening code blocks
        .replace(/\s*```$/g, '')                       // Remove closing code blocks
        .replace(/^\s*\/\*\s*---\s*Slide\s*\d+\s*---\s*\*\/\s*/gi, '') // Remove slide headers
        .replace(/^Slide\s*\d+\s*[:.]\s*/gi, '')       // Remove "Slide X:" format
        .replace(/^\d+\s*[:.]\s*/g, '')                // Remove "1." format
        .replace(/^\*\*Slide\s*\d+\*\*:?\s*/gi, '')    // Remove "**Slide X**:" format
        .replace(/^\[Slide\s*\d+\]\s*/gi, '')          // Remove "[Slide X]" format
        .trim();
    };

    // Process the response to extract slides
    let carouselSlides: string[] = []
    try {
      // Attempt to find and parse JSON within the response
      const jsonMatch = text.match(/\[\s*"[\s\S]*"\s*\]/);
      if (jsonMatch) {
        // Try to parse the found JSON
        try {
          const jsonResponse = JSON.parse(jsonMatch[0]);
          if (Array.isArray(jsonResponse)) {
            // Clean up each slide 
            carouselSlides = jsonResponse.map(slide => cleanupSlide(slide))
              .filter(slide => slide.length > 0);
          }
        } catch (jsonError) {
          console.error("Error parsing JSON from matched string:", jsonError);
          // Continue to fallback parsing methods below
        }
      }
      
      // If JSON parsing didn't work or didn't produce valid slides, try direct JSON parse
      if (carouselSlides.length === 0) {
        try {
          const jsonResponse = JSON.parse(text.trim());
          if (Array.isArray(jsonResponse)) {
            carouselSlides = jsonResponse.map(slide => cleanupSlide(slide))
              .filter(slide => slide.length > 0);
          }
        } catch (directJsonError) {
          // Continue to fallback parsing methods
        }
      }

      // If we still don't have slides, try extracting based on patterns
      if (carouselSlides.length === 0) {
        // Look for slide patterns like "Slide 1:" or "1." or similar
        const slideRegex = /(?:\/\*\s*---\s*Slide\s*\d+\s*---\s*\*\/|Slide\s*\d+:|^\d+[.:]|\*\*Slide\s*\d+\*\*:?|\[Slide\s*\d+\])/gm;
        const slides = text.split(slideRegex).filter(Boolean).map(slide => cleanupSlide(slide));
        
        // Remove the first item if it's not actually a slide content
        if (slides.length > 0 && (slides[0].length < 10 || slides[0].includes('['))) {
          slides.shift();
        }
        
        carouselSlides = slides.filter(slide => 
          slide.length > 10 && !slide.includes('[') && !slide.includes(']')
        );
      }
    } catch (error) {
      console.error("Error processing carousel slides:", error);
      
      // Last resort: just split by newlines and try to find coherent content
      const lines = text.split('\n').filter(line => {
        const cleanLine = cleanupSlide(line);
        return cleanLine.length > 15 && 
          !cleanLine.includes('```') && 
          !cleanLine.includes('/*') &&
          !cleanLine.includes('Slide');
      });
      
      if (lines.length > 0) {
        carouselSlides = lines.map(cleanupSlide);
      }
    }

    return { success: true, carousel: carouselSlides }
  } catch (error) {
    console.error("Carousel generation error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    }
  }
}
