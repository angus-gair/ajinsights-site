"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

interface ConfigurationStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export default function ConfigurationStep({ data, onUpdate, onNext }: ConfigurationStepProps) {
  const config = data.generationConfig || {}
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side hydration safety
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Diagnostic logging for configuration step
  useEffect(() => {
    console.log("⚙️ CONFIGURATION STEP MOUNT - Initial Data:", data)
    console.log("⚙️ SOURCE DOCUMENTS COUNT:", data.sourceDocuments?.length || 0)
    console.log("⚙️ CONFIG:", config)

    // Validate that we have source documents
    if (data.sourceDocuments?.length === 0) {
      console.error("🚨 CRITICAL: Configuration step loaded without source documents!")
    }
  }, [])

  useEffect(() => {
    console.log("⚙️ DATA PROP CHANGED:", data)
    console.log("⚙️ SOURCE DOCUMENTS NOW:", data.sourceDocuments?.length || 0)
    if (data.sourceDocuments?.length === 0) {
      console.warn("🚨 POTENTIAL ISSUE: Source documents array is empty!")
    }
  }, [data])

  useEffect(() => {
    console.log("⚙️ CONFIG CHANGED:", config)
  }, [config])

  const aiModels = [
    { value: "gpt-4", label: "GPT-4 (Recommended)", description: "Best quality, slower generation" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Good quality, faster generation" },
    { value: "claude-3", label: "Claude 3", description: "Excellent for professional writing" },
    { value: "gemini-pro", label: "Gemini Pro", description: "Great for technical roles" },
  ]

  const templates = [
    {
      id: "data-analyst-continuous",
      name: "Data Analyst Professional",
      preview: "/test data/data-analyst-resume-continuous.html",
      description: "Optimized for data science and analytics roles"
    },
    {
      id: "modern",
      name: "Modern Professional",
      preview: "/placeholder.svg?height=200&width=150&query=modern resume template",
      description: "Clean, contemporary design for most industries"
    },
    {
      id: "classic",
      name: "Classic Traditional",
      preview: "/placeholder.svg?height=200&width=150&query=classic resume template",
      description: "Traditional format for conservative industries"
    },
    {
      id: "tech",
      name: "Tech Focused",
      preview: "/placeholder.svg?height=200&width=150&query=tech resume template",
      description: "Designed specifically for technical roles"
    },
    {
      id: "executive",
      name: "Executive Level",
      preview: "/placeholder.svg?height=200&width=150&query=executive resume template",
      description: "Premium design for senior leadership positions"
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      preview: "/placeholder.svg?height=200&width=150&query=minimal resume template",
      description: "Simple, distraction-free layout"
    }
  ]

  const languages = [
    { value: "en-us", label: "English (US)" },
    { value: "en-gb", label: "English (UK)" },
    { value: "en-au", label: "English (Australia)" },
    { value: "en-ca", label: "English (Canada)" },
  ]

  const emphasisOptions = [
    { id: "achievements", label: "Achievements & Results" },
    { id: "skills", label: "Technical Skills" },
    { id: "experience", label: "Work Experience" },
    { id: "education", label: "Education & Certifications" },
    { id: "leadership", label: "Leadership & Management" },
    { id: "projects", label: "Projects & Portfolio" },
  ]

  const updateConfig = (key: string, value: any) => {
    console.log("🔧 UPDATE CONFIG - Key:", key, "Value:", value)
    const newConfig = { ...config, [key]: value }
    console.log("🔧 NEW CONFIG:", newConfig)

    // Ensure we're not losing source documents when updating config
    const updateData = {
      generationConfig: newConfig,
      sourceDocuments: data.sourceDocuments || []
    }
    console.log("🔧 FULL UPDATE DATA:", updateData)
    onUpdate(updateData)
  }

  const toggleEmphasis = (emphasisId: string) => {
    const currentEmphasis = config.emphasis || []
    const newEmphasis = currentEmphasis.includes(emphasisId)
      ? currentEmphasis.filter((id: string) => id !== emphasisId)
      : [...currentEmphasis, emphasisId]
    updateConfig("emphasis", newEmphasis)
  }

  const isConfigComplete = config.aiModel && config.template && config.language

  // Additional diagnostic info
  useEffect(() => {
    console.log("✅ CONFIG COMPLETE CHECK:", {
      aiModel: !!config.aiModel,
      template: !!config.template,
      language: !!config.language,
      isComplete: isConfigComplete
    })
  }, [isConfigComplete, config.aiModel, config.template, config.language])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Resume Generation</h2>
        <p className="text-gray-600">Customize the AI model, template, and preferences for your resume</p>
      </div>

      {/* AI Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Selection</CardTitle>
          <CardDescription>Choose the AI model that will generate your resume content</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={config.aiModel} onValueChange={(value) => updateConfig("aiModel", value)}>
            <div className="space-y-3">
              {aiModels.map((model) => (
                <div key={model.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={model.value} id={model.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={model.value} className="font-medium cursor-pointer">
                      {model.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Template</CardTitle>
          <CardDescription>Select a template that matches your industry and personal style</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${config.template === template.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => updateConfig("template", template.id)}
              >
                <div className="relative">
                  {template.id === "data-analyst-continuous" ? (
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded mb-2 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-blue-800 font-semibold text-sm">Data Analyst</div>
                        <div className="text-blue-600 text-xs">Professional Template</div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={template.preview || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  {config.template === template.id && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-center mb-1">{template.name}</p>
                <p className="text-xs text-gray-500 text-center">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language and Style */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Style</CardTitle>
          <CardDescription>Set language preferences and content constraints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Language Style</Label>
            <Select value={config.language} onValueChange={(value) => updateConfig("language", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select language style" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="word-limit">Word Count Limit (Optional)</Label>
            <Input
              id="word-limit"
              type="number"
              placeholder="e.g., 500"
              value={config.wordLimit || ""}
              onChange={(e) => updateConfig("wordLimit", Number.parseInt(e.target.value) || undefined)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for no limit</p>
          </div>
        </CardContent>
      </Card>

      {/* Content Emphasis */}
      <Card>
        <CardHeader>
          <CardTitle>Content Emphasis</CardTitle>
          <CardDescription>Select areas to emphasize in your resume (choose 2-4 options)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emphasisOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={(config.emphasis || []).includes(option.id)}
                  onCheckedChange={() => toggleEmphasis(option.id)}
                />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      {isConfigComplete && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>AI Model:</strong> {aiModels.find((m) => m.value === config.aiModel)?.label}
              </p>
              <p>
                <strong>Template:</strong> {templates.find((t) => t.id === config.template)?.name}
              </p>
              <p>
                <strong>Language:</strong> {languages.find((l) => l.value === config.language)?.label}
              </p>
              {config.wordLimit && (
                <p>
                  <strong>Word Limit:</strong> {config.wordLimit} words
                </p>
              )}
              {config.emphasis?.length > 0 && (
                <p>
                  <strong>Emphasis:</strong>{" "}
                  {config.emphasis.map((id: string) => emphasisOptions.find((opt) => opt.id === id)?.label).join(", ")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-center">
        <Button
          onClick={() => {
            console.log("🚀 START GENERATION CLICKED - Config Complete:", isConfigComplete)
            console.log("🚀 FINAL CONFIG:", config)
            console.log("🚀 FINAL DATA:", data)
            console.log("🚀 SOURCE DOCUMENTS FINAL CHECK:", data.sourceDocuments?.length || 0)

            if (!isConfigComplete) {
              console.error("🚨 CONFIGURATION INCOMPLETE")
              return
            }

            if (data.sourceDocuments?.length === 0) {
              console.error("🚨 NO SOURCE DOCUMENTS AVAILABLE")
              alert("Error: No source documents found. Please go back and upload your resume documents.")
              return
            }

            // Ensure all data is preserved before proceeding
            const finalUpdate = {
              generationConfig: config,
              sourceDocuments: data.sourceDocuments
            }
            onUpdate(finalUpdate)

            setTimeout(() => {
              console.log("🚀 PROCEEDING TO GENERATION")
              onNext()
            }, 100)
          }}
          disabled={!isConfigComplete}
          size="lg"
        >
          Start Resume Generation
          {!isConfigComplete && (
            <span className="ml-2 text-xs">
              ({!config.aiModel ? "Select AI Model" : !config.template ? "Select Template" : "Select Language"})
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
