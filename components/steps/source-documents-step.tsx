"use client"
interface UploadedFile extends File {
  content?: string;
}

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SourceDocumentsStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}



export default function SourceDocumentsStep({ data, onUpdate, onNext }: SourceDocumentsStepProps) {
  const [isClient, setIsClient] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Use parent state as single source of truth
  const uploadedFiles = data.sourceDocuments || []

  // Ensure client-side hydration safety
  useEffect(() => {
    setIsClient(true)
    console.log("📄 SOURCE DOCUMENTS STEP MOUNTED")
    console.log("📄 Initial files from parent:", uploadedFiles.length)
  }, [])

  // Diagnostic logging for source documents step
  useEffect(() => {
    console.log("📄 Parent data changed:", {
      sourceDocuments: uploadedFiles.length,
      hasDocuments: uploadedFiles.length > 0,
      fileNames: uploadedFiles.map((f: UploadedFile) => f.name)
    })
  }, [uploadedFiles]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📤 FILE UPLOAD TRIGGERED");
    setUploadError(null)
    setIsUploading(true)

    try {
      const files = Array.from(event.target.files || [])
      console.log("📤 NEW FILES SELECTED:", files.length, "files")

      if (files.length === 0) {
        console.warn("📤 NO FILES SELECTED")
        setIsUploading(false)
        return
      }

      // Validate file sizes
      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE)
      if (oversizedFiles.length > 0) {
        setUploadError(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 10MB per file.`)
        setIsUploading(false)
        return
      }

      const newFiles = [...uploadedFiles]

      // Read file contents and update state
      await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              newFiles.push({
                ...file,
                content: e.target?.result as string,
              });
              resolve(null);
            };
            reader.onerror = reject;
            reader.readAsText(file);
          });
        })
      );

      console.log("📤 UPDATING PARENT STATE WITH:", newFiles.length, "total files");

      // Update parent state immediately - single source of truth
      onUpdate({ sourceDocuments: newFiles });
      console.log("📤 Parent state updated successfully");

      // Reset the input to allow re-uploading the same file
      event.target.value = ''
    } catch (error) {
      console.error("📤 FILE UPLOAD ERROR:", error)
      setUploadError("Failed to upload files. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    console.log("🗑️ REMOVING FILE AT INDEX:", index);
    const fileToRemove: UploadedFile = uploadedFiles[index];
    console.log("🗑️ Removing file:", fileToRemove.name);

    const newFiles = uploadedFiles.filter((_: UploadedFile, i: number) => i !== index);
    console.log("🗑️ NEW FILES ARRAY:", newFiles.length, "files remaining");

    // Update parent state immediately
    onUpdate({ sourceDocuments: newFiles })
    setUploadError(null) // Clear any errors when successfully removing
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    // You could add different icons for different file types here
    // For now, all files get the same icon
    return <FileText className="h-5 w-5 text-blue-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Source Documents</h2>
        <p className="text-gray-600">
          Upload your existing CV, cover letters, portfolios, and other relevant documents
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Add Documents</CardTitle>
          <CardDescription>
            Upload documents that contain information about your experience, skills, and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
              <Upload className={`h-12 w-12 mx-auto mb-4 ${isUploading ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                }`} />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isUploading ? 'Uploading...' : 'Drop files here or click to browse'}
                </p>
                <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, TXT, MD • Maximum 10MB per file</p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload resume documents"
                aria-label="Upload resume documents"
                disabled={isUploading}
              />
            </div>
            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents ({uploadedFiles.length})</CardTitle>
            <CardDescription>These documents will be used to generate your tailored resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file: UploadedFile, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Types Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Essential Documents</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Current CV/Resume</li>
                <li>• Cover Letters</li>
                <li>• LinkedIn Profile Export</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Additional Documents</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Portfolio Descriptions</li>
                <li>• Project Summaries</li>
                <li>• Achievement Lists</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={() => {
            console.log("🎯 CONTINUE BUTTON CLICKED");
            console.log("🎯 Current files:", uploadedFiles.length);
            console.log("🎯 File names:", uploadedFiles.map((f: UploadedFile) => f.name));

            if (uploadedFiles.length === 0) {
              console.error("🚨 NO FILES TO CONTINUE WITH")
              setUploadError("Please upload at least one document before continuing.")
              return
            }

            // Clear any errors
            setUploadError(null)

            // Call onNext immediately - no delay needed
            console.log("🎯 Proceeding to next step")
            onNext()
          }}
          disabled={uploadedFiles.length === 0 || isUploading}
          size="lg"
        >
          Continue to Configuration
          {uploadedFiles.length === 0 && <span className="ml-2 text-xs">(Upload at least one document)</span>}
        </Button>

        {/* Add a reset button for when users get stuck */}
        {uploadedFiles.length === 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("🔄 RESET CLICKED - Clearing session storage")
              sessionStorage.removeItem('resumeCurrentStep')
              sessionStorage.removeItem('resumeData')
              window.location.reload()
            }}
          >
            Having issues? Reset and try again
          </Button>
        )}
      </div>
    </div>
  )
}
