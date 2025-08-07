import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, ExternalLink, BarChart3Icon as Diagram3 } from 'lucide-react'

interface GeneratedDiagramDisplayProps {
  mermaidDiagram: string
  diagramType: string
  provider: string
  copiedStates: { [key: string]: boolean }
  onCopy: (text: string, type: string) => void
  onOpenInMermaidLive: () => void
}

export function GeneratedDiagramDisplay({
  mermaidDiagram,
  diagramType,
  provider,
  copiedStates,
  onCopy,
  onOpenInMermaidLive
}: GeneratedDiagramDisplayProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Generated Mermaid Code</CardTitle>
        <CardDescription className="text-sm">
          Copy this code to use in documentation, GitHub, or any Mermaid-compatible platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mermaidDiagram ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border max-h-[300px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono break-words">
                {mermaidDiagram}
              </pre>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => onCopy(mermaidDiagram, "diagram")}
                className="flex-1 h-10"
                variant={copiedStates.diagram ? "secondary" : "default"}
              >
                {copiedStates.diagram ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Copy Mermaid Code</span>
                    <span className="sm:hidden">Copy Code</span>
                  </>
                )}
              </Button>
              <Button onClick={onOpenInMermaidLive} variant="outline" className="flex-1 h-10 bg-transparent">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Open in Mermaid Live</span>
                <span className="sm:hidden">Open Live</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary" className="text-xs">
                {diagramType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {provider}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Diagram3 className="mx-auto h-8 w-8 sm:h-12 sm:w-12 mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Your Mermaid diagram will appear here</p>
            <p className="text-xs sm:text-sm mt-2">
              Describe your content and generate a professional diagram
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
