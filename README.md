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

### 🎓 Student Portal
- **Browse Catalog** — View the latest books with cover images, ratings, genres, and descriptions.
- **Book Detail View** — Full book details with video trailers, summaries, and borrow eligibility checks.
- **Borrow Books** — One-click borrowing with real-time availability tracking.

### 🛡️ Admin Dashboard
- **Role-Based Access** — Only `ADMIN` role users can access `/admin` routes.
- **Book Management** — Create new books with cover images, trailers, color pickers, and metadata.
- **Account Approval** — Approve or reject pending student registrations.

### ⚙️ Platform Features
- **Rate Limiting** — Upstash Redis-based IP rate limiting (5 requests/minute).
- **Automated Onboarding** — Upstash Workflow-driven welcome & re-engagement email sequences.
- **File Uploads** — ImageKit CDN with client-side auth and progress tracking.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: Neon PostgreSQL (Serverless) + Drizzle ORM
- **Authentication**: NextAuth.js v5 (Edge-compatible config via `proxy.ts`)
- **Cache & Workflows**: Upstash Redis + Upstash QStash
- **Email Delivery**: SendGrid
- **File Storage**: ImageKit CDN
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI

---

## 🏗️ Architecture Overview

### High-Level System Architecture

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

### Request / Response Lifecycle (Borrowing a Book)

```mermaid
sequenceDiagram
    actor User
    participant UI as BorrowBook Component
    participant Action as Server Action
    participant DB as Neon DB

    User->>UI: Click "Borrow"
    UI->>Action: borrowBook({ bookId, userId })
    Action->>DB: SELECT available_copies
    DB-->>Action: Returns copies count

    alt Copies Available > 0
        Action->>DB: INSERT INTO borrow_records (dueDate: +7 days)
        Action->>DB: UPDATE books SET available_copies - 1
        Action-->>UI: { success: true }
        UI-->>User: Success Toast & Redirect
    else No Copies
        Action-->>UI: { success: false, error: "Unavailable" }
        UI-->>User: Error Toast
    end
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS ||--o{ BORROW_RECORDS : "borrows"
    BOOKS ||--o{ BORROW_RECORDS : "is borrowed"

    USERS {
        uuid id PK "gen_random_uuid()"
        varchar full_name "NOT NULL"
        text email "NOT NULL, UNIQUE"
        text password "NOT NULL, bcrypt"
        status_enum status "DEFAULT 'PENDING'"
        role_enum role "DEFAULT 'USER'"
        date last_activity_date
    }

    BOOKS {
        uuid id PK "gen_random_uuid()"
        varchar title "NOT NULL"
        varchar author "NOT NULL"
        integer total_copies "DEFAULT 1"
        integer available_copies "DEFAULT 0"
        text cover_url "ImageKit Path"
        text video_url "ImageKit Path"
    }

    BORROW_RECORDS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK
        uuid book_id FK
        date due_date "NOT NULL"
        borrow_status_enum status "DEFAULT 'BORROWED'"
    }
```

---

## 🚀 Key Pipelines

### Authentication & Proxy
Authentication runs using **NextAuth.js v5**. Because Next.js 16 enforces strict runtime constraints, the application splits the auth config:
- `auth.config.ts`: Contains lightweight session strategies and callbacks (runs on Edge).
- `auth.ts`: Contains database adapters (runs on Node).
- `proxy.ts`: Intercepts route requests at the Edge to protect authenticated routes (`/admin`, `/my-profile`).

### Background Workflows
The onboarding workflow uses **Upstash QStash**:
1. User signs up.
2. A welcome email is sent via SendGrid.
3. The workflow pauses for 3 days.
4. It polls user activity, sending "We miss you" emails or standard updates based on the last logged activity.

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
cd bookdom

# 2. Install dependencies
# Note: Next.js 16 upgrade relies on the .npmrc legacy-peer-deps rule for ImageKit
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

<div align="center">
**Built with ❤️ by [Saravana Priyan](https://github.com/codesbysaravana)**
</div>
