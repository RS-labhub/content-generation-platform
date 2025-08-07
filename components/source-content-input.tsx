import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface SourceContentInputProps {
  content: string
  onContentChange: (content: string) => void
}

export function SourceContentInput({ content, onContentChange }: SourceContentInputProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Source Content</CardTitle>
        <CardDescription className="text-sm">
          Paste your blog post, notes, or any content to transform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your blog post, website content, notes, or any text you want to transform into a social media post..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[150px] sm:min-h-[200px] max-h-[300px] resize-none text-sm overflow-y-auto"
        />
      </CardContent>
    </Card>
  )
}
