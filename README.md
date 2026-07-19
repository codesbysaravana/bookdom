<div align="center">

# 📚 BookDom — University Library Management System

**A modern, full-stack university library platform built with Next.js 15, Drizzle ORM, Neon PostgreSQL, and Upstash Redis.**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-C5F74F?style=for-the-badge)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)

[Live Demo](https://bookdom-pied.vercel.app/sign-in) · [Report Bug](https://github.com/codesbysaravana/University_Library/issues) · [Request Feature](https://github.com/codesbysaravana/University_Library/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Request / Response Lifecycle](#-request--response-lifecycle)
- [API Reference](#-api-reference)
- [Server Actions](#-server-actions)
- [Component Architecture](#-component-architecture)
- [Onboarding Workflow](#-onboarding-workflow)
- [Rate Limiting](#-rate-limiting)
- [File Upload Pipeline](#-file-upload-pipeline)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [Docker Deployment](#-docker-deployment)
- [Scripts Reference](#-scripts-reference)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌟 Overview

**BookDom** is a comprehensive university library management system that allows students to browse, borrow, and manage books digitally. It features a student-facing portal and a role-gated admin dashboard for librarians to manage inventory, approve accounts, and track borrow requests.

The platform implements industry best practices including JWT-based authentication, IP-based rate limiting, automated onboarding email workflows, and serverless PostgreSQL with Drizzle ORM migrations.

---

## ✨ Features

### 🎓 Student Portal
- **Browse Catalog** — View the latest books with cover images, ratings, genres, and descriptions
- **Book Detail View** — Full book details with video trailers, summaries, and borrow eligibility checks
- **Borrow Books** — One-click borrowing with real-time availability tracking
- **User Profile** — Personal account management and sign-out functionality
- **University Card Upload** — ImageKit-powered ID card upload during registration

### 🛡️ Admin Dashboard
- **Role-Based Access** — Only `ADMIN` role users can access `/admin` routes
- **Book Management** — Create new books with cover images, trailers, color pickers, and metadata
- **User Management** — View all registered users
- **Borrow Request Tracking** — Monitor active borrow records
- **Account Approval** — Approve or reject pending student registrations

### ⚙️ Platform Features
- **Rate Limiting** — Upstash Redis-based IP rate limiting (5 requests/minute)
- **Automated Onboarding** — Upstash Workflow-driven welcome & re-engagement email sequences
- **Email Notifications** — SendGrid-powered transactional emails
- **File Uploads** — ImageKit CDN with client-side auth and progress tracking
- **Form Validation** — Zod schema validation with React Hook Form integration
- **Toast Notifications** — Sonner-based success/error feedback

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Server/client rendering, routing, API routes |
| **Runtime** | React 19 + TypeScript 5 | UI components with type safety |
| **Styling** | Tailwind CSS 3.4 | Utility-first responsive design |
| **Database** | Neon PostgreSQL (Serverless) | Serverless Postgres via WebSocket |
| **ORM** | Drizzle ORM 0.44 | Type-safe SQL queries & migrations |
| **Auth** | NextAuth.js v5 (Beta 28) | JWT sessions with credentials provider |
| **Cache/Queue** | Upstash Redis | Rate limiting & workflow state |
| **Workflows** | Upstash QStash + Workflow | Durable background email sequences |
| **Email** | SendGrid | Transactional email delivery |
| **File Storage** | ImageKit | Image/video upload, CDN, & transformations |
| **Forms** | React Hook Form + Zod | Form state management & schema validation |
| **UI Components** | Radix UI + shadcn/ui | Accessible, composable primitives |
| **Notifications** | Sonner | Toast notification system |
| **Deployment** | Vercel + Docker | Serverless deployment & containerization |

---

## 🏗️ Architecture Overview

### High-Level System Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client Browser"]
        UI["React 19 UI"]
        RHF["React Hook Form"]
        IK_CLIENT["ImageKit Client SDK"]
    end

    subgraph NextJS["⚡ Next.js 15 App Router"]
        MW["Middleware - Auth Guard"]
        
        subgraph Pages["📄 Pages - Server Components"]
            AUTH_PAGES["Auth Pages - sign-in / sign-up"]
            ROOT_PAGES["Root Pages - home / books / profile"]
            ADMIN_PAGES["Admin Pages - dashboard / books"]
            TOO_FAST["Too Fast - Rate Limit Page"]
        end
        
        subgraph API["🔌 API Routes"]
            AUTH_API["NextAuth API - /api/auth/[...nextauth]"]
            IK_API["ImageKit Auth - /api/auth/imagekit"]
            WF_API["Onboarding Workflow - /api/workflows/onboarding"]
        end
        
        subgraph Actions["⚙️ Server Actions"]
            AUTH_ACTIONS["signIn / signUp"]
            BOOK_ACTIONS["borrowBook"]
            ADMIN_ACTIONS["createBook"]
        end
    end

    subgraph External["☁️ External Services"]
        NEON["Neon PostgreSQL"]
        REDIS["Upstash Redis"]
        QSTASH["Upstash QStash"]
        SENDGRID["SendGrid Email"]
        IMAGEKIT["ImageKit CDN"]
    end

    UI -->|"Form Submit"| RHF
    RHF -->|"Server Action"| Actions
    UI -->|"File Upload"| IK_CLIENT
    IK_CLIENT -->|"Auth Request"| IK_API
    IK_CLIENT -->|"Upload Files"| IMAGEKIT

    MW -->|"Verify Session"| Pages
    AUTH_PAGES -->|"Credentials"| AUTH_ACTIONS
    ROOT_PAGES -->|"Borrow"| BOOK_ACTIONS
    ADMIN_PAGES -->|"Create"| ADMIN_ACTIONS

    AUTH_ACTIONS -->|"Rate Check"| REDIS
    AUTH_ACTIONS -->|"Query/Insert"| NEON
    AUTH_ACTIONS -->|"Trigger Workflow"| QSTASH
    BOOK_ACTIONS -->|"Query/Insert"| NEON
    ADMIN_ACTIONS -->|"Insert"| NEON

    WF_API -->|"Send Email"| SENDGRID
    WF_API -->|"Check State"| NEON
    QSTASH -->|"Invoke"| WF_API

    AUTH_API -->|"JWT"| UI

    style Client fill:#1a1a2e,stroke:#e94560,color:#fff
    style NextJS fill:#16213e,stroke:#0f3460,color:#fff
    style External fill:#0f3460,stroke:#533483,color:#fff
```

### Next.js Rendering Strategy

```mermaid
graph LR
    subgraph SSR["Server-Side Rendered"]
        HOME["Home Page"]
        BOOK_DETAIL["Book Detail Page"]
        PROFILE["Profile Page"]
        ADMIN_DASH["Admin Dashboard"]
        ADMIN_BOOKS["Admin Books"]
    end

    subgraph CSR["Client-Side Rendered"]
        AUTH_FORM["AuthForm Component"]
        BORROW_BTN["BorrowBook Component"]
        FILE_UP["FileUpload Component"]
        BOOK_FORM["BookForm Component"]
        SIDEBAR["Admin Sidebar"]
        COLOR_PICK["ColorPicker"]
    end

    SSR -->|"Hydration"| CSR

    style SSR fill:#1B4332,stroke:#2D6A4F,color:#fff
    style CSR fill:#3A0CA3,stroke:#4361EE,color:#fff
```

---

## 📁 Project Structure

```
university-library/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no layout nesting with root)
│   │   ├── layout.tsx            # Auth layout with illustration sidebar
│   │   ├── sign-in/page.tsx      # Sign-in page
│   │   └── sign-up/page.tsx      # Sign-up page
│   ├── (root)/                   # Main app route group
│   │   ├── layout.tsx            # Root layout with Header + auth guard
│   │   ├── page.tsx              # Home page — book overview + latest books
│   │   ├── books/[id]/page.tsx   # Dynamic book detail page
│   │   └── my-profile/page.tsx   # User profile page
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx            # Admin layout with Sidebar + role guard
│   │   ├── page.tsx              # Admin home
│   │   └── books/
│   │       ├── page.tsx          # All books listing
│   │       └── new/page.tsx      # Create new book form
│   ├── api/                      # API route handlers
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth catch-all route
│   │   │   └── imagekit/route.ts # ImageKit authentication endpoint
│   │   └── workflows/
│   │       └── onboarding/route.ts # Upstash onboarding workflow
│   ├── too-fast/page.tsx         # Rate limit exceeded page
│   ├── layout.tsx                # Root layout — fonts, SessionProvider, Toaster
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── AuthForm.tsx              # Generic auth form (sign-in / sign-up)
│   ├── BookCard.tsx              # Book card for list display
│   ├── BookCover.tsx             # Book cover with SVG frame
│   ├── BookCoverSvg.tsx          # SVG book cover template
│   ├── BookList.tsx              # Book list grid container
│   ├── BookOverview.tsx          # Hero book overview section
│   ├── BookVideo.tsx             # Book trailer video player
│   ├── BorrowBook.tsx            # Borrow button with eligibility check
│   ├── FileUpload.tsx            # ImageKit file upload with progress
│   ├── Header.tsx                # Main app header with logout
│   ├── admin/
│   │   ├── ColorPicker.tsx       # Color picker for book covers
│   │   ├── Header.tsx            # Admin header
│   │   ├── Sidebar.tsx           # Admin sidebar navigation
│   │   └── forms/
│   │       └── BookForm.tsx      # Admin book creation form
│   └── ui/                       # shadcn/ui primitives
│
├── database/                     # Database layer
│   ├── drizzle.ts                # Drizzle ORM client initialization
│   ├── redis.ts                  # Upstash Redis client
│   ├── schema.ts                 # Drizzle table schemas & enums
│   └── seed.ts                   # Database seeding script
│
├── lib/                          # Shared utilities & business logic
│   ├── actions/
│   │   ├── auth.ts               # Auth server actions (signIn, signUp)
│   │   └── book.ts               # Book server actions (borrowBook)
│   ├── admin/actions/
│   │   └── book.ts               # Admin server actions (createBook)
│   ├── config.ts                 # Centralized env config object
│   ├── ratelimit.ts              # Upstash rate limiter setup
│   ├── redis.ts                  # Redis client export
│   ├── sendEmail.ts              # SendGrid email utility
│   ├── utils.ts                  # General utilities (cn, getInitials)
│   ├── validation.ts             # Zod validation schemas
│   └── workflow.ts               # Upstash Workflow client + email helper
│
├── constants/index.ts            # App constants (nav links, field mappings, sample data)
├── types.d.ts                    # Global TypeScript interfaces
├── migrations/                   # Drizzle SQL migrations
├── public/                       # Static assets
│   ├── icons/                    # SVG icons
│   ├── images/                   # Static images
│   └── fonts/                    # Local font files (IBM Plex Sans, Bebas Neue)
├── styles/admin.css              # Admin-specific styles
│
├── auth.ts                       # NextAuth v5 configuration
├── middleware.ts                  # Next.js middleware (auth guard)
├── drizzle.config.ts             # Drizzle Kit configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── docker-compose.yml            # Docker Compose for local dev
├── Dockerfile                    # Multi-stage Docker build
└── package.json                  # Dependencies & scripts
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ BORROW_RECORDS : "borrows"
    BOOKS ||--o{ BORROW_RECORDS : "is borrowed"

    USERS {
        uuid id PK "gen_random_uuid()"
        varchar full_name "NOT NULL, 255 chars"
        text email "NOT NULL, UNIQUE"
        integer university_id "NOT NULL"
        text password "NOT NULL, bcrypt hashed"
        text university_card "NOT NULL, ImageKit path"
        status_enum status "DEFAULT 'PENDING'"
        role_enum role "DEFAULT 'USER'"
        date last_activity_date "DEFAULT now()"
        timestamptz created_at "DEFAULT now()"
    }

    BOOKS {
        uuid id PK "gen_random_uuid()"
        varchar title "NOT NULL, 255 chars"
        varchar author "NOT NULL, 255 chars"
        text genre "NOT NULL"
        integer rating "NOT NULL, 1-5"
        text cover_url "NOT NULL, ImageKit path"
        varchar cover_color "NOT NULL, 7 chars hex"
        text description "NOT NULL"
        integer total_copies "NOT NULL, DEFAULT 1"
        integer available_copies "NOT NULL, DEFAULT 0"
        text video_url "NOT NULL, ImageKit path"
        varchar summary "NOT NULL"
        timestamptz created_at "DEFAULT now()"
    }

    BORROW_RECORDS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "references users.id"
        uuid book_id FK "references books.id"
        timestamptz borrow_date "DEFAULT now()"
        date due_date "NOT NULL, +7 days"
        date return_date "nullable"
        borrow_status_enum status "DEFAULT 'BORROWED'"
        timestamptz created_at "DEFAULT now()"
    }
```

### Enum Types

| Enum | Values | Usage |
|------|--------|-------|
| `status` | `PENDING`, `APPROVED`, `REJECTED` | User account approval status |
| `role` | `USER`, `ADMIN` | User role for access control |
| `borrow_status` | `BORROWED`, `RETURNED` | Book borrow record status |

---

## 🔐 Authentication Flow

BookDom uses **NextAuth.js v5** with a **Credentials Provider** and **JWT session strategy**.

### Complete Auth Lifecycle

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Middleware
    participant AuthLayout as Auth Layout
    participant AuthForm as AuthForm Component
    participant SignUpAction as signUp() Server Action
    participant SignInAction as signIn() Server Action
    participant RateLimit as Rate Limiter
    participant DB as Neon PostgreSQL
    participant NextAuth as NextAuth.js
    participant Workflow as Upstash Workflow
    participant SendGrid as SendGrid

    Note over User, SendGrid: 📝 SIGN UP FLOW

    User->>Browser: Navigate to /sign-up
    Browser->>Middleware: GET /sign-up
    Middleware->>Middleware: Check session (none)
    Middleware->>AuthLayout: Render auth layout
    AuthLayout->>AuthLayout: Check session → not logged in → proceed
    AuthLayout->>AuthForm: Render sign-up form

    User->>AuthForm: Fill form (name, email, universityId, password, universityCard)
    AuthForm->>AuthForm: Zod validation (signUpSchema)
    AuthForm->>SignUpAction: Submit form data

    SignUpAction->>RateLimit: Check IP rate limit (5/min)
    alt Rate Limit Exceeded
        RateLimit-->>Browser: Redirect → /too-fast
    end

    SignUpAction->>DB: SELECT * FROM users WHERE email = ?
    alt User Exists
        DB-->>SignUpAction: User found
        SignUpAction-->>AuthForm: {success: false, error: "user already exists"}
    end

    SignUpAction->>SignUpAction: bcrypt.hash(password, 10)
    SignUpAction->>DB: INSERT INTO users VALUES (...)
    DB-->>SignUpAction: User created

    SignUpAction->>Workflow: Trigger onboarding workflow
    Workflow->>SendGrid: Send welcome email
    
    SignUpAction->>SignInAction: Auto sign-in after signup
    SignInAction->>NextAuth: signIn("credentials", {email, password})
    NextAuth->>DB: Verify credentials
    NextAuth-->>Browser: Set JWT cookie
    
    SignUpAction-->>AuthForm: {success: true}
    AuthForm->>Browser: Toast "Signed up successfully"
    Browser->>Browser: router.push("/")

    Note over User, SendGrid: 🔑 SIGN IN FLOW

    User->>Browser: Navigate to /sign-in
    User->>AuthForm: Enter email + password
    AuthForm->>AuthForm: Zod validation (signInSchema)
    AuthForm->>SignInAction: Submit credentials

    SignInAction->>RateLimit: Check IP rate limit
    SignInAction->>NextAuth: signIn("credentials", {email, password})
    NextAuth->>DB: SELECT * FROM users WHERE email = ?
    NextAuth->>NextAuth: bcrypt.compare(password, hash)
    NextAuth-->>Browser: JWT token → cookie
    
    SignInAction-->>AuthForm: {success: true}
    AuthForm->>Browser: router.push("/")
```

### JWT Token Flow

```mermaid
graph LR
    A["User Login"] --> B["NextAuth Authorize"]
    B --> C["JWT Callback - Add user.id + user.name to token"]
    C --> D["Session Callback - Expose id + name on session.user"]
    D --> E["Client - useSession() / auth()"]
    
    style A fill:#E94560,color:#fff
    style B fill:#0F3460,color:#fff
    style C fill:#16213E,color:#fff
    style D fill:#533483,color:#fff
    style E fill:#1A1A2E,color:#fff
```

### Middleware Protection

The middleware (`middleware.ts`) exports `auth` from NextAuth, which runs on every request to verify JWT session validity. Route-level protection is then handled in layouts:

| Route Group | Layout Guard | Behavior |
|------------|-------------|----------|
| `(auth)/*` | `if (session) redirect("/")` | Redirects authenticated users away from auth pages |
| `(root)/*` | `if (!session) redirect("/sign-in")` | Requires authentication to access |
| `admin/*` | `if (!session) redirect("/sign-in")` + DB role check | Requires `ADMIN` role |

---

## 🔄 Request / Response Lifecycle

### Full Page Request Lifecycle

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextJS as Next.js Server
    participant MW as Middleware
    participant Layout as Layout Component
    participant Page as Page Component
    participant SC as Server Component
    participant SA as Server Action
    participant DB as Neon PostgreSQL
    participant Redis as Upstash Redis

    Note over User, Redis: 📄 SERVER-SIDE RENDERED PAGE (e.g., Home Page)

    User->>Browser: Navigate to /
    Browser->>NextJS: HTTP GET /
    NextJS->>MW: Run middleware (auth check)
    MW->>MW: Verify JWT from cookie
    MW-->>NextJS: Request passes

    NextJS->>Layout: Render RootLayout
    Layout->>Layout: Load fonts (IBM Plex Sans, Bebas Neue)
    Layout->>Layout: Wrap with SessionProvider

    NextJS->>Layout: Render (root)/layout.tsx
    Layout->>Layout: await auth() → session exists
    Layout->>Layout: Render Header component

    NextJS->>Page: Render (root)/page.tsx
    Page->>DB: SELECT * FROM books ORDER BY created_at DESC LIMIT 10
    DB-->>Page: latestBooks[]
    Page->>SC: Render BookOverview with latestBooks[0]
    SC->>DB: SELECT * FROM users WHERE id = session.user.id
    DB-->>SC: user record (check eligibility)
    Page->>SC: Render BookList with latestBooks[1..9]

    NextJS-->>Browser: Full HTML + RSC Payload
    Browser->>Browser: Hydrate client components (BorrowBook btn)
    Browser-->>User: Interactive page displayed
```

### Server Action Lifecycle (Borrow Book)

```mermaid
sequenceDiagram
    actor User
    participant BorrowBtn as BorrowBook Component
    participant SA as borrowBook() Server Action
    participant DB as Neon PostgreSQL

    User->>BorrowBtn: Click "Borrow Book"
    BorrowBtn->>BorrowBtn: Check isEligible flag
    
    alt Not Eligible
        BorrowBtn->>BorrowBtn: toast.error(message)
        BorrowBtn-->>User: Show error toast
    end

    BorrowBtn->>BorrowBtn: setBorrowing(true)
    BorrowBtn->>SA: borrowBook({bookId, userId})

    SA->>DB: SELECT available_copies FROM books WHERE id = bookId
    DB-->>SA: {availableCopies: N}

    alt No Copies Available
        SA-->>BorrowBtn: {success: false, error: "Book not available"}
        BorrowBtn->>BorrowBtn: toast.error()
    end

    SA->>SA: Calculate dueDate = now + 7 days
    SA->>DB: INSERT INTO borrow_records (userId, bookId, dueDate, status)
    SA->>DB: UPDATE books SET available_copies = N-1 WHERE id = bookId

    SA-->>BorrowBtn: {success: true, data: record}
    BorrowBtn->>BorrowBtn: toast.success("Book borrowed successfully")
    BorrowBtn->>BorrowBtn: router.push("/")
    BorrowBtn-->>User: Redirected to home
```

### API Route Lifecycle (ImageKit Auth)

```mermaid
sequenceDiagram
    participant FileUpload as FileUpload Component
    participant API as /api/auth/imagekit
    participant ImageKit as ImageKit SDK

    FileUpload->>API: GET /api/auth/imagekit
    API->>ImageKit: imagekit.getAuthenticationParameters()
    ImageKit-->>API: {token, expire, signature}
    API-->>FileUpload: NextResponse.json({token, expire, signature})
    FileUpload->>FileUpload: Use params for client-side upload
```

---

## 🔌 API Reference

### `GET /api/auth/imagekit`

Returns ImageKit authentication parameters for secure client-side uploads.

**Response:**
```json
{
  "token": "unique-token-string",
  "expire": 1234567890,
  "signature": "generated-signature"
}
```

---

### `GET/POST /api/auth/[...nextauth]`

NextAuth.js catch-all route. Handles all authentication operations (sign-in, sign-out, session management, CSRF).

---

### `POST /api/workflows/onboarding`

Upstash Workflow endpoint for the user onboarding email sequence.

**Request Body (triggered by QStash):**
```json
{
  "email": "user@university.edu",
  "fullName": "John Doe"
}
```

**Workflow Steps:**
1. Send welcome email immediately
2. Set Redis status `user:{email}:status = "new"`
3. Sleep for 3 days
4. Loop every 30 days:
   - Check user activity state from DB
   - Send re-engagement email (non-active) or welcome-back email (active)

---

## ⚙️ Server Actions

### Auth Actions (`lib/actions/auth.ts`)

| Action | Signature | Description |
|--------|-----------|-------------|
| `signInWithCredentials` | `(params: {email, password}) => Promise<{success, error?}>` | Signs in user with credentials, applies rate limiting |
| `signUp` | `(params: AuthCredentials) => Promise<{success, error?}>` | Registers new user, hashes password, triggers onboarding workflow, auto sign-in |

### Book Actions (`lib/actions/book.ts`)

| Action | Signature | Description |
|--------|-----------|-------------|
| `borrowBook` | `(params: {bookId, userId}) => Promise<{success, data?, error?}>` | Creates borrow record, decrements available copies, sets 7-day due date |

### Admin Actions (`lib/admin/actions/book.ts`)

| Action | Signature | Description |
|--------|-----------|-------------|
| `createBook` | `(params: BookParams) => Promise<{success, data?, message?}>` | Inserts new book, sets `availableCopies = totalCopies` |

---

## 🧩 Component Architecture

### Component Tree

```mermaid
graph TD
    RootLayout["RootLayout - Fonts + SessionProvider + Toaster"]
    
    subgraph AuthGroup["(auth) Route Group"]
        AuthLayout["Auth Layout - Logo + Illustration"]
        SignInPage["Sign In Page"]
        SignUpPage["Sign Up Page"]
        AuthForm["AuthForm - Generic Form"]
        FileUpload1["FileUpload - University Card"]
    end

    subgraph RootGroup["(root) Route Group"]
        MainLayout["Root Layout - Header + Auth Guard"]
        Header["Header - Logo + Logout"]
        HomePage["Home Page"]
        BookOverview["BookOverview - Hero Section"]
        BookCover["BookCover + BookCoverSvg"]
        BorrowBook["BorrowBook - Borrow Button"]
        BookList["BookList - Grid"]
        BookCard["BookCard - Card Item"]
        BookDetailPage["Book Detail Page"]
        BookVideo["BookVideo - Trailer Player"]
        ProfilePage["Profile Page"]
    end

    subgraph AdminGroup["admin Route Group"]
        AdminLayout["Admin Layout - Sidebar + Header + Role Guard"]
        AdminSidebar["Sidebar - Navigation"]
        AdminHeader["Admin Header"]
        AdminDashboard["Dashboard Page"]
        AdminBooks["Books List Page"]
        NewBookPage["New Book Page"]
        BookForm["BookForm - Create/Edit"]
        ColorPicker["ColorPicker"]
        FileUpload2["FileUpload - Cover + Trailer"]
    end

    RootLayout --> AuthGroup
    RootLayout --> RootGroup
    RootLayout --> AdminGroup

    AuthLayout --> SignInPage
    AuthLayout --> SignUpPage
    SignInPage --> AuthForm
    SignUpPage --> AuthForm
    AuthForm --> FileUpload1

    MainLayout --> Header
    MainLayout --> HomePage
    MainLayout --> BookDetailPage
    MainLayout --> ProfilePage
    
    HomePage --> BookOverview
    HomePage --> BookList
    BookOverview --> BookCover
    BookOverview --> BorrowBook
    BookList --> BookCard
    BookCard --> BookCover
    BookDetailPage --> BookOverview
    BookDetailPage --> BookVideo

    AdminLayout --> AdminSidebar
    AdminLayout --> AdminHeader
    AdminLayout --> AdminDashboard
    AdminLayout --> AdminBooks
    AdminBooks --> NewBookPage
    NewBookPage --> BookForm
    BookForm --> FileUpload2
    BookForm --> ColorPicker

    style RootLayout fill:#1a1a2e,stroke:#e94560,color:#fff
    style AuthGroup fill:#16213e,stroke:#0f3460,color:#fff
    style RootGroup fill:#1B4332,stroke:#2D6A4F,color:#fff
    style AdminGroup fill:#3A0CA3,stroke:#4361EE,color:#fff
```

### Key Components

| Component | Type | Props | Description |
|-----------|------|-------|-------------|
| `AuthForm<T>` | Client | `schema`, `defaultValues`, `onSubmit`, `type` | Generic form component supporting both sign-in and sign-up with dynamic field rendering |
| `BookOverview` | Server | `Book` + `userId` | Hero section showing book details, cover, and borrow eligibility |
| `BorrowBook` | Client | `userId`, `bookId`, `borrowingEligibility` | Interactive borrow button with loading state |
| `BookCard` | Server | `id`, `title`, `genre`, `coverColor`, `coverUrl` | Card component for book grid listings |
| `BookList` | Server | `title`, `books[]`, `containerClassName?` | Grid container rendering BookCard list |
| `BookCover` | Server | `coverColor`, `coverImage`, `variant?`, `className?` | Book cover with decorative SVG frame |
| `FileUpload` | Client | `type`, `accept`, `folder`, `variant`, `onFileChange`, `value?` | ImageKit upload with progress bar & preview |
| `BookForm` | Client | `type?`, `...Book?` | Admin book creation/edit form with 10 fields |
| `Sidebar` | Client | `session` | Admin navigation sidebar with active state |
| `ColorPicker` | Client | `onPickerChange`, `value` | Color picker for book cover color |

---

## 📧 Onboarding Workflow

The onboarding workflow is a durable, long-running background process powered by **Upstash QStash** and the **Upstash Workflow SDK**.

```mermaid
stateDiagram-v2
    [*] --> SignUp: User signs up

    SignUp --> WelcomeEmail: Trigger workflow
    WelcomeEmail --> SetRedisStatus: Send welcome email
    SetRedisStatus --> Sleep3Days: Set user:email:status = new

    Sleep3Days --> CheckActivity: Wait 3 days

    state CheckActivity <<choice>>
    CheckActivity --> SendReEngagement: non-active (>3 days, ≤30 days since last activity)
    CheckActivity --> SendWelcomeBack: active (≤3 days since last activity)

    SendReEngagement --> Sleep30Days: "We miss you!" email
    SendWelcomeBack --> Sleep30Days: "Welcome back!" email

    Sleep30Days --> CheckActivity: Wait 30 days (loop forever)
```

### Activity State Logic

```
getUserState(email):
  ├── User not found → "non-active"
  ├── Last activity > 3 days AND ≤ 30 days → "non-active"
  └── Last activity ≤ 3 days OR > 30 days → "active"
```

---

## 🚦 Rate Limiting

Rate limiting is implemented using **Upstash Redis** with a **fixed window** algorithm.

```mermaid
graph LR
    A["User Request"] --> B{"Rate Limit Check"}
    B -->|"≤ 5 requests/min"| C["✅ Allow Request"]
    B -->|"> 5 requests/min"| D["🚫 Redirect to /too-fast"]

    style B fill:#E94560,color:#fff
    style C fill:#2D6A4F,color:#fff
    style D fill:#D00000,color:#fff
```

**Configuration:**
- **Algorithm:** Fixed Window
- **Limit:** 5 requests per 1-minute window
- **Key:** Client IP address (`x-forwarded-for` header)
- **Applied to:** `signInWithCredentials()` and `signUp()` server actions

---

## 📤 File Upload Pipeline

```mermaid
sequenceDiagram
    actor User
    participant UI as FileUpload Component
    participant API as /api/auth/imagekit
    participant IK_SDK as ImageKit SDK
    participant IK_CDN as ImageKit CDN

    User->>UI: Select file
    UI->>UI: Validate file size (image: 20MB, video: 50MB)

    alt Validation Fails
        UI-->>User: toast.error("File size too large")
    end

    UI->>API: GET /api/auth/imagekit
    API->>IK_SDK: getAuthenticationParameters()
    IK_SDK-->>API: {token, expire, signature}
    API-->>UI: Auth params

    UI->>IK_CDN: Upload file with auth params
    IK_CDN-->>UI: Progress events (loaded/total)
    UI->>UI: Update progress bar (0-100%)

    IK_CDN-->>UI: {filePath: "/folder/filename.ext"}
    UI->>UI: Show preview (IKImage or IKVideo)
    UI->>UI: onFileChange(filePath) → update form state
    UI-->>User: toast.success("Upload successful")
```

**Upload Limits:**
| Type | Max Size | Accepted |
|------|----------|----------|
| Image | 20 MB | `image/*` |
| Video | 50 MB | `video/*` |

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ─── ImageKit (File Upload CDN) ───
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxx

# ─── API Endpoint ───
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
NEXT_PUBLIC_PROD_API_ENDPOINT=https://your-domain.vercel.app

# ─── Database (Neon PostgreSQL) ───
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# ─── Auth (NextAuth.js) ───
AUTH_SECRET="your-auth-secret-key"

# ─── Upstash Redis (Rate Limiting) ───
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token

# ─── Upstash QStash (Workflows) ───
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="your-qstash-token"
QSTASH_CURRENT_SIGNING_KEY="sig_xxxxx"
QSTASH_NEXT_SIGNING_KEY="sig_xxxxx"

# ─── SendGrid (Email) ───
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_SENDER=your-email@domain.com
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x (or pnpm/yarn)
- **Neon** PostgreSQL account ([neon.tech](https://neon.tech))
- **Upstash** Redis + QStash account ([upstash.com](https://upstash.com))
- **ImageKit** account ([imagekit.io](https://imagekit.io))
- **SendGrid** account ([sendgrid.com](https://sendgrid.com))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codesbysaravana/University_Library.git
cd university-library

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Generate database migrations
npx drizzle-kit generate

# 5. Run database migrations
npx drizzle-kit migrate

# 6. Seed the database (optional)
npm run seed

# 7. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗃️ Database Setup

### Using Drizzle Kit

```bash
# Generate new migration from schema changes
npm run db:generate

# Apply pending migrations to database
npm run db:migrate

# Open Drizzle Studio (visual DB browser)
npm run db:studio

# Seed database with sample books (uploads covers/videos to ImageKit)
npm run seed
```

### Migration Files

| Migration | Description |
|-----------|-------------|
| `0000_chilly_anthem.sql` | Creates `users` table with `status`, `role` enums |
| `0001_sharp_quasimodo.sql` | Creates `books` and `borrow_records` tables with foreign keys |

### Seeding Process

The seed script (`database/seed.ts`):
1. Reads books from `dummybooks.json`
2. Uploads each book cover to ImageKit (`/books/covers/`)
3. Uploads each book trailer to ImageKit (`/books/videos/`)
4. Inserts book records into the database with ImageKit paths

---

## 🐳 Docker Deployment

### Docker Compose (Local Development)

```bash
# Start both app and PostgreSQL
docker-compose up -d

# Stop services
docker-compose down
```

**Services:**

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `app` | Custom (Dockerfile) | `3000` | Next.js application |
| `db` | `postgres:15` | `5432` | Local PostgreSQL instance |

### Dockerfile (Multi-Stage Build)

```
Stage 1 (base)    → Install dependencies
Stage 2 (build)   → Build Next.js production bundle
Stage 3 (runner)  → Copy only necessary files, expose port 3000
```

---

## 📜 Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev --turbopack` | Start dev server with Turbopack |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |
| `seed` | `npx tsx database/seed.ts` | Seed database with sample books |
| `db:generate` | `npx drizzle-kit generate` | Generate SQL migrations from schema |
| `db:migrate` | `npx drizzle-kit migrate` | Apply pending migrations |
| `db:studio` | `npx drizzle-kit studio` | Open visual database browser |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy — Vercel auto-detects Next.js and builds accordingly

> **Note:** The `next.config.ts` ignores TypeScript and ESLint errors during builds (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`) for seamless deployment.

### Remote Image Domains

The following domains are whitelisted in `next.config.ts` for `next/image`:
- `placehold.co`
- `m.media-amazon.com`
- `ik.imagekit.io`

---

## 📝 Validation Schemas

### Sign Up Schema

```typescript
{
  fullName:       z.string().min(3),
  email:          z.string().email(),
  universityId:   z.coerce.number(),
  universityCard: z.string().nonempty("University card is required"),
  password:       z.string().min(8),
}
```

### Sign In Schema

```typescript
{
  email:    z.string().email(),
  password: z.string().min(8),
}
```

### Book Schema (Admin)

```typescript
{
  title:       z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author:      z.string().trim().min(2).max(100),
  genre:       z.string().trim().min(2).max(50),
  rating:      z.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl:    z.string().nonempty(),
  coverColor:  z.string().trim().regex(/^#[0-9A-F]{6}$/i),
  videoUrl:    z.string().nonempty(),
  summary:     z.string().trim().min(10),
}
```

---

## 📄 Global TypeScript Interfaces

```typescript
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#E7C9A5` | Primary accent (gold) |
| `primary-admin` | `#25388C` | Admin theme (deep blue) |
| `dark-100` | `#16191E` | Dark backgrounds |
| `dark-500` | `#0F172A` | Darkest background |
| `light-100` | `#D6E0FF` | Light text on dark |
| `light-200` | `#EED1AC` | Gold light text |
| `green-500` | `#2CC171` | Success states |
| `red-DEFAULT` | `#EF3A4B` | Error states |

### Typography

| Font | Weight | Usage |
|------|--------|-------|
| **IBM Plex Sans** | 400, 500, 600, 700 | Body text, UI elements |
| **Bebas Neue** | 400 | Display headings, hero text |

---

## 📜 License

This project is built for educational purposes as part of a university portfolio project.

---

<div align="center">

**Built with ❤️ by [Saravana Priyan](https://github.com/codesbysaravana)**

</div>
