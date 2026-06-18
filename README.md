# Spamurai

An AI-powered productivity platform that brings your email, calendar, and workflows into one intelligent workspace.

Spamurai helps you manage conversations, schedules, and daily tasks without constantly switching between applications. By connecting Gmail and Google Calendar, users can interact with their data through an AI-first experience designed to improve productivity and reduce context switching.

---

## Features

### Authentication
- Email & Password Authentication
- Google OAuth
- JWT-based Sessions
- Email Verification
- Protected Routes

### Gmail Integration
- Connect Gmail with one click
- Read Inbox Messages
- View Recent Emails
- Draft Management
- Send Emails
- Search Emails
- Email Actions & Automation

### Google Calendar Integration
- Connect Google Calendar
- View Upcoming Events
- Create Events
- Update Events
- Delete Events
- Schedule Management

### AI Workspace
- AI-powered productivity assistant
- Context-aware workflows
- Natural language interactions
- Email and calendar actions through AI
- Unified productivity experience

### Dashboard
- Gmail Overview
- Calendar Overview
- Integration Status
- Activity Tracking
- Productivity Insights

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

### Backend
- tRPC
- Node.js
- TypeScript

### Database
- PostgreSQL
- Drizzle ORM

### Authentication
- JWT Authentication
- Google OAuth 2.0

### Integrations
- Corsair
- Gmail API
- Google Calendar API

### AI
- OpenAI

### Infrastructure
- Docker
- Turborepo
- PNPM

---

## Architecture

```text
Frontend
    ↓
tRPC Client
    ↓
tRPC Router
    ↓
Service Layer
    ↓
Corsair Integrations
    ↓
Google APIs

Database
    ↓
PostgreSQL
    ↓
Drizzle ORM
```

---

## Current Progress

### Completed
- Authentication System
- Email Verification
- Google OAuth
- JWT Authentication
- Gmail Connection Flow
- Corsair Integration Setup
- Database Architecture
- Service Layer Architecture
- tRPC API Structure
- Dashboard Foundation

### In Progress
- Calendar Integration
- Inbox Synchronization
- AI Memory System
- Analytics
- Workflow Automation
- Real-Time Updates

---

## Project Structure

```bash
apps/
├── web/

packages/
├── database/
├── services/
├── trpc/
├── ui/
```

---

## Vision

Spamurai aims to become an AI productivity operating system where users can:

- Manage emails
- Manage schedules
- Automate workflows
- Access context-aware AI assistance
- Perform actions across connected applications

All from a single interface.

---

## Why Spamurai?

Most professionals spend their day switching between:

- Gmail
- Calendar
- Notes
- Tasks
- AI Tools

Spamurai brings everything together into one AI-powered workspace that understands context and helps users get work done faster.

---

## Built With

Next.js • React • TypeScript • tRPC • PostgreSQL • Drizzle ORM • Tailwind CSS • React Query • Zod • JWT Authentication • Google OAuth • Corsair • Gmail API • Google Calendar API • OpenAI • Turborepo • PNPM • Docker

---

### Builder Mode: ON 🚀