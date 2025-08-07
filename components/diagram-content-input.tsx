import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface DiagramContentInputProps {
  diagramContent: string
  onDiagramContentChange: (content: string) => void
}

export function DiagramContentInput({ diagramContent, onDiagramContentChange }: DiagramContentInputProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Content for Diagram</CardTitle>
        <CardDescription className="text-sm">
          Describe the process, workflow, or concept you want to visualize
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Describe your process, workflow, or any content you want to turn into a diagram. For example: 'User registration process with email verification and profile setup' or 'Project management workflow from planning to deployment'..."
          value={diagramContent}
          onChange={(e) => onDiagramContentChange(e.target.value)}
          className="min-h-[200px] max-h-[300px] resize-none text-sm overflow-y-auto"
        />
      </CardContent>
    </Card>
  )
}
