import { Sparkles } from 'lucide-react'

export function Header() {
  return (
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
  )
}
