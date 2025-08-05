"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  Loader2,
  Sparkles,
  Zap,
  Brain,
  BarChart3Icon as Diagram3,
  ExternalLink,
  BookOpen,
  Github,
  Check,
  Linkedin,
  Twitter,
  Globe,
  Heart,
} from "lucide-react"
import { generatePost, generateContentDiagram } from "./actions/generate-post"
import { useToast } from "@/hooks/use-toast"
import { Analytics } from "@vercel/analytics/react"

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
  const [provider, setProvider] = useState<"groq" | "gemini">("groq")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<string>("")
  const [mermaidDiagram, setMermaidDiagram] = useState<string>("")
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

  const handleGenerate = async () => {
    if (!context.platform || !context.style || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in platform, style, and content fields.",
        variant: "destructive",
      })
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
      })

      if (result.success && result.post) {
        setGeneratedPost(result.post)
        toast({
          title: "Post Generated!",
          description: `Successfully generated ${context.platform} post using ${provider}.`,
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

    setIsGeneratingDiagram(true)

    try {
      const result = await generateContentDiagram({
        content: diagramContent,
        diagramType: diagramType,
        provider: provider,
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

  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

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

  const providerInfo = {
    groq: {
      name: "GROQ",
      description: "Lightning-fast inference with excellent performance",
      icon: Zap,
      color: "text-orange-600",
    },
    gemini: {
      name: "Gemini",
      description: "Advanced reasoning and contextual understanding",
      icon: Brain,
      color: "text-blue-600",
    },
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-violet-200 via-fuchsia-200 to-rose-200 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 px-2">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 flex items-center justify-center gap-2 mt-8 mb-4">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700" />
            <span className="hidden sm:inline">Content Generation Platform</span>
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700" />
            <span className="sm:hidden">Content Platform</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-700 px-2">
            Generate platform-specific posts with AI-powered contextual optimization
          </p>
        </div>

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
              {/* Context & Content Input */}
              <div className="space-y-6">
                {/* Context Card */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Post Context</CardTitle>
                    <CardDescription className="text-sm">
                      Define your target platform and content preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform" className="text-sm font-medium">
                        Platform
                      </Label>
                      <Select
                        value={context.platform}
                        onValueChange={(value) => setContext((prev) => ({ ...prev, platform: value }))}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="x">X (Twitter)</SelectItem>
                          <SelectItem value="reddit">Reddit</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="threads">Threads</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="style" className="text-sm font-medium">
                        Custom Style
                      </Label>
                      <Input
                        id="style"
                        placeholder="e.g., storytelling, educational, humorous..."
                        value={context.style}
                        onChange={(e) => setContext((prev) => ({ ...prev, style: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords" className="text-sm font-medium">
                        Keywords (Optional)
                      </Label>
                      <Input
                        id="keywords"
                        placeholder="e.g., AI, productivity, startup..."
                        value={context.keywords}
                        onChange={(e) => setContext((prev) => ({ ...prev, keywords: e.target.value }))}
                        className="h-10"
                      />
                      <p className="text-xs text-gray-500">Comma-separated keywords to emphasize in your post</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Input Card */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Source Content</CardTitle>
                    <CardDescription className="text-sm">
                      Paste your blog post, notes, or any content to transform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Paste your blog post, website content, notes, or any text you want to transform into a social media post..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[150px] sm:min-h-[200px] max-h-[300px] resize-none text-sm overflow-y-auto"
                    />
                  </CardContent>
                </Card>

                {/* Generation Button */}
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

              {/* Generated Post Display */}
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Generated Post</CardTitle>
                    <CardDescription className="text-sm">Your AI-generated, platform-optimized content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedPost ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
                          <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words text-gray-800 min-h-[200px] sm:min-h-[300px] max-h-[400px] resize-none text-sm overflow-y-auto">
                            {generatedPost}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(generatedPost, "post")}
                            className="flex-1 h-10"
                            variant={copiedStates.post ? "secondary" : "default"}
                          >
                            {copiedStates.post ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Copied!</span>
                                <span className="sm:hidden">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Copy Post</span>
                                <span className="sm:hidden">Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {context.platform}
                          </Badge>
                          <Badge variant="secondary" className="text-xs truncate max-w-[120px]">
                            {context.style}
                          </Badge>
                          {context.keywords && (
                            <Badge variant="outline" className="text-xs truncate max-w-[150px]">
                              Keywords: {context.keywords}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {provider}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12 text-gray-500">
                        <Sparkles className="mx-auto h-8 w-8 sm:h-12 sm:w-12 mb-4 opacity-50" />
                        <p className="text-sm sm:text-base">Your generated post will appear here</p>
                        <p className="text-xs sm:text-sm mt-2">
                          The length will be automatically optimized for your selected platform
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Provider Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Provider</CardTitle>
                    <CardDescription>Choose your preferred AI model for content generation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {Object.entries(providerInfo).map(([key, info]) => {
                        const IconComponent = info.icon
                        return (
                          <Button
                            key={key}
                            variant={provider === key ? "default" : "outline"}
                            className="h-auto p-3 flex items-center gap-3 text-left justify-start"
                            onClick={() => setProvider(key as "groq" | "gemini")}
                          >
                            <IconComponent className={`h-4 w-4 flex-shrink-0 ${info.color}`} />
                            <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                              <span className="font-semibold text-sm">{info.name}</span>
                              <span className="text-xs opacity-80 leading-tight">{info.description}</span>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diagram" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Diagram Input Section */}
              <div className="space-y-4 sm:space-y-6">
                {/* Diagram Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Diagram Configuration</CardTitle>
                    <CardDescription className="text-sm">
                      Choose diagram type and AI provider for generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="diagramType" className="text-sm font-medium">
                        Diagram Type
                      </Label>
                      <Select value={diagramType} onValueChange={setDiagramType}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select diagram type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flowchart">Flowchart</SelectItem>
                          <SelectItem value="process">Process Diagram</SelectItem>
                          <SelectItem value="workflow">Workflow</SelectItem>
                          <SelectItem value="mindmap">Mind Map</SelectItem>
                          <SelectItem value="timeline">Timeline</SelectItem>
                          <SelectItem value="hierarchy">Hierarchy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(providerInfo).map(([key, info]) => {
                        const IconComponent = info.icon
                        return (
                          <Button
                            key={key}
                            variant={provider === key ? "default" : "outline"}
                            className="h-auto p-2 flex flex-col items-center gap-1"
                            onClick={() => setProvider(key as "groq" | "gemini")}
                          >
                            <IconComponent className={`h-4 w-4 ${info.color}`} />
                            <span className="text-xs font-semibold">{info.name}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Input for Diagram */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Content for Diagram</CardTitle>
                    <CardDescription className="text-sm">
                      Describe the process, workflow, or concept you want to visualize
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Describe your process, workflow, or any content you want to turn into a diagram. For example: 'User registration process with email verification and profile setup' or 'Project management workflow from planning to deployment'..."
                      value={diagramContent}
                      onChange={(e) => setDiagramContent(e.target.value)}
                      className="min-h-[200px] max-h-[300px] resize-none text-sm overflow-y-auto"
                    />
                  </CardContent>
                </Card>

                {/* Generate Diagram Button */}
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

              {/* Diagram Output Section */}
              <div className="space-y-4 sm:space-y-6">
                {/* Generated Diagram */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Generated Mermaid Code</CardTitle>
                    <CardDescription className="text-sm">
                      Copy this code to use in documentation, GitHub, or any Mermaid-compatible platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mermaidDiagram ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border max-h-[300px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono break-words">
                            {mermaidDiagram}
                          </pre>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => copyToClipboard(mermaidDiagram, "diagram")}
                            className="flex-1 h-10"
                            variant={copiedStates.diagram ? "secondary" : "default"}
                          >
                            {copiedStates.diagram ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Copied!</span>
                                <span className="sm:hidden">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Copy Mermaid Code</span>
                                <span className="sm:hidden">Copy Code</span>
                              </>
                            )}
                          </Button>
                          <Button onClick={openInMermaidLive} variant="outline" className="flex-1 h-10 bg-transparent">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Open in Mermaid Live</span>
                            <span className="sm:hidden">Open Live</span>
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {diagramType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {provider}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12 text-gray-500">
                        <Diagram3 className="mx-auto h-8 w-8 sm:h-12 sm:w-12 mb-4 opacity-50" />
                        <p className="text-sm sm:text-base">Your Mermaid diagram will appear here</p>
                        <p className="text-xs sm:text-sm mt-2">
                          Describe your content and generate a professional diagram
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mermaid Resources */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Mermaid Resources</CardTitle>
                    <CardDescription className="text-sm">
                      Helpful links and tools for working with Mermaid diagrams
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-3 bg-transparent"
                        onClick={() => window.open("https://mermaid.live/", "_blank")}
                      >
                        <ExternalLink className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Mermaid Live Editor</div>
                          <div className="text-xs opacity-70">Create and edit diagrams online</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-3 bg-transparent"
                        onClick={() => window.open("https://mermaid.js.org/intro/", "_blank")}
                      >
                        <BookOpen className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Documentation</div>
                          <div className="text-xs opacity-70">Learn Mermaid syntax and features</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-3 bg-transparent"
                        onClick={() => window.open("https://github.com/mermaid-js/mermaid", "_blank")}
                      >
                        <Github className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">GitHub Repository</div>
                          <div className="text-xs opacity-70">Source code and examples</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 bg-white/50 backdrop-blur-sm rounded-lg">
          <div className="px-4 py-6 sm:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600">Made with love by</span>
                <span className="font-semibold text-gray-900">Rohan Sharma</span>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-600 hover:text-gray-900"
                  onClick={() => window.open("https://github.com/RS-labhub", "_blank")}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-600 hover:text-gray-900"
                  onClick={() => window.open("https://www.linkedin.com/in/rohan-sharma-9386rs/", "_blank")}
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-600 hover:text-gray-900"
                  onClick={() => window.open("https://twitter.com/rrs00179", "_blank")}
                >
                  <Twitter className="mr-2 h-4 w-4" />X (Twitter)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-600 hover:text-gray-900"
                  onClick={() => window.open("https://rohan-sharma-portfolio.vercel.app", "_blank")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Portfolio
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p className="mt-1">
                  Must check the{" "}
                  <a
                    href="https://rss-markdown-converter.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Content Generation Platform
                  </a>
                </p>
                <p className="mt-1">© 2025 Content Posting Platform.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    <Analytics />
    </>
  )
}
