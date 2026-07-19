<div align="center">

# 📚 BookDom — University Library Management System

**A modern, full-stack university library platform built with Next.js 16, Drizzle ORM, Neon PostgreSQL, and Upstash Redis.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-C5F74F?style=for-the-badge)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)

[Live Demo](https://bookdom-pied.vercel.app/sign-in) · [Report Bug](https://github.com/codesbysaravana/University_Library/issues) · [Request Feature](https://github.com/codesbysaravana/University_Library/issues)

</div>

---

## 🌟 Overview

**BookDom** is a comprehensive university library management system that allows students to browse, borrow, and manage books digitally. It features a student-facing portal and a role-gated admin dashboard for librarians to manage inventory, approve accounts, and track borrow requests.

## ✨ Features

- **🎓 Student Portal**: Browse the catalog, view book trailers, and one-click borrow with real-time availability tracking.
- **🛡️ Admin Dashboard**: Role-based access for librarians to manage users, track borrows, and add new books.
- **⚙️ Platform Security**: Upstash Redis-based IP rate limiting (5 req/min) and NextAuth.js JWT authentication.
- **📧 Automated Onboarding**: Upstash Workflow-driven welcome & re-engagement email sequences via SendGrid.
- **☁️ File Storage**: ImageKit CDN integration for fast image and video uploads.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL (Serverless) + Drizzle ORM
- **Auth**: NextAuth.js v5 (Edge Compatible)
- **Cache & Workflows**: Upstash Redis + Upstash QStash
- **Styling**: Tailwind CSS + shadcn/ui

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph Client["🖥️ Client Browser"]
        UI["React 19 UI"]
        IK_CLIENT["ImageKit SDK"]
    end

    subgraph NextJS["⚡ Next.js 16"]
        PROXY["Proxy (Auth Guard)"]
        PAGES["Server & Client Components"]
        API["API Routes & Server Actions"]
    end

    subgraph External["☁️ External Services"]
        NEON["Neon PostgreSQL"]
        REDIS["Upstash Redis / QStash"]
        SENDGRID["SendGrid Email"]
        IMAGEKIT["ImageKit CDN"]
    end

    UI -->|"Interactions"| PAGES
    UI -->|"File Upload"| IK_CLIENT
    IK_CLIENT -->|"Upload Files"| IMAGEKIT
    
    PROXY -->|"Verify Session"| PAGES
    PAGES -->|"Actions"| API

    API -->|"Query/Insert"| NEON
    API -->|"Rate Limit / Workflow"| REDIS
    REDIS -->|"Trigger Email"| SENDGRID
```

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS ||--o{ BORROW_RECORDS : "borrows"
    BOOKS ||--o{ BORROW_RECORDS : "is borrowed"

    USERS {
        uuid id PK
        varchar full_name
        text email
        text password
        status_enum status
        role_enum role
    }

    BOOKS {
        uuid id PK
        varchar title
        varchar author
        integer available_copies
        text cover_url
        text video_url
    }

    BORROW_RECORDS {
        uuid id PK
        uuid user_id FK
        uuid book_id FK
        borrow_status_enum status
    }
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# ImageKit CDN
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxx

# API Endpoint
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# NextAuth
AUTH_SECRET="your-auth-secret-key"

# Upstash
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="your-qstash-token"

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

---

## 🚀 Getting Started

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codesbysaravana/University_Library.git
cd university-library

# 2. Install dependencies
npm install

# 3. Generate and run database migrations
npm run db:generate
npm run db:migrate

# 4. Seed the database (optional)
npm run seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---
