"use client"

import React from "react"
import { Zap, Brain, Bot, Cpu, FileImage } from "lucide-react"
import type { APIProvider } from "@/lib/api-key-manager"

// ═══════════════════════════════════════════════════════════════════════════════
// Client-side AI Provider Configuration
// This file contains UI-related provider information for client components
// ═══════════════════════════════════════════════════════════════════════════════

export type AIProviderType = "groq" | "gemini" | "openai" | "anthropic" | "huggingface"

// ─────────────────────────────────────────────────────────────────────────────
// Provider Icons
// ─────────────────────────────────────────────────────────────────────────────

export const PROVIDER_ICONS: Record<AIProviderType, React.ReactNode> = {
  groq: <Zap className="h-4 w-4 text-orange-600" />,
  gemini: <Brain className="h-4 w-4 text-blue-600" />,
  openai: <Bot className="h-4 w-4 text-green-600" />,
  anthropic: <Cpu className="h-4 w-4 text-purple-600" />,
  huggingface: <FileImage className="h-4 w-4 text-yellow-600" />,
}

// ─────────────────────────────────────────────────────────────────────────────
// Model Configurations
// ─────────────────────────────────────────────────────────────────────────────

export const AI_MODELS = {
  groq: {
    default: "llama-3.3-70b-versatile",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
      { id: "llama-3.2-90b-vision-preview", name: "Llama 3.2 90B Vision" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
    ]
  },
  gemini: {
    default: "gemini-2.0-flash",
    models: [
      { id: "models/gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "models/gemini-2.0-flash-thinking-exp", name: "Gemini 2.0 Flash Thinking" },
      { id: "models/gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    ]
  },
  openai: {
    default: "gpt-4o",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "o1", name: "o1" },
      { id: "o1-mini", name: "o1 Mini" },
    ]
  },
  anthropic: {
    default: "claude-sonnet-4-5-20250929",
    models: [
      { id: "claude-sonnet-4-5-20250929", name: "Claude 4.5 Sonnet" },
      { id: "claude-haiku-4-5-20251001", name: "Claude 4.5 Haiku" },
      { id: "claude-opus-4-5-20251101", name: "Claude 4.5 Opus" },
    ]
  },
  huggingface: {
    default: "meta-llama/Llama-2-7b-chat-hf",
    models: [
      { id: "meta-llama/Llama-2-7b-chat-hf", name: "Llama 2 7B" },
      { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell" },
      { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "SDXL Base" },
    ]
  }
} as const

// ─────────────────────────────────────────────────────────────────────────────
// All Providers List (for UI components)
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_PROVIDERS: APIProvider[] = [
  {
    id: "groq",
    name: "GROQ",
    description: "Ultra-fast inference with excellent performance for creative content generation",
    icon: PROVIDER_ICONS.groq,
    model: "llama-3.3-70b-versatile",
    requiresKey: false,
    keyPlaceholder: "",
    keyValidation: () => true,
    defaultModels: AI_MODELS.groq.models.map(m => m.id),
    supportsCustomModels: false,
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google's advanced AI with strong reasoning capabilities and multimodal understanding",
    icon: PROVIDER_ICONS.gemini,
    model: "gemini-2.0-flash",
    requiresKey: false,
    keyPlaceholder: "",
    keyValidation: () => true,
    defaultModels: AI_MODELS.gemini.models.map(m => m.id),
    supportsCustomModels: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models with excellent reasoning and creative capabilities",
    icon: PROVIDER_ICONS.openai,
    model: "GPT-4o",
    requiresKey: true,
    keyPlaceholder: "sk-...",
    keyValidation: (key: string) => key.startsWith("sk-") && key.length > 20,
    defaultModels: AI_MODELS.openai.models.map(m => m.id),
    supportsCustomModels: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models with strong reasoning and safety features",
    icon: PROVIDER_ICONS.anthropic,
    model: "Claude 4.5 Sonnet",
    requiresKey: true,
    keyPlaceholder: "sk-ant-...",
    keyValidation: (key: string) => key.startsWith("sk-ant-") && key.length > 20,
    defaultModels: AI_MODELS.anthropic.models.map(m => m.id),
    supportsCustomModels: true,
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "Access to a wide variety of open-source models and cutting-edge AI research",
    icon: PROVIDER_ICONS.huggingface,
    model: "Llama & FLUX Models",
    requiresKey: true,
    keyPlaceholder: "hf_...",
    keyValidation: (key: string) => key.startsWith("hf_") && key.length > 20,
    defaultModels: AI_MODELS.huggingface.models.map(m => m.id),
    supportsCustomModels: true,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

export function getProviderById(id: string): APIProvider | undefined {
  return ALL_PROVIDERS.find(p => p.id === id)
}

export function getProviderIcon(providerId: string): React.ReactNode {
  return PROVIDER_ICONS[providerId as AIProviderType] || PROVIDER_ICONS.groq
}

export function getDefaultModel(providerId: string): string {
  const models = AI_MODELS[providerId as keyof typeof AI_MODELS]
  return models?.default || "llama-3.3-70b-versatile"
}

export function getProviderModels(providerId: string): { id: string; name: string }[] {
  const models = AI_MODELS[providerId as keyof typeof AI_MODELS]
  return models?.models ? [...models.models] : []
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Generation Providers
// ─────────────────────────────────────────────────────────────────────────────

export const IMAGE_PROVIDERS = [
  { value: "pollinations_free", label: "AI Image Generator (Free)" },
  { value: "free_alternatives", label: "Free Alternatives" },
  { value: "huggingface", label: "Hugging Face (API Key)" },
  { value: "openai", label: "OpenAI DALL·E" },
]

export const IMAGE_SIZES = [
  { value: "square_large", label: "Square (1024 × 1024)" },
  { value: "post", label: "Post (1200 × 675)" },
  { value: "portrait", label: "Portrait (768 × 1024)" },
  { value: "landscape", label: "Landscape (1024 × 768)" },
]

export const IMAGE_STYLES = [
  { value: "realistic", label: "Photorealistic" },
  { value: "minimalist", label: "Minimalist" },
  { value: "cartoon", label: "Cartoon" },
  { value: "watercolor", label: "Watercolor" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "pixel_art", label: "Pixel Art" },
  { value: "custom", label: "Custom" },
]
