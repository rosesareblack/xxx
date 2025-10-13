'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, BrainIcon, CheckCircleIcon } from 'lucide-react'

export function IntelligentAssistant() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    // Simulate AI processing
    setTimeout(() => {
      setResponse(`AI Analysis of your request: "${prompt}"\n\nBased on your input, I recommend:\n\n1. Consider using TypeScript for better type safety\n2. Implement proper error handling\n3. Add comprehensive testing\n4. Follow clean code principles\n\nWould you like me to generate a code example?`)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BrainIcon className="h-5 w-5 text-blue-500" />
        <span className="font-semibold">AI-Powered Code Analysis</span>
        <Badge variant="secondary">Beta</Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Describe what you want to build or the problem you need to solve</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="E.g., I need to create a React component that handles file uploads with drag and drop functionality..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
            />
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !prompt.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BrainIcon className="mr-2 h-4 w-4" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
            <CardDescription>Intelligent suggestions and code recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Analysis Complete</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                  {response}
                </pre>
                <Button variant="outline" className="w-full">
                  Generate Code Example
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BrainIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter a prompt to get AI-powered recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
