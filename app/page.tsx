"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, Zap, Brain, BarChart3Icon as Diagram3 } from 'lucide-react'
import { generatePost, generateContentDiagram } from "./actions/generate-post"
import { useToast } from "@/hooks/use-toast"
import { Analytics } from "@vercel/analytics/react"
import { APIKeyDialog } from "@/components/api-key-dialog"
import { apiKeyManager, type APIProvider } from "@/lib/api-key-manager"
import { Bot, Cpu } from 'lucide-react'

// Import all the new components
import { Header } from "@/components/header"
import { PostContextForm } from "@/components/post-context-form"
import { SourceContentInput } from "@/components/source-content-input"
import { GeneratedPostDisplay } from "@/components/generated-post-display"
import { AIProviderSelection } from "@/components/ai-provider-selection"
import { DiagramConfiguration } from "@/components/diagram-configuration"
import { DiagramContentInput } from "@/components/diagram-content-input"
import { GeneratedDiagramDisplay } from "@/components/generated-diagram-display"
import { MermaidResources } from "@/components/mermaid-resources"
import { Footer } from "@/components/footer"

// Define all providers including the new ones
const allProviders: APIProvider[] = [
  {
    id: "groq",
    name: "GROQ",
    description: "Ultra-fast inference with excellent performance for creative content generation",
    icon: <Zap className="h-4 w-4 text-orange-600" />,
    model: "llama-3.3-70b-versatile",
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
    model: "Claude 3.5 Sonnet",
    requiresKey: true,
    keyPlaceholder: "sk-ant-...",
    keyValidation: (key: string) => key.startsWith("sk-ant-") && key.length > 20,
    defaultModels: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"],
    supportsCustomModels: true,
  },
]

interface PostContext {
  platform: string
  style: string
  keywords: string
}

export default function ContentPostingPlatform() {
  const [context, setContext] = useState<PostContext>({
    platform: "",
    style: "",
    keywords: "",
  })
  const [content, setContent] = useState("")
  const [diagramContent, setDiagramContent] = useState("")
  const [diagramType, setDiagramType] = useState("flowchart")
  const [provider, setProvider] = useState<"groq" | "gemini" | "openai" | "anthropic">("groq")
  const [activeProvider, setActiveProvider] = useState<APIProvider>(allProviders[0])
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null)
  const [activeModel, setActiveModel] = useState<string>("")
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<string>("")
  const [mermaidDiagram, setMermaidDiagram] = useState<string>("")
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  // Load saved data on mount
  useEffect(() => {
    const savedContext = localStorage.getItem("postContext")
    const savedContent = localStorage.getItem("postContent")
    const savedDiagramContent = localStorage.getItem("diagramContent")

    if (savedContext) {
      try {
        const parsed = JSON.parse(savedContext)
        setContext({
          platform: parsed.platform || "",
          style: parsed.style || "",
          keywords: parsed.keywords || "",
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
  }, [])

  useEffect(() => {
    // Load saved provider and key
    const savedProvider = localStorage.getItem("activeProvider")
    const savedKeyId = localStorage.getItem("activeKeyId")
    const savedModel = localStorage.getItem("activeModel")
    
    if (savedProvider) {
      const providerInfo = allProviders.find(p => p.id === savedProvider)
      if (providerInfo) {
        setProvider(savedProvider as any)
        setActiveProvider(providerInfo)
        if (savedKeyId && providerInfo.requiresKey) {
          setActiveKeyId(savedKeyId)
        }
        if (savedModel) {
          setActiveModel(savedModel)
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

  // Helper functions
  const handleProviderChange = (providerId: string, keyId?: string) => {
    const providerInfo = allProviders.find(p => p.id === providerId)
    if (!providerInfo) return

    setProvider(providerId as any)
    setActiveProvider(providerInfo)
    
    if (providerInfo.requiresKey && keyId) {
      setActiveKeyId(keyId)
      const models = apiKeyManager.getAPIKeyModels(keyId)
      if (models.length > 0) {
        setActiveModel(models[0])
      }
    } else if (!providerInfo.requiresKey) {
      setActiveKeyId(null)
      setActiveModel(providerInfo.model)
    }

    // Save to localStorage
    localStorage.setItem("activeProvider", providerId)
    if (keyId) localStorage.setItem("activeKeyId", keyId)
    if (providerInfo.model) localStorage.setItem("activeModel", providerInfo.model)
  }

  const handleKeyAdded = (providerId: string, keyId: string) => {
    handleProviderChange(providerId, keyId)
  }

  const getActiveApiKey = () => {
    return activeKeyId ? apiKeyManager.getAPIKey(activeKeyId) : null
  }

  const handleGenerate = async () => {
    if (!context.platform || !context.style || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in platform, style, and content fields.",
        variant: "destructive",
      })
      return
    }

    if (activeProvider.requiresKey && !activeKeyId) {
      toast({
        title: "API Key Required",
        description: `Please add an API key for ${activeProvider.name}`,
        variant: "destructive",
      })
      setShowAPIKeyDialog(true)
      return
    }

    setIsGenerating(true)

    try {
      const result = await generatePost({
        platform: context.platform,
        style: context.style,
        keywords: context.keywords,
        content: content,
        provider: provider,
        apiKey: getActiveApiKey() || undefined,
        model: activeModel || undefined,
      })

      if (result.success && result.post) {
        setGeneratedPost(result.post)
        toast({
          title: "Post Generated!",
          description: `Successfully generated ${context.platform} post using ${activeProvider.name}.`,
        })
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate post.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateDiagram = async () => {
    if (!diagramContent.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content to generate a diagram.",
        variant: "destructive",
      })
      return
    }

    if (activeProvider.requiresKey && !activeKeyId) {
      toast({
        title: "API Key Required",
        description: `Please add an API key for ${activeProvider.name}`,
        variant: "destructive",
      })
      setShowAPIKeyDialog(true)
      return
    }

    setIsGeneratingDiagram(true)

    try {
      const result = await generateContentDiagram({
        content: diagramContent,
        diagramType: diagramType,
        provider: provider,
        apiKey: getActiveApiKey() || undefined,
        model: activeModel || undefined,
      })

      if (result.success && result.diagram) {
        setMermaidDiagram(result.diagram)
        toast({
          title: "Diagram Generated!",
          description: "Mermaid diagram created successfully.",
        })
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate diagram.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDiagram(false)
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

  const openInMermaidLive = () => {
    if (mermaidDiagram) {
      // Encode the diagram for URL
      const encodedDiagram = btoa(unescape(encodeURIComponent(mermaidDiagram)))
      const url = `https://mermaid.live/edit#base64:${encodedDiagram}`
      window.open(url, "_blank")
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-200 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <Header />

          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="text-xs sm:text-sm">
                Generate Post
              </TabsTrigger>
              <TabsTrigger value="diagram" className="text-xs sm:text-sm">
                Mermaid Diagrams
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column - Input */}
                <div className="space-y-6">
                  <PostContextForm 
                    context={context} 
                    onContextChange={setContext} 
                  />
                  
                  <SourceContentInput 
                    content={content} 
                    onContentChange={setContent} 
                  />

                  <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Post
                      </>
                    )}
                  </Button>
                </div>

                {/* Right Column - Output */}
                <div className="space-y-4 sm:space-y-6">
                  <GeneratedPostDisplay
                    generatedPost={generatedPost}
                    context={context}
                    provider={provider}
                    copiedStates={copiedStates}
                    onCopy={copyToClipboard}
                  />

                  <AIProviderSelection
                    allProviders={allProviders}
                    activeProvider={activeProvider}
                    activeModel={activeModel}
                    provider={provider}
                    onShowAPIKeyDialog={() => setShowAPIKeyDialog(true)}
                    onProviderChange={handleProviderChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diagram" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column - Input */}
                <div className="space-y-4 sm:space-y-6">
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
                  />

                  <Button onClick={handleGenerateDiagram} disabled={isGeneratingDiagram} className="w-full" size="lg">
                    {isGeneratingDiagram ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Diagram...
                      </>
                    ) : (
                      <>
                        <Diagram3 className="mr-2 h-4 w-4" />
                        Generate Mermaid Diagram
                      </>
                    )}
                  </Button>
                </div>

                {/* Right Column - Output */}
                <div className="space-y-4 sm:space-y-6">
                  <GeneratedDiagramDisplay
                    mermaidDiagram={mermaidDiagram}
                    diagramType={diagramType}
                    provider={provider}
                    copiedStates={copiedStates}
                    onCopy={copyToClipboard}
                    onOpenInMermaidLive={openInMermaidLive}
                  />

                  <MermaidResources />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Footer />
        </div>
      </div>

      <APIKeyDialog
        open={showAPIKeyDialog}
        onOpenChange={setShowAPIKeyDialog}
        providers={allProviders}
        onKeyAdded={handleKeyAdded}
      />
      <Analytics />
    </>
  )
}
