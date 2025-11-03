import { Badge } from '@/components/ui/badge'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Sparkles, Wand2, ShieldCheck, TimerReset } from 'lucide-react'

export function Header() {
  const featureChips = [
    {
      icon: <Wand2 className="size-4 text-primary" aria-hidden="true" />,
      label: 'Persona-aware copy in seconds',
    },
    {
      icon: <ShieldCheck className="size-4 text-primary" aria-hidden="true" />,
      label: 'Brand context and compliance built-in',
    },
    {
      icon: <TimerReset className="size-4 text-primary" aria-hidden="true" />,
      label: 'Accelerate your content ops workflow',
    },
  ]

  return (
    <header className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="space-y-8">
        <Badge
          variant="secondary"
          className="w-fit rounded-full border border-border/60 bg-secondary/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-secondary-foreground"
        >
          Content Intelligence Studio
        </Badge>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.05]">
            Orchestrate on-brand storytelling with <span className="text-primary">AI craftsmanship</span>
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Blend personas, brand intelligence, long-form insights, and visual explanations in a collaborative canvas.
            Publish faster with creative guardrails your marketing, product, and leadership teams can trust.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {featureChips.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 rounded-2xl border border-border/70 bg-secondary/60 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-secondary/80"
            >
              {feature.icon}
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/12 via-card to-card/95 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Adaptive Modes
          </div>
          <ThemeSwitcher size="default" variant="outline" />
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Switch between light and dark experiences instantly. The design system stays consistent across every surface,
            whether you&apos;re planning campaigns in daylight or iterating with your team after hours.
          </p>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs text-primary">
            <p className="font-medium uppercase tracking-wide text-primary/90">Design Principles</p>
            <ul className="mt-3 space-y-2 text-primary/80">
              <li>• Typography pairing optimized for readability</li>
              <li>• High-contrast surfaces with elevated depth</li>
              <li>• Motion-ready components for immersive UX</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
