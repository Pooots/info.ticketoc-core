# Ticketoc Frontend

A modern, responsive ticketing platform built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🎨 Dark/Light mode toggle
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🚀 Fast development with Vite
- 🎯 TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the core directory:
```bash
cd core
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
core/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Theme)
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing
