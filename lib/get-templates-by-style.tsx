// LinkedIn Carousel Designer - Professional Templates
// Central template management - imports from modular template files

import { CarouselTemplate, VIBRANT_PALETTES } from "./carousel-designer-types"

import {
  generateSlideId,
  generateElementId,
  minimalProfessionalTemplate,
  corporateBlueTemplate,
  descriptiveCarouselTemplate,
  sideBySideComparison,
  milestoneJourney,
  trendingProductTemplate,
  editorsPickTemplate,
  editorsPickMonthly,
  trendingToolsWeekly,
  boldImpactTemplate,
  gradientWaveTemplate,
  neonVibrantTemplate,
  aiNativeLandscapeTemplate,
  tipsTricksTemplate,
  dataStoryTemplate,
  personalBrandTemplate,
  stepByStepTemplate,
  quoteCardsTemplate,
  caseStudyTemplate,
  coralSunsetTemplate,
  electricBlueTemplate,
  mintFreshTemplate,
  purpleHazeTemplate,
  professionalDarkModeTemplate,
  vibrantDarkModeTemplate,
  elegantBeigeShowcase,
  modernSkyBlue,
} from "./templates"

export const PROFESSIONAL_TEMPLATES: CarouselTemplate[] = [
  minimalProfessionalTemplate,
  corporateBlueTemplate,
  boldImpactTemplate,
  gradientWaveTemplate,
  tipsTricksTemplate,
  dataStoryTemplate,
  personalBrandTemplate,
  stepByStepTemplate,
  quoteCardsTemplate,
  caseStudyTemplate,
  neonVibrantTemplate,
  coralSunsetTemplate,
  electricBlueTemplate,
  mintFreshTemplate,
  purpleHazeTemplate,
  descriptiveCarouselTemplate,
  sideBySideComparison,
  milestoneJourney,
  trendingProductTemplate,
  editorsPickTemplate,
  editorsPickMonthly as any,
  trendingToolsWeekly as any,
  aiNativeLandscapeTemplate,
  professionalDarkModeTemplate,
  vibrantDarkModeTemplate,
  modernSkyBlue,
  elegantBeigeShowcase,
]

export const TEMPLATE_STYLES = [
  { id: "all", label: "All Templates" },
  { id: "professional", label: "Professional" },
  { id: "vibrant", label: "Vibrant" },
  { id: "create-your-own", label: "Create Your Own" },
]

export function getTemplatesByStyle(style: string): CarouselTemplate[] {
  if (style === "all") return PROFESSIONAL_TEMPLATES
  if (style === "professional") {
    return PROFESSIONAL_TEMPLATES.filter(t => 
      ["minimal", "corporate", "data-driven", "case-study", "tips-tricks", "personal-brand", "storytelling", "bold", "gradient", "descriptive-carousel", "trending-product", "editors-pick"].includes(t.category)
    )
  }
  if (style === "vibrant") {
    return PROFESSIONAL_TEMPLATES.filter(t => 
      ["vibrant", "creative", "gradient"].includes(t.category)
    )
  }
  return PROFESSIONAL_TEMPLATES
}

export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates", count: PROFESSIONAL_TEMPLATES.length },
  { id: "professional", label: "Professional", count: PROFESSIONAL_TEMPLATES.filter(t => ["minimal", "corporate", "data-driven", "case-study", "tips-tricks", "personal-brand", "storytelling", "bold", "gradient", "descriptive-carousel", "trending-product", "editors-pick"].includes(t.category)).length },
  { id: "vibrant", label: "Vibrant", count: PROFESSIONAL_TEMPLATES.filter(t => ["vibrant", "creative", "gradient"].includes(t.category)).length },
  { id: "create-your-own", label: "Create Your Own", count: 0 },
]

export function getTemplateById(id: string): CarouselTemplate | undefined {
  return PROFESSIONAL_TEMPLATES.find(t => t.id === id)
}

export function filterTemplatesByCategory(category: string): CarouselTemplate[] {
  if (category === "all") return PROFESSIONAL_TEMPLATES
  if (category === "educational") {
    return PROFESSIONAL_TEMPLATES.filter(t => t.category === "educational" || t.category === "tips-tricks")
  }
  return PROFESSIONAL_TEMPLATES.filter(t => t.category === category)
}

export function createBlankTemplate(): CarouselTemplate {
  return {
    id: `custom-${Date.now()}`,
    name: "Custom Template",
    description: "Your custom carousel template",
    category: "minimal",
    isPremium: false,
    isCustom: true,
    palette: VIBRANT_PALETTES[0],
    size: "square",
    defaultFonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    tags: ["custom"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    slides: [
      {
        id: generateSlideId(),
        name: "Slide 1",
        order: 0,
        background: { type: "solid", color: "#FFFFFF" },
        elements: [],
      },
    ],
  }
}

export function duplicateTemplate(template: CarouselTemplate): CarouselTemplate {
  return {
    ...template,
    id: `custom-${Date.now()}`,
    name: `${template.name} (Copy)`,
    isCustom: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    slides: template.slides.map(slide => ({
      ...slide,
      id: generateSlideId(),
      elements: slide.elements.map(element => ({
        ...element,
        id: generateElementId(),
      })),
    })),
  }
}
