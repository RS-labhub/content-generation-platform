import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Zap, Key } from 'lucide-react'
import { apiKeyManager, type APIProvider } from "@/lib/api-key-manager"

interface DiagramConfigurationProps {
  diagramType: string
  onDiagramTypeChange: (type: string) => void
  allProviders: APIProvider[]
  activeProvider: APIProvider
  activeModel: string
  provider: string
  onShowAPIKeyDialog: () => void
  onProviderChange: (providerId: string, keyId?: string) => void
}

export function DiagramConfiguration({
  diagramType,
  onDiagramTypeChange,
  allProviders,
  activeProvider,
  activeModel,
  provider,
  onShowAPIKeyDialog,
  onProviderChange
}: DiagramConfigurationProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Diagram Configuration</CardTitle>
        <CardDescription className="text-sm">
          Choose diagram type and AI provider for generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="diagramType" className="text-sm font-medium">
            Diagram Type
          </Label>
          <Select value={diagramType} onValueChange={onDiagramTypeChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select diagram type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flowchart">Flowchart</SelectItem>
              <SelectItem value="process">Process Diagram</SelectItem>
              <SelectItem value="workflow">Workflow</SelectItem>
              <SelectItem value="mindmap">Mind Map</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
              <SelectItem value="hierarchy">Hierarchy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Provider Grid for Diagrams */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border-2 border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-medium">Active: {activeProvider.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Model: {activeModel || activeProvider.model}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allProviders.map((providerInfo) => {
            const isActive = provider === providerInfo.id
            const hasKey = providerInfo.requiresKey ? 
              apiKeyManager.getConfigs(providerInfo.id).length > 0 : true
            
            return (
              <Button
                key={providerInfo.id}
                variant={isActive ? "default" : "outline"}
                className="h-auto p-2 flex flex-col items-center gap-1"
                onClick={() => {
                  if (providerInfo.requiresKey && !hasKey) {
                    onShowAPIKeyDialog()
                  } else if (providerInfo.requiresKey) {
                    const keys = apiKeyManager.getConfigs(providerInfo.id)
                    if (keys.length === 1) {
                      onProviderChange(providerInfo.id, keys[0].id)
                    } else {
                      onShowAPIKeyDialog()
                    }
                  } else {
                    onProviderChange(providerInfo.id)
                  }
                }}
              >
                {providerInfo.icon}
                <span className="text-xs font-semibold">{providerInfo.name}</span>
                {providerInfo.requiresKey && (
                  <div className="flex items-center gap-1 mt-1">
                    <Key className="w-2 h-2" />
                    <span className="text-xs opacity-70">API Key</span>
                  </div>
                )}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
