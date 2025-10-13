'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ZapIcon, PlayIcon, DownloadIcon } from 'lucide-react'

export function RapidCoder() {
  const [componentName, setComponentName] = useState('')
  const [framework, setFramework] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')

  const generateComponent = () => {
    if (!componentName || !framework) return

    const templates = {
      react: `import React from 'react'

interface ${componentName}Props {
  // Define your props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${componentName.toLowerCase()}">
      <h1>${componentName} Component</h1>
      {/* Your component logic here */}
    </div>
  )
}

export default ${componentName}`,
      vue: `<template>
  <div class="${componentName.toLowerCase()}">
    <h1>${componentName} Component</h1>
    <!-- Your template here -->
  </div>
</template>

<script setup lang="ts">
// Your component logic here
</script>

<style scoped>
.${componentName.toLowerCase()} {
  /* Your styles here */
}
</style>`,
      angular: `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  template: \`
    <div class="${componentName.toLowerCase()}">
      <h1>${componentName} Component</h1>
      <!-- Your template here -->
    </div>
  \`,
  styleUrls: ['./${componentName.toLowerCase()}.component.css']
})
export class ${componentName}Component {
  // Your component logic here
}`
    }

    setGeneratedCode(templates[framework as keyof typeof templates] || '')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <ZapIcon className="h-5 w-5 text-yellow-500" />
        <span className="font-semibold">Rapid Component Generation</span>
        <Badge variant="default">Lightning Fast</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Component Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Component Name</label>
              <Input
                placeholder="e.g., UserProfile"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Framework</label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateComponent}
              disabled={!componentName || !framework}
              className="w-full"
            >
              <PlayIcon className="mr-2 h-4 w-4" />
              Generate Component
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Generated Code</CardTitle>
            <CardDescription>Ready-to-use component code</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <Tabs defaultValue="code" className="w-full">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="code">
                  <div className="space-y-4">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generatedCode}</code>
                    </pre>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border rounded-lg p-4 bg-white">
                    <p className="text-muted-foreground">Component preview would appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ZapIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your component details to generate code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
