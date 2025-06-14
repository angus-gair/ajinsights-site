#!/usr/bin/env node

/**
 * Database Setup Script
 * This script will help you set up the database for the resume creation application
 * 
 * Usage:
 * 1. npm install (to install dependencies including Prisma)
 * 2. npm run db:setup (or node scripts/setup-database.js)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Resume Creator Database Setup\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your database connection string.');
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

try {
  console.log('🔄 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n📋 Creating database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Run "npm run dev" to start the development server');
  console.log('2. Run "npm run db:studio" to open Prisma Studio and view your database');
  console.log('3. The application will auto-save resume data to the database');
  
} catch (error) {
  console.error('\n❌ Database setup failed!');
  console.error(error.message);
  console.log('\n🔍 Troubleshooting:');
  console.log('1. Ensure PostgreSQL is running on localhost:5432');
  console.log('2. Check your DATABASE_URL in .env.local');
  console.log('3. Make sure the database "resume_creator" exists');
  console.log('\nTo create the database manually:');
  console.log('psql -U postgres -c "CREATE DATABASE resume_creator;"');
  process.exit(1);
}
