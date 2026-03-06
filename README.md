<div align="center">

<h1>💰 Coin Share</h1>

<p><strong>A full-stack group expense-splitting application — track shared costs, settle debts, and manage group finances with ease.</strong></p>

<p>
  <a href="https://coinshare.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-coinshare.vercel.app-6C63FF?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-99%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<br/>

> Built with the Next.js App Router, Prisma ORM, Shadcn UI, and deployed on Vercel — Coin Share is a modern, full-stack alternative to apps like Splitwise, designed for groups who want a clean interface for splitting bills and tracking balances.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

**Coin Share** is a collaborative expense-management web application built for groups — whether you're splitting rent with roommates, tracking a group trip, or sharing dinner bills. Users can create groups, add shared expenses, and see a live breakdown of who owes what.

The entire codebase is written in **TypeScript** (99.2% of the repo) and follows modern full-stack Next.js 14 conventions — including server components, server actions, API routes, and middleware-protected navigation.

---

## Features

- **Authentication & Authorization** — Secure user sign-in protected by Next.js Middleware (`middleware.ts`), restricting all app routes to authenticated users only.
- **Group Management** — Create and join expense groups with other users (e.g., "Goa Trip", "Flat 4B Rent").
- **Expense Tracking** — Add shared expenses to groups, assign payers, and define how costs are split among members.
- **Balance Calculation** — Automatically computes net balances so each user knows exactly what they owe or are owed.
- **Settle Up** — Record settlements between users to mark debts as paid and keep balances clean.
- **Responsive UI** — Built with [Shadcn UI](https://ui.shadcn.com/) and Tailwind CSS for a polished, accessible interface on both desktop and mobile.
- **Live Deployment** — Hosted on Vercel with zero-config deployment and automatic preview deployments on push.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | Full-stack React framework — SSR, API routes, server actions |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety |
| **Database ORM** | [Prisma](https://www.prisma.io/) | Type-safe database access and schema migrations |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) | Accessible, composable component library |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **Middleware** | Next.js Middleware (`middleware.ts`) | Route-level authentication protection |
| **Linting** | ESLint | Code quality and consistency enforcement |
| **Deployment** | [Vercel](https://vercel.com/) | Serverless deployment platform |

---

## Project Structure

```
coin-share/
│
├── app/                        # Next.js 14 App Router
│   ├── (auth)/                 # Authentication routes (sign-in, sign-up)
│   ├── (main)/                 # Protected app routes
│   │   ├── dashboard/          # User dashboard — overview of groups & balances
│   │   ├── groups/             # Group listing and creation
│   │   │   └── [groupId]/      # Dynamic group detail — expenses, members, balances
│   │   └── ...
│   ├── api/                    # Next.js API route handlers
│   └── layout.tsx              # Root layout
│
├── components/                 # Reusable React UI components
│   ├── ui/                     # Shadcn UI primitive components
│   └── ...                     # Feature-specific components (forms, cards, modals)
│
├── lib/                        # Shared utilities and server-side helpers
│   ├── db.ts                   # Prisma client singleton
│   ├── auth.ts                 # Authentication utilities
│   └── utils.ts                # General helper functions
│
├── prisma/                     # Database layer
│   ├── schema.prisma           # Data models (User, Group, Expense, Member, Settlement)
│   └── migrations/             # Auto-generated SQL migration history
│
├── public/                     # Static assets (icons, images, fonts)
│
├── middleware.ts               # Route protection — redirects unauthenticated users
├── components.json             # Shadcn UI configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.mjs             # Next.js configuration
└── tsconfig.json               # TypeScript compiler options
```

---

## Getting Started

### Prerequisites

- **Node.js** v18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun**
- A running **PostgreSQL** database (local or hosted — e.g., Neon, Supabase, Railway)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/saikiranpatil/coin-share.git
cd coin-share
```

**2. Install dependencies**

```bash
npm install
# or
yarn install
```

**3. Set up environment variables**

Create a `.env` file in the root directory. See [Environment Variables](#environment-variables) below for required values.

**4. Push the database schema**

```bash
npx prisma db push
# or run migrations
npx prisma migrate dev --name init
```

**5. Generate the Prisma client**

```bash
npx prisma generate
```

**6. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running.

---

## Environment Variables

Create a `.env` file at the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (if applicable)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

> **Note:** Never commit your `.env` file to version control. It is already listed in `.gitignore`.

---

## Database Schema

The Prisma schema defines the following core data models:

```
User          — Authenticated user accounts
  └── Group   — Expense groups (many-to-many via Member)
  └── Expense — Individual shared expenses paid by a user

Group
  ├── Member  — Join table linking Users to Groups
  └── Expense — Expenses belonging to a group

Expense
  ├── Paid by a User
  ├── Belongs to a Group
  └── Split — How the expense is divided among members

Settlement   — Records of payments between two users within a group
```

To explore or modify the schema, edit `prisma/schema.prisma` and run:

```bash
npx prisma migrate dev
```

You can also open Prisma Studio for a visual database browser:

```bash
npx prisma studio
```

---

## Deployment

This project is deployed on **Vercel**. To deploy your own instance:

**1. Push your code to GitHub**

**2. Import the repository on [Vercel](https://vercel.com/new)**

**3. Configure environment variables** in the Vercel project settings (same values as your `.env` file)

**4. Deploy** — Vercel automatically detects the Next.js project and handles the build

For detailed Next.js deployment instructions, see the [Vercel deployment documentation](https://nextjs.org/docs/deployment).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the production-optimized application |
| `npm run start` | Run the production server locally |
| `npm run lint` | Run ESLint across the codebase |
| `npx prisma studio` | Open Prisma Studio (visual DB browser) |
| `npx prisma migrate dev` | Apply pending migrations in development |
| `npx prisma db push` | Sync schema to DB without migration history |

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built by <a href="https://github.com/saikiranpatil">saikiranpatil</a></p>
  <p>
    <a href="https://coinshare.vercel.app">Live App</a> ·
    <a href="https://github.com/saikiranpatil/coin-share/issues">Report Bug</a> ·
    <a href="https://github.com/saikiranpatil/coin-share/issues">Request Feature</a>
  </p>
</div>
