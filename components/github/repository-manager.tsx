'use client'

import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ExternalLink, GitBranch, GitCommit, GitPullRequest, Loader2, LogIn, LogOut, Settings } from 'lucide-react'

interface RepoData {
  name: string;
  owner: { login: string };
  description: string;
  branches: any[]; // Simplified for example
  recentCommits: any[]; // Simplified for example
  pullRequests: any[]; // Simplified for example
}

export function RepositoryManager() {
  const [repoUrl, setRepoUrl] = useState('')
  const [connected, setConnected] = useState(false)
  const [repoData, setRepoData] = useState<RepoData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated') {
      setConnected(false)
      setRepoData(null)
    }
  }, [status])

  const connectRepository = async () => {
    if (!repoUrl || status !== 'authenticated' || !session?.accessToken) {
      return
    }

    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      setError('Invalid GitHub repository URL.')
      return
    }

    const [, owner, repo] = match
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${session.accessToken}`,
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch repository: ${res.statusText}`)
      }

      const data = await res.json()
      // In a real app, you'd fetch branches, commits, etc. in separate calls
      setRepoData({ ...data, branches: [], recentCommits: [], pullRequests: [] })
      setConnected(true)
    } catch (err: any) {
      setError(err.message)
      setRepoData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const mockRepoData = {
    name: 'awesome-project',
    owner: 'username',
    description: 'An amazing project built with modern tools',
    branches: [
      { name: 'main', commits: 47, lastCommit: '2 hours ago' },
      { name: 'feature/ai-integration', commits: 12, lastCommit: '1 day ago' },
      { name: 'develop', commits: 23, lastCommit: '3 days ago' }
    ],
    recentCommits: [
      { hash: 'a1b2c3d', message: 'feat: add AI code generation', author: 'developer', time: '2 hours ago' },
      { hash: 'e4f5g6h', message: 'fix: resolve authentication issue', author: 'developer', time: '1 day ago' },
      { hash: 'i7j8k9l', message: 'docs: update README with new features', author: 'developer', time: '2 days ago' }
    ],
    pullRequests: [
      { id: 1, title: 'Add advanced code generation features', status: 'open', author: 'contributor' },
      { id: 2, title: 'Improve error handling', status: 'merged', author: 'developer' }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className={`h-5 w-5 ${status === 'authenticated' ? 'text-green-500' : 'text-gray-500'}`} />
        <span className="font-semibold">Repository Management</span>
        <Badge variant={status === 'authenticated' ? 'default' : 'secondary'}>
          {status === 'loading' ? 'Loading...' : status === 'authenticated' ? 'Authenticated' : 'Unauthenticated'}
        </Badge>
        {status === 'authenticated' ? (
          <Button variant="outline" size="sm" onClick={() => signOut()} className="ml-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => signIn('github')} className="ml-auto">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In with GitHub
          </Button>
        )}
      </div>

      {!connected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Repository</CardTitle>
            <CardDescription>Connect your GitHub repository to manage code and collaborate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Repository URL</label>
              <Input
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
            <Button onClick={connectRepository} disabled={!repoUrl || status !== 'authenticated' || isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GitBranch className="mr-2 h-4 w-4" />
              )}
              Connect Repository
            </Button>
          </CardContent>
          {error && (
            <CardFooter>
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            </CardFooter>
          )}
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="commits">Commits</TabsTrigger>
            <TabsTrigger value="prs">Pull Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {repoData?.name}
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>{repoData?.description || 'No description available.'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Owner:</span>
                      <span className="text-sm font-medium">{repoData?.owner.login}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Branches:</span>
                      <span className="text-sm font-medium">{repoData?.branches.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Open PRs:</span>
                      <span className="text-sm font-medium">
                        {repoData?.pullRequests.filter(pr => (pr as any).status === 'open').length ?? 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <GitCommit className="mr-2 h-4 w-4" />
                    Create Commit
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GitBranch className="mr-2 h-4 w-4" />
                    New Branch
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GitPullRequest className="mr-2 h-4 w-4" />
                    Create PR
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branches" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Branches</CardTitle>
                <CardDescription>Manage your repository branches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRepoData.branches.map((branch) => (
                    <div key={branch.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {branch.commits} commits • Last commit {branch.lastCommit}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Merge</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commits" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Commits</CardTitle>
                <CardDescription>Latest commits to the repository</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRepoData.recentCommits.map((commit) => (
                    <div key={commit.hash} className="flex items-start gap-3 p-3 border rounded-lg">
                      <GitCommit className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{commit.message}</div>
                        <div className="text-sm text-muted-foreground">
                          {commit.hash} • {commit.author} • {commit.time}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pull Requests</CardTitle>
                <CardDescription>Manage pull requests and code reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRepoData.pullRequests.map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">#{pr.id} {pr.title}</div>
                        <div className="text-sm text-muted-foreground">
                          by {pr.author}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={pr.status === 'open' ? 'default' : 'secondary'}>
                          {pr.status}
                        </Badge>
                        <Button variant="outline" size="sm">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
