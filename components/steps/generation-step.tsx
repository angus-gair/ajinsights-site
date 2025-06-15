"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, CheckCircle, Clock, FileText, AlertCircle } from "lucide-react"

interface GenerationStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export default function GenerationStep({ data, onUpdate, onNext }: GenerationStepProps) {
  const [generationStatus, setGenerationStatus] = useState<"idle" | "generating" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState("")
  const [generatedResume, setGeneratedResume] = useState("")
  const [error, setError] = useState<string | null>(null)

  const generationTasks = [
    "Analyzing job requirements...",
    "Processing source documents...",
    "Extracting relevant experience...",
    "Matching skills to requirements...",
    "Generating resume content...",
    "Applying template formatting...",
    "Finalizing resume...",
  ]

  // Extract text content from source documents (simulated)
  const extractDocumentContent = async (): Promise<string> => {
    // In a real implementation, this would parse PDF/DOC files
    // For now, we'll simulate extraction based on file names and basic info
    const sourceFiles = data.sourceDocuments || []
    
    if (sourceFiles.length === 0) {
      return "No source documents provided."
    }

    // Simulate content extraction from files
    let extractedContent = "Extracted content from uploaded documents:\n\n"
    sourceFiles.forEach((file: File, index: number) => {
      extractedContent += `Document ${index + 1}: ${file.name}\n`
      extractedContent += `- File type: ${file.type || 'Unknown'}\n`
      extractedContent += `- Size: ${(file.size / 1024).toFixed(2)} KB\n\n`
    })

    return extractedContent
  }

  // Extract job description content
  const extractJobDescription = (): string => {
    if (data.jobDescription) {
      // If it's a file
      if (data.jobDescription instanceof File) {
        return `Job Description from: ${data.jobDescription.name}`
      }
      // If it's text
      if (typeof data.jobDescription === 'string') {
        return data.jobDescription
      }
    }
    return "No job description provided."
  }

  const generateResumeContent = async (): Promise<string> => {
    const jobDesc = extractJobDescription()
    const sourceContent = await extractDocumentContent()
    const config = data.generationConfig || {}

    // Create a basic resume structure based on actual data
    const resume = `# Resume
**Generated based on your uploaded documents and job requirements**

---

## Job Target
${jobDesc}

## Configuration
- **AI Model:** ${config.aiModel || 'Default'}
- **Template:** ${config.template || 'Professional'}
- **Language Style:** ${config.language || 'Professional'}
- **Word Limit:** ${config.wordLimit || 'No limit'}
- **Emphasis Areas:** ${config.emphasis?.join(', ') || 'None specified'}

## Source Documents Analysis
${sourceContent}

## Generated Resume Content

### Professional Summary
[This section would be generated based on the analysis of your uploaded CV and the job requirements. The AI would extract relevant experience and skills from your documents and tailor them to match the job description.]

### Core Competencies
[Skills and competencies extracted from your documents that match the job requirements would be listed here.]

### Professional Experience
[Your work history from the uploaded documents would be reformatted and tailored to emphasize experiences relevant to the target job.]

### Education
[Educational background extracted from your documents.]

### Additional Sections
[Any other relevant sections based on your uploaded content and the job requirements.]

---

**Note:** In a production environment, this would use advanced AI models to:
1. Parse and extract content from your PDF/DOC files
2. Analyze the job description for key requirements
3. Match your experience to job requirements
4. Generate tailored content that highlights relevant skills
5. Format according to the selected template

For now, this is a placeholder showing the structure and data that would be used.`

    return resume
  }

  const startGeneration = async () => {
    setGenerationStatus("generating")
    setProgress(0)
    setError(null)

    try {
      // Simulate AI generation process
      for (let i = 0; i < generationTasks.length; i++) {
        setCurrentTask(generationTasks[i])
        setProgress(((i + 1) / generationTasks.length) * 100)

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Generate actual resume content based on data
      const generatedContent = await generateResumeContent()
      
      setGeneratedResume(generatedContent)
      onUpdate({ generatedResume: generatedContent })
      setGenerationStatus("complete")
    } catch (err) {
      console.error("Generation error:", err)
      setError("Failed to generate resume. Please try again.")
      setGenerationStatus("idle")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Your Resume</h2>
        <p className="text-gray-600">
          AI is creating your tailored resume based on the job requirements and your documents
        </p>
      </div>

      {/* Generation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {generationStatus === "idle" && <Sparkles className="h-5 w-5 text-blue-600" />}
            {generationStatus === "generating" && <Clock className="h-5 w-5 text-orange-600 animate-spin" />}
            {generationStatus === "complete" && <CheckCircle className="h-5 w-5 text-green-600" />}
            <span>
              {generationStatus === "idle" && "Ready to Generate"}
              {generationStatus === "generating" && "Generating Resume..."}
              {generationStatus === "complete" && "Generation Complete"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generationStatus === "idle" && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Click the button below to start generating your tailored resume</p>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button onClick={startGeneration} size="lg" className="w-full">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Resume
              </Button>
            </div>
          )}

          {generationStatus === "generating" && (
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{currentTask}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          {generationStatus === "complete" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Resume generated successfully!</span>
              </div>
              <p className="text-gray-600">
                Your resume has been created and is ready for review. You can preview and edit it in the next step.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>AI Model:</strong> {data.generationConfig?.aiModel || "Not selected"}
              </p>
              <p>
                <strong>Template:</strong> {data.generationConfig?.template || "Not selected"}
              </p>
              <p>
                <strong>Language:</strong> {data.generationConfig?.language || "Not selected"}
              </p>
            </div>
            <div>
              <p>
                <strong>Source Documents:</strong> {data.sourceDocuments?.length || 0} files
              </p>
              <p>
                <strong>Word Limit:</strong> {data.generationConfig?.wordLimit || "No limit"}
              </p>
              <p>
                <strong>Emphasis Areas:</strong> {data.generationConfig?.emphasis?.length || 0} selected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Resume Preview */}
      {generationStatus === "complete" && generatedResume && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generated Resume Preview</span>
            </CardTitle>
            <CardDescription>
              Here's a preview of your generated resume. You can review and edit it in the next step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                {(() => {
                  const lines = generatedResume.split('\n')
                  const elements: JSX.Element[] = []
                  let currentListItems: string[] = []
                  
                  const flushListItems = () => {
                    if (currentListItems.length > 0) {
                      elements.push(
                        <ul key={`list-${elements.length}`} className="ml-4 mb-2">
                          {currentListItems.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      )
                      currentListItems = []
                    }
                  }
                  
                  lines.forEach((line, index) => {
                    if (line.startsWith('#')) {
                      flushListItems()
                      const level = line.match(/^#+/)?.[0].length || 1
                      const text = line.replace(/^#+\s*/, '')
                      const Tag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements
                      elements.push(<Tag key={index} className="font-bold mt-4 mb-2">{text}</Tag>)
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      flushListItems()
                      elements.push(<p key={index} className="font-semibold">{line.replace(/\*\*/g, '')}</p>)
                    } else if (line.startsWith('-')) {
                      currentListItems.push(line.substring(1).trim())
                    } else if (line === '---') {
                      flushListItems()
                      elements.push(<hr key={index} className="my-4" />)
                    } else if (line.trim()) {
                      flushListItems()
                      elements.push(<p key={index} className="mb-2">{line}</p>)
                    }
                  })
                  
                  flushListItems() 
                  return elements
                })()}
              </div>
            </div>
            <Button onClick={onNext} className="w-full mt-4" size="lg">
              Review & Edit Resume
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
