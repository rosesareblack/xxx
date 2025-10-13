'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  CodeIcon, 
  GitHubLogoIcon, 
  LightningBoltIcon, 
  MagicWandIcon,
  RocketIcon,
  GearIcon
} from '@radix-ui/react-icons'

import { IntelligentAssistant } from '@/components/code-generation/intelligent-assistant'
import { RapidCoder } from '@/components/code-generation/rapid-coder'
import { CodeGenerator } from '@/components/code-generation/code-generator'
import { RepositoryManager } from '@/components/github/repository-manager'

export default function StrategicCodePage() {
  const [activeFeature, setActiveFeature] = useState<string>('overview')

  const features = [
    {
      id: 'intelligent-assistant',
      title: 'Intelligent Assistant',
      description: 'AI-powered coding companion that understands context and provides smart suggestions',
      icon: <MagicWandIcon className="h-6 w-6" />,
      status: 'active',
      component: <IntelligentAssistant />
    },
    {
      id: 'rapid-coder',
      title: 'Rapid Coder',
      description: 'Lightning-fast code generation with real-time preview and optimization',
      icon: <LightningBoltIcon className="h-6 w-6" />,
      status: 'active',
      component: <RapidCoder />
    },
    {
      id: 'code-generator',
      title: 'Advanced Code Generator',
      description: 'Multi-language code generation with advanced templates and patterns',
      icon: <CodeIcon className="h-6 w-6" />,
      status: 'active',
      component: <CodeGenerator />
    },
    {
      id: 'repo-manager',
      title: 'Repository Manager',
      description: 'Seamless GitHub integration for project management and collaboration',
      icon: <GitHubLogoIcon className="h-6 w-6" />,
      status: 'active',
      component: <RepositoryManager />
    }
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <RocketIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Strategic Code Interface</h1>
          <Badge variant="secondary" className="ml-2">
            <GearIcon className="h-3 w-3 mr-1" />
            Advanced
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Professional-grade AI tools for accelerated development. Build faster, code smarter, and deploy with confidence.
        </p>
      </div>

      <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intelligent-assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="rapid-coder">Rapid Coder</TabsTrigger>
          <TabsTrigger value="code-generator">Code Generator</TabsTrigger>
          <TabsTrigger value="repo-manager">Repository</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setActiveFeature(feature.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                      {feature.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Launch {feature.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {features.map((feature) => (
          <TabsContent key={feature.id} value={feature.id} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {feature.component}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
