# Database Setup Instructions

## Overview
This application now uses PostgreSQL for persistent storage of resume data. The database automatically saves your progress as you work through the resume creation process.

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database Connection
The `.env.local` file has been created with your database credentials:
```
DATABASE_URL="postgresql://postgres:Yb2ywEVqAh3agY@localhost:5432/resume_creator?schema=public"
```

### 3. Create Database
First, create the database if it doesn't exist:
```bash
psql -U postgres -p 5432 -h localhost -c "CREATE DATABASE resume_creator;"
```
Enter password when prompted: `Yb2ywEVqAh3agY`

### 4. Set Up Database Tables
Run the setup script:
```bash
npm run db:setup
```

Or manually run:
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Create tables in database
```

## Available Database Commands

- `npm run db:setup` - Complete database setup
- `npm run db:studio` - Open Prisma Studio (GUI for viewing/editing data)
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:format` - Format the Prisma schema file

## Features

### Automatic Saving
- Resume data is automatically saved to the database every 2 seconds after changes
- You'll see "Saving..." and "Last saved" indicators in the UI
- No need to manually save - everything is persisted automatically

### Data Persistence
The following data is saved:
- Job descriptions (text or file metadata)
- Source document information
- Configuration settings (AI model, template, language style)
- Generated resume content
- Final edited resume
- Version history

### File Handling
- File metadata is stored in the database
- For production, you would integrate cloud storage (AWS S3, etc.) for actual file storage
- Currently, file information is preserved but files need to be re-uploaded after page refresh

## Troubleshooting

### Cannot connect to database
1. Ensure PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-14  # or your version
   
   # Linux/Mac
   sudo systemctl start postgresql
   ```

2. Check if you can connect:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### Database already exists error
This is fine - the database is already created. Continue with the setup.

### Permission denied
Make sure your PostgreSQL user has the necessary permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE resume_creator TO postgres;
```

## Viewing Your Data

### Using Prisma Studio
```bash
npm run db:studio
```
This opens a web interface at http://localhost:5555 where you can:
- View all resumes
- See source documents
- Check resume versions
- Manually edit data

### Direct Database Access
```bash
psql -U postgres -d resume_creator
\dt  # List all tables
SELECT * FROM "Resume";  # View resumes
```

## Next Steps
1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Create a resume - it will be automatically saved to the database
4. Use Prisma Studio to view your saved data: `npm run db:studio`
