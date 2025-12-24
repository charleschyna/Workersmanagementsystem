# Workers Management System

A comprehensive task and payroll management system built with Next.js 14, PostgreSQL, and Prisma.

## Features

- **Employee Portal**: Submit claims, manage assigned accounts
- **Manager Dashboard**: Review claims, assign accounts, manage payroll
- **Account Management**: Assign work accounts to employees with accept/pause/leave workflow
- **Payroll System**: Automatic calculation at $15/hour with mark as paid functionality
- **Employee History**: View detailed claim history per employee with date filtering

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

## Getting Started

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed the database
node prisma/seed.js

# Start development server
npm run dev
```

## Default Credentials

- **Manager**: `manager` / `password123`
- **Employee**: `charles` / `password123`

## Deployment

This app is ready to deploy on Vercel. Make sure to set the environment variables in your Vercel project settings.
# Trigger rebuild
