"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  ImageIcon, 
  MessageSquare, 
  Sparkles, 
  Loader2,
  Wand2,
  Download,
  Copy,
  Check,
  Plus,
  RotateCcw,
  Key,
  AlertCircle
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { APIKeyDialog } from "@/components/api-key-dialog"
import { apiKeyManager } from "@/lib/api-key-manager"
import { useToast } from "@/hooks/use-toast"

interface PostToolsProps {
  post?: string
  postTitle?: string
  postLink?: string
  isLoading?: boolean
  platform?: string
}

// Image provider configurations
const IMAGE_PROVIDERS = {
  pollinations_free: {
    id: "pollinations_free",
    name: "AI Image Generator (Free)",
    requiresKey: false,
    description: "Free AI-powered image generation, no API key required",
    models: [
      { id: "turbo", label: "Turbo (Fast Generation)" },
      { id: "sdxl", label: "Higher Quality (SDXL, Slower)" },
    ],
    defaultModel: "turbo",
  },
  huggingface: {
    id: "huggingface",
    name: "Hugging Face",
    requiresKey: true,
    description: "High-quality models via Hugging Face API",
    models: [
      { id: "black-forest-labs/FLUX.1-schnell", label: "FLUX.1 Schnell (Fast & High Quality)" },
      { id: "stabilityai/stable-diffusion-xl-base-1.0", label: "SDXL Base 1.0 (High Quality)" },
    ],
    defaultModel: "black-forest-labs/FLUX.1-schnell",
  },
  free_alternatives: {
    id: "free_alternatives",
    name: "Free Alternative Services",
    requiresKey: false,
    description: "Multiple free AI image generation services",
    models: [
      { id: "flux", label: "FLUX (High Quality)" },
      { id: "sdxl", label: "SDXL (Stable Diffusion XL)" },
      { id: "playground", label: "Playground AI (Creative)" },
      { id: "craiyon", label: "Craiyon (DALL-E Mini)" },
    ],
    defaultModel: "flux",
  },
  openai: {
    id: "openai",
    name: "OpenAI DALL-E",
    requiresKey: true,
    description: "High-quality DALL-E 3 generation",
    models: [
      { id: "dall-e-3", label: "DALL-E 3" },
    ],
    defaultModel: "dall-e-3",
  },
}

const STYLE_OPTIONS = [
  { id: "none", label: "Auto-Generated (Default)" },
  { id: "realistic", label: "Realistic" },
  { id: "minimalist", label: "Minimalist" },
  { id: "cartoon", label: "Cartoon" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "watercolor", label: "Watercolor" },
  { id: "pixel_art", label: "Pixel Art" },
  { id: "custom", label: "Custom Style" },
]

const COMMENT_PERSONAS = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual Friend" },
  { id: "expert", label: "Technical Expert" },
  { id: "enthusiast", label: "Enthusiast" },
  { id: "skeptical", label: "Skeptical" },
]

export function PostTools({ post = "", postTitle = "", postLink = "", isLoading = false, platform = "general" }: PostToolsProps) {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)
  
  // Summary states
  const [summary, setSummary] = useState("")
  const [isSummarizing, setIsSummarizing] = useState(false)
  
  // Image generation states
  const [imagePrompt, setImagePrompt] = useState("")
  const [originalImagePrompt, setOriginalImagePrompt] = useState("")
  const [selectedImageProvider, setSelectedImageProvider] = useState("pollinations_free")
  const [selectedImageModel, setSelectedImageModel] = useState("turbo")
  const [selectedImageSize, setSelectedImageSize] = useState("square_large")
  const [selectedImageStyle, setSelectedImageStyle] = useState("none")
  const [customStyle, setCustomStyle] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<{
    url: string
    prompt: string
    provider: string
  } | null>(null)
  const [imageError, setImageError] = useState("")
  
  // Comment generation states
  const [selectedPersona, setSelectedPersona] = useState("professional")
  const [selectedCommentProvider, setSelectedCommentProvider] = useState("groq")
  const [commentCount, setCommentCount] = useState("3")
  const [customCommentCount, setCustomCommentCount] = useState("")
  const [isGeneratingComments, setIsGeneratingComments] = useState(false)
  const [generatedComments, setGeneratedComments] = useState<string[]>([])
  const [commentError, setCommentError] = useState("")
  
  // API Key dialog
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState(false)
  const [apiKeyDialogProviders, setApiKeyDialogProviders] = useState<any[]>([])
  
  // Copy states
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  // Auto-generate image prompt when content is available
  useEffect(() => {
    if (post && postTitle && !originalImagePrompt) {
      const autoPrompt = generateAutoImagePrompt(post, postTitle)
      setImagePrompt(autoPrompt)
      setOriginalImagePrompt(autoPrompt)
    }
  }, [post, postTitle, originalImagePrompt])

  // Handle model selection when provider changes
  useEffect(() => {
    const provider = IMAGE_PROVIDERS[selectedImageProvider as keyof typeof IMAGE_PROVIDERS]
    if (provider && provider.defaultModel) {
      setSelectedImageModel(provider.defaultModel)
    }
  }, [selectedImageProvider])

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const generateAutoImagePrompt = (content: string, title: string): string => {
    const words = content.toLowerCase().split(/\s+/)
    const techKeywords = [
      "ai", "machine learning", "blockchain", "cloud", "devops", 
      "programming", "software", "database", "api", "framework",
      "javascript", "python", "react", "node", "docker"
    ]
    
    const foundKeywords = techKeywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    )

    let basePrompt = `Create a professional blog cover image for an article titled "${title}".`
    
    if (foundKeywords.length > 0) {
      basePrompt += ` The article focuses on ${foundKeywords.slice(0, 3).join(", ")}.`
    }
    
    basePrompt += " Modern, clean design with abstract tech elements. Professional color scheme."
    
    return basePrompt
  }

  const handleGenerateSummary = async () => {
    if (!post || isSummarizing) return
    setIsSummarizing(true)
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Example summary generation
      const postLines = post.split("\n").filter(line => line.trim().length > 0)
      const firstSentences = postLines.slice(0, 2).join(" ")
      const lastSentence = postLines[postLines.length - 1]
      setSummary(`${firstSentences} [...] ${lastSentence}`)
      setIsSummarizing(false)
    }, 1500)
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError("Please enter a prompt for image generation")
      return
    }

    const provider = IMAGE_PROVIDERS[selectedImageProvider as keyof typeof IMAGE_PROVIDERS]
    if (!provider) {
      setImageError("Invalid provider selected")
      return
    }

    // Check API key requirement
    if (provider.requiresKey) {
      const configs = apiKeyManager.getConfigs(selectedImageProvider)
      if (configs.length === 0) {
        setApiKeyDialogProviders([{
          id: provider.id,
          name: provider.name,
          description: provider.description,
          icon: <ImageIcon className="w-4 h-4" />,
          model: provider.defaultModel,
          requiresKey: provider.requiresKey,
          keyPlaceholder: `Enter ${provider.name} API key`,
          keyValidation: (key: string) => key.length > 0,
        }])
        setShowAPIKeyDialog(true)
        return
      }
    }

    setIsGeneratingImage(true)
    setImageError("")

    try {
      const apiKey = provider.requiresKey 
        ? apiKeyManager.getAPIKey(apiKeyManager.getConfigs(selectedImageProvider)[0]?.id || "")
        : null

      const response = await fetch("/api/image-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: selectedImageProvider,
          prompt: imagePrompt,
          content: post,
          title: postTitle,
          size: selectedImageSize,
          model: selectedImageModel,
          apiKey,
          style: selectedImageStyle,
          customStyle: selectedImageStyle === "custom" ? customStyle : undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Image generation failed")
      }

      if (result.success) {
        setGeneratedImage({
          url: result.imageUrl,
          prompt: result.prompt,
          provider: result.provider,
        })
        toast({
          title: "Image Generated Successfully",
          description: `Generated using ${result.provider}`,
        })
      } else {
        throw new Error(result.error || "Image generation failed")
      }
    } catch (error) {
      console.error("Image generation error:", error)
      setImageError(error instanceof Error ? error.message : "Image generation failed")
      toast({
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleGenerateComments = async () => {
    if (!post) {
      setCommentError("Post content is required for comment generation")
      return
    }

    // Determine the actual count to use
    let actualCount = commentCount;
    if (commentCount === "custom") {
      const customNum = parseInt(customCommentCount);
      if (!customNum || customNum < 1 || customNum > 20) {
        setCommentError("Please enter a valid number between 1 and 20");
        return;
      }
      actualCount = customNum.toString();
    }

    setIsGeneratingComments(true)
    setCommentError("")

    try {
      const response = await fetch("/api/comment-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: selectedCommentProvider,
          content: post,
          title: postTitle,
          link: postLink,
          persona: selectedPersona,
          count: parseInt(actualCount),
          platform,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Comment generation failed")
      }

      if (result.success) {
        setGeneratedComments(result.comments)
        toast({
          title: "Comments Generated Successfully",
          description: `Generated ${result.comments.length} comments`,
        })
      } else {
        throw new Error(result.error || "Comment generation failed")
      }
    } catch (error) {
      console.error("Comment generation error:", error)
      setCommentError(error instanceof Error ? error.message : "Comment generation failed")
      toast({
        title: "Comment Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingComments(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }))
      }, 2000)
      
      toast({
        title: "Copied to Clipboard",
        description: `${type} copied successfully`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadImage = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage.url)
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

  const resetImagePrompt = () => {
    if (originalImagePrompt) {
      setImagePrompt(originalImagePrompt)
    }
  }

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Content Tools
          </CardTitle>
          <CardDescription>
            {post ? `Enhance your ${platform} content with AI-powered tools` : "AI-powered content generation tools"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="comments" disabled={!post}>Comments</TabsTrigger>
              <TabsTrigger value="summary" disabled={!post}>Summary</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            {/* Images Tab - Always Active */}
            <TabsContent value="images" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">AI Image Generation</h3>
                  <Badge variant="outline" className="text-xs">
                    Always Available
                  </Badge>
                </div>

                {/* Provider Selection */}
                <div className="space-y-2">
                  <Label className="text-sm">Image Provider</Label>
                  <div className="grid gap-2">
                    {Object.values(IMAGE_PROVIDERS).map((provider) => {
                      // Fix hydration by only checking after mount
                      const hasKey = isMounted && provider.requiresKey 
                        ? apiKeyManager.getConfigs(provider.id).length > 0 
                        : !provider.requiresKey
                      return (
                        <Button
                          key={provider.id}
                          variant={selectedImageProvider === provider.id ? "default" : "outline"}
                          className="justify-start h-auto p-3"
                          onClick={() => setSelectedImageProvider(provider.id)}
                          disabled={provider.requiresKey && isMounted && !hasKey}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <ImageIcon className="w-4 h-4" />
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">{provider.description}</div>
                            </div>
                            {provider.requiresKey && (
                              <Badge variant={hasKey ? "default" : "secondary"} className="text-xs">
                                {isMounted ? (hasKey ? "✓" : "API Key Required") : "Loading..."}
                              </Badge>
                            )}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Style Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Style</Label>
                    <Select value={selectedImageStyle} onValueChange={setSelectedImageStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLE_OPTIONS.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedImageStyle === "custom" && (
                      <div className="space-y-1">
                        <Input
                          placeholder="Enter custom style (e.g., 'vintage poster art', 'neon cyberpunk')"
                          value={customStyle}
                          onChange={(e) => setCustomStyle(e.target.value)}
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Describe the artistic style you want
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Size</Label>
                    <Select value={selectedImageSize} onValueChange={setSelectedImageSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Social Media Sizes - Only for Free Providers */}
                        {(selectedImageProvider === "pollinations_free" || selectedImageProvider === "free_alternatives") && (
                          <>
                            <SelectItem value="post">Post (1200x675)</SelectItem>
                          </>
                        )}
                        <SelectItem value="square_small">Square (512x512)</SelectItem>
                        <SelectItem value="square_large">Square (1024x1024)</SelectItem>
                        <SelectItem value="best_square">Best Square (1536x1536)</SelectItem>
                        <SelectItem value="portrait">Portrait (512x768)</SelectItem>
                        <SelectItem value="landscape">Landscape (768x512)</SelectItem>
                        {(selectedImageProvider === "pollinations_free" || selectedImageProvider === "free_alternatives") && (
                          <>
                            <SelectItem value="landscape_wide">Wide (1024x576)</SelectItem>
                            <SelectItem value="hd_landscape">HD Landscape (1536x864)</SelectItem>
                          </>
                        )}
                        {(selectedImageProvider === "openai") && (
                          <>
                            <SelectItem value="hd_portrait">HD Portrait (1024x1792)</SelectItem>
                            <SelectItem value="hd_landscape">HD Landscape (1792x1024)</SelectItem>
                            <SelectItem value="highest_resolution">Highest Resolution (1792x1024)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                  <Label className="text-sm">Model</Label>
                  <Select value={selectedImageModel} onValueChange={setSelectedImageModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_PROVIDERS[selectedImageProvider as keyof typeof IMAGE_PROVIDERS]?.models?.map((model: {id: string, label: string}) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Image Prompt</Label>
                    {originalImagePrompt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetImagePrompt}
                        className="h-auto p-1 text-xs"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset to Original
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="min-h-[100px] resize-none"
                  />
                  {post && (
                    <p className="text-xs text-muted-foreground">
                      Auto-generated prompt based on your content. You can edit or reset to original.
                    </p>
                  )}
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="w-full"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                {imageError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{imageError}</AlertDescription>
                  </Alert>
                )}

                {/* Generated Image Display */}
                {generatedImage && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Generated Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="relative bg-muted rounded-lg overflow-hidden">
                        <img
                          src={generatedImage.url}
                          alt="Generated image"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={downloadImage} variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button onClick={() => copyToClipboard(generatedImage.url, "Image URL")} variant="outline" size="sm" className="flex-1">
                          {copiedStates["Image URL"] ? (
                            <Check className="w-4 h-4 mr-2 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy URL
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><strong>Provider:</strong> {generatedImage.provider}</p>
                        <p><strong>Prompt:</strong> {generatedImage.prompt}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Comments Tab - Active after post creation */}
            <TabsContent value="comments" className="space-y-4">
              {!post ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Generate a post first to access comment generation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">AI Comment Generation</h3>
                    <Badge variant="outline" className="text-xs">
                      Post Required
                    </Badge>
                  </div>

                  {/* Persona Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Persona</Label>
                      <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select persona" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMENT_PERSONAS.map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Number of Comments</Label>
                      <Select value={commentCount} onValueChange={setCommentCount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Comment</SelectItem>
                          <SelectItem value="3">3 Comments</SelectItem>
                          <SelectItem value="5">5 Comments</SelectItem>
                          <SelectItem value="7">7 Comments</SelectItem>
                          <SelectItem value="10">10 Comments</SelectItem>
                          <SelectItem value="custom">Custom Number</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {commentCount === "custom" && (
                        <div className="space-y-1">
                          <Input
                            type="number"
                            placeholder="Enter number (1-20)"
                            value={customCommentCount}
                            onChange={(e) => setCustomCommentCount(e.target.value)}
                            min="1"
                            max="20"
                            className="text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Max 20 comments allowed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateComments}
                    disabled={isGeneratingComments}
                    className="w-full"
                  >
                    {isGeneratingComments ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Comments...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Generate Comments
                      </>
                    )}
                  </Button>

                  {commentError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{commentError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Generated Comments Display */}
                  {generatedComments.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Generated Comments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-3">
                            {generatedComments.map((comment, index) => (
                              <div key={index} className="bg-muted p-3 rounded-md">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Comment {index + 1}
                                  </Badge>
                                  <Button
                                    onClick={() => copyToClipboard(comment, `Comment ${index + 1}`)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    {copiedStates[`Comment ${index + 1}`] ? (
                                      <Check className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                                <p className="text-sm">{comment}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Summary Tab - Active after post creation */}
            <TabsContent value="summary" className="space-y-4">
              {!post ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Generate a post first to access summary generation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Content Summary</h3>
                    <Button
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing}
                      size="sm"
                      variant="outline"
                    >
                      {isSummarizing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {isSummarizing ? "Generating..." : "Generate Summary"}
                    </Button>
                  </div>

                  {summary ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          Generated Summary
                          <Button
                            onClick={() => copyToClipboard(summary, "Summary")}
                            variant="ghost"
                            size="sm"
                          >
                            {copiedStates["Summary"] ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{summary}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click "Generate Summary" to create a concise summary of your content
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <Card className="p-3">
                      <h4 className="font-medium mb-2">Word Count</h4>
                      <p className="text-2xl font-bold text-primary">{post.split(/\s+/).length}</p>
                    </Card>
                    <Card className="p-3">
                      <h4 className="font-medium mb-2">Character Count</h4>
                      <p className="text-2xl font-bold text-primary">{post.length}</p>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-sm">AI Images</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Generate custom images using AI - always available
                  </p>
                  <Badge variant="default" className="text-xs">
                    Always Active
                  </Badge>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-sm">AI Comments</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Generate engaging comments for social media
                  </p>
                  <Badge variant={post ? "default" : "secondary"} className="text-xs">
                    {post ? "Active" : "Post Required"}
                  </Badge>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-sm">Smart Summary</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Create concise summaries of your content
                  </p>
                  <Badge variant={post ? "default" : "secondary"} className="text-xs">
                    {post ? "Active" : "Post Required"}
                  </Badge>
                </Card>
              </div>

              {post && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Content Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <Label className="text-xs font-medium">Platform</Label>
                        <p className="text-muted-foreground">{platform || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Content Length</Label>
                        <p className="text-muted-foreground">{post.length} characters</p>
                      </div>
                      {postTitle && (
                        <div className="md:col-span-2">
                          <Label className="text-xs font-medium">Title</Label>
                          <p className="text-muted-foreground line-clamp-2">{postTitle}</p>
                        </div>
                      )}
                      {postLink && (
                        <div className="md:col-span-2">
                          <Label className="text-xs font-medium">Source Link</Label>
                          <p className="text-muted-foreground truncate">{postLink}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* API Key Dialog */}
      <APIKeyDialog
        open={showAPIKeyDialog}
        onOpenChange={() => setShowAPIKeyDialog(false)}
        providers={apiKeyDialogProviders}
        onKeyAdded={() => setShowAPIKeyDialog(false)}
      />
    </div>
  )
}
