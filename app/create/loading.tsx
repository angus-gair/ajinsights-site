import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkles, FileText, Upload, Settings } from 'lucide-react'

export default function CreateLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-semibold">Create Your Resume</h1>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Loading...</span>
              <span>Please wait</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
              </div>
              <CardTitle>Setting up your resume creator</CardTitle>
              <CardDescription>
                We're preparing everything you need to create your perfect resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Upload className="h-4 w-4 animate-bounce" />
                  <span>Initializing upload components...</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FileText className="h-4 w-4 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span>Loading document processors...</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Settings className="h-4 w-4 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span>Preparing AI configuration...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}