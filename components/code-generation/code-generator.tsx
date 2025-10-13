'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeIcon, SettingsIcon, FileTextIcon } from 'lucide-react'

export function CodeGenerator() {
  const [language, setLanguage] = useState('')
  const [pattern, setPattern] = useState('')
  const [requirements, setRequirements] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')

  const generateAdvancedCode = () => {
    if (!language || !pattern || !requirements) return

    const templates = {
      'typescript-api': `// API Service Implementation
export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

export class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`)
      const data = await response.json()
      
      return {
        data,
        status: response.status,
        message: response.ok ? 'Success' : 'Error'
      }
    } catch (error) {
      throw new Error(\`API call failed: \${error}\`)
    }
  }
}`,
      'python-class': `from typing import Optional, List
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class BaseModel:
    """Base model with common functionality"""
    id: Optional[int] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class Repository(ABC):
    """Abstract repository pattern"""
    
    @abstractmethod
    async def create(self, entity: BaseModel) -> BaseModel:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[BaseModel]:
        pass
    
    @abstractmethod
    async def update(self, entity: BaseModel) -> BaseModel:
        pass
    
    @abstractmethod
    async def delete(self, id: int) -> bool:
        pass`,
      'react-hook': `import { useState, useEffect, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(url: string, dependencies: any[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }
      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }))
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { ...state, refetch: fetchData }
}`
    }

    const key = `${language}-${pattern}` as keyof typeof templates
    setGeneratedCode(templates[key] || '// Code generation for this combination is not yet implemented')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CodeIcon className="h-5 w-5 text-purple-500" />
        <span className="font-semibold">Advanced Code Generator</span>
        <Badge variant="outline">Professional</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Configuration
            </CardTitle>
            <CardDescription>Define your code generation parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language/Framework</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="node">Node.js</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Pattern/Template</label>
              <Select value={pattern} onValueChange={setPattern}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API Service</SelectItem>
                  <SelectItem value="class">Class/Model</SelectItem>
                  <SelectItem value="hook">Custom Hook</SelectItem>
                  <SelectItem value="component">Component</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Requirements</label>
              <Textarea
                placeholder="Describe specific requirements, features, or constraints..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={generateAdvancedCode}
              disabled={!language || !pattern || !requirements}
              className="w-full"
            >
              <CodeIcon className="mr-2 h-4 w-4" />
              Generate Code
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              Generated Code
            </CardTitle>
            <CardDescription>Production-ready code with best practices</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <Tabs defaultValue="code" className="w-full">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="docs">Documentation</TabsTrigger>
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>
                <TabsContent value="code">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                    <code>{generatedCode}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="docs">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">Documentation and usage examples would be generated here.</p>
                  </div>
                </TabsContent>
                <TabsContent value="tests">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">Unit tests and test examples would be generated here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CodeIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your requirements to generate advanced code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
