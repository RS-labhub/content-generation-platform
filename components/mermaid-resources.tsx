import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Github } from 'lucide-react'

export function MermaidResources() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Mermaid Resources</CardTitle>
        <CardDescription className="text-sm">
          Helpful links and tools for working with Mermaid diagrams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3 bg-transparent"
            onClick={() => window.open("https://mermaid.live/", "_blank")}
          >
            <ExternalLink className="mr-3 h-4 w-4 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold text-sm">Mermaid Live Editor</div>
              <div className="text-xs opacity-70">Create and edit diagrams online</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3 bg-transparent"
            onClick={() => window.open("https://mermaid.js.org/intro/", "_blank")}
          >
            <BookOpen className="mr-3 h-4 w-4 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold text-sm">Documentation</div>
              <div className="text-xs opacity-70">Learn Mermaid syntax and features</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3 bg-transparent"
            onClick={() => window.open("https://github.com/mermaid-js/mermaid", "_blank")}
          >
            <Github className="mr-3 h-4 w-4 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold text-sm">GitHub Repository</div>
              <div className="text-xs opacity-70">Source code and examples</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
