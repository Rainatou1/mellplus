# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Commands
- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

### Database Commands
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database (development)
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open Prisma Studio for database inspection

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.4.5 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS v4
- **UI Components**: Headless UI, Lucide React icons
- **Notifications**: React Hot Toast
- **Validation**: Zod

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/app/api/` - API routes for backend functionality
- `src/app/admin/` - Protected admin dashboard pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations

### Database Schema
The application uses PostgreSQL with comprehensive models for:
- **Products**: Full e-commerce product catalog with categories, pricing, inventory
- **Services**: Service offerings with flexible pricing models
- **Quote System**: Quote requests with items, status tracking, and admin assignment
- **Admin System**: Role-based admin accounts with activity logging
- **Contact Management**: Contact form submissions with status tracking
- **Site Configuration**: Centralized site settings and social media links

### Authentication & Authorization
- NextAuth.js handles authentication with JWT strategy
- Admin-only routes protected by middleware (`middleware.js`)
- Session expires after 24 hours
- Protected routes: `/admin/*` (except `/admin/login`)

### Key Business Logic
- **Mell Plus Niger**: IT services company in Niger
- **Product Categories**: ORDI_SERVEUR, RESEAUX_SECURITE, IMPRIMANTE_COPIEUR, ACCESSOIRES
- **Service Categories**: VENTE_MATERIEL, INSTALLATION, MAINTENANCE, FORMATION, CONSEIL, DEVELOPPEMENT, RESEAU, SECURITE
- **Quote Management**: Complete workflow from request to acceptance/rejection
- **Inventory Tracking**: Stock levels with low-stock alerts

### API Structure
- `POST /api/contact` - Handle contact form submissions
- `GET/POST /api/products` - Product management
- `GET/POST /api/quotes` - Quote request handling
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `GET /api/admin/stats` - Admin dashboard statistics

### Database Configuration
- Uses Prisma Client with connection pooling
- Development: Detailed logging enabled (`query`, `error`, `warn`)
- Production: Standard configuration without verbose logging
- Error handling utility for common Prisma errors in `src/lib/prisma.js`

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `NEXTAUTH_URL` - Application URL for NextAuth

### Development Notes
- Database schema supports French language content (comments in French)
- Uses cuid() for all primary keys
- Comprehensive indexing for performance
- Soft delete patterns where applicable
- JSON fields for flexible data storage (specifications, settings)