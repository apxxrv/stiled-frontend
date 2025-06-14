# Replit.md

## Overview

STILED is a full-stack styling platform that connects users with professional stylists. Built with React frontend and Express.js backend, it features stylist discovery, social feeds, and booking capabilities. The application uses TypeScript, Tailwind CSS with shadcn/ui components, Drizzle ORM for database operations, and in-memory storage for data persistence. The project is structured as a monorepo with shared code between client and server.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Comprehensive set of Radix UI-based components via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Configured for connect-pg-simple (PostgreSQL session store)
- **API Structure**: RESTful API with `/api` prefix for all endpoints

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type-safe sharing between client and server
- **Storage**: In-memory storage implementation with seeded data
- **Current Schema**: Users, stylists, posts, and comments with relationships
- **Features**: Stylist profiles, social posts, comments system, ratings

## Key Components

### Shared Code (`/shared`)
- **Schema Definition**: Centralized database schema with Zod validation
- **Type Safety**: Shared types between frontend and backend using Drizzle's type inference

### Client (`/client`)
- **Entry Point**: `src/main.tsx` renders the React application
- **Routing**: Wouter-based routing with splash, get-started, home, and social pages
- **State Management**: TanStack Query with custom query client configuration
- **Components**: shadcn/ui component library with comprehensive UI primitives
- **Pages**: Splash screen, onboarding, stylist discovery, social feed with comments
- **Styling**: Tailwind CSS with mobile-first design matching Figma specifications

### Server (`/server`)
- **Entry Point**: `index.ts` sets up Express server with middleware
- **Storage Interface**: Abstracted storage layer with in-memory implementation and seeded data
- **API Routes**: RESTful endpoints for stylists, posts, and comments
- **Route Management**: Centralized route registration system
- **Development**: Vite integration for HMR and development server

## Data Flow

1. **Client Requests**: React components use TanStack Query for server state
2. **API Layer**: Express routes handle requests with `/api` prefix
3. **Storage Layer**: Abstract storage interface allows for flexible data persistence
4. **Database**: Drizzle ORM provides type-safe database operations
5. **Response**: JSON responses with proper error handling and logging

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database ORM
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Process**: Runs TypeScript server with tsx and Vite development server
- **Hot Reload**: Enabled for both client and server code
- **Port**: Application runs on port 5000

### Production Build
- **Client Build**: Vite builds optimized client bundle to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.js`
- **Command**: `npm run build` followed by `npm run start`

### Replit Configuration
- **Auto-scaling**: Configured for Replit's autoscale deployment
- **Environment**: Node.js 20, Web, and PostgreSQL 16 modules
- **Build Process**: Automated build and deployment pipeline

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Migrated from Figma designs, implemented full STILED platform:
  * Added stylist discovery with filtering capabilities
  * Implemented social feed with posts and comments
  * Created mobile-responsive UI matching Figma designs
  * Added data models for stylists, posts, comments
  * Implemented complete user flow from splash to social features
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```