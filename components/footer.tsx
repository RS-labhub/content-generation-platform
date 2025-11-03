"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Globe, HeartCrack } from "lucide-react"

const socialLinks = [
  {
    label: "GitHub",
    icon: <Github className="size-4" aria-hidden="true" />,
    href: "https://github.com/RS-labhub",
  },
  {
    label: "LinkedIn",
    icon: <Linkedin className="size-4" aria-hidden="true" />,
    href: "https://www.linkedin.com/in/rohan-sharma-9386rs/",
  },
  {
    label: "X (Twitter)",
    icon: <Twitter className="size-4" aria-hidden="true" />,
    href: "https://twitter.com/rrs00179",
  },
  {
    label: "Portfolio",
    icon: <Globe className="size-4" aria-hidden="true" />,
    href: "https://rohan-sharma-portfolio.vercel.app",
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="flex flex-col gap-8 border-t border-border/60 pt-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <HeartCrack className="size-4 text-primary" aria-hidden="true" />
            Crafted by Rohan Sharma in memories of Radhika Sharma
          </div>
          <p className="text-sm text-muted-foreground">
            Explore more tools and community projects that help marketers, founders, and creators scale meaningful
            content experiences with AI.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Must check the{' '}
            <a
              href="https://rss-markdown-converter.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 transition hover:text-primary/80"
            >
              RSS to Markdown Converter
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {socialLinks.map((link) => (
            <Button
              key={link.label}
              variant="outline"
              size="sm"
              className="rounded-full border-border/70 bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:bg-secondary/60"
              onClick={() => window.open(link.href, "_blank")}
            >
              {link.icon}
              <span className="pl-1">{link.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t border-border/50 pt-6 text-xs text-muted-foreground flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span>© {currentYear} Content Generation Platform. All rights reserved.</span>
        <span className="text-muted-foreground/70">
          Waiting for her is <strong>eternal</strong> but <strong>beautiful</strong>. Can you imagine how adorable she is?
        </span>
      </div>
    </footer>
  )
}
