import { generateText } from "ai";
import { getAIModel } from "@/lib/ai-providers";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    prompt,
    selectedProvider,
    selectedModel,
    apiKey,
    clientPersonaTrainingData,
    clientContextData,
    platform = "linkedin",
  } = await req.json();

  // Get the AI model using centralized config
  const model = getAIModel({ 
    provider: selectedProvider, 
    model: selectedModel, 
    apiKey 
  });

  // Build persona prompt from CLIENT-PROVIDED data only
  const buildPersonaPrompt = (): string => {
    if (!clientPersonaTrainingData || clientPersonaTrainingData.length === 0) {
      return "";
    }

    const personaLines = clientPersonaTrainingData.map((persona: {
      name: string;
      type: string;
      writingSamples: string[];
      styleNotes: string;
      commentInstructions?: string;
    }) => {
      const samples = persona.writingSamples?.slice(0, 3).join("\n---\n") || "";
      const commentGuidance = persona.commentInstructions 
        ? `\nComment Writing Guidelines: ${persona.commentInstructions}` 
        : "";
      return `
### ${persona.name} (${persona.type})
Style Notes: ${persona.styleNotes || "N/A"}${commentGuidance}

Sample Content:
${samples}
`;
    });

    return `
## Writing Style Reference
Use these as inspiration for tone, vocabulary, and structure:
${personaLines.join("\n")}
`;
  };

  // Build context prompt from CLIENT-PROVIDED data only
  const buildContextPrompt = (): string => {
    if (!clientContextData || clientContextData.length === 0) {
      return "";
    }

    const contextLines = clientContextData.map((ctx: {
      name: string;
      type: string;
      content: string;
    }) => `
### ${ctx.name} (${ctx.type})
${ctx.content}
`);

    return `
## Brand/Context Information
Apply these guidelines:
${contextLines.join("\n")}
`;
  };

  const personaPrompt = buildPersonaPrompt();
  const contextPrompt = buildContextPrompt();

  const systemPrompt = `You are an expert social media content strategist and comment writer.

Your task is to generate engaging, thoughtful comments for ${platform} posts.

${personaPrompt}

${contextPrompt}

## Comment Writing Guidelines:

### For LinkedIn:
- Be professional yet personable
- Add genuine value to the conversation
- Share relevant insights or experiences
- Ask thoughtful follow-up questions when appropriate
- Avoid generic praise like "Great post!" or "Love this!"
- Keep comments concise but meaningful (2-4 sentences typically)
- Use natural, conversational language

### For Twitter/X:
- Be concise and punchy
- Add wit or insight
- Stay within character limits mentally
- Use relevant hashtags sparingly if at all
- Engage authentically

### Comment Quality Standards:
- AUTHENTIC: Sound like a real person, not AI-generated
- VALUABLE: Add something to the conversation
- RELEVANT: Stay on topic
- ENGAGING: Invite further discussion when appropriate
- SPECIFIC: Reference specific points from the original post

## Output Format:
Generate comments as a JSON array. Each comment should be unique and different in approach.
Output ONLY the JSON array, no other text.
Example format: ["Comment 1 text here", "Comment 2 text here", "Comment 3 text here"]`;

  try {
    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.8,
    });

    // Parse the response as JSON array of comments
    let comments: string[] = [];
    try {
      // Try to extract JSON array from the response
      const text = result.text.trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        comments = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, split by newlines and filter empty lines
        comments = text.split('\n').filter(line => line.trim().length > 0);
      }
    } catch {
      // Fallback: treat the entire response as a single comment or split by common separators
      const text = result.text.trim();
      if (text.includes('\n\n')) {
        comments = text.split('\n\n').filter(c => c.trim().length > 0);
      } else if (text.includes('\n')) {
        comments = text.split('\n').filter(c => c.trim().length > 0);
      } else {
        comments = [text];
      }
    }

    // Clean up comments (remove numbering, quotes, etc.)
    comments = comments.map(comment => {
      return comment
        .replace(/^[\d]+[\.\)]\s*/, '') // Remove numbering like "1. " or "1) "
        .replace(/^["']|["']$/g, '') // Remove surrounding quotes
        .trim();
    }).filter(c => c.length > 0);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error generating comments:", error);
    return NextResponse.json(
      { error: "Failed to generate comments" },
      { status: 500 }
    );
  }
}
