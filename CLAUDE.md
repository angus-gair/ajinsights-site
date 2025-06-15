# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based resume creation framework that uses AI to generate tailored resumes. The application guides users through a 6-step workflow: Job Description → Source Documents → Configuration → Generation → Review & Edit → Export.

## Key Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Testing
- `npm test` - Run all Jest tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests
- `npm run test:api` - Run API tests
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:coverage` - Run tests with coverage report

### Database (Prisma + PostgreSQL)
- `npm run db:setup` - Complete database setup (generates client and pushes schema)
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations

## Architecture

### Multi-Step Workflow
The application implements a wizard-style interface with 6 steps managed in `/app/create/page.tsx`:
1. **JobDescriptionStep** - Upload/input job posting
2. **SourceDocumentsStep** - Upload CV and supporting documents  
3. **ConfigurationStep** - Select AI model, template, language style
4. **GenerationStep** - AI generates tailored resume
5. **ReviewStep** - User reviews and edits the generated content
6. **ExportStep** - Download as HTML or PDF

### State Management
- Uses React `useState` for local component state
- Implements auto-save functionality that persists to database every 2 seconds
- Session storage backup for client-side persistence
- Centralized `resumeData` object passed between step components

### Database Schema
Uses Prisma ORM with PostgreSQL:
- **Resume** - Main entity storing job description, config, generated content
- **SourceDocument** - File metadata for uploaded documents
- **ResumeVersion** - Version history tracking
- **User** - Authentication (future feature)

### API Structure
- `/app/api/resumes/route.ts` - CRUD operations for resumes
- `/app/api/templates/route.ts` - Template management
- `/app/api/templates/[templateId]/route.ts` - Individual template operations

### Component Architecture
- Step components in `/components/steps/` follow consistent interface: `{ data, onUpdate, onNext }`
- Shadcn/ui components in `/components/ui/`
- Shared utilities in `/lib/utils.ts`
- API client in `/lib/api/resume-api.ts`

### Styling & UI
- Tailwind CSS for styling
- Shadcn/ui component library with Radix UI primitives
- Responsive design with mobile-first approach
- Custom theme provider for dark/light mode support

## Important Patterns

### Step Component Interface
All step components must implement:
```typescript
interface StepProps {
  data: ResumeData
  onUpdate: (data: Partial<ResumeData>) => void
  onNext: () => void
}
```

### Auto-Save Pattern
The main create page implements debounced auto-save:
- Saves 2 seconds after last change
- Shows saving indicators in UI
- Handles save failures gracefully
- Validates data before allowing step progression

### File Handling
- Files stored as File objects in component state
- File metadata persisted to database
- File objects cannot be restored from session storage (limitation noted in code)

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
- Located in `/tests/unit/`
- Test individual components and utilities
- Use `jest.setup.ts` for test configuration

### Integration Tests
- Located in `/tests/integration/`
- Test API endpoints and database interactions

### End-to-End Tests (Playwright)
- Located in `/tests/e2e/`
- Test complete user workflows
- Configured to run against localhost:3000

### Test Configuration
- Jest config in `jest.config.js` with Next.js integration
- Playwright config in `playwright.config.ts`
- Separate TypeScript config for tests: `tsconfig.test.json`

## Development Notes

### Database Setup Required
New developers must run `npm run db:setup` after `npm install` to initialize the PostgreSQL database. See `DATABASE_SETUP.md` for detailed instructions.

### Session Storage Limitations
File objects cannot be serialized to session storage, so users must re-upload files after page refresh. This is documented in the code with warnings.

### Auto-Save Behavior
The application automatically saves progress every 2 seconds when meaningful data changes. This creates database entries even for incomplete resumes.

### Type Safety
Strict TypeScript configuration with path aliases configured for cleaner imports (`@/components`, `@/lib`, etc.).