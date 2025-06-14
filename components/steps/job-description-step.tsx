"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Sparkles, Upload } from "lucide-react"
import { useEffect, useState } from "react"

interface JobDescriptionStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export default function JobDescriptionStep({ data, onUpdate, onNext }: JobDescriptionStepProps) {
  const [uploadMethod, setUploadMethod] = useState<"file" | "text">("file")
  const [selectedModel, setSelectedModel] = useState("")
  const [extractedRequirements, setExtractedRequirements] = useState<string[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side hydration safety
  useEffect(() => {
    setIsClient(true)
  }, [])

  const aiModels = [
    { value: "gpt-4", label: "GPT-4 (Recommended)" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "claude-3", label: "Claude 3" },
    { value: "gemini-pro", label: "Gemini Pro" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpdate({ jobDescription: file, jobText: "" })
    }
  }

  const handleExtractRequirements = async () => {
    console.log("✨ EXTRACTING REQUIREMENTS - Method:", uploadMethod)
    console.log("✨ Job Text:", data.jobText?.substring(0, 100) + "...")

    setIsExtracting(true)
    // Placeholder for AI extraction logic - using real job description content
    setTimeout(() => {
      const mockRequirements = [
        "Bachelor's degree in computer science, Data Science, Software Engineering, or related discipline",
        "1-2 years of experience in software development or AI-related projects",
        "Familiarity with Python and basic understanding of machine learning concepts",
        "Interest in large language models, AI agents, and public sector use cases",
        "Exposure to AWS or similar cloud platforms (S3, Lambda, API Gateway)",
        "Experience with agent frameworks like LangChain or prompt tuning libraries",
        "Understanding of REST APIs, Git, and basic DevOps workflows",
        "Strong problem-solving mindset and collaborative team attitude",
      ]
      setExtractedRequirements(mockRequirements)
      setIsExtracting(false)
      console.log("✨ REQUIREMENTS EXTRACTED:", mockRequirements.length, "items")
    }, 2000)
  }

  const canProceed =
    (uploadMethod === "file" && data.jobDescription) || (uploadMethod === "text" && data.jobText?.trim())

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Job Description</h2>
        <p className="text-gray-600">Upload the job posting or paste the description to extract key requirements</p>
      </div>

      {/* Upload Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Input Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={uploadMethod === "file" ? "default" : "outline"}
              onClick={() => {
                console.log("📁 SWITCHING TO FILE MODE")
                setUploadMethod("file")
              }}
              className="h-20 flex flex-col items-center justify-center"
            >
              <Upload className="h-6 w-6 mb-2" />
              Upload File
            </Button>
            <Button
              variant={uploadMethod === "text" ? "default" : "outline"}
              onClick={() => {
                console.log("📝 SWITCHING TO TEXT MODE")
                setUploadMethod("text")
              }}
              className="h-20 flex flex-col items-center justify-center"
            >
              <FileText className="h-6 w-6 mb-2" />
              Paste Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      {uploadMethod === "file" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Job Description File</CardTitle>
            <CardDescription>Supported formats: PDF, DOC, DOCX, TXT, MD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop your file here or click to browse</p>
                <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload job description file"
              />
            </div>
            {data.jobDescription && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Selected:</strong> {data.jobDescription.name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Text Input */}
      {uploadMethod === "text" && (
        <Card>
          <CardHeader>
            <CardTitle>Paste Job Description</CardTitle>
            <CardDescription>Copy and paste the job description text</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="job-text">Job Description</Label>
            <Textarea
              id="job-text"
              placeholder="Paste the job description here..."
              value={data.jobText || ""}
              onChange={(e) => {
                console.log("📝 TEXT CHANGED - Length:", e.target.value.length)
                onUpdate({ jobText: e.target.value, jobDescription: null })
              }}
              className="min-h-[200px] mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Characters: {data.jobText?.length || 0}
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Model Selection */}
      {canProceed && (
        <Card>
          <CardHeader>
            <CardTitle>Select AI Model</CardTitle>
            <CardDescription>Choose the AI model to extract key requirements from the job description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedModel && (
              <Button onClick={handleExtractRequirements} disabled={isExtracting} className="w-full">
                {isExtracting ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Extracting Requirements...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Extract Key Requirements
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Extracted Requirements */}
      {extractedRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Requirements</CardTitle>
            <CardDescription>Key requirements identified from the job description</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {extractedRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{requirement}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => {
                console.log("🎯 JOB DESCRIPTION COMPLETE - Continuing to source documents")
                onNext()
              }}
              className="w-full mt-6"
            >
              Continue to Source Documents
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
