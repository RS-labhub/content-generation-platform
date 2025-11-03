"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SunMedium, MoonStar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeSwitcherProps {
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "ghost" | "outline" | "default"
}

export function ThemeSwitcher({ className, size = "sm", variant = "outline" }: ThemeSwitcherProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Button variant={variant} size={size} className={cn("relative overflow-hidden", className)} disabled>
        <SunMedium className="size-4 animate-pulse opacity-60" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "backdrop-blur-sm",
        isDark ? "bg-secondary/30 hover:bg-secondary/50" : "bg-secondary/50 hover:bg-secondary/70",
        className,
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="sr-only">Toggle theme</span>
      <SunMedium
        className={cn("size-4 transition-all", isDark ? "-rotate-90 opacity-0" : "rotate-0 opacity-100")}
        aria-hidden={isDark}
      />
      <MoonStar
        className={cn("size-4 absolute transition-all", isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0")}
        aria-hidden={!isDark}
      />
    </Button>
  )
}
