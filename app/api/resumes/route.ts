import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { ResumeStatus } from '@prisma/client'

// GET /api/resumes - Get all resumes or a specific resume by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId') // For future user-specific queries

    if (id) {
      // Get specific resume with related data
      const resume = await prisma.resume.findUnique({
        where: { id },
        include: {
          sourceDocuments: true,
          resumeVersions: {
            orderBy: { versionNumber: 'desc' },
            take: 5 // Get last 5 versions
          }
        }
      })

      if (!resume) {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(resume)
    }

    // Get all resumes (with pagination)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where: userId ? { userId } : {},
        include: {
          sourceDocuments: {
            select: {
              id: true,
              fileName: true,
              fileSize: true,
              fileType: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.resume.count({
        where: userId ? { userId } : {}
      })
    ])

    return NextResponse.json({
      resumes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}

// POST /api/resumes - Create a new resume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.sourceDocuments || body.sourceDocuments.length === 0) {
      return NextResponse.json(
        { error: 'At least one source document is required' },
        { status: 400 }
      )
    }

    // Create resume with related data in a transaction
    const resume = await prisma.$transaction(async (tx) => {
      // Create the resume
      const newResume = await tx.resume.create({
        data: {
          userId: body.userId,
          jobDescription: body.jobDescription || body.jobText,
          jobFileName: body.jobFileName,
          jobFileSize: body.jobFileSize,
          aiModel: body.generationConfig?.aiModel,
          template: body.generationConfig?.template,
          languageStyle: body.generationConfig?.language,
          wordLimit: body.generationConfig?.wordLimit,
          emphasisAreas: body.generationConfig?.emphasis || [],
          status: ResumeStatus.DRAFT
        }
      })

      // Create source documents
      if (body.sourceDocuments && body.sourceDocuments.length > 0) {
        await tx.sourceDocument.createMany({
          data: body.sourceDocuments.map((doc: any) => ({
            resumeId: newResume.id,
            fileName: doc.name,
            fileSize: doc.size,
            fileType: doc.type,
            // In production, you would upload files to cloud storage and store URLs
            fileUrl: null,
            fileContent: doc.content // If you're storing content directly
          }))
        })
      }

      // Return resume with documents
      return await tx.resume.findUnique({
        where: { id: newResume.id },
        include: { sourceDocuments: true }
      })
    })

    return NextResponse.json(
      { 
        message: 'Resume created successfully',
        resume 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating resume:', error)
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    )
  }
}

// PUT /api/resumes - Update an existing resume
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      )
    }

    // Check if resume exists
    const existingResume = await prisma.resume.findUnique({
      where: { id },
      include: { resumeVersions: { orderBy: { versionNumber: 'desc' }, take: 1 } }
    })

    if (!existingResume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Update resume data
    const updatedData: any = {}
    
    if (updateData.jobDescription !== undefined) {
      updatedData.jobDescription = updateData.jobDescription
    }
    if (updateData.generatedResume !== undefined) {
      updatedData.generatedResume = updateData.generatedResume
      updatedData.status = ResumeStatus.GENERATED
    }
    if (updateData.finalResume !== undefined) {
      updatedData.finalResume = updateData.finalResume
      updatedData.status = ResumeStatus.FINALIZED
      
      // Create a version entry for the finalized resume
      const lastVersion = existingResume.resumeVersions[0]
      const newVersionNumber = (lastVersion?.versionNumber || 0) + 1
      
      await prisma.resumeVersion.create({
        data: {
          resumeId: id,
          versionNumber: newVersionNumber,
          content: updateData.finalResume,
          changelog: updateData.changelog || 'Resume finalized'
        }
      })
    }
    if (updateData.status !== undefined) {
      updatedData.status = updateData.status
    }
    if (updateData.generationConfig) {
      if (updateData.generationConfig.aiModel) updatedData.aiModel = updateData.generationConfig.aiModel
      if (updateData.generationConfig.template) updatedData.template = updateData.generationConfig.template
      if (updateData.generationConfig.language) updatedData.languageStyle = updateData.generationConfig.language
      if (updateData.generationConfig.wordLimit) updatedData.wordLimit = updateData.generationConfig.wordLimit
      if (updateData.generationConfig.emphasis) updatedData.emphasisAreas = updateData.generationConfig.emphasis
    }

    // Update resume
    const updatedResume = await prisma.resume.update({
      where: { id },
      data: updatedData,
      include: { sourceDocuments: true }
    })

    return NextResponse.json({
      message: 'Resume updated successfully',
      resume: updatedResume
    })
  } catch (error) {
    console.error('Error updating resume:', error)
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    )
  }
}

// DELETE /api/resumes - Delete a resume
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      )
    }

    // Check if resume exists
    const resume = await prisma.resume.findUnique({
      where: { id }
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Delete resume (cascade will handle related records)
    await prisma.resume.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Resume deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting resume:', error)
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}
