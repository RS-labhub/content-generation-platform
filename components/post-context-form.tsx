import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PostContext {
  platform: string
  style: string
  keywords: string
}

interface PostContextFormProps {
  context: PostContext
  onContextChange: (context: PostContext) => void
}

export function PostContextForm({ context, onContextChange }: PostContextFormProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Post Context</CardTitle>
        <CardDescription className="text-sm">
          Define your target platform and content preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platform" className="text-sm font-medium">
            Platform
          </Label>
          <Select
            value={context.platform}
            onValueChange={(value) => onContextChange({ ...context, platform: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="x">X (Twitter)</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="discord">Discord</SelectItem>
              <SelectItem value="threads">Threads</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="style" className="text-sm font-medium">
            Custom Style
          </Label>
          <Input
            id="style"
            placeholder="e.g., storytelling, educational, humorous..."
            value={context.style}
            onChange={(e) => onContextChange({ ...context, style: e.target.value })}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium">
            Keywords (Optional)
          </Label>
          <Input
            id="keywords"
            placeholder="e.g., AI, productivity, startup..."
            value={context.keywords}
            onChange={(e) => onContextChange({ ...context, keywords: e.target.value })}
            className="h-10"
          />
          <p className="text-xs text-gray-500">Comma-separated keywords to emphasize in your post</p>
        </div>
      </CardContent>
    </Card>
  )
}
