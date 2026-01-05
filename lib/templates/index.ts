// ═══════════════════════════════════════════════════════════════════════════════
// Template Exports
// Central export file for all carousel templates
// ═══════════════════════════════════════════════════════════════════════════════

// Helper functions
export {
  generateElementId,
  generateSlideId,
  resetElementIdCounter,
  createTextElement,
  createShapeElement,
  createSwipeIndicator,
  SWIPE_TEXTS,
} from "./template-helpers"

// ─────────────────────────────────────────────────────────────────────────────────
// Individual Template Exports
// ─────────────────────────────────────────────────────────────────────────────────

// Professional Templates
export { minimalProfessionalTemplate } from "./minimal-professional"
export { corporateBlueTemplate } from "./corporate-blue"

// Featured Templates  
export { descriptiveCarouselTemplate } from "./descriptive-carousel"
export { trendingProductTemplate } from "./trending-product"
export { editorsPickTemplate } from "./editors-pick"
export { editorsPickMonthly } from "./editor-pick-montly"
export { trendingToolsWeekly } from "./trending-tool-weekly"

// Creative Templates
export { boldImpactTemplate } from "./bold-impact"
export { gradientWaveTemplate } from "./gradient-wave"
export { neonVibrantTemplate } from "./neon-vibrant"
export { aiNativeLandscapeTemplate } from "./ai-native-landscape"

// Content Format Templates
export { tipsTricksTemplate } from "./tips-tricks"
export { dataStoryTemplate } from "./data-story"
export { personalBrandTemplate } from "./personal-brand"
export { stepByStepTemplate } from "./step-by-step"
export { quoteCardsTemplate } from "./quote-cards"
export { caseStudyTemplate } from "./case-study"

// Vibrant Templates
export { coralSunsetTemplate } from "./coral-sunset"
export { electricBlueTemplate } from "./electric-blue"
export { mintFreshTemplate } from "./mint-fresh"
export { purpleHazeTemplate } from "./purple-haze"

// Dark Mode Templates
export { professionalDarkModeTemplate } from "./professional-dark-mode"
export { vibrantDarkModeTemplate } from "./vibrant-dark-mode"

// Showcase Templates
export { elegantBeigeShowcase } from "./elegant-beige-showcase"
export { modernSkyBlue } from "./modern-sky-blue"
export { sideBySideComparison } from "./side-by-side-comparison"
export { milestoneJourney } from "./milestone-journey"

// ─────────────────────────────────────────────────────────────────────────────────
// Import all templates for collections
// ─────────────────────────────────────────────────────────────────────────────────

import { minimalProfessionalTemplate } from "./minimal-professional"
import { corporateBlueTemplate } from "./corporate-blue"
import { descriptiveCarouselTemplate } from "./descriptive-carousel"
import { trendingProductTemplate } from "./trending-product"
import { editorsPickTemplate } from "./editors-pick"
import { editorsPickMonthly } from "./editor-pick-montly"
import { trendingToolsWeekly } from "./trending-tool-weekly"
import { boldImpactTemplate } from "./bold-impact"
import { gradientWaveTemplate } from "./gradient-wave"
import { neonVibrantTemplate } from "./neon-vibrant"
import { aiNativeLandscapeTemplate } from "./ai-native-landscape"
import { tipsTricksTemplate } from "./tips-tricks"
import { dataStoryTemplate } from "./data-story"
import { personalBrandTemplate } from "./personal-brand"
import { stepByStepTemplate } from "./step-by-step"
import { quoteCardsTemplate } from "./quote-cards"
import { caseStudyTemplate } from "./case-study"
import { coralSunsetTemplate } from "./coral-sunset"
import { electricBlueTemplate } from "./electric-blue"
import { mintFreshTemplate } from "./mint-fresh"
import { purpleHazeTemplate } from "./purple-haze"
import { professionalDarkModeTemplate } from "./professional-dark-mode"
import { vibrantDarkModeTemplate } from "./vibrant-dark-mode"
import { elegantBeigeShowcase } from "./elegant-beige-showcase"
import { modernSkyBlue } from "./modern-sky-blue"
import { sideBySideComparison } from "./side-by-side-comparison"
import { milestoneJourney } from "./milestone-journey"

// ─────────────────────────────────────────────────────────────────────────────────
// Template Collections
// ─────────────────────────────────────────────────────────────────────────────────

export const PROFESSIONAL_TEMPLATES_COLLECTION = [
  minimalProfessionalTemplate,
  corporateBlueTemplate,
  sideBySideComparison,
  milestoneJourney,
]

export const FEATURED_TEMPLATES = [
  descriptiveCarouselTemplate,
  trendingProductTemplate,
  editorsPickTemplate,
  editorsPickMonthly,
  trendingToolsWeekly,
  elegantBeigeShowcase,
  sideBySideComparison,
  milestoneJourney,
]

export const CREATIVE_TEMPLATES = [
  boldImpactTemplate,
  gradientWaveTemplate,
  neonVibrantTemplate,
  aiNativeLandscapeTemplate,
]

export const CONTENT_FORMAT_TEMPLATES = [
  tipsTricksTemplate,
  dataStoryTemplate,
  personalBrandTemplate,
  stepByStepTemplate,
  quoteCardsTemplate,
  caseStudyTemplate,
]

export const VIBRANT_TEMPLATES = [
  coralSunsetTemplate,
  electricBlueTemplate,
  mintFreshTemplate,
  purpleHazeTemplate,
  vibrantDarkModeTemplate,
  modernSkyBlue,
]

export const DARK_MODE_TEMPLATES = [
  professionalDarkModeTemplate,
  vibrantDarkModeTemplate,
]

// All templates in one array
export const ALL_TEMPLATES = [
  // Professional
  minimalProfessionalTemplate,
  corporateBlueTemplate,
  professionalDarkModeTemplate,
  // Featured
  descriptiveCarouselTemplate,
  trendingProductTemplate,
  editorsPickTemplate,
  editorsPickMonthly,
  trendingToolsWeekly,
  // Creative
  boldImpactTemplate,
  gradientWaveTemplate,
  neonVibrantTemplate,
  aiNativeLandscapeTemplate,
  // Content Formats
  tipsTricksTemplate,
  dataStoryTemplate,
  personalBrandTemplate,
  stepByStepTemplate,
  quoteCardsTemplate,
  caseStudyTemplate,
  // Vibrant
  coralSunsetTemplate,
  electricBlueTemplate,
  mintFreshTemplate,
  purpleHazeTemplate,
  vibrantDarkModeTemplate,
  modernSkyBlue,
  // Showcase
  elegantBeigeShowcase,
  sideBySideComparison,
  milestoneJourney,
]
