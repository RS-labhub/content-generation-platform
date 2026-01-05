"use client"

import { CarouselDesigner } from "@/components/carousel-designer"

export default function CarouselDesignerPage() {
  // Full-screen designer with no Header/Footer (layout.tsx strips them)
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <CarouselDesigner />
    </div>
  )
}
