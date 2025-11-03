"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Zap, Key } from "lucide-react"
import { apiKeyManager, type APIProvider } from "@/lib/api-key-manager"

interface AIProviderSelectionProps {
  allProviders: APIProvider[]
  activeProvider: APIProvider
  activeModel: string
  provider: string
  onShowAPIKeyDialog: () => void
  onProviderChange: (providerId: string, keyId?: string) => void
}

export function AIProviderSelection({
  allProviders,
  activeProvider,
  activeModel,
  provider,
  onShowAPIKeyDialog,
  onProviderChange
}: AIProviderSelectionProps) {
  const [keyAvailability, setKeyAvailability] = useState<Record<string, boolean>>({})
  const [statusReady, setStatusReady] = useState(false)

  useEffect(() => {
    const updateAvailability = () => {
      const availability = allProviders.reduce<Record<string, boolean>>((acc, providerInfo) => {
        acc[providerInfo.id] = providerInfo.requiresKey
          ? apiKeyManager.getConfigs(providerInfo.id).length > 0
          : true
        return acc
      }, {})
      setKeyAvailability(availability)
      setStatusReady(true)
    }

    updateAvailability()
    const unsubscribe = apiKeyManager.subscribe(updateAvailability)
    return () => {
      unsubscribe()
    }
  }, [allProviders])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Provider</CardTitle>
            <CardDescription>Choose your preferred AI model for content generation</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowAPIKeyDialog}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configure Keys</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Active Provider Display */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border-2 border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-medium">Active: {activeProvider.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Model: {activeModel || activeProvider.model}
          </p>
        </div>

        {/* Provider Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allProviders.map((providerInfo) => {
            const isActive = provider === providerInfo.id
            const hasKey = keyAvailability[providerInfo.id] ?? false
            
            return (
              <Button
                key={providerInfo.id}
                variant={isActive ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-start gap-2 text-left justify-start relative"
                onClick={() => {
                  if (providerInfo.requiresKey && statusReady && !hasKey) {
                    onShowAPIKeyDialog()
                  } else if (providerInfo.requiresKey) {
                    // Use the most recently used key for this provider
                    const keys = apiKeyManager.getConfigs(providerInfo.id)
                    if (keys.length > 0) {
                      // keys are already sorted by lastUsed (most recent first)
                      onProviderChange(providerInfo.id, keys[0].id)
                    } else {
                      onShowAPIKeyDialog()
                    }
                  } else {
                    onProviderChange(providerInfo.id)
                  }
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  {providerInfo.icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{providerInfo.name}</span>
                      <span className="text-xs opacity-70 truncate">{providerInfo.model}</span>
                    </div>
                    <p className="text-xs opacity-80 leading-tight text-left line-clamp-2">
                      {providerInfo.description}
                    </p>
                  </div>
                  {providerInfo.requiresKey && (
                    <div className="flex items-center gap-1">
                      {statusReady ? (
                        <>
                          <Key className={`w-3 h-3 ${hasKey ? "text-green-500" : "text-orange-500"}`} />
                          <span className={`text-xs ${hasKey ? "text-green-600" : "text-orange-600"}`}>
                            {hasKey ? "Configured" : "Setup Required"}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Checking...</span>
                      )}
                    </div>
                  )}
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
