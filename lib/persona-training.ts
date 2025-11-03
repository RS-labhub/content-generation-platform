"use client"

interface PersonaData {
  name: string
  rawContent: string
  instructions?: string
  createdAt: string
  isBuiltIn?: boolean
  contentType?: "posts" | "blogs" | "mixed"
  sentiment?: {
    positive: number
    negative: number
    neutral: number
    dominant: string
    keywords: string[]
    styleCharacteristics: {
      avgSentenceLength: number
      usesEmojis: boolean
      usesHashtags: boolean
      formalityLevel: 'formal' | 'casual' | 'mixed'
      punctuationStyle: string[]
      writingPatterns: {
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
      formattingPatterns: {
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
}

interface SentimentAnalysis {
  positive: number
  negative: number
  neutral: number
  dominant: string
  keywords: string[]
  styleCharacteristics: {
    avgSentenceLength: number
    usesEmojis: boolean
    usesHashtags: boolean
    formalityLevel: 'formal' | 'casual' | 'mixed'
    punctuationStyle: string[]
    writingPatterns: {
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
    formattingPatterns: {
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

const STORAGE_KEY = "rss-platform-persona-training"
const BUILT_IN_PERSONAS_KEY = "rss-platform-built-in-personas-initialized"

// Initialize built-in personas on first load
export function initializeBuiltInPersonas(): void {
  if (typeof window === "undefined") return
  
  // Check if built-in personas have already been initialized
  const initialized = localStorage.getItem(BUILT_IN_PERSONAS_KEY)
  if (initialized === "true") return
  
  // Load rohan-sharma persona data from sample-data
  const rohanSharmaContent = `𝗘𝘅𝗰𝗹𝘂𝘀𝗶𝘃𝗲 𝗖𝘆𝗯𝗲𝗿𝘀𝗲𝗰𝘂𝗿𝗶𝘁𝘆 𝗪𝗲𝗯𝗶𝗻𝗮𝗿 𝗔𝗹𝗲𝗿𝘁! 

Join us for a game-changing session on securing connected devices with industry leaders from Infineon Technologies and Thistle Technologies!

📅 August 14, 2025
🕗 8:30 PM - 9:30 PM IST
🎯 Focus: Practical embedded security implementation

𝗪𝗵𝗮𝘁 𝗺𝗮𝗸𝗲𝘀 𝘁𝗵𝗶𝘀 𝘄𝗲𝗯𝗶𝗻𝗮𝗿 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁?
• No death by PowerPoint - real, interactive engineering discussions
• Practical insights for CRA compliance
• Hands-on approach to boot protection & OTA firmware updates
• Direct access to industry experts

𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝗱 𝗦𝗽𝗲𝗮𝗸𝗲𝗿𝘀:
→ Raúl Vergara (Thistle Technologies)
→ Josh Marquardt (Infineon Technologies)
→ Julie Huang (Infineon Technologies)
→ Elliott Lee-Hearn (ipXchange)

𝗞𝗲𝘆 𝗧𝗼𝗽𝗶𝗰𝘀:
• PSOC™ 6 Family security features
• OPTIGA™ Trust M implementation
• Edge device security best practices
• Real-world cybersecurity challenges & solutions

Perfect for engineers, security professionals, and tech leaders looking to strengthen their IoT security infrastructure.

𝗟𝗶𝗺𝗶𝘁𝗲𝗱 𝘀𝗽𝗼𝘁𝘀 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲! Register now:
https://tr.ee/thistle-rs

---

𝗕𝗶𝗴 𝗺𝗶𝗹𝗲𝘀𝘁𝗼𝗻𝗲 𝗳𝗼𝗿 𝗟𝗟𝗠𝗪𝗮𝗿𝗲.

We've 𝗰𝗿𝗼𝘀𝘀𝗲𝗱 𝟯𝟬𝟬+ 𝗳𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀 𝗼𝗻 𝗚𝗶𝘁𝗛𝘂𝗯, with 𝟭𝟰𝗞+ 𝘀𝘁𝗮𝗿𝘀 𝗮𝗻𝗱 𝟮.𝟱𝗞+ 𝗳𝗼𝗿𝗸𝘀 and our Discord community has grown to 𝗼𝘃𝗲𝗿 𝟱,𝟬𝟬𝟬+ 𝗱𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿𝘀.

LLMWare (by Ai Bloks) is built for developers who want fast, production-ready LLM apps without the heavy lifting. From lightweight model hosting to enterprise-ready integrations, we're making it easier to go from idea to deployment in record time.

If you're building with LLMs and want to stay ahead of the curve:

✦ 𝗘𝘅𝗽𝗹𝗼𝗿𝗲 𝘁𝗵𝗲 𝗚𝗶𝘁𝗵𝘂𝗯 𝗥𝗲𝗽𝗼𝘀𝗶𝘁𝗼𝗿𝘆: https://lnkd.in/duQudB-D

✦ 𝗝𝗼𝗶𝗻 𝘁𝗵𝗲 𝗟𝗟𝗠𝗪𝗮𝗿𝗲 𝗖𝗼𝗺𝗺𝘂𝗻𝗶𝘁𝘆: https://lnkd.in/gY-_Cy8i

Let's build the future of LLM applications together.`
  
  const rohanSharmaInstructions = "Write in an engaging, professional style with Unicode bold formatting for headers. Use bullet points with •, →, and ✦ symbols. Include relevant emojis naturally. Focus on technical topics, community engagement, and innovation. Structure posts with clear sections separated by --- when appropriate."
  
  try {
    // Check if rohan-sharma persona already exists
    const existingPersona = getPersonaTrainingData("rohan-sharma")
    if (!existingPersona) {
      // Create the built-in persona
      const sentiment = analyzeSentiment(rohanSharmaContent)
      const persona: PersonaData = {
        name: "rohan-sharma",
        rawContent: rohanSharmaContent,
        instructions: rohanSharmaInstructions,
        createdAt: new Date().toISOString(),
        isBuiltIn: true,
        contentType: "posts",
        sentiment
      }
      
      // Save the persona
      const stored = getStoredPersonaData()
      stored.push(persona)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    }
    
    // Mark as initialized
    localStorage.setItem(BUILT_IN_PERSONAS_KEY, "true")
  } catch (error) {
    console.error("Error initializing built-in personas:", error)
  }
}

// Comprehensive sentiment analysis function
export function analyzeSentiment(text: string): SentimentAnalysis {
  const positiveWords = [
    'amazing', 'awesome', 'brilliant', 'excellent', 'fantastic', 'great', 'incredible', 'love', 'perfect', 'wonderful',
    'best', 'outstanding', 'superb', 'magnificent', 'beautiful', 'exciting', 'happy', 'joy', 'delighted', 'thrilled',
    'passionate', 'enthusiastic', 'innovative', 'creative', 'successful', 'achievement', 'victory', 'win', 'celebrate',
    'inspiring', 'motivated', 'confident', 'proud', 'grateful', 'blessed', 'lucky', 'fortunate', 'positive', 'optimistic'
  ]
  
  const negativeWords = [
    'terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disgusting', 'annoying', 'frustrating', 'disappointing',
    'failed', 'failure', 'problem', 'issue', 'difficult', 'hard', 'struggle', 'challenge', 'obstacle', 'barrier',
    'worried', 'concerned', 'anxious', 'stressed', 'sad', 'angry', 'upset', 'disappointed', 'confused', 'lost'
  ]

  const neutralWords = [
    'maybe', 'perhaps', 'possibly', 'probably', 'might', 'could', 'would', 'should', 'think', 'believe',
    'consider', 'suggest', 'recommend', 'option', 'alternative', 'choice', 'decide', 'determine', 'analyze'
  ]

  const words = text.toLowerCase().split(/\s+/)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  let positiveCount = 0
  let negativeCount = 0
  let neutralCount = 0
  const foundKeywords: string[] = []

  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '')
    if (positiveWords.includes(cleanWord)) {
      positiveCount++
      if (!foundKeywords.includes(cleanWord)) foundKeywords.push(cleanWord)
    } else if (negativeWords.includes(cleanWord)) {
      negativeCount++
      if (!foundKeywords.includes(cleanWord)) foundKeywords.push(cleanWord)
    } else if (neutralWords.includes(cleanWord)) {
      neutralCount++
      if (!foundKeywords.includes(cleanWord)) foundKeywords.push(cleanWord)
    }
  })

  const total = positiveCount + negativeCount + neutralCount || 1
  const positive = Math.round((positiveCount / total) * 100)
  const negative = Math.round((negativeCount / total) * 100)
  const neutral = 100 - positive - negative

  let dominant = 'neutral'
  if (positive > negative && positive > neutral) dominant = 'positive'
  else if (negative > positive && negative > neutral) dominant = 'negative'

  // Advanced style analysis
  const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0
  const usesEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text)
  const usesHashtags = /#\w+/.test(text)
  
  // Determine formality level
  const formalWords = ['however', 'therefore', 'furthermore', 'nevertheless', 'consequently', 'moreover']
  const casualWords = ['yeah', 'gonna', 'wanna', 'hey', 'awesome', 'cool', 'super', 'totally']
  const formalCount = formalWords.filter(word => text.toLowerCase().includes(word)).length
  const casualCount = casualWords.filter(word => text.toLowerCase().includes(word)).length
  
  let formalityLevel: 'formal' | 'casual' | 'mixed' = 'mixed'
  if (formalCount > casualCount && formalCount > 0) formalityLevel = 'formal'
  else if (casualCount > formalCount && casualCount > 0) formalityLevel = 'casual'
  
  // Analyze punctuation patterns
  const punctuationStyle: string[] = []
  if (text.includes('!')) punctuationStyle.push('exclamatory')
  if (text.includes('?')) punctuationStyle.push('questioning')
  if (text.includes('...')) punctuationStyle.push('ellipsis')
  if (text.includes('--') || text.includes('—')) punctuationStyle.push('dashes')
  if ((text.match(/!/g) || []).length > 2) punctuationStyle.push('high-excitement')

  // Extract writing patterns
  const writingPatterns = extractWritingPatterns(text, sentences, words)
  
  // Extract formatting patterns
  const formattingPatterns = extractFormattingPatterns(text)

  return {
    positive,
    negative,
    neutral,
    dominant,
    keywords: foundKeywords,
    styleCharacteristics: {
      avgSentenceLength,
      usesEmojis,
      usesHashtags,
      formalityLevel,
      punctuationStyle,
      writingPatterns,
      formattingPatterns
    }
  }
}

// Extract writing patterns
function extractWritingPatterns(text: string, sentences: string[], words: string[]) {
  const contractionsUsed = extractContractions(text)
  const uniquePhrases = extractUniquePhrases(text)
  const sentenceStarters = extractSentenceStarters(sentences)
  const sentenceEnders = extractSentenceEnders(sentences)
  const vocabularyLevel = analyzeVocabularyLevel(words)
  const personalPronouns = extractPersonalPronouns(text)
  const transitionWords = extractTransitionWords(text)
  const questionPatterns = extractQuestionPatterns(sentences)
  const exclamationPatterns = extractExclamationPatterns(sentences)
  
  return {
    contractionsUsed,
    uniquePhrases,
    sentenceStarters,
    sentenceEnders,
    vocabularyLevel,
    personalPronouns,
    transitionWords,
    questionPatterns,
    exclamationPatterns
  }
}

// Extract comprehensive formatting patterns
function extractFormattingPatterns(text: string) {
  const lines = text.split('\n')
  
  // Detect bullet styles - generic approach to find any bullet patterns
  const bulletStyles: string[] = []
  const bulletRegex = /^\s*([•✦→✓★☆▪▫○●◦‣⁃–—-]|\d+[\.\)]|[a-zA-Z][\.\)])\s+/
  lines.forEach(line => {
    const match = line.match(bulletRegex)
    if (match && !bulletStyles.includes(match[1])) {
      bulletStyles.push(match[1])
    }
  })
  
  // Detect header styles
  const headerStyles: string[] = []
  lines.forEach(line => {
    if (line.match(/^#{1,6}\s/)) headerStyles.push('markdown-headers')
    if (line.match(/^[A-Z][^a-z]*:$/)) headerStyles.push('colon-headers')
    if (line.match(/^[A-Z\s]+$/)) headerStyles.push('all-caps-headers')
    if (line.match(/^=+$/)) headerStyles.push('equals-underline')
    if (line.match(/^-+$/)) headerStyles.push('dash-underline')
  })
  
  // Detect emphasis patterns
  const emphasisPatterns: string[] = []
  if (text.match(/\*\*[^*]+\*\*/)) emphasisPatterns.push('double-asterisk-bold')
  if (text.match(/\*[^*]+\*/)) emphasisPatterns.push('single-asterisk-italic')
  if (text.match(/__[^_]+__/)) emphasisPatterns.push('double-underscore-bold')
  if (text.match(/_[^_]+_/)) emphasisPatterns.push('single-underscore-italic')
  if (text.match(/`[^`]+`/)) emphasisPatterns.push('code-backticks')
  if (text.match(/~~[^~]+~~/)) emphasisPatterns.push('strikethrough')
  if (/[\u{1D400}-\u{1D7FF}]/u.test(text)) emphasisPatterns.push('unicode-bold')
  
  // Detect list structures
  const listStructures: string[] = []
  if (lines.some(line => /^\s*[•✦→✓★☆▪▫○●◦‣⁃–—-]\s/.test(line))) listStructures.push('bullet-lists')
  if (lines.some(line => /^\s*\d+[\.\)]\s/.test(line))) listStructures.push('numbered-lists')
  if (lines.some(line => /^\s*[a-zA-Z][\.\)]\s/.test(line))) listStructures.push('alphabetic-lists')
  if (lines.some(line => /^\s*[-*+]\s*\[[x\s]\]\s/.test(line))) listStructures.push('task-lists')
  
  // Detect special characters and emojis
  const specialCharacters: string[] = []
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
  const emojis = text.match(emojiRegex) || []
  specialCharacters.push(...[...new Set(emojis)].slice(0, 10))
  
  const symbols = ['→', '←', '↑', '↓', '⬆️', '⬇️', '➡️', '⬅️', '✓', '✗', '★', '☆']
  symbols.forEach(symbol => {
    if (text.includes(symbol) && !specialCharacters.includes(symbol)) {
      specialCharacters.push(symbol)
    }
  })
  
  // Detect link patterns
  const linkPatterns: string[] = []
  if (text.match(/https?:\/\/[^\s]+/)) linkPatterns.push('direct-urls')
  if (text.match(/\[([^\]]+)\]\(([^)]+)\)/)) linkPatterns.push('markdown-links')
  if (text.match(/<[^>]+>/)) linkPatterns.push('html-links')
  
  // Detect callout patterns
  const calloutPatterns: string[] = []
  if (text.match(/^\s*>\s/m)) calloutPatterns.push('blockquotes')
  if (text.match(/^\s*\|\s/m)) calloutPatterns.push('table-format')
  if (text.match(/{%[^%]+%}/)) calloutPatterns.push('template-tags')
  if (text.match(/^\s*(NOTE|TIP|WARNING|INFO):/mi)) calloutPatterns.push('note-callouts')
  
  // Analyze indentation
  let indentationStyle = 'none'
  const indentedLines = lines.filter(line => /^\s+/.test(line))
  if (indentedLines.length > 0) {
    const spaceIndents = indentedLines.filter(line => line.match(/^ +/))
    const tabIndents = indentedLines.filter(line => line.match(/^\t+/))
    indentationStyle = tabIndents.length > spaceIndents.length ? 'tabs' : 'spaces'
  }
  
  // Detect formatting types
  const usesBoldUnicode = /[\u{1D400}-\u{1D7FF}]/u.test(text)
  const usesMarkdownSyntax = /[#*`_\[\]()]/.test(text)
  const usesHTMLElements = /<[^>]+>/.test(text)
  
  // Detect structural markers
  const structuralMarkers: string[] = []
  const separatorPatterns = [
    { pattern: /^-{3,}$/m, name: 'triple-dash' },
    { pattern: /^={3,}$/m, name: 'triple-equals' },
    { pattern: /^_{3,}$/m, name: 'triple-underscore' },
    { pattern: /^\*{3,}$/m, name: 'triple-asterisk' }
  ]
  
  separatorPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(text)) structuralMarkers.push(name)
  })
  
  return {
    bulletStyles: [...new Set(bulletStyles)],
    headerStyles: [...new Set(headerStyles)],
    emphasisPatterns: [...new Set(emphasisPatterns)],
    listStructures: [...new Set(listStructures)],
    specialCharacters: [...new Set(specialCharacters)],
    linkPatterns: [...new Set(linkPatterns)],
    calloutPatterns: [...new Set(calloutPatterns)],
    indentationStyle,
    usesBoldUnicode,
    usesMarkdownSyntax,
    usesHTMLElements,
    structuralMarkers: [...new Set(structuralMarkers)]
  }
}

// Helper functions for writing pattern analysis
function extractContractions(text: string): string[] {
  const contractionRegex = /\b\w+'\w+\b/g
  const matches = text.match(contractionRegex) || []
  return [...new Set(matches.map(c => c.toLowerCase()))]
}

function extractUniquePhrases(text: string): string[] {
  const phrases: string[] = []
  const words = text.toLowerCase().split(/\s+/)
  
  for (let i = 0; i < words.length - 1; i++) {
    for (let len = 2; len <= 4 && i + len <= words.length; len++) {
      const phrase = words.slice(i, i + len).join(' ')
      if (phrase.length > 5 && !phrase.match(/^(the|and|but|or|in|on|at|to|for|of|with|by)$/)) {
        phrases.push(phrase)
      }
    }
  }
  
  const phraseCounts = phrases.reduce((acc, phrase) => {
    acc[phrase] = (acc[phrase] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(phraseCounts)
    .filter(([_, count]) => count > 1)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 5)
    .map(([phrase]) => phrase)
}

function extractSentenceStarters(sentences: string[]): string[] {
  const starters = sentences
    .map(s => s.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase())
    .filter(s => s.length > 2)
  
  const starterCounts = starters.reduce((acc, starter) => {
    acc[starter] = (acc[starter] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(starterCounts)
    .filter(([_, count]) => count > 1)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 5)
    .map(([starter]) => starter)
}

function extractSentenceEnders(sentences: string[]): string[] {
  const enders = sentences
    .map(s => s.trim().split(/\s+/).slice(-2).join(' ').toLowerCase())
    .filter(s => s.length > 2)
  
  const enderCounts = enders.reduce((acc, ender) => {
    acc[ender] = (acc[ender] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(enderCounts)
    .filter(([_, count]) => count > 1)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 5)
    .map(([ender]) => ender)
}

function analyzeVocabularyLevel(words: string[]): 'simple' | 'intermediate' | 'advanced' | 'mixed' {
  const complexWords = words.filter(word => word.length > 7)
  const simpleWords = words.filter(word => word.length <= 4)
  const complexRatio = complexWords.length / words.length
  
  if (complexRatio > 0.15) return 'advanced'
  if (complexRatio > 0.08) return 'intermediate'
  if (simpleWords.length / words.length > 0.6) return 'simple'
  return 'mixed'
}

function extractPersonalPronouns(text: string): string[] {
  const pronounRegex = /\b(i|me|my|mine|myself|you|your|yours|yourself|we|us|our|ours|ourselves)\b/gi
  const matches = text.match(pronounRegex) || []
  const pronounCounts = matches.reduce((acc, pronoun) => {
    const lower = pronoun.toLowerCase()
    acc[lower] = (acc[lower] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(pronounCounts)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .map(([pronoun]) => pronoun)
}

function extractTransitionWords(text: string): string[] {
  const transitions = ['however', 'therefore', 'meanwhile', 'furthermore', 'moreover', 'additionally', 'consequently', 'nevertheless', 'thus', 'hence', 'indeed', 'certainly', 'obviously', 'clearly', 'specifically', 'particularly', 'especially', 'actually', 'basically', 'essentially', 'ultimately', 'eventually', 'finally']
  
  const foundTransitions = transitions.filter(transition => 
    text.toLowerCase().includes(transition.toLowerCase())
  )
  
  return foundTransitions.slice(0, 5)
}

function extractQuestionPatterns(sentences: string[]): string[] {
  const questions = sentences.filter(s => s.includes('?'))
  const patterns = questions.map(q => {
    const words = q.trim().split(/\s+/)
    return words.slice(0, 3).join(' ').toLowerCase()
  })
  
  return [...new Set(patterns)].slice(0, 3)
}

function extractExclamationPatterns(sentences: string[]): string[] {
  const exclamations = sentences.filter(s => s.includes('!'))
  const patterns = exclamations.map(e => {
    const words = e.trim().split(/\s+/)
    if (words.length <= 3) return e.toLowerCase().replace(/[!.?]/g, '')
    return words.slice(-2).join(' ').toLowerCase().replace(/[!.?]/g, '')
  })
  
  return [...new Set(patterns)].slice(0, 3)
}

// Function to load built-in persona data from text files
export async function loadBuiltInPersonaData(name: string): Promise<string | null> {
  try {
    const response = await fetch(`/training-data/${name}-posts.txt`)
    if (response.ok) {
      return await response.text()
    }
  } catch (error) {
    console.error(`Error loading ${name} training data:`, error)
  }
  return null
}

// Add a new function to load built-in persona data with content type
export async function loadBuiltInPersonaDataWithType(
  name: string,
  contentType: "posts" | "blogs",
): Promise<string | null> {
  try {
    const suffix = contentType === "blogs" ? "blogs" : "posts"
    const response = await fetch(`/training-data/${name}-${suffix}.txt`)
    if (response.ok) {
      return await response.text()
    }
  } catch (error) {
    console.error(`Error loading ${name} ${contentType} training data:`, error)
  }
  return null
}

export function savePersonaTrainingData(name: string, rawContent: string, instructions?: string): void {
  if (typeof window === "undefined") return

  try {
    const existingData = getStoredPersonaData()
    const newPersona: PersonaData = {
      name: name.toLowerCase(),
      rawContent,
      instructions,
      createdAt: new Date().toISOString(),
      isBuiltIn: false,
    }

    // Remove existing persona with same name
    const filteredData = existingData.filter((p) => p.name !== name.toLowerCase())
    const updatedData = [...filteredData, newPersona]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
  } catch (error) {
    console.error("Error saving persona training data:", error)
    throw new Error("Failed to save persona training data")
  }
}

// Update savePersonaTrainingData to include content type and instructions
export function savePersonaTrainingDataWithType(
  name: string,
  rawContent: string,
  contentType: "posts" | "blogs" | "mixed" = "mixed",
  instructions?: string,
): void {
  if (typeof window === "undefined") return

  try {
    const existingData = getStoredPersonaData()
    
    // Analyze sentiment of the training content
    const sentiment = analyzeSentiment(rawContent)
    
    const newPersona: PersonaData = {
      name: name.toLowerCase(),
      rawContent,
      instructions,
      createdAt: new Date().toISOString(),
      isBuiltIn: false,
      contentType,
      sentiment,
    }

    // Remove existing persona with same name (regardless of content type)
    const filteredData = existingData.filter((p) => p.name !== name.toLowerCase())
    const updatedData = [...filteredData, newPersona]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))

    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event("personas-updated"))
  } catch (error) {
    console.error("Error saving persona training data:", error)
    throw new Error("Failed to save persona training data")
  }
}

export function getPersonaTrainingData(name: string): PersonaData | null {
  if (typeof window === "undefined") return null

  try {
    const allPersonas = getAllPersonaData()
    return allPersonas.find((p) => p.name === name.toLowerCase()) || null
  } catch (error) {
    console.error("Error getting persona training data:", error)
    return null
  }
}

// Update the getPersonaTrainingData function to support content type
export function getPersonaTrainingDataWithType(
  name: string,
  contentType?: "posts" | "blogs" | "mixed",
): PersonaData | null {
  if (typeof window === "undefined") return null

  try {
    const allPersonas = getAllPersonaData()
    // Always return the persona with the given name, regardless of content type if not specified
    return allPersonas.find((p) => p.name === name.toLowerCase()) || null
  } catch (error) {
    console.error("Error getting persona training data:", error)
    return null
  }
}

// Return all stored personas (no built-in ones)
export function getAllPersonaData(): PersonaData[] {
  if (typeof window === "undefined") return []

  try {
    const stored = getStoredPersonaData()
    return stored.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error getting all persona data:", error)
    return []
  }
}

export function removePersonaTrainingData(name: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const existingData = getStoredPersonaData()
    const filteredData = existingData.filter((p) => p.name !== name.toLowerCase())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData))

    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event("personas-updated"))
    return true
  } catch (error) {
    console.error("Error removing persona training data:", error)
    return false
  }
}

export function downloadPersonaData(name: string): void {
  const persona = getPersonaTrainingData(name)
  if (!persona) return

  const dataToDownload = {
    name: persona.name,
    rawContent: persona.rawContent,
    instructions: persona.instructions,
    createdAt: persona.createdAt,
    contentType: persona.contentType,
    exportedAt: new Date().toISOString(),
    version: "1.0",
  }

  const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${name}-persona-backup.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function uploadPersonaData(file: File): Promise<PersonaData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        if (!data.name || !data.rawContent) {
          throw new Error("Invalid persona backup file format")
        }

        const persona: PersonaData = {
          name: data.name.toLowerCase(),
          rawContent: data.rawContent,
          instructions: data.instructions,
          createdAt: data.createdAt || new Date().toISOString(),
          isBuiltIn: false,
          contentType: data.contentType || "mixed",
        }

        // Save the persona
        savePersonaTrainingDataWithType(persona.name, persona.rawContent, persona.contentType, persona.instructions)
        resolve(persona)
      } catch (error) {
        reject(new Error("Failed to parse persona backup file"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

// Add a new function specifically for creating personas from text content
export function createPersonaFromText(
  name: string,
  textContent: string,
  contentType: "posts" | "blogs" | "mixed" = "mixed",
  instructions?: string
): void {
  if (!name.trim() || !textContent.trim()) {
    throw new Error("Name and content are required")
  }

  const cleanName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
  savePersonaTrainingDataWithType(cleanName, textContent.trim(), contentType, instructions)
}

function getStoredPersonaData(): PersonaData[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error parsing stored persona data:", error)
    return []
  }
}
