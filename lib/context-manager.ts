export interface ContextData {
  name: string
  description?: string
  category: "company" | "product" | "service" | "team" | "values" | "history" | "general"
  data: {
    structured: Record<string, any>
    rawContent: string
    metadata: {
      dataType: "json" | "text" | "csv" | "markdown" | "mixed"
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
    keyInsights: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface ContextCategory {
  name: string
  description: string
  examples: string[]
  color: string
}

export const CONTEXT_CATEGORIES: ContextCategory[] = [
  {
    name: "company",
    description: "Company overview, mission, vision, values, and general information",
    examples: ["About Us", "Mission Statement", "Company History"],
    color: "blue"
  },
  {
    name: "product",
    description: "Product information, features, specifications, and documentation",
    examples: ["Product Catalog", "Feature Lists", "Technical Specs"],
    color: "green"
  },
  {
    name: "service",
    description: "Services offered, processes, and service-related information",
    examples: ["Service Descriptions", "Process Documentation", "SLAs"],
    color: "purple"
  },
  {
    name: "team",
    description: "Team members, leadership, expertise, and organizational structure",
    examples: ["Team Bios", "Leadership Profiles", "Org Chart"],
    color: "orange"
  },
  {
    name: "values",
    description: "Company culture, values, principles, and brand personality",
    examples: ["Culture Deck", "Brand Guidelines", "Core Values"],
    color: "pink"
  },
  {
    name: "history",
    description: "Company timeline, milestones, achievements, and case studies",
    examples: ["Company Timeline", "Success Stories", "Milestones"],
    color: "indigo"
  },
  {
    name: "general",
    description: "General information that doesn't fit other categories",
    examples: ["Mixed Content", "Reference Materials", "Other Data"],
    color: "gray"
  }
]

// Storage keys
const CONTEXT_STORAGE_KEY = "content-generator-contexts"
const CONTEXT_PREFIX = "context-"

// Save context data
export function saveContextData(contextData: ContextData): void {
  try {
    // Save individual context
    const contextKey = `${CONTEXT_PREFIX}${contextData.name}`
    localStorage.setItem(contextKey, JSON.stringify(contextData))
    
    // Update context list
    const contexts = getAllContextNames()
    if (!contexts.includes(contextData.name)) {
      contexts.push(contextData.name)
      localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(contexts))
    }
  } catch (error) {
    console.error("Error saving context data:", error)
    throw new Error("Failed to save context data")
  }
}

// Get context data by name
export function getContextData(contextName: string): ContextData | null {
  try {
    const contextKey = `${CONTEXT_PREFIX}${contextName}`
    const data = localStorage.getItem(contextKey)
    if (!data) {
      return null
    }

    const parsed: ContextData = JSON.parse(data)

    if (!parsed.analysis || typeof parsed.analysis.keyInsights === "undefined") {
      const refreshedAnalysis = analyzeContextContent(parsed.data?.rawContent || "")
      const now = new Date().toISOString()

      let updatedStructured = parsed.data?.structured
      if (
        parsed.data &&
        typeof parsed.data.structured === "object" &&
        parsed.data.structured !== null &&
        Object.prototype.hasOwnProperty.call(parsed.data.structured, "analysis")
      ) {
        updatedStructured = {
          ...(parsed.data.structured as Record<string, any>),
          analysis: refreshedAnalysis,
        }
      }

      const updatedContext: ContextData = {
        ...parsed,
        analysis: refreshedAnalysis,
        data: {
          ...parsed.data,
          structured: updatedStructured,
          metadata: {
            ...parsed.data.metadata,
            lastUpdated: now,
          },
        },
        updatedAt: now,
      }

      localStorage.setItem(contextKey, JSON.stringify(updatedContext))
      return updatedContext
    }

    return parsed
  } catch (error) {
    console.error("Error loading context data:", error)
    return null
  }
}

// Get all context names
export function getAllContextNames(): string[] {
  try {
    const data = localStorage.getItem(CONTEXT_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error loading context names:", error)
    return []
  }
}

// Get all context data
export function getAllContextData(): ContextData[] {
  const contextNames = getAllContextNames()
  return contextNames
    .map(name => getContextData(name))
    .filter((context): context is ContextData => context !== null)
}

// Remove context data
export function removeContextData(contextName: string): void {
  try {
    // Remove individual context
    const contextKey = `${CONTEXT_PREFIX}${contextName}`
    localStorage.removeItem(contextKey)
    
    // Update context list
    const contexts = getAllContextNames().filter(name => name !== contextName)
    localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(contexts))
  } catch (error) {
    console.error("Error removing context data:", error)
    throw new Error("Failed to remove context data")
  }
}

// Enhanced context content analysis with automatic extraction
export function analyzeContextContent(rawContent: string): ContextData["analysis"] {
  if (!rawContent.trim()) {
    return {
      keyTopics: [],
      entities: [],
      dataCategories: [],
      contentSummary: "Start typing to see content analysis...",
      keyInsights: [],
    }
  }

  const normalizedContent = rawContent.replace(/\r\n/g, "\n")
  const sentences = (normalizedContent.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length > 0)
  const lines = normalizedContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const stopWords = new Set([
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "throughout",
    "despite",
    "towards",
    "upon",
    "this",
    "that",
    "these",
    "those",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "us",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "whose",
    "where",
    "when",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "can",
    "will",
    "just",
    "should",
    "now",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "would",
    "could",
    "may",
    "might",
    "must",
    "shall",
    "being",
    "been",
    "be",
    "am",
    "is",
    "are",
    "was",
    "were",
    "https",
    "http",
    "www",
    "com",
    "inc",
    "ltd",
    "amp",
  ])

  const importantShortTokens = new Set(["ai", "ml", "ui", "ux", "it", "hr", "vr", "ar", "xr", "pr"])

  const tokenize = (text: string) =>
    text
      .toLowerCase()
      .split(/[^a-z0-9%]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 0)

  const allTokens = tokenize(normalizedContent)
  const wordFreq = new Map<string, number>()
  allTokens.forEach((token) => {
    if ((token.length <= 2 && !importantShortTokens.has(token)) || stopWords.has(token) || /^\d+$/.test(token)) {
      return
    }
    wordFreq.set(token, (wordFreq.get(token) || 0) + 1)
  })

  const candidatePhrases: string[] = []
  sentences.forEach((sentence) => {
    const words = sentence
      .toLowerCase()
      .split(/[^a-z0-9&+/%-]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 0)

    let currentPhrase: string[] = []
    words.forEach((word) => {
      const isMeaningful = (!stopWords.has(word) && (word.length > 2 || importantShortTokens.has(word)))
      if (!isMeaningful) {
        if (currentPhrase.length > 0) {
          candidatePhrases.push(currentPhrase.join(" "))
          currentPhrase = []
        }
      } else {
        currentPhrase.push(word)
      }
    })

    if (currentPhrase.length > 0) {
      candidatePhrases.push(currentPhrase.join(" "))
    }
  })

  const rakeWordFreq = new Map<string, number>()
  const rakeWordDegree = new Map<string, number>()
  candidatePhrases.forEach((phrase) => {
    const words = phrase.split(" ").filter((word) => word.length > 0)
    const degree = words.length - 1
    words.forEach((word) => {
      rakeWordFreq.set(word, (rakeWordFreq.get(word) || 0) + 1)
      rakeWordDegree.set(word, (rakeWordDegree.get(word) || 0) + degree)
    })
  })

  const rakeWordScore = new Map<string, number>()
  rakeWordFreq.forEach((freq, word) => {
    const degree = (rakeWordDegree.get(word) || 0) + freq
    rakeWordScore.set(word, degree / Math.max(freq, 1))
  })

  const phraseScores = new Map<string, number>()
  candidatePhrases.forEach((phrase) => {
    const words = phrase.split(" ").filter((word) => word.length > 0)
    if (words.length === 0) {
      return
    }

    const score = words.reduce((acc, word) => acc + (rakeWordScore.get(word) || 0), 0)
    if (score > 0) {
      phraseScores.set(phrase, (phraseScores.get(phrase) || 0) + score)
    }
  })

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const findOriginalPhrase = (phrase: string) => {
    const pattern = phrase
      .trim()
      .split(/\s+/)
      .map((segment) => escapeRegex(segment))
      .join("\\s+")
    if (!pattern) {
      return ""
    }

    const regex = new RegExp(`\\b${pattern}\\b`, "i")
    const match = rawContent.match(regex)
    if (match && match[0]) {
      return match[0].replace(/\s+/g, " ").trim()
    }

    return phrase
      .split(/\s+/)
      .filter((segment) => segment.length > 0)
      .map((segment) => {
        if (segment.length <= 3) {
          return segment.toUpperCase()
        }
        return segment.charAt(0).toUpperCase() + segment.slice(1)
      })
      .join(" ")
  }

  const sortedPhraseEntries = Array.from(phraseScores.entries())
    .filter(([phrase]) => phrase.split(" ").length >= 2)
    .sort((a, b) => b[1] - a[1])

  const sortedWordEntries = Array.from(wordFreq.entries())
    .sort((a, b) => {
      const scoreA = (rakeWordScore.get(a[0]) || 0) + a[1]
      const scoreB = (rakeWordScore.get(b[0]) || 0) + b[1]
      return scoreB - scoreA
    })

  const keyTopics: string[] = []
  const seenTopics = new Set<string>()

  const addTopic = (candidate: string) => {
    const normalized = candidate.toLowerCase()
    if (!normalized || seenTopics.has(normalized)) {
      return
    }
    seenTopics.add(normalized)
    keyTopics.push(candidate)
  }

  sortedPhraseEntries.some(([phrase]) => {
    const topic = findOriginalPhrase(phrase)
    if (!topic) {
      return false
    }
    addTopic(topic)
    return keyTopics.length >= 8
  })

  if (keyTopics.length < 10) {
    for (const [word] of sortedWordEntries) {
      const topic = findOriginalPhrase(word)
      if (!topic) {
        continue
      }
      addTopic(topic)
      if (keyTopics.length >= 10) {
        break
      }
    }
  }

  if (keyTopics.length === 0) {
    for (const [word] of sortedWordEntries.slice(0, 5)) {
      const topic = findOriginalPhrase(word) || word
      addTopic(topic)
    }
  }

  // Enhanced entity extraction - multiple patterns
  const entityPatterns = [
    /\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3}\b/g, // Proper names and brands
    /\b[A-Z][a-zA-Z]*(?:Pro|Plus|Max|Tech|Soft|Ware|Lab|Hub|Cloud|AI|ML|API|Suite|Platform)\b/g, // Product names
    /\b[A-Z]{2,6}\b/g, // Acronyms
    /\$[\d,]+(?:\.\d{2})?|\d+(?:K|M|B|k|m|b)\b|\d+(?:%|GB|TB|MB|hrs|yrs)\b/g, // Numbers and metrics
    /#[a-zA-Z0-9_]+/g, // Hashtags
    /https?:\/\/[^\s]+/g, // URLs
  ]

  let entities: string[] = []
  entityPatterns.forEach((pattern) => {
    const matches = rawContent.match(pattern) || []
    entities.push(...matches)
  })

  entities = Array.from(new Set(entities))
    .map((entity) => entity.trim())
    .filter((entity) => {
      if (entity.length <= 1) {
        return false
      }
      const lower = entity.toLowerCase()
      return !stopWords.has(lower) && !/^(the|this|that|and|or|but|if|when|where|with|for|from)$/i.test(entity)
    })
    .slice(0, 18)

  const categoryKeywords = {
    company: [
      "company",
      "business",
      "organization",
      "firm",
      "corporation",
      "startup",
      "agency",
      "founded",
      "headquarters",
      "mission",
      "vision",
      "about us",
      "team",
      "culture",
    ],
    product: [
      "product",
      "service",
      "solution",
      "offering",
      "platform",
      "software",
      "application",
      "tool",
      "feature",
      "functionality",
      "roadmap",
      "release",
      "integration",
    ],
    service: [
      "service",
      "package",
      "consulting",
      "support",
      "deployment",
      "maintenance",
      "implementation",
      "training",
      "engagement",
    ],
    team: [
      "team",
      "staff",
      "employee",
      "member",
      "people",
      "founder",
      "ceo",
      "cto",
      "developer",
      "designer",
      "manager",
      "director",
      "leadership",
    ],
    values: [
      "value",
      "culture",
      "principle",
      "belief",
      "mission",
      "vision",
      "philosophy",
      "commitment",
      "dedication",
      "promise",
      "ethos",
      "brand voice",
    ],
    process: [
      "process",
      "workflow",
      "methodology",
      "approach",
      "framework",
      "strategy",
      "procedure",
      "method",
      "lifecycle",
      "pipeline",
    ],
    achievement: [
      "award",
      "achievement",
      "success",
      "milestone",
      "recognition",
      "certified",
      "winner",
      "leader",
      "growth",
      "record",
      "ranking",
    ],
    metrics: [
      "revenue",
      "profit",
      "growth",
      "customer",
      "client",
      "user",
      "download",
      "million",
      "billion",
      "percent",
      "%",
      "roi",
      "conversion",
    ],
    marketing: [
      "campaign",
      "marketing",
      "branding",
      "positioning",
      "audience",
      "segment",
      "channel",
      "engagement",
      "reach",
    ],
  }

  const dataCategories: string[] = []
  const contentLower = normalizedContent.toLowerCase()
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const matches = keywords.filter((keyword) => contentLower.includes(keyword)).length
    const matchRatio = matches / Math.max(keywords.length, 1)
    if (matches >= 2 || matchRatio >= 0.25) {
      dataCategories.push(category)
    }
  })

  const normalizedKeyTopics = keyTopics.map((topic) => topic.toLowerCase())
  const sentenceCandidates = sentences
    .map((sentence) => {
      const lower = sentence.toLowerCase()
      const words = lower.split(/[^a-z0-9%]+/).filter((token) => token.length > 0)
      let score = 0
      let topicMatches = 0

      normalizedKeyTopics.forEach((topic) => {
        if (topic.length > 3 && lower.includes(topic)) {
          score += 4
          topicMatches += 1
        }
      })

      words.forEach((word) => {
        score += rakeWordScore.get(word) || 0
      })

      if (/[0-9]/.test(sentence)) {
        score += 2
      }

      if (sentence.length > 220) {
        score *= 0.9
      }

      return {
        sentence: sentence.endsWith('.') || sentence.endsWith('!') || sentence.endsWith('?') ? sentence : `${sentence}.`,
        score,
        topicMatches,
      }
    })
    .filter((candidate) => candidate.sentence.length > 30)

  const averageSentenceScore =
    sentenceCandidates.reduce((acc, candidate) => acc + candidate.score, 0) /
      Math.max(sentenceCandidates.length, 1) || 0

  const keyInsights: string[] = []
  const usedSentences = new Set<string>()
  sentenceCandidates
    .sort((a, b) => b.score - a.score)
    .forEach((candidate) => {
      if (keyInsights.length >= 5) {
        return
      }

      if (candidate.score < averageSentenceScore * 0.55 && keyInsights.length > 0) {
        return
      }

      if (candidate.topicMatches === 0 && keyInsights.length >= 3) {
        return
      }

      const normalizedSentence = candidate.sentence.toLowerCase()
      if (usedSentences.has(normalizedSentence)) {
        return
      }

      usedSentences.add(normalizedSentence)
      keyInsights.push(candidate.sentence)
    })

  if (keyInsights.length === 0) {
    if (sentences.length > 0) {
      keyInsights.push(sentences[0].endsWith('.') ? sentences[0] : `${sentences[0]}.`)
    } else if (lines.length > 0) {
      keyInsights.push(`${lines[0]}.`)
    }
  }

  let contentSummary = keyInsights.slice(0, 2).join(" ")
  if (!contentSummary && sentences.length > 0) {
    contentSummary = sentences[0]
  }
  if (!contentSummary && lines.length > 0) {
    contentSummary = lines[0]
  }
  if (!contentSummary) {
    contentSummary = "Content analysis will appear here as you type..."
  }
  if (contentSummary.length > 220) {
    contentSummary = `${contentSummary.substring(0, 217).trim()}...`
  }

  return {
    keyTopics,
    entities,
    dataCategories,
    contentSummary,
    keyInsights,
  }
}

// Create context from text content
export function createContextFromText(
  name: string,
  rawContent: string,
  category: ContextData['category'] = 'general',
  description?: string
): ContextData {
  const analysis = analyzeContextContent(rawContent)
  const now = new Date().toISOString()
  
  // Try to parse as JSON, otherwise treat as plain text
  let structured: Record<string, any> = {}
  let dataType: ContextData['data']['metadata']['dataType'] = 'text'
  
  try {
    structured = JSON.parse(rawContent)
    dataType = 'json'
  } catch {
    // Try to detect other formats
    if (rawContent.includes('|') && rawContent.includes('\n')) {
      dataType = 'csv'
    } else if (rawContent.includes('#') || rawContent.includes('**')) {
      dataType = 'markdown'
    }
    
    // For non-JSON, create a simple structure
    structured = {
      content: rawContent,
      analysis: analysis
    }
  }
  
  return {
    name,
    description,
    category,
    data: {
      structured,
      rawContent,
      metadata: {
        dataType,
        fileCount: 1,
        totalSize: rawContent.length,
        lastUpdated: now
      }
    },
    analysis,
    createdAt: now,
    updatedAt: now
  }
}

// Upload and parse context files
export function uploadContextData(files: FileList): Promise<{ name: string; content: string; type: string }[]> {
  return Promise.all(
    Array.from(files).map(file => {
      return new Promise<{ name: string; content: string; type: string }>((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          const content = e.target?.result as string
          resolve({
            name: file.name,
            content,
            type: file.type || 'text/plain'
          })
        }
        
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
        reader.readAsText(file)
      })
    })
  )
}

// Download context data
export function downloadContextData(contextName: string): void {
  const context = getContextData(contextName)
  if (!context) {
    throw new Error(`Context "${contextName}" not found`)
  }
  
  const dataStr = JSON.stringify(context, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${contextName}-context.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export all contexts
export function exportAllContexts(): void {
  const allContexts = getAllContextData()
  const dataStr = JSON.stringify(allContexts, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `all-contexts-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Import contexts from file
export function importContextsFromFile(file: File): Promise<ContextData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const contexts: ContextData[] = JSON.parse(content)
        
        // Save each context
        contexts.forEach(context => {
          saveContextData(context)
        })
        
        resolve(contexts)
      } catch (error) {
        reject(new Error('Invalid context file format'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Get contexts by category
export function getContextsByCategory(category: ContextData['category']): ContextData[] {
  return getAllContextData().filter(context => context.category === category)
}

// Search contexts
export function searchContexts(query: string): ContextData[] {
  const lowercaseQuery = query.toLowerCase()
  return getAllContextData().filter(context => 
    context.name.toLowerCase().includes(lowercaseQuery) ||
    context.description?.toLowerCase().includes(lowercaseQuery) ||
    context.data.rawContent.toLowerCase().includes(lowercaseQuery) ||
    context.analysis?.keyTopics.some(topic => topic.includes(lowercaseQuery)) ||
    context.analysis?.entities.some(entity => entity.toLowerCase().includes(lowercaseQuery))
  )
}
