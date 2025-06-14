import { NextRequest, NextResponse } from 'next/server';

// This would normally come from your database
const getTemplateById = (id: string) => {
    // Mock implementation - replace with database query
    const templates: Record<string, any> = {
        'data-analyst': {
            id: 'data-analyst',
            name: 'Data Analyst Professional',
            description: 'Optimized for data science and analytics roles',
            content: '<div>Template HTML content</div>',
            css: '.template { color: #333; }'
        }
        // ... other templates
    }
    return templates[id];
}

export async function GET(
    request: NextRequest,
    { params }: { params: { templateId: string } }
) {
    try {
        const template = getTemplateById(params.templateId)

        if (!template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(template)
    } catch (error) {
        console.error('Error fetching template:', error)
        return NextResponse.json(
            { error: 'Failed to fetch template' },
            { status: 500 }
        )
    }
}