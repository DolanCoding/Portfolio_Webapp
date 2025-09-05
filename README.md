# Portfolio Website - Work in Progress

> **⚠️ Work in Progress Notice**  
> This portfolio is currently being reworked and is not yet finished. Due to time constraints, this commit provides a "work in progress" version with core functionality implemented but some features still under development.

## Overview

A modern, responsive portfolio website built with React, TypeScript, and Node.js. The project showcases a unique "Blueprint Theme" design system that uses a sophisticated grid-based layout as its foundational component.

## Architecture

This is a full-stack web application with three main packages:

- **`frontend/`** - React SPA built with Vite
- **`backend/`** - Express.js API server with SQLite database
- **`shared-types/`** - TypeScript interfaces shared between frontend and backend

## Technology Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **React Router** for client-side routing
- **ESLint + Prettier** for code quality

### Backend

- **Node.js** with Express.js
- **SQLite** database with `sqlite3` driver
- **TypeScript** for type safety

### Development Tools

- **GitHub Actions** CI/CD pipeline
- **ESLint** and **Prettier** for code formatting
- **Husky** pre-commit hooks (planned)

## Blueprint Theme & Grid System

### Core Concept

The Blueprint Theme is a sophisticated design system that treats the grid background as the primary layout-defining component rather than just a visual element. This approach creates a unique "architectural drawing" aesthetic while providing precise, responsive layout control.

### Grid Background as Layout Foundation

The grid system serves dual purposes:

1. **Visual Design Element**: Creates the distinctive blueprint/paper aesthetic
2. **Layout Infrastructure**: Provides the underlying measurement system for all spacing and positioning

#### Grid Structure

```css
/* Primary grid lines (major) - every 10 units */
repeating-linear-gradient(to right, var(--bp-mid) 0 var(--bp-thick), transparent...)

/* Secondary grid lines (minor) - every 1 unit */
repeating-linear-gradient(to right, var(--bp-weak) 0 var(--bp-thin), transparent...)
```

#### Dynamic Responsive Spacing

The layout system dynamically calculates padding and content widths based on viewport dimensions:

```typescript
// Content width adapts to viewport: 70 or 80 units based on parity
const contentUnitsW = blocksW % 2 === 0 ? 80 : 70;

// Padding snaps to nearest major grid line (multiples of 10)
let padUnitsEach = gridUnitsW / 6;
const moduloUnits = padUnitsEach % 10;
padUnitsEach = moduloUnits > 5 ? padUnitsEach + (10 - moduloUnits) : padUnitsEach - moduloUnits;
```

### Color Palette

The Blueprint Theme uses a carefully crafted blue palette inspired by architectural drawings:

```css
/* Core Blueprint Paper Tones */
--bp-blue-4: #021a31; /* Deepest navy base (shadows) */
--bp-blue-3: #022445; /* Mid-deep tone (body field) */
--bp-blue-2: #042743; /* Mid tone (elevations) */
--bp-blue-1: #031e37; /* Highlighted paper lift */

/* Accent Effects */
--bp-edge-glow: rgba(145, 235, 255, 0.55); /* Cyan luminous ink glow */
--bp-cyan-glow: rgba(0, 178, 255, 0.1); /* Energy pockets */
--bp-indigo-glow: rgba(60, 90, 170, 0.12); /* Depth bloom */
```

### Layout Components

#### Background Component

The `Background` component is the heart of the Blueprint Theme:

- **Dynamic Grid Calculation**: Adjusts grid size based on viewport and desired square size
- **Responsive Padding**: Calculates optimal padding that snaps to grid lines
- **Orientation Handling**: Special handling for mobile device rotation
- **Layout Callbacks**: Provides grid measurements to parent components

#### Layout System

- **Proportional Spacing**: Uses 1/6 viewport width for side padding
- **Grid-Aligned Content**: Content widths snap to grid units (70/80 units)
- **Responsive Breakpoints**: Adapts layout based on viewport dimensions

## Getting Started

### Prerequisites

- Node.js 22.x
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DolanCoding/Portfolio_AI_Driven.git
   cd Portfolio_AI_Driven
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up the database**

   ```bash
   cd ../backend
   npm run build
   npm start
   ```

   The database will be automatically initialized with sample data.

4. **Start the frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```

### Available Scripts

#### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run typecheck` - Run TypeScript type checking

#### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
Portfolio_AI_Driven/
├── backend/                 # Express.js API server
│   ├── db/                  # Database files and schemas
│   ├── dist/                # Compiled JavaScript
│   ├── tests/               # Backend tests
│   └── server.ts            # Main server file
├── frontend/                # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── layout/          # Layout utilities
│   │   └── utils/           # Helper functions
│   └── index.html           # HTML template
├── shared-types/            # Shared TypeScript interfaces
└── .github/workflows/       # CI/CD pipeline
```

## API Endpoints

- `GET /api/projects` - Retrieve all projects
- `GET /api/certificates` - Retrieve all certificates
- `GET /images/*` - Serve static images

## Development Guidelines

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Zero warnings policy (`--max-warnings=0`)
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Follow semantic commit messages

### Architecture Patterns

- **Component Composition**: Prefer composition over inheritance
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Type Safety**: Maximize TypeScript usage for API contracts
- **Shared Types**: Use `shared-types` for API interfaces

## Deployment

### Frontend

The frontend is configured for GitHub Pages deployment with the `/Portfolio` base path:

```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

### Backend

The backend can be deployed to any Node.js hosting service:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting
5. Submit a pull request

## License

This project is private and not currently licensed for public use.

## Roadmap

- [ ] Complete responsive design refinements
- [ ] Add more interactive elements
- [ ] Implement contact form functionality
- [ ] Add project filtering and search
- [ ] Optimize performance and loading times
- [ ] Implement CI/CD for automated deployment

---

_Built with ❤️ using modern web technologies_</content>
<parameter name="filePath">c:\Coding\Portfolio\README.md
