"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Layers, Target, ArrowRight } from "lucide-react"

interface LinkedInCarouselConfigProps {
  carouselSettings: {
    slideCount: number
    includeIntro: boolean
    includeOutro: boolean
    carouselTheme: string
    slideFormat: string
    carouselDepth?: string
    customDepthDescription?: string
  }
  onCarouselSettingsChange: (settings: any) => void
}

export function LinkedInCarouselConfig({
  carouselSettings,
  onCarouselSettingsChange,
}: LinkedInCarouselConfigProps) {
  const handleSlideCountChange = (value: number[]) => {
    onCarouselSettingsChange({
      ...carouselSettings,
      slideCount: value[0]
    })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" />
          Carousel Configuration
        </CardTitle>
        <CardDescription className="text-sm">
          Customize how your content will be transformed into a LinkedIn carousel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="slide-count" className="text-sm font-medium">
              Number of Slides: {carouselSettings.slideCount}
            </Label>
            <span className="text-xs text-muted-foreground">
              (5-20 recommended)
            </span>
          </div>
          <Slider
            id="slide-count"
            min={3}
            max={20}
            step={1}
            value={[carouselSettings.slideCount]}
            onValueChange={handleSlideCountChange}
            className="py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="include-intro" className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Include Intro Slide
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-intro"
                checked={carouselSettings.includeIntro}
                onCheckedChange={(checked) =>
                  onCarouselSettingsChange({
                    ...carouselSettings,
                    includeIntro: checked,
                  })
                }
              />
              <span className="text-xs text-muted-foreground">
                {carouselSettings.includeIntro ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="include-outro" className="text-sm font-medium flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-blue-600" />
              Include Outro Slide
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-outro"
                checked={carouselSettings.includeOutro}
                onCheckedChange={(checked) =>
                  onCarouselSettingsChange({
                    ...carouselSettings,
                    includeOutro: checked,
                  })
                }
              />
              <span className="text-xs text-muted-foreground">
                {carouselSettings.includeOutro ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="carousel-theme" className="text-sm font-medium">
            Carousel Theme
          </Label>
          <Select
            value={carouselSettings.carouselTheme}
            onValueChange={(value) =>
              onCarouselSettingsChange({
                ...carouselSettings,
                carouselTheme: value,
              })
            }
          >
            <SelectTrigger id="carousel-theme" className="h-10">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="bold">Bold & Impactful</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="storytelling">Storytelling</SelectItem>
              <SelectItem value="data-driven">Data-Driven</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slide-format" className="text-sm font-medium">
            Slide Format
          </Label>
          <Select
            value={carouselSettings.slideFormat}
            onValueChange={(value) =>
              onCarouselSettingsChange({
                ...carouselSettings,
                slideFormat: value,
              })
            }
          >
            <SelectTrigger id="slide-format" className="h-10">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="headline-body">Headline + Body Text</SelectItem>
              <SelectItem value="bullet-points">Bullet Points</SelectItem>
              <SelectItem value="quote-style">Quote Style</SelectItem>
              <SelectItem value="numbered-list">Numbered List</SelectItem>
              <SelectItem value="question-answer">Question & Answer</SelectItem>
              <SelectItem value="step-by-step">Step-by-Step Guide</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="carousel-depth" className="text-sm font-medium">
            Content Depth
          </Label>
          <Select
            value={carouselSettings.carouselDepth || "technical"}
            onValueChange={(value) =>
              onCarouselSettingsChange({
                ...carouselSettings,
                carouselDepth: value,
              })
            }
          >
            <SelectTrigger id="carousel-depth" className="h-10">
              <SelectValue placeholder="Select content depth" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Short</span>
                  <span className="text-xs text-muted-foreground">Brief overviews • Easy to scan</span>
                </div>
              </SelectItem>
              <SelectItem value="technical">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Technical</span>
                  <span className="text-xs text-muted-foreground">Balanced details • Professional depth</span>
                </div>
              </SelectItem>
              <SelectItem value="in-depth">
                <div className="flex flex-col items-start">
                  <span className="font-medium">In-Depth</span>
                  <span className="text-xs text-muted-foreground">Comprehensive • Detailed explanations</span>
                </div>
              </SelectItem>
              <SelectItem value="custom">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Custom</span>
                  <span className="text-xs text-muted-foreground">Define your own depth requirements</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {carouselSettings.carouselDepth === "custom" && (
            <div className="mt-2">
              <Input
                placeholder="Describe your preferred content depth..."
                value={carouselSettings.customDepthDescription || ""}
                onChange={(e) =>
                  onCarouselSettingsChange({
                    ...carouselSettings,
                    customDepthDescription: e.target.value,
                  })
                }
                className="h-10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                E.g., "Include code examples" or "Focus on real-world applications"
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
