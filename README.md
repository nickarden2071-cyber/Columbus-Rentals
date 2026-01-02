# Columbus Rentals - Equipment Management System

A production-ready V1 internal tool for managing equipment rentals, built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Inventory Management**: Track equipment, quantities, and status (Available/Maintenance).
- **Booking System**: Create date-based rentals with automatic availability checks.
- **Availability Engine**: Prevents overbooking and handles buffer days between rentals.
- **Admin Dashboard**: Overview of active rentals, upcoming returns, and maintenance items.
- **Authentication**: Secure admin-only access via Supabase Auth.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Next.js Server Actions
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth

## Getting Started

### Prerequisites

1. Node.js (v18+)
2. npm
3. A Supabase project

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd columbus-rentals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Go to your Supabase project's SQL Editor.
   - Run the contents of `supabase/schema.sql` to create tables and policies.
   - (Optional) Create your first admin user in Supabase Authentication > Users.

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the project into Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in Vercel project settings.
4. Deploy.

## Architecture Highlights

- **Availability Service**: Located in `services/availability.ts`. This is the core logic engine that calculates if an item can be booked for a specific date range, considering existing bookings and buffer times.
- **Notifications**: `services/notifications.ts` provides an extensible abstraction for sending alerts (currently logs to console, ready for email/SMS integration).
- **Server Actions**: All mutations (create/update/delete) are handled via Next.js Server Actions in `actions.ts` files within each feature directory.
- **Middleware**: `middleware.ts` handles session refreshment and route protection.

## License

Private / Proprietary
