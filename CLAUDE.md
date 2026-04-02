# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Claude Simulator** - 上班摸鱼神器，假装 vibe coding

A CLI tool that simulates Claude Code running, generating random tool calls and outputs to create the illusion of AI-assisted coding. Perfect for looking busy while doing nothing.

**All output text in the application must be in English.**

## Documentation

| File | Description |
|------|-------------|
| `docs/PRD.md` | Product requirements and feature list |
| `docs/DESIGN.md` | Technical design and architecture |
| `docs/PLAN.md` | Version roadmap and changelog |
| `docs/ui.jpeg` | UI screenshot reference |

## Commands

```bash
npm start          # Run the simulator
npm run dev        # Run with hot reload
npm link           # Install globally → claude-simulator
```

## Architecture

```
src/
├── App.jsx                 # Main app (state, input handling)
├── components/
│   ├── Header.jsx          # Responsive layout (horizontal/compact)
│   ├── Footer.jsx          # Permission mode, shortcuts, stats
│   ├── OutputArea.jsx      # Tool calls with diff rendering
│   ├── TextInput.jsx       # User input
│   └── Spinner.jsx         # Loading animation
├── engine/
│   └── SimulatorEngine.jsx # Core loop: tick(), start/stop/pause
├── generators/
│   ├── ToolGenerator.jsx   # Random tool calls
│   ├── CodeGenerator.jsx   # Fake diffs
│   └── CommentGenerator.jsx # Thinking comments
├── hooks/
│   └── useSimulatorState.jsx
└── models/
    └── FileTree.jsx        # Virtual project structure
```

## Key Implementation

### Responsive Layout (Header.jsx)

Uses Claude Code's exact algorithm:

```javascript
const MAX_LEFT_WIDTH = 50;
const BORDER_PADDING = 4;
const DIVIDER_WIDTH = 1;
const CONTENT_PADDING = 2;

// Layout modes: horizontal (≥70 cols) / compact (<70 cols)
function getLayoutMode(columns) {
  return columns >= 70 ? 'horizontal' : 'compact';
}
```

### Resize Handling

**NO DEBOUNCE.** Synchronous resize prevents flicker:

```javascript
stdout?.on('resize', handleResize);  // Direct, no setTimeout
```

### State Machine

```
idle ──start──► running ──stop──► paused
  │                │                  │
  │                └────resume────────┘
  │                       │
  └─────────exit──────────┴──► exit
```

### Diff Rendering

- Green background: added lines (`+`)
- Red background: removed lines (`-`)

## Tech Stack

- **Ink** v5.0.1 - React for CLI
- **React** v18.3.1
- **chalk** v5.3.0 - Terminal colors
- **figures** v6.1.0 - Unicode symbols
- **tsx** v4.19.0 - JSX runtime