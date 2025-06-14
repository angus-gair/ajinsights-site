export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

// Define template types
interface ResumeTemplate {
  id: string
  name: string
  description: string
  category: string
  preview?: string
  content: string
  css?: string
  features: string[]
  isActive: boolean
  isPremium: boolean
}

// Mock template data - In production, this would come from your database
const templates: Record<string, ResumeTemplate> = {
  'data-analyst': {
    id: 'data-analyst',
    name: 'Data Analyst Professional',
    description: 'Optimized for data science and analytics roles',
    category: 'technical',
    features: ['ATS-friendly', 'Data visualization section', 'Technical skills matrix', 'Project highlights'],
    isActive: true,
    isPremium: false,
    content: `
<div class="resume-container data-analyst-template">
  <header class="resume-header">
    <h1 class="name">{{name}}</h1>
    <h2 class="title">{{title || 'Data Analyst'}}</h2>
    <div class="contact-info">
      {{#if email}}<span class="email">{{email}}</span>{{/if}}
      {{#if phone}}<span class="phone">{{phone}}</span>{{/if}}
      {{#if location}}<span class="location">{{location}}</span>{{/if}}
      {{#if linkedin}}<span class="linkedin">{{linkedin}}</span>{{/if}}
    </div>
  </header>

  {{#if summary}}
  <section class="summary-section">
    <h3>Professional Summary</h3>
    <p>{{summary}}</p>
  </section>
  {{/if}}

  <section class="skills-section">
    <h3>Technical Skills</h3>
    <div class="skills-grid">
      <div class="skill-category">
        <h4>Programming Languages</h4>
        <ul>
          {{#each skills.programming}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
      <div class="skill-category">
        <h4>Data Tools</h4>
        <ul>
          {{#each skills.tools}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
      <div class="skill-category">
        <h4>Databases</h4>
        <ul>
          {{#each skills.databases}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
    </div>
  </section>

  <section class="experience-section">
    <h3>Professional Experience</h3>
    {{#each experiences}}
    <div class="job">
      <div class="job-header">
        <h4>{{title}} - {{company}}</h4>
        <span class="dates">{{startDate}} - {{endDate}}</span>
      </div>
      <ul class="achievements">
        {{#each achievements}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    {{/each}}
  </section>

  {{#if projects}}
  <section class="projects-section">
    <h3>Key Projects</h3>
    {{#each projects}}
    <div class="project">
      <h4>{{name}}</h4>
      <p>{{description}}</p>
      <div class="technologies">
        {{#each technologies}}
        <span class="tech-tag">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/each}}
  </section>
  {{/if}}

  <section class="education-section">
    <h3>Education</h3>
    {{#each education}}
    <div class="education-item">
      <h4>{{degree}} - {{school}}</h4>
      <span class="dates">{{graduationDate}}</span>
    </div>
    {{/each}}
  </section>
</div>
    `,
    css: `
.data-analyst-template {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
}

.resume-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 20px;
}

.name {
  font-size: 32px;
  margin: 0;
  color: #2c3e50;
}

.title {
  font-size: 20px;
  color: #7f8c8d;
  margin: 10px 0;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  font-size: 14px;
}

.contact-info span::after {
  content: " |";
  margin-left: 20px;
  color: #bdc3c7;
}

.contact-info span:last-child::after {
  content: "";
}

section {
  margin-bottom: 30px;
}

h3 {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 5px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.skill-category h4 {
  font-size: 14px;
  color: #34495e;
  margin-bottom: 8px;
}

.skill-category ul {
  list-style: none;
  padding: 0;
}

.skill-category li {
  font-size: 13px;
  margin-bottom: 4px;
}

.job {
  margin-bottom: 20px;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.job-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.dates {
  font-size: 14px;
  color: #7f8c8d;
}

.achievements {
  margin-left: 20px;
  font-size: 14px;
}

.achievements li {
  margin-bottom: 5px;
}

.tech-tag {
  display: inline-block;
  background: #ecf0f1;
  padding: 2px 8px;
  margin-right: 5px;
  border-radius: 3px;
  font-size: 12px;
}
    `
  },
  'modern-professional': {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, contemporary design for most industries',
    category: 'professional',
    features: ['Clean layout', 'Modern typography', 'Flexible sections', 'Professional appearance'],
    isActive: true,
    isPremium: false,
    content: `
<div class="resume-container modern-professional">
  <header class="resume-header">
    <h1>{{name}}</h1>
    <p class="tagline">{{title}}</p>
    <div class="contact-bar">
      {{#if email}}<a href="mailto:{{email}}">{{email}}</a>{{/if}}
      {{#if phone}}<span>{{phone}}</span>{{/if}}
      {{#if location}}<span>{{location}}</span>{{/if}}
    </div>
  </header>

  {{#if summary}}
  <section class="summary">
    <p>{{summary}}</p>
  </section>
  {{/if}}

  <section class="main-content">
    <div class="left-column">
      <div class="experience">
        <h2>Experience</h2>
        {{#each experiences}}
        <div class="job-item">
          <h3>{{title}}</h3>
          <p class="company">{{company}} | {{startDate}} - {{endDate}}</p>
          <ul>
            {{#each achievements}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
        {{/each}}
      </div>
    </div>

    <div class="right-column">
      <div class="skills">
        <h2>Skills</h2>
        <div class="skill-list">
          {{#each skills}}
          <span class="skill-tag">{{this}}</span>
          {{/each}}
        </div>
      </div>

      <div class="education">
        <h2>Education</h2>
        {{#each education}}
        <div class="edu-item">
          <h3>{{degree}}</h3>
          <p>{{school}}</p>
          <p class="date">{{graduationDate}}</p>
        </div>
        {{/each}}
      </div>
    </div>
  </section>
</div>
    `,
    css: `
.modern-professional {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  line-height: 1.5;
}

.modern-professional .resume-header {
  background: #f8f9fa;
  padding: 40px;
  text-align: center;
}

.modern-professional h1 {
  font-size: 36px;
  margin: 0;
  font-weight: 300;
}

.modern-professional .tagline {
  font-size: 18px;
  color: #6c757d;
  margin: 10px 0;
}

.modern-professional .contact-bar {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  font-size: 14px;
}

.modern-professional .main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  padding: 40px;
}

.modern-professional h2 {
  font-size: 20px;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.modern-professional .skill-tag {
  display: inline-block;
  background: #e9ecef;
  padding: 5px 12px;
  margin: 5px;
  border-radius: 20px;
  font-size: 13px;
}
    `
  },
  'classic-traditional': {
    id: 'classic-traditional',
    name: 'Classic Traditional',
    description: 'Traditional format for conservative industries',
    category: 'traditional',
    features: ['Traditional layout', 'Formal tone', 'Conservative design', 'Time-tested format'],
    isActive: true,
    isPremium: false,
    content: `<div class="resume-container classic"><!-- Classic template content --></div>`,
    css: `.classic { font-family: 'Times New Roman', serif; }`
  },
  'tech-focused': {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'Designed specifically for technical roles',
    category: 'technical',
    features: ['GitHub integration', 'Code samples section', 'Tech stack display', 'Project showcase'],
    isActive: true,
    isPremium: false,
    content: `<div class="resume-container tech"><!-- Tech template content --></div>`,
    css: `.tech { font-family: 'Source Code Pro', monospace; }`
  },
  'executive-level': {
    id: 'executive-level',
    name: 'Executive Level',
    description: 'Premium design for senior leadership positions',
    category: 'executive',
    features: ['Executive summary', 'Board positions', 'Strategic achievements', 'Leadership focus'],
    isActive: true,
    isPremium: true,
    content: `<div class="resume-container executive"><!-- Executive template content --></div>`,
    css: `.executive { font-family: 'Georgia', serif; }`
  },
  'minimal-clean': {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, distraction-free layout',
    category: 'minimal',
    features: ['Minimalist design', 'Focus on content', 'Clean typography', 'Lots of white space'],
    isActive: true,
    isPremium: false,
    content: `<div class="resume-container minimal"><!-- Minimal template content --></div>`,
    css: `.minimal { font-family: 'Helvetica', sans-serif; }`
  }
}

// GET /api/templates or /api/templates?id=template-id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('id')
    const category = searchParams.get('category')

    // If specific template ID is requested
    if (templateId) {
      const template = templates[templateId]
      if (template) {
        return NextResponse.json(template)
      }
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Filter by category if provided
    let filteredTemplates = Object.values(templates)
    if (category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === category)
    }

    // Return only active templates for non-admin users
    filteredTemplates = filteredTemplates.filter(t => t.isActive)

    return NextResponse.json({
      templates: filteredTemplates,
      total: filteredTemplates.length
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates/preview - Generate preview with sample data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, resumeData } = body

    const template = templates[templateId]
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // In production, you would use a template engine like Handlebars
    // For now, return a simple preview
    const preview = {
      html: template.content,
      css: template.css,
      // This would be the rendered version with actual data
      rendered: `<div class="preview">Preview of ${template.name} with your data</div>`
    }

    return NextResponse.json(preview)
  } catch (error) {
    console.error('Error generating preview:', error)
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}