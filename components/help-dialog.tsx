"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  HelpCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Heart,
  ExternalLink,
  Code2,
  Bug,
  Lightbulb,
  Sparkles,
  Coffee,
} from "lucide-react"

interface HelpDialogProps {
  trigger?: React.ReactNode
}

export function HelpDialog({ trigger }: HelpDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const socialLinks = [
    {
      name: "Portfolio",
      url: "https://rohan-sharma-portfolio.vercel.app/",
      icon: Globe,
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      name: "GitHub",
      url: "https://github.com/RS-labhub",
      icon: Github,
      color: "bg-gradient-to-r from-gray-700 to-gray-900",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/rohan-sharma-9386rs/",
      icon: Linkedin,
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/rrs00179",
      icon: Twitter,
      color: "bg-gradient-to-r from-sky-400 to-sky-500",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-[90vw] max-h-[85vh] p-0 overflow-hidden border-2 animate-pulse-glow">
        <Tabs defaultValue="contribute" className="w-full">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Help & About
            </DialogTitle>
            <DialogDescription>
              Learn how to contribute or get in touch with the developer
            </DialogDescription>
          </DialogHeader>
          
          <TabsList className="mx-6 grid w-[calc(100%-3rem)] grid-cols-2">
            <TabsTrigger value="contribute" className="gap-2">
              <Code2 className="h-4 w-4" />
              Contribute
            </TabsTrigger>
            <TabsTrigger value="developer" className="gap-2">
              <Heart className="h-4 w-4" />
              Developer
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[calc(85vh-180px)]">
            {/* Contribute Tab */}
            <TabsContent value="contribute" className="mt-0 px-6 pb-6">
              <div className="space-y-6 pt-4">
                {/* Open Source Banner */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-5">
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        Open Source
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Want to add features or report bugs?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Don't just think about it — contribute it yourself! This project is open source 
                      and welcomes contributions from the community.
                    </p>
                    <Button 
                      className="gap-2" 
                      onClick={() => window.open("https://github.com/RS-labhub/content-generation-platform", "_blank")}
                    >
                      <Github className="h-4 w-4" />
                      View on GitHub
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* How to Contribute */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    How to Contribute
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Fork the repository</p>
                        <p className="text-xs text-muted-foreground">Create your own copy of the project</p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Make your changes</p>
                        <p className="text-xs text-muted-foreground">Add features or fix bugs in your fork</p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Submit a Pull Request</p>
                        <p className="text-xs text-muted-foreground">Share your improvements with everyone</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Issues */}
                <div className="p-4 rounded-lg border bg-orange-500/5 border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <Bug className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Found a Bug?</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Report issues on GitHub with detailed steps to reproduce.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => window.open("https://github.com/RS-labhub/content-generation-platform/issues", "_blank")}
                      >
                        Report Issue
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Developer Tab */}
            <TabsContent value="developer" className="mt-0 px-6 pb-6">
              <div className="space-y-6 pt-4">
                {/* Developer Card */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 border p-6">
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    {/* Profile Photo Frame */}
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-spin-slow" style={{ padding: "3px", animation: "spin 8s linear infinite" }} />
                      <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden border-4 border-background">
                        {/* Placeholder for photo*/}
                        {/* <div className="absolute inset-1 rounded-full bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 opacity-20" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                          RS
                        </span> */}
                        {/* actual image: */}
                        <img src="/rs.png" alt="Rohan Sharma" className="h-full w-full object-cover" />
                      </div>
                    </div>

                    {/* Name & Title */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Rohan Sharma
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Full Stack Developer
                    </p>

                    {/* Romantic Quote */}
                    <div className="mt-4 px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-pink-500/20">
                      <p className="text-sm italic text-muted-foreground leading-relaxed">
                        <span className="text-pink-500">"</span>
                        Waiting for her is eternal but beautiful. 
                        Can you imagine how adorable she is?
                        <span className="text-pink-500">"</span>
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Heart className="h-3 w-3 text-pink-500 fill-pink-500 animate-pulse" />
                        <Heart className="h-4 w-4 text-pink-500 fill-pink-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <Heart className="h-3 w-3 text-pink-500 fill-pink-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Connect With Me
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {socialLinks.map((link) => (
                      <Button
                        key={link.name}
                        variant="outline"
                        className="h-11 justify-start gap-3 hover:scale-[1.02] transition-transform"
                        onClick={() => window.open(link.url, "_blank")}
                      >
                        <div className={`p-1.5 rounded-md ${link.color}`}>
                          <link.icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm">{link.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Thank You Section */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 p-5">
                  <div className="absolute top-2 right-2">
                    <Coffee className="h-12 w-12 text-amber-500/20" />
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Coffee className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium">Want to say thanks?</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      If this tool helped you, feel free to reach out! Your appreciation means a lot.
                    </p>
                    <Button 
                      variant="outline" 
                      className="gap-2 border-amber-500/30 hover:bg-amber-500/10"
                      onClick={() => window.open("mailto:rs4101976@gmail.com?subject=Thanks for Content Generator Platform!", "_blank")}
                    >
                      <Mail className="h-4 w-4 text-amber-500" />
                      Send Thanks
                      <span className="text-xs text-muted-foreground ml-1">
                        rs4101976@gmail.com
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Made with <Heart className="h-3 w-3 inline text-red-500 fill-red-500" /> by Rohan Sharma
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
