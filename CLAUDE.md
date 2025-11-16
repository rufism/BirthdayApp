# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.0.3 application built with TypeScript, React 19, and the App Router architecture. It's a birthday tracking application bootstrapped from `create-next-app`.

**CRITICAL: This is a mobile-first application.** The app will be hosted on Vercel but accessed exclusively from mobile phones. Every component, layout, and feature MUST be optimized for mobile devices and small screens.

## Commands

### Development
```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### Installation
```bash
npm install       # Install dependencies
```

## Architecture

### Framework: Next.js App Router
- Uses the modern App Router (`src/app/`) rather than Pages Router
- Server Components by default (unless marked with 'use client')
- File-based routing under `src/app/`

### TypeScript Configuration
- Path alias `@/*` maps to `./src/*` for cleaner imports
- Target: ES2017
- Strict mode enabled
- JSX transformed to react-jsx (automatic runtime)

### Project Structure
```
src/
  app/
    layout.tsx        # Root layout with Geist fonts
    page.tsx          # Home page component
    globals.css       # Global styles
    page.module.css   # Page-specific CSS modules
```

### Styling
- CSS Modules for component-scoped styles (`.module.css` files)
- Global styles in `globals.css`
- Uses Geist and Geist Mono fonts from `next/font/google`

### ESLint Configuration
- Uses `eslint.config.mjs` (flat config format)
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Development Notes

### Next.js App Router Patterns
- Place server components in `src/app/` without 'use client' directive
- Add 'use client' directive at the top of files that use client-side features (useState, useEffect, event handlers)
- Layout components wrap page content and persist across navigations
- Use CSS Modules (`.module.css`) for component styling

### Metadata
- Configure page metadata via `metadata` export in layout.tsx or page files
- Type-safe with Next.js `Metadata` type

### Images
- Use `next/image` component for optimized image loading
- Static assets stored in `public/` directory

### Mobile-First Development Requirements
- **All designs must be mobile-optimized** - this is not a responsive web app with desktop fallback
- Test UI on mobile viewports (375px - 428px width typical for modern phones)
- Use touch-friendly tap targets (minimum 44x44px)
- Optimize for vertical scrolling and thumb-reach zones
- Consider mobile data constraints when loading assets
- Ensure text is readable without zooming (minimum 16px font size for body text)
- Design for mobile gestures (swipe, tap, long-press) rather than hover states
