# Replit.md

## Overview

This is a full-stack web application built with a React frontend and Express.js backend. The application uses a modern tech stack with TypeScript, Tailwind CSS with shadcn/ui components, Drizzle ORM for database operations, and PostgreSQL for data persistence. The project is structured as a monorepo with shared code between client and server.

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
- **Migrations**: Managed through Drizzle Kit with migrations stored in `./migrations`
- **Current Schema**: Basic user management with username/password authentication

## Key Components

### Shared Code (`/shared`)
- **Schema Definition**: Centralized database schema with Zod validation
- **Type Safety**: Shared types between frontend and backend using Drizzle's type inference

### Client (`/client`)
- **Entry Point**: `src/main.tsx` renders the React application
- **Routing**: Wouter-based routing with a splash page and 404 fallback
- **State Management**: TanStack Query with custom query client configuration
- **Components**: shadcn/ui component library with comprehensive UI primitives
- **Styling**: Tailwind CSS with custom design tokens and variables

### Server (`/server`)
- **Entry Point**: `index.ts` sets up Express server with middleware
- **Storage Interface**: Abstracted storage layer with in-memory implementation
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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```