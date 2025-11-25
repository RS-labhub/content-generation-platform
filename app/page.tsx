"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Sparkles, Zap, Brain, BarChart3Icon as Diagram3, Layers, Settings2, Send, MessageSquare, Copy, Check, Download, Edit, Save, X, RotateCcw, FileText } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { generatePost, generateContentDiagram } from "./actions/generate-post"
import { generateLinkedInCarousel } from "./actions/generate-linkedin-carousel"
import { useToast } from "@/hooks/use-toast"
import { Analytics } from "@vercel/analytics/react"
import { APIKeyDialog } from "@/components/api-key-dialog"
import { apiKeyManager, type APIProvider } from "@/lib/api-key-manager"
import { Bot, Cpu, FileImage } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Import all the new components
import { Header } from "@/components/header"
import { PostContextForm } from "@/components/post-context-form"
import { SourceContentInput } from "@/components/source-content-input"
import { AIProviderSelection } from "@/components/ai-provider-selection"
import { DiagramConfiguration } from "@/components/diagram-configuration"
import { DiagramContentInput } from "@/components/diagram-content-input"
import { Footer } from "@/components/footer"
import { PersonaTrainingDialog } from "@/components/persona-training-dialog"
import { getPersonaTrainingDataWithType } from "@/lib/persona-training"
import { ContextManagerDialog } from "@/components/context-manager-dialog"
import { getContextData } from "@/lib/context-manager"
import { LinkedInCarouselConfig } from "@/components/linkedin-carousel-config"
import { MermaidPreview } from "@/components/mermaid-preview"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

// Define all providers including the new ones
const allProviders: APIProvider[] = [
  {
    id: "groq",
    name: "GROQ",
    description: "Ultra-fast inference with excellent performance for creative content generation",
    icon: <Zap className="h-4 w-4 text-orange-600" />,
    model: "llama-3.1-8b-instant",
    requiresKey: false,
    keyPlaceholder: "",
    keyValidation: () => true,
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google's advanced AI with strong reasoning capabilities and multimodal understanding",
    icon: <Brain className="h-4 w-4 text-blue-600" />,
    model: "gemini-2.0-flash",
    requiresKey: false,
    keyPlaceholder: "",
    keyValidation: () => true,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models with excellent reasoning and creative capabilities",
    icon: <Bot className="h-4 w-4 text-green-600" />,
    model: "GPT-4",
    requiresKey: true,
    keyPlaceholder: "sk-...",
    keyValidation: (key: string) => key.startsWith("sk-") && key.length > 20,
    defaultModels: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    supportsCustomModels: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models with strong reasoning and safety features",
    icon: <Cpu className="h-4 w-4 text-purple-600" />,
    model: "Claude Sonnet 4.5",
    requiresKey: true,
    keyPlaceholder: "sk-ant-...",
    keyValidation: (key: string) => key.startsWith("sk-ant-") && key.length > 20,
    defaultModels: ["claude-sonnet-4-5-20250929", "claude-haiku-4-5-20251001", "claude-opus-4-5-20251101"],
    supportsCustomModels: true,
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "Access to a wide variety of open-source models and cutting-edge AI research",
    icon: <FileImage className="h-4 w-4 text-yellow-600" />,
    model: "Llama & FLUX Models",
    requiresKey: true,
    keyPlaceholder: "hf_...",
    keyValidation: (key: string) => key.startsWith("hf_") && key.length > 20,
    defaultModels: ["meta-llama/Llama-2-7b-chat-hf", "black-forest-labs/FLUX.1-schnell", "stabilityai/stable-diffusion-xl-base-1.0"],
    supportsCustomModels: true,
  },
]

interface PostContext {
  platform: string
  style: string
  keywords: string
  contentType?: string
  postLength?: string
  customWordCount?: number
}

type WorkbenchMode = "post" | "image" | "carousel" | "diagram"

interface ModeOption {
  label: string
  description: string
  icon: LucideIcon
  badge: string
}

const workbenchModes: Record<WorkbenchMode, ModeOption> = {
  post: {
    label: "Post Generation",
    description: "Channel-native narratives tuned to your personas and contexts.",
    icon: Sparkles,
    badge: "Narrative Studio",
  },
  image: {
    label: "Image Generation",
    description: "Brand-aligned campaign visuals from long-form insights.",
    icon: FileImage,
    badge: "Visual Lab",
  },
  carousel: {
    label: "Carousel Builder",
    description: "Slide-by-slide storytelling for LinkedIn and community drops.",
    icon: Layers,
    badge: "Sequence Design",
  },
  diagram: {
    label: "Diagram Studio",
    description: "Mermaid diagrams that translate frameworks into clarity.",
    icon: Diagram3,
    badge: "Systems Thinking",
  },
}

const highlightMetrics: Array<{
  title: string
  value: string
  description: string
}> = [
  {
    title: "Modes Unified",
    value: "4",
    description: "Generate posts, carousels, diagrams, and visuals without context switching.",
  },
  {
    title: "Persona Memory",
    value: "Persistent",
    description: "Keep tone, sentiment, and references aligned with your saved personas.",
  },
  {
    title: "Context Recall",
    value: "Real-time",
    description: "Blend source material and brand cues into every response automatically.",
  },
]

interface ChatMessage {
  id: string
  author: "user" | "assistant"
  mode: WorkbenchMode
  content: string
  timestamp: number
  payload?: {
    post?: string
    carouselSlides?: string[]
    mermaidDiagram?: string
    imageUrl?: string
    imageConfig?: ImageConfig
    comments?: string[]
    isGeneratingComments?: boolean
  }
  status?: "success" | "error"
  error?: string
}

interface ImageConfig {
  provider: string
  model: string
  size: string
  customWidth?: string
  customHeight?: string
  title: string
  content: string
  style: string
  customStyle?: string
  customPrompt?: string
}

const imageProviderOptions = [
  { value: "pollinations_free", label: "AI Image Generator (Free)" },
  { value: "free_alternatives", label: "Free Alternatives" },
  { value: "huggingface", label: "Hugging Face (API Key)" },
  { value: "openai", label: "OpenAI DALL·E" },
]

const imageSizeOptions = [
  { value: "square_large", label: "Square (1024 × 1024)" },
  { value: "post", label: "Post (1200 × 675)" },
  { value: "portrait", label: "Portrait (768 × 1024)" },
  { value: "landscape", label: "Landscape (1024 × 768)" },
]

const imageStyleOptions = [
  { value: "realistic", label: "Photorealistic" },
  { value: "minimalist", label: "Minimalist" },
  { value: "cartoon", label: "Cartoon" },
  { value: "watercolor", label: "Watercolor" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "pixel_art", label: "Pixel Art" },
  { value: "custom", label: "Custom" },
]

export default function ContentPostingPlatform() {
  const [context, setContext] = useState<PostContext>({
    platform: "LinkedIn",
    style: "",
    keywords: "",
    postLength: "medium",
    customWordCount: undefined,
  })
  const [content, setContent] = useState("")
  const [diagramContent, setDiagramContent] = useState("")
  const [diagramType, setDiagramType] = useState("flowchart")
  const [provider, setProvider] = useState<"groq" | "gemini" | "openai" | "anthropic">("groq")
  const [activeProvider, setActiveProvider] = useState<APIProvider>(allProviders[0])
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null)
  const [activeModel, setActiveModel] = useState<string>("")
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState(false)
  const [carouselSettings, setCarouselSettings] = useState({
    slideCount: 8,
    includeIntro: true,
    includeOutro: true,
    carouselTheme: "professional",
    slideFormat: "headline-body",
    carouselDepth: "technical",
    customDepthDescription: ""
  })
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [selectedPersona, setSelectedPersona] = useState<string>("default")
  const [showPersonaDialog, setShowPersonaDialog] = useState(false)
  const [selectedContext, setSelectedContext] = useState<string>("")
  const [showContextDialog, setShowContextDialog] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeMode, setActiveMode] = useState<WorkbenchMode>("post")
  const [modeConfigTarget, setModeConfigTarget] = useState<WorkbenchMode | null>(null)
  const [isGlobalConfigOpen, setIsGlobalConfigOpen] = useState(false)
  const [imageConfig, setImageConfig] = useState<ImageConfig>({
    provider: "pollinations_free",
    model: "turbo",
    size: "square_large",
    title: "",
    content: "",
    style: "realistic",
    customStyle: "",
    customPrompt: "",
  })
  const [editingCarouselId, setEditingCarouselId] = useState<string | null>(null)
  const [editedCarouselSlides, setEditedCarouselSlides] = useState<string[]>([])
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editedPostContent, setEditedPostContent] = useState<string>("")
  const [collapsedDiagrams, setCollapsedDiagrams] = useState<{ [key: string]: boolean }>({})
  const [editingDiagramId, setEditingDiagramId] = useState<string | null>(null)
  const [editedDiagramContent, setEditedDiagramContent] = useState<string>("")
  const [useContent, setUseContent] = useState(true)
  const [sourceComments, setSourceComments] = useState<string[]>([])
  const [isGeneratingSourceComments, setIsGeneratingSourceComments] = useState(false)
  const [postCommentCounts, setPostCommentCounts] = useState<{ [key: string]: number }>({})
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()

  // Run model migration on mount
  useEffect(() => {
    apiKeyManager.migrateClaudeModels()
  }, [])

  // Load saved data on mount
  useEffect(() => {
    const savedContext = localStorage.getItem("postContext")
    const savedContent = localStorage.getItem("postContent")
    const savedDiagramContent = localStorage.getItem("diagramContent")
    const savedPersona = localStorage.getItem("selectedPersona")
    const savedContextSelection = localStorage.getItem("selectedContext")

    if (savedContext) {
      try {
        const parsed = JSON.parse(savedContext)
        setContext({
          platform: parsed.platform || "",
          style: parsed.style || "",
          keywords: parsed.keywords || "",
          contentType: parsed.contentType || undefined,
          postLength: parsed.postLength || "medium",
          customWordCount: parsed.customWordCount || undefined,
        })
      } catch (error) {
        console.error("Error parsing saved context:", error)
      }
    }
    if (savedContent) {
      setContent(savedContent || "")
    }
    if (savedDiagramContent) {
      setDiagramContent(savedDiagramContent || "")
    }
    if (savedPersona) {
      setSelectedPersona(savedPersona || "default")
    }
    if (savedContextSelection) {
      setSelectedContext(savedContextSelection || "")
    }
  }, [])

  useEffect(() => {
    // Load saved provider and key
    const savedProvider = localStorage.getItem("activeProvider")
    const savedKeyId = localStorage.getItem("activeKeyId")
    const savedModel = localStorage.getItem("activeModel")

    if (savedProvider) {
      const providerInfo = allProviders.find((p) => p.id === savedProvider)
      if (providerInfo) {
        setProvider(savedProvider as any)
        setActiveProvider(providerInfo)

        if (providerInfo.requiresKey && savedKeyId) {
          // Validate that the saved key ID still exists
          const keyExists = apiKeyManager.getAPIKey(savedKeyId)
          if (keyExists) {
            setActiveKeyId(savedKeyId)
            // Get models for this key
            const models = apiKeyManager.getAPIKeyModels(savedKeyId)
            if (models.length > 0 && savedModel && models.includes(savedModel)) {
              setActiveModel(savedModel)
            } else if (models.length > 0) {
              setActiveModel(models[0])
            }
          } else {
            // Key no longer exists, clear the saved key ID
            setActiveKeyId(null)
            localStorage.removeItem("activeKeyId")
            localStorage.removeItem("activeModel")
            // Check if there are other keys for this provider
            const availableKeys = apiKeyManager.getConfigs(providerInfo.id)
            if (availableKeys.length > 0) {
              // Use the most recently used key
              const latestKey = availableKeys[0]
              setActiveKeyId(latestKey.id)
              localStorage.setItem("activeKeyId", latestKey.id)
              const models = apiKeyManager.getAPIKeyModels(latestKey.id)
              if (models.length > 0) {
                setActiveModel(models[0])
                localStorage.setItem("activeModel", models[0])
              }
            }
          }
        } else if (!providerInfo.requiresKey) {
          setActiveKeyId(null)
          if (savedModel) {
            setActiveModel(savedModel)
          } else {
            setActiveModel(providerInfo.model)
          }
        }
      }
    }
  }, [])

  // Save context in real-time
  useEffect(() => {
    localStorage.setItem("postContext", JSON.stringify(context))
  }, [context])

  // Save content in real-time
  useEffect(() => {
    localStorage.setItem("postContent", content)
  }, [content])

  // Save diagram content in real-time
  useEffect(() => {
    localStorage.setItem("diagramContent", diagramContent)
  }, [diagramContent])

  // Save persona in real-time
  useEffect(() => {
    localStorage.setItem("selectedPersona", selectedPersona)
  }, [selectedPersona])

  // Save context in real-time
  useEffect(() => {
    localStorage.setItem("selectedContext", selectedContext)
  }, [selectedContext])

  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [chatHistory, isProcessing])

  // Helper functions
  const handleProviderChange = (providerId: string, keyId?: string) => {
    const providerInfo = allProviders.find((p) => p.id === providerId)
    if (!providerInfo) return

    setProvider(providerId as any)
    setActiveProvider(providerInfo)

    if (providerInfo.requiresKey) {
      if (keyId) {
        // Use the provided key ID
        setActiveKeyId(keyId)
        const models = apiKeyManager.getAPIKeyModels(keyId)
        if (models.length > 0) {
          setActiveModel(models[0])
        }
        // Save to localStorage
        localStorage.setItem("activeKeyId", keyId)
        localStorage.setItem("activeModel", models.length > 0 ? models[0] : "")
      } else {
        // No key provided, try to find an existing key for this provider
        const availableKeys = apiKeyManager.getConfigs(providerId)
        if (availableKeys.length > 0) {
          // Use the most recently used key
          const latestKey = availableKeys[0]
          setActiveKeyId(latestKey.id)
          const models = apiKeyManager.getAPIKeyModels(latestKey.id)
          if (models.length > 0) {
            setActiveModel(models[0])
          }
          // Save to localStorage
          localStorage.setItem("activeKeyId", latestKey.id)
          localStorage.setItem("activeModel", models.length > 0 ? models[0] : "")
        } else {
          // No keys available for this provider
          setActiveKeyId(null)
          setActiveModel("")
          localStorage.removeItem("activeKeyId")
          localStorage.removeItem("activeModel")
        }
      }
    } else {
      // Provider doesn't require a key
      setActiveKeyId(null)
      setActiveModel(providerInfo.model)
      localStorage.removeItem("activeKeyId")
      localStorage.setItem("activeModel", providerInfo.model)
    }

    // Save provider to localStorage
    localStorage.setItem("activeProvider", providerId)
  }

  const handleKeyAdded = (providerId: string, keyId: string) => {
    handleProviderChange(providerId, keyId)
  }

  const getActiveApiKey = () => {
    return activeKeyId ? apiKeyManager.getAPIKey(activeKeyId) : null
  }

  // Validate that the current configuration is valid
  const validateCurrentConfig = () => {
    if (activeProvider.requiresKey) {
      const apiKey = getActiveApiKey()
      return apiKey !== null
    }
    return true
  }

  // Add an effect to periodically validate the configuration
  useEffect(() => {
    if (activeProvider && activeProvider.requiresKey && activeKeyId) {
      const isValid = validateCurrentConfig()
      if (!isValid) {
        // The API key is no longer valid, try to find another one
        const availableKeys = apiKeyManager.getConfigs(activeProvider.id)
        if (availableKeys.length > 0) {
          const latestKey = availableKeys[0]
          setActiveKeyId(latestKey.id)
          localStorage.setItem("activeKeyId", latestKey.id)
          const models = apiKeyManager.getAPIKeyModels(latestKey.id)
          if (models.length > 0) {
            setActiveModel(models[0])
            localStorage.setItem("activeModel", models[0])
          }
        } else {
          setActiveKeyId(null)
          setActiveModel("")
          localStorage.removeItem("activeKeyId")
          localStorage.removeItem("activeModel")
        }
      }
    }
  }, [activeProvider, activeKeyId])

  const runPostGeneration = async (prompt: string) => {
    const hasPersona = selectedPersona && selectedPersona !== "default"

    if (!context.platform) {
      toast({
        title: "Missing Information",
        description: "Please select a platform before generating posts.",
        variant: "destructive",
      })
      return null
    }

    if (activeProvider.requiresKey && !activeKeyId) {
      toast({
        title: "API Key Required",
        description: `Please add an API key for ${activeProvider.name}`,
        variant: "destructive",
      })
      setShowAPIKeyDialog(true)
      return null
    }

    try {
      // Get persona data if selected
      let personaData = undefined
      if (hasPersona) {
        const persona = getPersonaTrainingDataWithType(selectedPersona)
        if (persona) {
          personaData = {
            name: persona.name,
            rawContent: persona.rawContent,
            instructions: persona.instructions,
            sentiment: persona.sentiment
          }
        }
      }

      // Get context data if selected
      let contextData = undefined
      if (selectedContext) {
        const context = getContextData(selectedContext)
        if (context) {
          contextData = context
        }
      }

      const contentToUse = useContent ? content.trim() : ""
      const combinedContent = [contentToUse, prompt.trim()].filter(Boolean).join("\n\n")
      if (!combinedContent) {
        toast({
          title: "Missing Content",
          description: "Provide a prompt or base content for the assistant to work with.",
          variant: "destructive",
        })
        return null
      }

      const result = await generatePost({
        platform: context.platform,
        style: context.style,
        keywords: context.keywords,
        content: combinedContent,
        contentType: context.contentType,
        postLength: context.postLength,
        customWordCount: context.customWordCount,
        provider: provider,
        apiKey: getActiveApiKey() || undefined,
        model: activeModel || undefined,
        persona: personaData,
        context: contextData,
      })

      if (result.success && result.post) {
        toast({
          title: "Post Generated!",
          description: `Successfully generated ${context.platform} post using ${activeProvider.name}${hasPersona ? ` with ${selectedPersona} persona` : ""}${selectedContext ? ` and ${selectedContext} context` : ""}.`,
        })
        return result.post
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate post.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
      return null
    }
  }

  const runCarouselGeneration = async (prompt: string) => {
    const hasPersona = selectedPersona && selectedPersona !== "default"

    if (!context.platform) {
      toast({
        title: "Missing Information",
        description: "Please select a platform before generating a carousel.",
        variant: "destructive",
      })
      return null
    }

    if (activeProvider.requiresKey && !activeKeyId) {
      toast({
        title: "API Key Required",
        description: `Please add an API key for ${activeProvider.name}`,
        variant: "destructive",
      })
      setShowAPIKeyDialog(true)
      return null
    }

    try {
      // Get persona data if selected
      let personaData = undefined
      if (hasPersona) {
        const persona = getPersonaTrainingDataWithType(selectedPersona)
        if (persona) {
          personaData = {
            name: persona.name,
            rawContent: persona.rawContent,
            instructions: persona.instructions,
            sentiment: persona.sentiment
          }
        }
      }

      // Get context data if selected
      let contextData = undefined
      if (selectedContext) {
        const context = getContextData(selectedContext)
        if (context) {
          contextData = context
        }
      }

      const contentToUse = useContent ? content.trim() : ""
      const combinedContent = [contentToUse, prompt.trim()].filter(Boolean).join("\n\n")
      if (!combinedContent) {
        toast({
          title: "Missing Content",
          description: "Provide a prompt or base content for carousel generation.",
          variant: "destructive",
        })
        return null
      }

      const result = await generateLinkedInCarousel({
        platform: context.platform,
        style: context.style,
        keywords: context.keywords,
        content: combinedContent,
        slideCount: carouselSettings.slideCount,
        includeIntro: carouselSettings.includeIntro,
        includeOutro: carouselSettings.includeOutro,
        carouselTheme: carouselSettings.carouselTheme,
        slideFormat: carouselSettings.slideFormat,
        carouselDepth: carouselSettings.carouselDepth,
        customDepthDescription: carouselSettings.customDepthDescription,
        provider: provider,
        apiKey: getActiveApiKey() || undefined,
        model: activeModel || undefined,
        persona: personaData,
        context: contextData,
      })

      if (result.success && result.carousel) {
        toast({
          title: "Carousel Generated!",
          description: `Successfully generated carousel using ${activeProvider.name}${hasPersona ? ` with ${selectedPersona} persona` : ""}${selectedContext ? ` and ${selectedContext} context` : ""}.`,
        })
        return result.carousel
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate carousel.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
      return null
    }
  }

  const runDiagramGeneration = async (prompt: string) => {
    if (!diagramContent.trim() && !prompt.trim()) {
      toast({
        title: "Missing Content",
        description: "Provide structure or instructions to craft the diagram.",
        variant: "destructive",
      })
      return null
    }
    if (activeProvider.requiresKey && !activeKeyId) {
      toast({
        title: "API Key Required",
        description: `Please add an API key for ${activeProvider.name}`,
        variant: "destructive",
      })
      setShowAPIKeyDialog(true)
      return null
    }

    try {
      const contentToUse = useContent ? diagramContent.trim() : ""
      const combinedContent = [contentToUse, prompt.trim()].filter(Boolean).join("\n\n")
      const result = await generateContentDiagram({
        content: combinedContent,
        diagramType: diagramType,
        provider: provider,
        apiKey: getActiveApiKey() || undefined,
        model: activeModel || undefined,
      })

      if (result.success && result.diagram) {
        toast({
          title: "Diagram Generated!",
          description: "Mermaid diagram created successfully.",
        })
        return result.diagram
      }

      toast({
        title: "Generation Failed",
        description: result.error || "Failed to generate diagram.",
        variant: "destructive",
      })
      return null
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
      return null
    }
  }

  const runImageGeneration = async (prompt: string, config?: ImageConfig) => {
    const configToUse = config || imageConfig
    const contentToUse = useContent ? configToUse.content : ""
    const finalPrompt = [contentToUse, configToUse.customPrompt || prompt].filter(Boolean).join("\n\n")
    
    try {
      const response = await fetch("/api/image-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: configToUse.provider,
          prompt: finalPrompt,
          content: contentToUse,
          title: configToUse.title,
          size: configToUse.size,
          customWidth: configToUse.customWidth,
          customHeight: configToUse.customHeight,
          model: configToUse.model,
          style: configToUse.style,
          customStyle: configToUse.customStyle,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const errorMessage = typeof data.error === "string" ? data.error : "Failed to generate image."
        toast({
          title: "Image Generation Failed",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      }

      const data = await response.json()
      if (data?.success && data.imageUrl) {
        toast({
          title: "Image Generated!",
          description: `Created visual using ${data.provider}.`,
        })
        return {
          imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : null,
          config: configToUse,
        }
      }

      toast({
        title: "Image Generation Failed",
        description: "No image returned from the provider.",
        variant: "destructive",
      })
      return null
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Image generation failed. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  const copyToClipboard = async (text: string, type = "default") => {
    try {
      await navigator.clipboard.writeText(text)

      // Set copied state for this specific button
      setCopiedStates((prev) => ({ ...prev, [type]: true }))

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: false }))
      }, 2000)

      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `generated-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Image Downloaded",
        description: "Image saved successfully",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image",
        variant: "destructive",
      })
    }
  }

  const updateImageConfig = (field: keyof ImageConfig, value: string | boolean) => {
    setImageConfig((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const regenerateImage = async (messageId: string) => {
    const message = chatHistory.find(msg => msg.id === messageId)
    if (!message || !message.payload?.imageConfig) {
      toast({
        title: "Error",
        description: "Cannot regenerate: configuration not found",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    
    try {
      const result = await runImageGeneration("", message.payload.imageConfig)
      
      if (result && result.imageUrl) {
        // Update the message with new image URL
        setChatHistory((prevHistory) => 
          prevHistory.map((msg) => 
            msg.id === messageId
              ? { 
                  ...msg, 
                  payload: { 
                    ...msg.payload, 
                    imageUrl: result.imageUrl,
                    imageConfig: result.config
                  },
                  timestamp: Date.now()
                }
              : msg
          )
        )
        
        toast({
          title: "Image Regenerated!",
          description: "New image created with the same settings",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate image",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const startEditingCarousel = (messageId: string, slides: string[]) => {
    setEditingCarouselId(messageId)
    setEditedCarouselSlides([...slides])
  }

  const saveCarouselEdits = (messageId: string) => {
    setChatHistory((prevHistory) => 
      prevHistory.map((msg) => 
        msg.id === messageId
          ? { ...msg, payload: { ...msg.payload, carouselSlides: editedCarouselSlides } }
          : msg
      )
    )
    setEditingCarouselId(null)
    setEditedCarouselSlides([])
    toast({
      title: "Carousel Updated",
      description: "Your slides have been saved successfully",
    })
  }

  const cancelCarouselEdits = () => {
    setEditingCarouselId(null)
    setEditedCarouselSlides([])
  }

  const updateCarouselSlide = (index: number, newContent: string) => {
    setEditedCarouselSlides((prev) => {
      const updated = [...prev]
      updated[index] = newContent
      return updated
    })
  }

  // Unicode formatting to Markdown conversion for editing
  const unicodeToMarkdown = (text: string): string => {
    // Unicode character mappings
    const boldMap: { [key: string]: string } = {
      '𝗔': 'A', '𝗕': 'B', '𝗖': 'C', '𝗗': 'D', '𝗘': 'E', '𝗙': 'F', '𝗚': 'G', '𝗛': 'H', '𝗜': 'I', '𝗝': 'J',
      '𝗞': 'K', '𝗟': 'L', '𝗠': 'M', '𝗡': 'N', '𝗢': 'O', '𝗣': 'P', '𝗤': 'Q', '𝗥': 'R', '𝗦': 'S', '𝗧': 'T',
      '𝗨': 'U', '𝗩': 'V', '𝗪': 'W', '𝗫': 'X', '𝗬': 'Y', '𝗭': 'Z',
      '𝗮': 'a', '𝗯': 'b', '𝗰': 'c', '𝗱': 'd', '𝗲': 'e', '𝗳': 'f', '𝗴': 'g', '𝗵': 'h', '𝗶': 'i', '𝗷': 'j',
      '𝗸': 'k', '𝗹': 'l', '𝗺': 'm', '𝗻': 'n', '𝗼': 'o', '𝗽': 'p', '𝗾': 'q', '𝗿': 'r', '𝘀': 's', '𝘁': 't',
      '𝘂': 'u', '𝘃': 'v', '𝘄': 'w', '𝘅': 'x', '𝘆': 'y', '𝘇': 'z',
      '𝟬': '0', '𝟭': '1', '𝟮': '2', '𝟯': '3', '𝟰': '4', '𝟱': '5', '𝟲': '6', '𝟳': '7', '𝟴': '8', '𝟵': '9'
    }

    const italicMap: { [key: string]: string } = {
      '𝘈': 'A', '𝘉': 'B', '𝘊': 'C', '𝘋': 'D', '𝘌': 'E', '𝘍': 'F', '𝘎': 'G', '𝘏': 'H', '𝘐': 'I', '𝘑': 'J',
      '𝘒': 'K', '𝘓': 'L', '𝘔': 'M', '𝘕': 'N', '𝘖': 'O', '𝘗': 'P', '𝘘': 'Q', '𝘙': 'R', '𝘚': 'S', '𝘛': 'T',
      '𝘜': 'U', '𝘝': 'V', '𝘞': 'W', '𝘟': 'X', '𝘠': 'Y', '𝘡': 'Z',
      '𝘢': 'a', '𝘣': 'b', '𝘤': 'c', '𝘥': 'd', '𝘦': 'e', '𝘧': 'f', '𝘨': 'g', '𝘩': 'h', '𝘪': 'i', '𝘫': 'j',
      '𝘬': 'k', '𝘭': 'l', '𝘮': 'm', '𝘯': 'n', '𝘰': 'o', '𝘱': 'p', '𝘲': 'q', '𝘳': 'r', '𝘴': 's', '𝘵': 't',
      '𝘶': 'u', '𝘷': 'v', '𝘸': 'w', '𝘹': 'x', '𝘺': 'y', '𝘻': 'z'
    }

    let convertedText = ''
    let inBoldSequence = false
    let inItalicSequence = false
    let buffer = ''

    // Use Array.from to properly handle Unicode surrogate pairs
    const chars = Array.from(text)
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      const normalFromBold = boldMap[char]
      const normalFromItalic = italicMap[char]

      if (normalFromBold) {
        if (!inBoldSequence) {
          convertedText += '**'
          inBoldSequence = true
        }
        buffer += normalFromBold
      } else if (normalFromItalic) {
        if (!inItalicSequence) {
          convertedText += '*'
          inItalicSequence = true
        }
        buffer += normalFromItalic
      } else {
        // Close any open sequences
        if (inBoldSequence) {
          convertedText += buffer + '**'
          buffer = ''
          inBoldSequence = false
        } else if (inItalicSequence) {
          convertedText += buffer + '*'
          buffer = ''
          inItalicSequence = false
        }
        convertedText += char
      }
    }

    // Close any remaining sequences
    if (inBoldSequence) {
      convertedText += buffer + '**'
    } else if (inItalicSequence) {
      convertedText += buffer + '*'
    }

    // Convert special bullets and symbols to markdown
    convertedText = convertedText.replace(/✦/g, '-').replace(/→/g, '-').replace(/•/g, '-')

    return convertedText
  }

  // Markdown to Unicode formatting conversion for display
  const markdownToUnicode = (text: string): string => {
    const normalToBold: { [key: string]: string } = {
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
      'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
      'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
      'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
      'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
      ' ': ' ', ',': ',', '.': '.', '!': '!', '?': '?', ':': ':', ';': ';', '-': '-', '(': '(', ')': ')',
      "'": "'", '"': '"', '/': '/', '@': '@', '#': '#', '$': '$', '%': '%', '&': '&', '+': '+', '=': '='
    }

    const normalToItalic: { [key: string]: string } = {
      'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑',
      'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛',
      'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
      'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫',
      'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵',
      'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
      ' ': ' ', ',': ',', '.': '.', '!': '!', '?': '?', ':': ':', ';': ';', '-': '-', '(': '(', ')': ')',
      "'": "'", '"': '"', '/': '/', '@': '@', '#': '#', '$': '$', '%': '%', '&': '&', '+': '+', '=': '='
    }

    let result = text

    // Convert ***bold italic*** (must be before ** and *)
    result = result.replace(/\*\*\*(.+?)\*\*\*/g, (match, content) => {
      return Array.from(content as string).map((char) => normalToBold[char] || char).join('')
    })

    // Convert **bold** to Unicode bold
    result = result.replace(/\*\*(.+?)\*\*/g, (match, content) => {
      return Array.from(content as string).map((char) => normalToBold[char] || char).join('')
    })

    // Convert *italic* to Unicode italic (but not ** which is already processed)
    result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, (match, content) => {
      return Array.from(content as string).map((char) => normalToItalic[char] || char).join('')
    })

    // Convert __underline__ to Unicode underlined (note: limited Unicode support for underline)
    result = result.replace(/__(.+?)__/g, (match, content) => {
      // For now, keep underline as-is since Unicode underline is limited
      return content
    })

    return result
  }

  const startEditingPost = (messageId: string, post: string) => {
    setEditingPostId(messageId)
    // Convert Unicode bold to Markdown for editing
    setEditedPostContent(unicodeToMarkdown(post))
  }

  const savePostEdits = (messageId: string) => {
    // Convert Markdown back to Unicode bold for display
    const displayContent = markdownToUnicode(editedPostContent)
    
    setChatHistory((prevHistory) => 
      prevHistory.map((msg) => 
        msg.id === messageId
          ? { 
              ...msg, 
              content: displayContent,
              payload: { ...msg.payload, post: displayContent } 
            }
          : msg
      )
    )
    setEditingPostId(null)
    setEditedPostContent("")
    toast({
      title: "Post Updated",
      description: "Your post has been saved successfully",
    })
  }

  const cancelPostEdits = () => {
    setEditingPostId(null)
    setEditedPostContent("")
  }

  const toggleDiagramCode = (messageId: string) => {
    setCollapsedDiagrams((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  const startEditingDiagram = (messageId: string, diagram: string) => {
    setEditingDiagramId(messageId)
    setEditedDiagramContent(diagram)
  }

  const saveDiagramEdits = (messageId: string) => {
    setChatHistory((prevHistory) => 
      prevHistory.map((msg) => 
        msg.id === messageId
          ? { 
              ...msg, 
              content: editedDiagramContent,
              payload: { ...msg.payload, mermaidDiagram: editedDiagramContent } 
            }
          : msg
      )
    )
    setEditingDiagramId(null)
    setEditedDiagramContent("")
    toast({
      title: "Diagram Updated",
      description: "Your diagram has been saved successfully",
    })
  }

  const cancelDiagramEdits = () => {
    setEditingDiagramId(null)
    setEditedDiagramContent("")
  }

  const retryGeneration = async (messageId: string) => {
    // Find the failed message and its corresponding user message
    const messageIndex = chatHistory.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    const failedMessage = chatHistory[messageIndex]
    const userMessage = chatHistory[messageIndex - 1]
    
    if (!userMessage || userMessage.author !== "user") return

    // Remove the failed message from history
    setChatHistory((prev) => prev.filter((msg) => msg.id !== messageId))
    
    // Re-trigger generation with the original prompt
    const originalMode = activeMode
    setActiveMode(failedMessage.mode)
    
    // Wait a bit for state to update
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Trigger the generation with the original prompt directly
    setTimeout(() => {
      handleSendMessageWithPrompt(userMessage.content)
      setActiveMode(originalMode)
    }, 200)
  }

  const handleDiagramSuggestionSelect = (suggestion: string) => {
    // Close the mode configuration dialog
    setModeConfigTarget(null)
    
    // Automatically trigger the message send with the suggestion
    setTimeout(() => {
      handleSendMessageWithPrompt(suggestion)
    }, 100)
  }

  const handlePostSuggestionSelect = (suggestion: string) => {
    // Close the mode configuration dialog
    setModeConfigTarget(null)
    
    // Automatically trigger the message send with the suggestion
    setTimeout(() => {
      handleSendMessageWithPrompt(suggestion)
    }, 100)
  }

  const handleSendMessageWithPrompt = async (promptText: string) => {
    const prompt = promptText.trim()
    if (!prompt || isProcessing) {
      return
    }

    const timestamp = Date.now()
    const userMessage: ChatMessage = {
      id: `user-${timestamp}`,
      author: "user",
      mode: activeMode,
      content: prompt,
      timestamp,
    }

    setChatHistory((previous) => [...previous, userMessage])
    setIsProcessing(true)

    let assistantContent = ""
    let payload: ChatMessage["payload"] = {}
    let status: ChatMessage["status"] = "success"
    let error: string | undefined

    try {
      if (activeMode === "post") {
        const post = await runPostGeneration(prompt)
        if (post) {
          assistantContent = post
          payload = { post }
        } else {
          status = "error"
          error = "Post generation failed."
        }
      } else if (activeMode === "carousel") {
        const slides = await runCarouselGeneration(prompt)
        if (slides && slides.length > 0) {
          payload = { carouselSlides: slides }
          assistantContent = slides.join("\n\n")
        } else {
          status = "error"
          error = "Carousel generation failed."
        }
      } else if (activeMode === "diagram") {
        const diagram = await runDiagramGeneration(prompt)
        if (diagram) {
          assistantContent = diagram
          payload = { mermaidDiagram: diagram }
        } else {
          status = "error"
          error = "Diagram generation failed."
        }
      } else if (activeMode === "image") {
        const result = await runImageGeneration(prompt)
        if (result && result.imageUrl) {
          assistantContent = "Generated image:"
          payload = { 
            imageUrl: result.imageUrl,
            imageConfig: result.config
          }
        } else {
          status = "error"
          error = "Image generation failed."
        }
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${timestamp}`,
        author: "assistant",
        mode: activeMode,
        content: assistantContent,
        timestamp: Date.now(),
        payload,
        status,
        error,
      }

      setChatHistory((previous) => [...previous, assistantMessage])
    } catch (err) {
      const assistantMessage: ChatMessage = {
        id: `assistant-${timestamp}`,
        author: "assistant",
        mode: activeMode,
        content: "",
        timestamp: Date.now(),
        status: "error",
        error: "An unexpected error occurred.",
      }

      setChatHistory((previous) => [...previous, assistantMessage])
    } finally {
      setIsProcessing(false)
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 100)
    }
  }

  const handleSendMessage = async () => {
    const prompt = chatInput.trim()
    if (!prompt || isProcessing) {
      return
    }

    setChatInput("")
    await handleSendMessageWithPrompt(prompt)
  }

  const generateComments = async (messageId: string, postContent: string, count?: number) => {
    // Set generating state for this message
    setChatHistory((prevHistory) => 
      prevHistory.map((msg) => 
        msg.id === messageId
          ? { 
              ...msg, 
              payload: { ...msg.payload, isGeneratingComments: true } 
            }
          : msg
      )
    )

    try {
      // Get the count from state or use the provided count or default to 3
      const commentCount = count || postCommentCounts[messageId] || 3
      
      // Prepare the API request
      const requestBody = {
        title: context.platform || "Post",
        content: postContent,
        link: "",
        persona: selectedPersona !== "default" ? selectedPersona : "general",
        keywords: context.keywords || "",
        count: commentCount,
        provider: provider,
        model: activeModel,
        apiKey: activeKeyId || undefined,
      }

      // Call the comment generation API
      const response = await fetch("/api/comment-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate comments")
      }

      const data = await response.json()

      // Update the message with generated comments
      setChatHistory((prevHistory) => 
        prevHistory.map((msg) => 
          msg.id === messageId
            ? { 
                ...msg, 
                payload: { 
                  ...msg.payload, 
                  comments: data.comments,
                  isGeneratingComments: false 
                } 
              }
            : msg
        )
      )

      toast({
        title: "Comments Generated",
        description: `${data.comments.length} comments created successfully`,
      })
    } catch (error) {
      console.error("Error generating comments:", error)
      
      // Clear generating state on error
      setChatHistory((prevHistory) => 
        prevHistory.map((msg) => 
          msg.id === messageId
            ? { 
                ...msg, 
                payload: { ...msg.payload, isGeneratingComments: false } 
              }
            : msg
        )
      )

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate comments",
        variant: "destructive",
      })
    }
  }

  const generateSourceContentComments = async (count: number = 5) => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please provide source content before generating comments",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingSourceComments(true)

    try {
      // Prepare the API request
      const requestBody = {
        title: context.platform || "Source Content",
        content: content,
        link: "",
        persona: selectedPersona !== "default" ? selectedPersona : "general",
        keywords: context.keywords || "",
        count: count, // Use the provided count parameter
        provider: provider,
        model: activeModel,
        apiKey: activeKeyId || undefined,
      }

      // Call the comment generation API
      const response = await fetch("/api/comment-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate comments")
      }

      const data = await response.json()

      // Update source comments
      setSourceComments(data.comments)

      toast({
        title: "Comments Generated",
        description: `${data.comments.length} comments created from source content`,
      })
    } catch (error) {
      console.error("Error generating source comments:", error)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate comments",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSourceComments(false)
    }
  }

  const handleChatInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const renderAssistantMessage = (message: ChatMessage) => {
    if (message.status === "error") {
      // Find the last failed message (most recent error)
      const errorMessages = chatHistory.filter(msg => msg.author === "assistant" && msg.status === "error")
      const lastErrorMessage = errorMessages.length > 0 ? errorMessages[errorMessages.length - 1] : null
      const isLastError = lastErrorMessage?.id === message.id
      
      return (
        <div className="space-y-3">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {message.error || "The assistant could not complete this request."}
          </div>
          {isLastError && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => retryGeneration(message.id)}
              className="rounded-full border-border/70"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RotateCcw className="size-4" />
              )}
              <span className="text-xs font-medium">Retry</span>
            </Button>
          )}
        </div>
      )
    }

    switch (message.mode) {
      case "post": {
        const post = message.payload?.post || message.content
        const isEditing = editingPostId === message.id
        const displayContent = isEditing ? editedPostContent : post
        const comments = message.payload?.comments || []
        const isGeneratingComments = message.payload?.isGeneratingComments || false
        
        return (
          <div className="space-y-3">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={displayContent}
                  onChange={(e) => setEditedPostContent(e.target.value)}
                  className="min-h-[120px] text-sm font-mono"
                  placeholder="Edit your post with Markdown..."
                />
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                  <span className="font-semibold">Formatting:</span> **bold**, *italic*, ## heading, - bullet points
                </div>
              </div>
            ) : (
              // Check if content has Unicode bold or Markdown syntax
              /[\u{1D5D4}-\u{1D5EF}\u{1D5EE}-\u{1D607}\u{1D7CE}-\u{1D7D7}]/u.test(displayContent) ? (
                // Unicode formatted - display as plain text with preserved formatting
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {displayContent}
                </div>
              ) : (
                // Markdown formatted - render with ReactMarkdown
                <div className="text-sm text-foreground prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 mt-4 text-foreground" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3 text-foreground" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3 text-foreground" {...props} />,
                      h4: ({node, ...props}) => <h4 className="text-sm font-bold mb-1 mt-2 text-foreground" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 text-foreground" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="text-foreground" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/40 pl-3 italic my-2 text-muted-foreground" {...props} />,
                      code: ({node, inline, ...props}: any) => inline 
                        ? <code className="bg-muted rounded px-1 py-0.5 text-xs font-mono text-foreground" {...props} />
                        : <code className="block bg-muted rounded p-2 text-xs font-mono overflow-x-auto my-2 text-foreground" {...props} />,
                      a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
                      hr: ({node, ...props}) => <hr className="my-3 border-border" {...props} />,
                    }}
                  >
                    {displayContent}
                  </ReactMarkdown>
                </div>
              )
            )}
            
            {/* Display generated comments */}
            {comments.length > 0 && (
              <div className="mt-4 space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="size-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                    Generated Comments ({comments.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {comments.map((comment: string, index: number) => (
                    <div key={index} className="rounded-lg border border-border/40 bg-background/80 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-foreground flex-1">{comment}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(comment, `comment-${message.id}-${index}`)}
                          className="h-6 w-6 p-0 shrink-0"
                        >
                          {copiedStates[`comment-${message.id}-${index}`] ? (
                            <Check className="size-3" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => savePostEdits(message.id)}
                    className="rounded-full border-border/70 flex-1"
                  >
                    <Save className="size-4" />
                    <span className="text-xs font-medium">Save changes</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelPostEdits}
                    className="rounded-full border-border/70 flex-1"
                  >
                    <X className="size-4" />
                    <span className="text-xs font-medium">Cancel</span>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(post, `post-${message.id}`)}
                      className="rounded-full border-border/70 flex-1"
                    >
                      {copiedStates[`post-${message.id}`] ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                      <span className="text-xs font-medium">Copy post</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditingPost(message.id, post)}
                      className="rounded-full border-border/70 flex-1"
                    >
                      <Edit className="size-4" />
                      <span className="text-xs font-medium">Edit post</span>
                    </Button>
                  </div>
                  
                  {/* Comment generation section with count selector */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={postCommentCounts[message.id] || 3}
                      onChange={(e) => setPostCommentCounts(prev => ({
                        ...prev,
                        [message.id]: Math.max(1, Math.min(10, parseInt(e.target.value) || 3))
                      }))}
                      className="h-8 w-16 text-xs"
                      disabled={isGeneratingComments}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateComments(message.id, post)}
                      disabled={isGeneratingComments}
                      className="rounded-full border-border/70 flex-1"
                    >
                      {isGeneratingComments ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <MessageSquare className="size-4" />
                      )}
                      <span className="text-xs font-medium">
                        {comments.length > 0 ? "Regenerate Comments" : "Generate Comments"}
                      </span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }
      case "carousel": {
        const slides = message.payload?.carouselSlides || []
        const isEditing = editingCarouselId === message.id
        const displaySlides = isEditing ? editedCarouselSlides : slides
        
        return (
          <div className="space-y-4">
            <ol className="space-y-3">
              {displaySlides.map((slide, index) => (
                <li key={`${message.id}-slide-${index}`} className="space-y-2 rounded-2xl border border-border/60 bg-background/70 p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/70">
                    Slide {index + 1}
                  </span>
                  {isEditing ? (
                    <Textarea
                      value={slide}
                      onChange={(e) => updateCarouselSlide(index, e.target.value)}
                      className="min-h-[80px] text-sm"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-foreground">{slide}</p>
                  )}
                </li>
              ))}
            </ol>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveCarouselEdits(message.id)}
                    className="rounded-full border-border/70 flex-1"
                  >
                    <Save className="size-4" />
                    <span className="text-xs font-medium">Save changes</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelCarouselEdits}
                    className="rounded-full border-border/70 flex-1"
                  >
                    <X className="size-4" />
                    <span className="text-xs font-medium">Cancel</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(slides.join("\n\n"), `carousel-${message.id}`)}
                    className="rounded-full border-border/70 flex-1"
                  >
                    {copiedStates[`carousel-${message.id}`] ? <Check className="size-4" /> : <Copy className="size-4" />}
                    <span className="text-xs font-medium">Copy slides</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditingCarousel(message.id, slides)}
                    className="rounded-full border-border/70 flex-1"
                  >
                    <Edit className="size-4" />
                    <span className="text-xs font-medium">Edit slides</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      }
      case "diagram": {
        const diagram = message.payload?.mermaidDiagram || message.content
        const isCodeVisible = collapsedDiagrams[message.id] === true // Default to collapsed
        const isEditing = editingDiagramId === message.id
        const displayDiagram = isEditing ? editedDiagramContent : diagram
        
        return (
          <div className="space-y-4">
            {/* Mermaid Preview */}
            {!isEditing && (
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-[0_12px_40px_-32px_rgba(15,23,42,0.6)]">
                <MermaidPreview chart={displayDiagram} />
              </div>
            )}
            
            {/* Collapsible Code Section */}
            <Collapsible open={isCodeVisible} onOpenChange={() => toggleDiagramCode(message.id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-between rounded-lg hover:bg-muted/50"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {isCodeVisible ? "Hide" : "Show"} Mermaid Code
                  </span>
                  {isCodeVisible ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                {isEditing ? (
                  <Textarea
                    value={displayDiagram}
                    onChange={(e) => setEditedDiagramContent(e.target.value)}
                    className="min-h-[200px] text-xs font-mono"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap rounded-lg border border-border/40 bg-muted/30 p-4 text-xs font-mono text-foreground">
                    {displayDiagram}
                  </pre>
                )}
              </CollapsibleContent>
            </Collapsible>
            
            <div className="flex flex-wrap items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveDiagramEdits(message.id)}
                    className="rounded-full border-border/70"
                  >
                    <Save className="size-4" />
                    <span className="text-xs font-medium">Save changes</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelDiagramEdits}
                    className="rounded-full border-border/70"
                  >
                    <X className="size-4" />
                    <span className="text-xs font-medium">Cancel</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(diagram, `diagram-${message.id}`)}
                    className="rounded-full border-border/70"
                  >
                    {copiedStates[`diagram-${message.id}`] ? <Check className="size-4" /> : <Copy className="size-4" />}
                    <span className="text-xs font-medium">Copy Mermaid</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditingDiagram(message.id, diagram)}
                    className="rounded-full border-border/70"
                  >
                    <Edit className="size-4" />
                    <span className="text-xs font-medium">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openInMermaidLive(diagram)}
                    className="rounded-full border border-transparent hover:border-border/60"
                  >
                    Open in Mermaid Live
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      }
      case "image": {
        const imageUrl = message.payload?.imageUrl || message.content
        const hasConfig = !!message.payload?.imageConfig
        return (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/60 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.65)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Generated visual" className="h-auto w-full object-cover" />
              {hasConfig && (
                <div className="absolute top-3 right-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => regenerateImage(message.id)}
                    disabled={isProcessing}
                    className="rounded-full shadow-lg bg-background/90 hover:bg-background backdrop-blur-sm border border-border/60"
                    title="Regenerate with same settings"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <RotateCcw className="size-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(imageUrl, `image-${message.id}`)}
                className="rounded-full border-border/70 flex-1"
              >
                {copiedStates[`image-${message.id}`] ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span className="text-xs font-medium">Copy URL</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadImage(imageUrl)}
                className="rounded-full border-border/70 flex-1"
              >
                <Download className="size-4" />
                <span className="text-xs font-medium">Download</span>
              </Button>
            </div>
          </div>
        )
      }
      default:
        return <p className="text-sm text-foreground">{message.content}</p>
    }
  }

  const openInMermaidLive = (diagram: string) => {
    if (diagram) {
      const encodedDiagram = btoa(unescape(encodeURIComponent(diagram)))
      const url = `https://mermaid.live/edit#base64:${encodedDiagram}`
      window.open(url, "_blank")
    }
  }

  const renderModeConfiguration = () => {
    if (!modeConfigTarget) {
      return null
    }

    switch (modeConfigTarget) {
      case "post":
        return (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <PostContextForm
              context={context}
              onContextChange={setContext}
              selectedPersona={selectedPersona}
              onPersonaChange={setSelectedPersona}
              onShowPersonaDialog={() => setShowPersonaDialog(true)}
              selectedBrandContext={selectedContext}
              onBrandContextChange={setSelectedContext}
              onShowContextDialog={() => setShowContextDialog(true)}
            />
            <SourceContentInput 
              content={content} 
              onContentChange={setContent}
              platform={context.platform}
              onSuggestionSelect={handlePostSuggestionSelect}
              sourceComments={sourceComments}
              isGeneratingSourceComments={isGeneratingSourceComments}
              onGenerateComments={generateSourceContentComments}
              onCopyComment={(comment, index) => copyToClipboard(comment, `source-comment-${index}`)}
              copiedCommentStates={copiedStates}
            />
          </div>
        )
      case "carousel":
        return (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <PostContextForm
                context={context}
                onContextChange={setContext}
                selectedPersona={selectedPersona}
                onPersonaChange={setSelectedPersona}
                onShowPersonaDialog={() => setShowPersonaDialog(true)}
                selectedBrandContext={selectedContext}
                onBrandContextChange={setSelectedContext}
                onShowContextDialog={() => setShowContextDialog(true)}
              />
              <SourceContentInput 
                content={content} 
                onContentChange={setContent}
                platform={context.platform}
                onSuggestionSelect={handlePostSuggestionSelect}
                sourceComments={sourceComments}
                isGeneratingSourceComments={isGeneratingSourceComments}
                onGenerateComments={generateSourceContentComments}
                onCopyComment={(comment, index) => copyToClipboard(comment, `source-comment-${index}`)}
                copiedCommentStates={copiedStates}
              />
            </div>
            <LinkedInCarouselConfig carouselSettings={carouselSettings} onCarouselSettingsChange={setCarouselSettings} />
          </div>
        )
      case "diagram":
        return (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <DiagramConfiguration
              diagramType={diagramType}
              onDiagramTypeChange={setDiagramType}
              allProviders={allProviders}
              activeProvider={activeProvider}
              activeModel={activeModel}
              provider={provider}
              onShowAPIKeyDialog={() => setShowAPIKeyDialog(true)}
              onProviderChange={handleProviderChange}
            />
            <DiagramContentInput 
              diagramContent={diagramContent} 
              onDiagramContentChange={setDiagramContent}
              diagramType={diagramType}
              onSuggestionSelect={handleDiagramSuggestionSelect}
            />
          </div>
        )
      case "image":
        return (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-provider" className="text-sm font-semibold text-foreground">
                  Image provider
                </Label>
                <Select value={imageConfig.provider} onValueChange={(value) => updateImageConfig("provider", value)}>
                  <SelectTrigger id="image-provider" className="h-11 rounded-xl border-border/60 bg-background/80">
                    <SelectValue placeholder="Choose provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageProviderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="image-model" className="text-sm font-semibold text-foreground">
                    Model name
                  </Label>
                  <Input
                    id="image-model"
                    value={imageConfig.model}
                    onChange={(event) => updateImageConfig("model", event.target.value)}
                    placeholder="e.g. flux-pro-1.1"
                    className="rounded-xl border-border/60 bg-background/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-size" className="text-sm font-semibold text-foreground">
                    Output size
                  </Label>
                  <Select value={imageConfig.size} onValueChange={(value) => updateImageConfig("size", value)}>
                    <SelectTrigger id="image-size" className="h-11 rounded-xl border-border/60 bg-background/80">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="image-width" className="text-sm font-semibold text-foreground">
                    Custom width (px)
                  </Label>
                  <Input
                    id="image-width"
                    value={imageConfig.customWidth ?? ""}
                    onChange={(event) => updateImageConfig("customWidth", event.target.value)}
                    placeholder="1024"
                    className="rounded-xl border-border/60 bg-background/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-height" className="text-sm font-semibold text-foreground">
                    Custom height (px)
                  </Label>
                  <Input
                    id="image-height"
                    value={imageConfig.customHeight ?? ""}
                    onChange={(event) => updateImageConfig("customHeight", event.target.value)}
                    placeholder="1024"
                    className="rounded-xl border-border/60 bg-background/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-style" className="text-sm font-semibold text-foreground">
                  Visual style
                </Label>
                <Select value={imageConfig.style} onValueChange={(value) => updateImageConfig("style", value)}>
                  <SelectTrigger id="image-style" className="h-11 rounded-xl border-border/60 bg-background/80">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageStyleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {imageConfig.style === "custom" ? (
                <div className="space-y-2">
                  <Label htmlFor="image-custom-style" className="text-sm font-semibold text-foreground">
                    Describe your custom style
                  </Label>
                  <Input
                    id="image-custom-style"
                    value={imageConfig.customStyle ?? ""}
                    onChange={(event) => updateImageConfig("customStyle", event.target.value)}
                    placeholder="Cinematic lighting, editorial photography"
                    className="rounded-xl border-border/60 bg-background/80"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-title" className="text-sm font-semibold text-foreground">
                  Campaign or asset title
                </Label>
                <Input
                  id="image-title"
                  value={imageConfig.title}
                  onChange={(event) => updateImageConfig("title", event.target.value)}
                  placeholder="Product launch visual"
                  className="rounded-xl border-border/60 bg-background/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-content" className="text-sm font-semibold text-foreground">
                  Source content or creative brief
                </Label>
                <Textarea
                  id="image-content"
                  value={imageConfig.content}
                  onChange={(event) => updateImageConfig("content", event.target.value)}
                  placeholder="Describe the scene, subject, and any brand elements you need." 
                  className="min-h-[140px] rounded-2xl border-border/60 bg-background/80 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-prompt" className="text-sm font-semibold text-foreground">
                  Additional prompt details
                </Label>
                <Textarea
                  id="image-prompt"
                  value={imageConfig.customPrompt ?? ""}
                  onChange={(event) => updateImageConfig("customPrompt", event.target.value)}
                  placeholder="Add lighting, mood, camera lens, or compositional cues."
                  className="min-h-[120px] rounded-2xl border-border/60 bg-background/80 text-sm"
                />
              </div>

              <Button
                onClick={async () => {
                  if (!imageConfig.customPrompt && !imageConfig.content) {
                    toast({
                      title: "Missing Prompt",
                      description: "Please provide additional prompt details or source content",
                      variant: "destructive",
                    })
                    return
                  }

                  setModeConfigTarget(null) // Close dialog
                  
                  // Generate image with the configured settings
                  const prompt = imageConfig.title || "Generate image"
                  await handleSendMessageWithPrompt(prompt)
                }}
                disabled={isProcessing}
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-background px-4 py-6 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl sm:h-[520px] sm:w-[520px]" />
          <div className="absolute left-[85%] top-[42%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute left-[-8%] top-[58%] h-[320px] w-[320px] rounded-full bg-secondary/30 blur-3xl sm:h-[360px] sm:w-[360px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1300px]">
          <div className="surface-panel overflow-hidden px-6 py-10 sm:px-12 sm:py-12 lg:px-16">
            <div className="noise-layer" aria-hidden="true" />
            <div className="flex flex-col gap-16">
              <Header />

              <section className="flex flex-col gap-10" aria-labelledby="creative-workbench-heading">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/75">Creative Workbench</p>
                    <h2 id="creative-workbench-heading" className="text-2xl font-semibold text-foreground sm:text-3xl">
                      Design every format from one intelligent canvas
                    </h2>
                    <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                      Shift seamlessly between post copy, sequenced carousels, and explainer diagrams without losing persona fidelity or context memory.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {highlightMetrics.map((metric) => (
                      <div
                        key={metric.title}
                        className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.55)] backdrop-blur"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">{metric.title}</p>
                        <p className="mt-3 text-2xl font-semibold text-foreground">{metric.value}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
                  <aside className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-secondary/55 p-6 backdrop-blur">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/75">Modes</p>
                        <p className="text-sm text-muted-foreground">
                          Choose how the assistant should respond. You can switch modes mid-conversation.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {(Object.entries(workbenchModes) as Array<[WorkbenchMode, ModeOption]>).map(([modeId, config]) => {
                          const isActive = activeMode === modeId
                          const Icon = config.icon

                          return (
                            <button
                              key={modeId}
                              type="button"
                              onClick={() => setActiveMode(modeId)}
                              className={cn(
                                "group flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-shadow cursor-pointer",
                                isActive
                                  ? "border-border/70 bg-background/95 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.7)]"
                                  : "border-transparent bg-background/30 hover:border-border/60 hover:bg-background/55"
                              )}
                            >
                              <span className={cn(
                                "mt-0.5 inline-flex size-10 items-center justify-center rounded-xl border bg-secondary/50 text-primary",
                                isActive ? "border-primary/50 bg-primary/15" : "border-border/60"
                              )}>
                                <Icon className="size-4" aria-hidden="true" />
                              </span>
                              <span className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-foreground">{config.label}</span>
                                <span className="text-xs text-muted-foreground">{config.description}</span>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                                  {config.badge}
                                </span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => setModeConfigTarget(activeMode)}
                        className="w-full justify-start gap-2 rounded-2xl border-border/70 text-sm"
                      >
                        <Settings2 className="size-4" />
                        Configure {workbenchModes[activeMode].badge}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsGlobalConfigOpen(true)}
                        className="w-full justify-start gap-2 rounded-2xl border border-transparent text-sm hover:border-border/60"
                      >
                        <Sparkles className="size-4 text-primary" />
                        Open global settings
                      </Button>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/80">
                        Session Context
                      </p>
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold text-foreground">Provider:</span> {activeProvider.name}
                          {activeModel ? ` · ${activeModel}` : ""}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Persona:</span>{" "}
                          {selectedPersona && selectedPersona !== "default" ? selectedPersona : "Default"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Brand Context:</span>{" "}
                          {selectedContext || "Not attached"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Diagram Type:</span> {diagramType}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Image Style:</span> {imageConfig.style}
                        </p>
                      </div>
                    </div>
                  </aside>

                  <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-background/75 p-4 shadow-[0_24px_65px_-42px_rgba(15,23,42,0.7)] backdrop-blur sm:p-6">
                    <div
                      ref={chatContainerRef}
                      className="chat-scroll-area flex h-[500px] flex-col gap-4 overflow-y-auto pr-1 sm:h-[600px] sm:pr-2"
                    >
                      {chatHistory.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-secondary/40 p-8 text-center text-muted-foreground">
                          <Sparkles className="size-6 text-primary" />
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground">No messages yet</p>
                            <p className="text-xs text-muted-foreground">
                              Ask for a {workbenchModes[activeMode].label.toLowerCase()} or paste source material to transform.
                            </p>
                          </div>
                        </div>
                      ) : (
                        chatHistory.map((message) => {
                          const isUser = message.author === "user"
                          const modeConfig = workbenchModes[message.mode]

                          return (
                            <div key={message.id} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}> 
                              <div
                                className={cn(
                                  "max-w-[92%] rounded-2xl border p-4 shadow-sm sm:max-w-[75%]",
                                  isUser
                                    ? "border-primary/40 bg-primary text-primary-foreground shadow-[0_18px_48px_-32px_rgba(99,102,241,0.75)]"
                                    : "border-border/60 bg-card/80 text-foreground backdrop-blur"
                                )}
                              >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <span className={cn(
                                    "text-[11px] font-semibold uppercase tracking-[0.32em]",
                                    isUser ? "text-primary-foreground/80" : "text-muted-foreground/80"
                                  )}>
                                    {isUser ? "You" : modeConfig.badge}
                                  </span>
                                  <span className={cn(
                                    "text-[10px] font-medium uppercase tracking-[0.24em]",
                                    isUser ? "text-primary-foreground/70" : "text-muted-foreground/60"
                                  )}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                {isUser ? (
                                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary-foreground/95">
                                    {message.content}
                                  </p>
                                ) : (
                                  <div className="space-y-3 text-foreground">{renderAssistantMessage(message)}</div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}

                      {isProcessing ? (
                        <div className="flex w-full justify-start">
                          <div className="max-w-[75%] rounded-2xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground shadow-sm">
                            <div className="flex items-center gap-2">
                              <Loader2 className="size-4 animate-spin text-primary" />
                              <span>
                                Crafting your {workbenchModes[activeMode].badge.toLowerCase()}…
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-3 rounded-2xl border border-border/60 bg-secondary/50 p-4 shadow-inner backdrop-blur">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <Textarea
                          value={chatInput}
                          onChange={(event) => setChatInput(event.target.value)}
                          onKeyDown={handleChatInputKeyDown}
                          placeholder={`Ask for a ${workbenchModes[activeMode].label.toLowerCase()}…`}
                          className="min-h-[120px] flex-1 resize-none rounded-2xl border-none bg-background/80 text-sm leading-relaxed shadow-[inset_0_1px_0_rgba(148,163,184,0.35)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Button
                          type="button"
                          onClick={handleSendMessage}
                          disabled={isProcessing || chatInput.trim().length === 0}
                          className="h-12 rounded-full px-6 text-sm font-semibold shadow-[0_18px_42px_-28px_rgba(15,23,42,0.55)]"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Working
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 size-4" />
                              Send
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-foreground">
                            <Sparkles className="size-3 text-primary" />
                            {activeProvider.name}
                          </span>
                          {selectedPersona && selectedPersona !== "default" ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-foreground">
                              <Bot className="size-3 text-amber-500" />
                              Persona: {selectedPersona}
                            </span>
                          ) : null}
                          {selectedContext ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-foreground">
                              <MessageSquare className="size-3 text-sky-500" />
                              Context: {selectedContext}
                            </span>
                          ) : null}
                          {/* Use Content Toggle - only show if content exists */}
                          {((activeMode === "diagram" && diagramContent.trim()) || 
                            (activeMode === "image" && imageConfig.content.trim()) ||
                            ((activeMode === "post" || activeMode === "carousel") && content.trim())) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUseContent(!useContent)}
                              className={cn(
                                "h-6 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] transition-all",
                                useContent 
                                  ? "border border-green-500/60 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20" 
                                  : "border border-border/60 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <FileText className="mr-1.5 size-3" />
                              {useContent ? "Content ON" : "Content OFF"}
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModeConfigTarget(activeMode)}
                            className="h-7 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
                          >
                            <Settings2 className="mr-1.5 size-3.5" />
                            Mode Config
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsGlobalConfigOpen(true)}
                            className="h-7 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
                          >
                            <Sparkles className="mr-1.5 size-3.5 text-primary" />
                            Global
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <Footer />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={modeConfigTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setModeConfigTarget(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl border-border/70 bg-background/95 sm:max-w-5xl">
          {modeConfigTarget ? (
            <>
              <DialogHeader>
                <DialogTitle>Configure {workbenchModes[modeConfigTarget].label}</DialogTitle>
                <DialogDescription>
                  Fine-tune inputs, context, and constraints for the {workbenchModes[modeConfigTarget].badge.toLowerCase()} workflow.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6 py-1">{renderModeConfiguration()}</div>
              </ScrollArea>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isGlobalConfigOpen} onOpenChange={setIsGlobalConfigOpen}>
        <DialogContent className="max-w-3xl border-border/70 bg-background/95">
          <DialogHeader>
            <DialogTitle>Global Workbench Settings</DialogTitle>
            <DialogDescription>
              Control AI providers, saved personas, and brand contexts for every generation mode.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 py-1">
              <AIProviderSelection
                allProviders={allProviders}
                activeProvider={activeProvider}
                activeModel={activeModel}
                provider={provider}
                onShowAPIKeyDialog={() => setShowAPIKeyDialog(true)}
                onProviderChange={handleProviderChange}
              />

              <div className="rounded-2xl border border-border/60 bg-secondary/50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">Active persona:</span>{" "}
                      {selectedPersona && selectedPersona !== "default" ? selectedPersona : "Default"}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Active context:</span>{" "}
                      {selectedContext || "Not attached"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsGlobalConfigOpen(false)
                        setShowPersonaDialog(true)
                      }}
                      className="rounded-full border-border/70 text-xs font-semibold"
                    >
                      Manage personas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsGlobalConfigOpen(false)
                        setShowContextDialog(true)
                      }}
                      className="rounded-full border-border/70 text-xs font-semibold"
                    >
                      Manage contexts
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <APIKeyDialog
        open={showAPIKeyDialog}
        onOpenChange={setShowAPIKeyDialog}
        providers={allProviders}
        onKeyAdded={handleKeyAdded}
      />
      <PersonaTrainingDialog
        open={showPersonaDialog}
        onOpenChange={(open) => {
          setShowPersonaDialog(open)
          // Refresh personas when dialog closes
          if (!open) {
            // Trigger personas refresh
            window.dispatchEvent(new Event("personas-updated"))
          }
        }}
        onPersonaAdded={(personaName) => {
          setSelectedPersona(personaName)
          // Trigger personas refresh
          window.dispatchEvent(new Event("personas-updated"))
          toast({
            title: "Persona Added",
            description: `${personaName} persona is now selected for content generation.`,
          })
        }}
        currentPersona={selectedPersona !== "default" ? selectedPersona : undefined}
      />
      <ContextManagerDialog
        open={showContextDialog}
        onOpenChange={(open) => {
          setShowContextDialog(open)
          // Refresh contexts when dialog closes
          if (!open) {
            // Trigger contexts refresh
            window.dispatchEvent(new Event("contexts-updated"))
          }
        }}
        onContextAdded={(contextName) => {
          setSelectedContext(contextName)
          // Trigger contexts refresh
          window.dispatchEvent(new Event("contexts-updated"))
          toast({
            title: "Context Added",
            description: `${contextName} context is now selected for content generation.`,
          })
        }}
        currentContext={selectedContext || undefined}
      />
      <Analytics />
    </>
  )
}
