"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Save, RefreshCw } from "lucide-react"

interface ReviewStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export default function ReviewStep({ data, onUpdate, onNext }: ReviewStepProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedResume, setEditedResume] = useState(data.generatedResume || "")
  const [feedback, setFeedback] = useState("")
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Initialize with generated resume if available
  useState(() => {
    if (data.generatedResume && !editedResume) {
      setEditedResume(data.generatedResume)
    }
  })

  const handleSave = () => {
    onUpdate({ finalResume: editedResume })
    setIsEditing(false)
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    // Simulate regeneration with feedback
    setTimeout(() => {
      const updatedResume = editedResume + "\n\n<!-- Updated based on feedback -->"
      setEditedResume(updatedResume)
      onUpdate({ finalResume: updatedResume })
      setIsRegenerating(false)
      setFeedback("")
    }, 3000)
  }

  // Parse resume sections from the generated content
  const parseResumeSections = () => {
    const resume = editedResume || data.generatedResume || ""
    const sections = []
    
    // Split resume into sections based on headers
    const lines = resume.split('\n')
    let currentSection = null
    let currentContent = []
    
    for (const line of lines) {
      if (line.startsWith('##')) {
        // Save previous section if exists
        if (currentSection) {
          sections.push({
            id: currentSection.toLowerCase().replace(/\s+/g, '-'),
            title: currentSection,
            content: currentContent.join('\n').trim()
          })
        }
        // Start new section
        currentSection = line.replace(/^#+\s*/, '')
        currentContent = []
      } else if (currentSection) {
        currentContent.push(line)
      }
    }
    
    // Save last section
    if (currentSection) {
      sections.push({
        id: currentSection.toLowerCase().replace(/\s+/g, '-'),
        title: currentSection,
        content: currentContent.join('\n').trim()
      })
    }
    
    return sections.length > 0 ? sections : [
      { id: "content", title: "Resume Content", content: resume }
    ]
  }

  const resumeSections = parseResumeSections()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Edit Your Resume</h2>
        <p className="text-gray-600">Review the generated resume and make any necessary adjustments</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
          {isEditing ? "Save Changes" : "Edit Resume"}
        </Button>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>

      {/* Resume Content */}
      <Tabs defaultValue="full" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="full">Full Resume</TabsTrigger>
          <TabsTrigger value="sections">By Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="full" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Resume</CardTitle>
              <CardDescription>
                {isEditing ? "Edit your resume content directly" : "Review your complete resume"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedResume}
                    onChange={(e) => setEditedResume(e.target.value)}
                    className="min-h-[500px] font-mono text-sm"
                    placeholder="Edit your resume content here..."
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border rounded-lg p-6 max-h-[500px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    {(() => {
                      const lines = editedResume.split('\n')
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          {resumeSections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    {(() => {
                      const lines = section.content.split('\n')
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
                      
                      lines.forEach((line, idx) => {
                        if (line.startsWith('-')) {
                          currentListItems.push(line.substring(1).trim())
                        } else if (line.trim()) {
                          flushListItems()
                          elements.push(<p key={idx} className="mb-1">{line}</p>)
                        }
                      })
                      
                      flushListItems()
                      return elements
                    })()}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit Section
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Feedback and Regeneration */}
      <Card>
        <CardHeader>
          <CardTitle>Provide Feedback</CardTitle>
          <CardDescription>Share specific feedback to regenerate parts of your resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'Make the professional summary more concise' or 'Add more emphasis on leadership experience'"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleRegenerate} disabled={!feedback.trim() || isRegenerating} variant="outline">
            {isRegenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate with Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resume Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{editedResume.split(' ').length}</p>
              <p className="text-sm text-gray-600">Total Words</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{resumeSections.length}</p>
              <p className="text-sm text-gray-600">Sections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{data.sourceDocuments?.length || 0}</p>
              <p className="text-sm text-gray-600">Source Docs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{editedResume.split('\n').length}</p>
              <p className="text-sm text-gray-600">Total Lines</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Configuration used:</p>
            <div className="flex flex-wrap gap-2">
              {data.generationConfig?.aiModel && (
                <Badge variant="secondary">Model: {data.generationConfig.aiModel}</Badge>
              )}
              {data.generationConfig?.template && (
                <Badge variant="secondary">Template: {data.generationConfig.template}</Badge>
              )}
              {data.generationConfig?.language && (
                <Badge variant="secondary">Style: {data.generationConfig.language}</Badge>
              )}
              {data.generationConfig?.emphasis?.map((item: string, index: number) => (
                <Badge key={index} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center">
        <Button onClick={onNext} size="lg">
          Proceed to Export
        </Button>
      </div>
    </div>
  )
}
