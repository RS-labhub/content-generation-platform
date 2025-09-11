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
    return data ? JSON.parse(data) : null
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
export function analyzeContextContent(rawContent: string): ContextData['analysis'] {
  if (!rawContent.trim()) {
    return {
      keyTopics: [],
      entities: [],
      dataCategories: [],
      contentSummary: 'Start typing to see content analysis...'
    }
  }

  const words = rawContent.toLowerCase().split(/\s+/)
  const sentences = rawContent.split(/[.!?]+/).filter(s => s.trim().length > 10)
  const lines = rawContent.split('\n').filter(line => line.trim())
  
  // Comprehensive stop words list
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'throughout', 'despite', 'towards', 'upon',
    'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'us', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now',
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'being', 'been', 'be', 'am', 'is', 'are', 'was', 'were'
  ])
  
  // Smart keyword extraction with frequency analysis
  const wordFreq = new Map<string, number>()
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase()
    if (cleanWord.length > 3 && !stopWords.has(cleanWord) && !/^\d+$/.test(cleanWord)) {
      wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1)
    }
  })
  
  const keyTopics = Array.from(wordFreq.entries())
    .filter(([_, freq]) => freq >= Math.max(2, Math.floor(words.length / 100)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word)
  
  // Enhanced entity extraction - multiple patterns
  const entityPatterns = [
    // Company/Brand names (2-3 capitalized words)
    /\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,2}\b/g,
    // Products/Technologies with common suffixes
    /\b[A-Z][a-zA-Z]*(?:Pro|Plus|Max|Tech|Soft|Ware|Lab|Hub|Cloud|AI|ML|API)\b/g,
    // Acronyms and abbreviations
    /\b[A-Z]{2,6}\b/g,
    // Numbers with units or currency
    /\$[\d,]+(?:\.\d{2})?|\d+(?:K|M|B|k|m|b)\b|\d+(?:%|GB|TB|MB)\b/g
  ]
  
  let entities: string[] = []
  entityPatterns.forEach(pattern => {
    const matches = rawContent.match(pattern) || []
    entities.push(...matches)
  })
  
  // Filter and clean entities
  entities = Array.from(new Set(entities))
    .filter(entity => {
      const clean = entity.trim()
      return clean.length > 1 && 
             !stopWords.has(clean.toLowerCase()) &&
             !/^(The|This|That|And|Or|But|If|When|Where|With|For|From)$/i.test(clean)
    })
    .slice(0, 15)
  
  // Smart content categorization
  const categoryKeywords = {
    'company': ['company', 'business', 'organization', 'firm', 'corporation', 'startup', 'agency', 'founded', 'headquarters', 'mission', 'vision', 'about us'],
    'product': ['product', 'service', 'solution', 'offering', 'platform', 'software', 'application', 'tool', 'feature', 'functionality'],
    'team': ['team', 'staff', 'employee', 'member', 'people', 'founder', 'ceo', 'cto', 'developer', 'designer', 'manager', 'director'],
    'values': ['value', 'culture', 'principle', 'belief', 'mission', 'vision', 'philosophy', 'commitment', 'dedication'],
    'process': ['process', 'workflow', 'methodology', 'approach', 'framework', 'strategy', 'procedure', 'method'],
    'achievement': ['award', 'achievement', 'success', 'milestone', 'recognition', 'certified', 'winner', 'leader', 'growth'],
    'contact': ['email', 'phone', 'address', 'contact', 'location', 'office', 'website', 'linkedin', 'twitter'],
    'metrics': ['revenue', 'profit', 'growth', 'customer', 'client', 'user', 'download', 'million', 'billion', 'percent', '%']
  }
  
  const dataCategories: string[] = []
  const contentLower = rawContent.toLowerCase()
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => contentLower.includes(keyword)).length
    if (matches >= 2 || (keywords.length > 5 && matches >= 3)) {
      dataCategories.push(category)
    }
  })
  
  // Intelligent content summary generation
  let contentSummary = ''
  if (sentences.length > 0) {
    // Find the most informative sentence
    const importantSentences = sentences.filter(sentence => {
      const s = sentence.toLowerCase()
      return s.includes('company') || s.includes('business') || s.includes('we') || 
             s.includes('product') || s.includes('service') || s.includes('specialize') ||
             s.includes('offer') || s.includes('provide') || s.includes('focus')
    })
    
    const bestSentence = importantSentences[0] || sentences[0]
    contentSummary = bestSentence.trim()
    
    if (contentSummary.length > 150) {
      contentSummary = contentSummary.substring(0, 147) + '...'
    }
  } else if (lines.length > 0) {
    contentSummary = lines[0].substring(0, 100) + '...'
  } else {
    contentSummary = 'Content analysis will appear here as you type...'
  }
  
  return {
    keyTopics,
    entities,
    dataCategories,
    contentSummary
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
