# Enterprise Architecture Dashboard

## Overview

This is a full-stack enterprise architecture dashboard built with Node.js, React, and PostgreSQL. The application provides visualization and management capabilities for business capabilities, applications, data objects, interfaces, IT components, and initiatives. It features advanced search, filtering, AI-powered diagram generation, and architectural decision record (ADR) management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: React Query for server state, local React state for UI
- **Build Tool**: Vite with development server
- **Data Visualization**: D3.js for interactive charts and network diagrams

### Backend Architecture
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **AI Integration**: Anthropic Claude SDK for diagram and ADR generation
- **Session Management**: Express sessions with PostgreSQL store

### Database Architecture
- **Database**: PostgreSQL 16 (Neon serverless)
- **Schema Management**: Drizzle migrations
- **Connection Pooling**: Neon serverless connection pooling
- **Tables**: Business capabilities, applications, data objects, interfaces, IT components, initiatives, ADRs, diagrams

## Key Components

### Data Model
1. **Business Capabilities**: Hierarchical structure with 3 levels (L1, L2, L3)
2. **Applications**: Enterprise applications mapped to capabilities
3. **Data Objects**: Data entities with application mappings
4. **Interfaces**: System integration points
5. **IT Components**: Technical infrastructure components
6. **Initiatives**: Business transformation projects
7. **ADRs**: Architectural Decision Records with versioning
8. **Diagrams**: Mermaid and external diagram storage

### Visualization Views
1. **Network View**: Interactive force-directed graph of relationships
2. **Hierarchy Map**: Stacked capability visualization with color coding
3. **Model View**: Column-based capability-application mapping
4. **Heatmap View**: Performance metrics visualization
5. **Dashboard View**: KPIs and summary metrics

### AI-Powered Features
1. **Diagram Generator**: Claude-powered Mermaid diagram generation
2. **ADR Generator**: Automated architectural decision documentation
3. **Smart Search**: Unified search across all entity types

## Data Flow

1. **Data Import**: CSV bulk import with fuzzy matching for application names
2. **Search Processing**: Hierarchical filtering maintains parent-child relationships
3. **Visualization Pipeline**: Data aggregation → D3.js rendering → Interactive updates
4. **AI Generation**: User input → Claude API → Mermaid/Markdown output → Storage
5. **Export**: Filtered data → JSON/CSV export with scope preservation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@anthropic-ai/sdk**: AI-powered content generation
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management and caching
- **d3**: Data visualization and interactive graphics
- **wouter**: Lightweight React routing

### UI Framework
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **lucide-react**: Icon library

### Development Tools
- **vite**: Fast development server and build tool
- **typescript**: Type safety across frontend and backend
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server with HMR
- **Process Management**: tsx for TypeScript execution

### Production Build
- **Frontend**: Vite build → static assets in dist/public
- **Backend**: esbuild bundle → single ESM file in dist/
- **Database**: Drizzle migrations applied automatically
- **Deployment**: Autoscale deployment target on port 80

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **ANTHROPIC_API_KEY**: Claude API access (for AI features)
- **NODE_ENV**: Environment flag (development/production)

## Changelog
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.