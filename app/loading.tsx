import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Loading...</h3>
              <p className="text-sm text-gray-600">Please wait while we load your content</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}