"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { resumeAPI } from "@/lib/api/resume-api"

// Step Components
import ConfigurationStep from "@/components/steps/configuration-step"
import ExportStep from "@/components/steps/export-step"
import GenerationStep from "@/components/steps/generation-step"
import JobDescriptionStep from "@/components/steps/job-description-step"
import ReviewStep from "@/components/steps/review-step"
import SourceDocumentsStep from "@/components/steps/source-documents-step"

// Types
interface ResumeData {
    id?: string // Add ID for saved resumes
    jobDescription?: File
    jobText?: string
    sourceDocuments: File[]
    generationConfig: {
        aiModel?: string
        template?: string
        language?: string
        wordLimit?: number
        emphasis?: string[]
    }
    generatedResume?: string
    finalResume?: string
}

const steps = [
    { id: 1, title: "Job Description", component: JobDescriptionStep },
    { id: 2, title: "Source Documents", component: SourceDocumentsStep },
    { id: 3, title: "Configuration", component: ConfigurationStep },
    { id: 4, title: "Generation", component: GenerationStep },
    { id: 5, title: "Review & Edit", component: ReviewStep },
    { id: 6, title: "Export", component: ExportStep },
]

export default function CreateResumeClient() {
    const [isClient, setIsClient] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [resumeData, setResumeData] = useState<ResumeData>({
        sourceDocuments: [],
        generationConfig: {},
    })
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    // Auto-save to database
    const saveToDatabase = async () => {
        try {
            setIsSaving(true)
            console.log("💾 Saving to database...")

            const savedResume = await resumeAPI.saveProgress(resumeData.id, resumeData)

            // Update local state with saved ID
            if (!resumeData.id && savedResume.id) {
                setResumeData(prev => ({ ...prev, id: savedResume.id }))
            }

            setLastSaved(new Date())
            console.log("✅ Saved to database successfully", savedResume.id)
        } catch (error) {
            console.error("❌ Failed to save to database:", error)
            // You might want to show a toast notification here
        } finally {
            setIsSaving(false)
        }
    }

    // Auto-save when data changes (debounced)
    useEffect(() => {
        if (!isClient) return

        // Skip saving if no meaningful data
        if (!resumeData.jobDescription && !resumeData.jobText && resumeData.sourceDocuments.length === 0) {
            return
        }

        const saveTimer = setTimeout(() => {
            saveToDatabase()
        }, 2000) // Save after 2 seconds of inactivity

        return () => clearTimeout(saveTimer)
    }, [resumeData, isClient])

    // Hydration-safe client-side rendering
    useEffect(() => {
        setIsClient(true)

        // Restore state from sessionStorage if available
        try {
            const savedStep = sessionStorage.getItem('resumeCurrentStep')
            const savedData = sessionStorage.getItem('resumeData')

            if (savedStep) {
                const step = parseInt(savedStep)
                if (step >= 1 && step <= steps.length) {
                    setCurrentStep(step)
                    console.log("🔄 RESTORED STEP FROM SESSION:", step)
                }
            }

            if (savedData) {
                const data = JSON.parse(savedData)
                // Note: File objects cannot be restored from sessionStorage
                // They will need to be re-uploaded
                if (data.sourceDocuments) {
                    console.warn("⚠️ File objects cannot be restored from session storage. Users will need to re-upload files.")
                    data.sourceDocuments = [] // Clear the array since File objects can't be serialized
                }
                setResumeData(data)
                console.log("🔄 RESTORED DATA FROM SESSION:", data)
            }
        } catch (error) {
            console.warn("⚠️ Failed to restore session data:", error)
            // Clear corrupted session data
            sessionStorage.removeItem('resumeCurrentStep')
            sessionStorage.removeItem('resumeData')
        }
    }, [])

    // Persist state to sessionStorage with error handling
    useEffect(() => {
        if (isClient) {
            try {
                sessionStorage.setItem('resumeCurrentStep', currentStep.toString())
                console.log("💾 SAVED STEP TO SESSION:", currentStep)
            } catch (error) {
                console.error("💾 Failed to save step to session:", error)
            }
        }
    }, [currentStep, isClient])

    useEffect(() => {
        if (isClient) {
            try {
                // Create a serializable version of resumeData
                const dataToSave = {
                    ...resumeData,
                    // Convert File objects to serializable format
                    sourceDocuments: resumeData.sourceDocuments?.map(file => ({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        lastModified: file.lastModified
                    }))
                }
                sessionStorage.setItem('resumeData', JSON.stringify(dataToSave))
                console.log("💾 SAVED DATA TO SESSION (serialized)")
            } catch (error) {
                console.error("💾 Failed to save data to session:", error)
            }
        }
    }, [resumeData, isClient])

    // Diagnostic logging to track state changes
    useEffect(() => {
        console.log("🔄 CREATE PAGE MOUNT - Current Step:", currentStep)
        console.log("📊 Resume Data on Mount:", resumeData)
    }, [])

    useEffect(() => {
        console.log("🚀 STEP CHANGE - New Step:", currentStep)
        console.log("📁 Source Documents Count:", resumeData.sourceDocuments?.length || 0)
        console.log("⚙️ Configuration:", resumeData.generationConfig)
    }, [currentStep])

    const progress = (currentStep / steps.length) * 100
    const CurrentStepComponent = steps[currentStep - 1].component

    const handleNext = () => {
        console.log("⏭️ HANDLE NEXT - Current Step:", currentStep, "Next:", currentStep + 1)
        console.log("⏭️ Current resume data:", {
            hasJobDescription: !!resumeData.jobDescription,
            sourceDocuments: resumeData.sourceDocuments?.length || 0,
            hasConfig: !!resumeData.generationConfig?.aiModel
        })

        if (currentStep < steps.length) {
            const nextStep = currentStep + 1

            // Validate before moving to next step
            const validationError = validateStep(currentStep)
            if (validationError) {
                console.error("🚨 Validation failed:", validationError)
                // Could show error toast here
                return
            }

            console.log("✅ Validation passed, moving to step", nextStep)
            setCurrentStep(nextStep)
        }
    }

    const validateStep = (step: number): string | null => {
        switch (step) {
            case 1: // Job Description
                if (!resumeData.jobDescription && !resumeData.jobText) {
                    return "Please upload or paste a job description"
                }
                break
            case 2: // Source Documents
                if (!resumeData.sourceDocuments || resumeData.sourceDocuments.length === 0) {
                    return "Please upload at least one source document"
                }
                break
            case 3: // Configuration
                if (!resumeData.generationConfig?.aiModel) {
                    return "Please select configuration options"
                }
                break
            case 4: // Generation
                if (!resumeData.generatedResume) {
                    return "Please generate your resume first"
                }
                break
            case 5: // Review
                if (!resumeData.finalResume) {
                    return "Please review and finalize your resume"
                }
                break
        }
        return null
    }

    const handlePrevious = () => {
        console.log("⏮️ HANDLE PREVIOUS - Current Step:", currentStep, "Previous:", currentStep - 1)
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const updateResumeData = (data: Partial<ResumeData>) => {
        console.log("🔧 UPDATE RESUME DATA - New Data:", data)
        console.log("🔧 UPDATE RESUME DATA - Keys:", Object.keys(data))

        setResumeData((prev) => {
            const newData = { ...prev, ...data }
            console.log("🔧 UPDATED RESUME DATA - Full State:", {
                ...newData,
                sourceDocuments: newData.sourceDocuments?.map(f => ({ name: f.name, size: f.size }))
            })
            return newData
        })
    }

    // Prevent hydration mismatch by not rendering until client-side
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-medium">Back to Home</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">Create Your Resume</h1>
                            {isSaving && (
                                <span className="text-sm text-gray-500">Saving...</span>
                            )}
                            {!isSaving && lastSaved && (
                                <span className="text-sm text-gray-500">
                                    Last saved: {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                        <div className="w-24" /> {/* Spacer for centering */}
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>
                                Step {currentStep} of {steps.length}
                            </span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index + 1 <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <span className="text-xs text-gray-600 mt-1 text-center max-w-20">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <CurrentStepComponent data={resumeData} onUpdate={updateResumeData} onNext={handleNext} />
                </div>
            </main>

            {/* Navigation Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between max-w-4xl mx-auto">
                        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>

                        <Button onClick={handleNext} disabled={currentStep === steps.length}>
                            {currentStep === steps.length ? "Complete" : "Next"}
                            {currentStep < steps.length && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    )
}
