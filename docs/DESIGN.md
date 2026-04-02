# Claude Simulator - Design Document

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude Simulator CLI                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    React/Ink App                       │   │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌────────┐  │   │
│  │  │ Header  │  │ OutputArea│  │ Spinner │  │ Footer │  │   │
│  │  └─────────┘  └──────────┘  └─────────┘  └────────┘  │   │
│  │                       │                                │   │
│  │  ┌────────────────────┴───────────────────────────┐   │   │
│  │  │              SimulatorEngine                     │   │   │
│  │  │  - tick() → generate tool call                   │   │   │
│  │  │  - start/stop/pause state                        │   │   │
│  │  └────────────────────┬───────────────────────────┘   │   │
│  │                       │                                │   │
│  │  ┌────────────────────┴───────────────────────────┐   │   │
│  │  │              Generators                         │   │   │
│  │  │  ToolGenerator  CodeGenerator  CommentGenerator │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Hierarchy

```
App
├── Header (responsive: horizontal/compact)
│   ├── Title border
│   ├── Welcome message
│   ├── Cat logo (▗ ▗ ▖ ▖ / ▘▘ ▝▝)
│   ├── Model info
│   └── CWD path
├── OutputArea (scrollable)
│   └── Tool call items
│       └── Diff rendering (optional)
├── Spinner (when running)
├── TextInput
│   └── Input field with placeholder
├── Footer
│   ├── Permission mode
│   ├── Keyboard hints
│   └── Progress stats
└── Buddy (cat speech bubble)
```

---

## 2. Core Components

### 2.1 App.jsx - Main Application

```jsx
function App() {
  // State
  const [terminalWidth, setTerminalWidth] = useState(80);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for async loop
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);

  // Simulator engine
  const engineRef = useRef(new SimulatorEngine({...}));

  // Input handling
  const handleSubmit = (text) => {
    if (text === 'start') startSimulation();
    if (text === 'stop') pauseSimulation();
    if (text === 'resume') resumeSimulation();
    if (text === 'quit') showSummaryAndExit();
  };
}
```

### 2.2 Header.jsx - Responsive Layout

**Layout Modes:**
- `horizontal` (columns >= 70): Two-column layout
- `compact` (columns < 70): Single-column centered

**Layout Algorithm (from Claude Code):**

```javascript
const MAX_LEFT_WIDTH = 50;
const BORDER_PADDING = 4;
const DIVIDER_WIDTH = 1;
const CONTENT_PADDING = 2;

function getLayoutMode(columns) {
  return columns >= 70 ? 'horizontal' : 'compact';
}

function calculateLayoutDimensions(columns, layoutMode, optimalLeftWidth) {
  if (layoutMode === 'horizontal') {
    const leftWidth = optimalLeftWidth;
    const usedSpace = BORDER_PADDING + CONTENT_PADDING + DIVIDER_WIDTH + leftWidth;
    const availableForRight = columns - usedSpace;
    let rightWidth = Math.max(30, availableForRight);
    const totalWidth = Math.min(
      leftWidth + rightWidth + DIVIDER_WIDTH + CONTENT_PADDING,
      columns - BORDER_PADDING
    );
    if (totalWidth < leftWidth + rightWidth + DIVIDER_WIDTH + CONTENT_PADDING) {
      rightWidth = totalWidth - leftWidth - DIVIDER_WIDTH - CONTENT_PADDING;
    }
    return { leftWidth, rightWidth, totalWidth };
  }
  // Compact mode
  const totalWidth = Math.min(columns - BORDER_PADDING, MAX_LEFT_WIDTH + 20);
  return { leftWidth: totalWidth, rightWidth: totalWidth, totalWidth };
}
```

**Resize Handling (NO DEBOUNCE):**

```javascript
// Correct: synchronous resize prevents flicker
useEffect(() => {
  const handleResize = () => {
    const newWidth = getWidth();
    setTerminalWidth(prev => prev === newWidth ? prev : newWidth);
  };
  stdout?.on('resize', handleResize);
  return () => stdout?.off('resize', handleResize);
}, [stdout]);
```

### 2.3 OutputArea.jsx - Tool Call Rendering

```jsx
function OutputArea({ outputs }) {
  return (
    <Box flexDirection="column">
      {outputs.slice(-30).map(renderOutput)}
    </Box>
  );
}

function renderOutput(output) {
  switch (output.type) {
    case 'tool_call':
      return <ToolCallLine {...output} />;
    case 'diff':
      return <DiffDisplay lines={output.diff} />;
    case 'comment':
      return <Text dimColor>{output.content}</Text>;
  }
}
```

### 2.4 SimulatorEngine.jsx - Core Loop

```jsx
class SimulatorEngine {
  async tick() {
    const toolCall = this.toolGenerator.generate(this.fileTree);
    this.showToolCall(toolCall);
    this.updateStats(toolCall);

    // Occasional comments
    if (Math.random() < 0.15) {
      this.onOutput({ type: 'comment', content: this.commentGenerator.next() });
    }
  }
}

// Async loop in App.jsx
useEffect(() => {
  if (!isSimulating || isPaused) return;
  isRunningRef.current = true;

  const runLoop = async () => {
    while (isRunningRef.current && !isPausedRef.current) {
      await engineRef.current?.tick();
      await new Promise(r => setTimeout(r, 500 + Math.random() * 2000));
    }
  };
  runLoop();
}, [isSimulating, isPaused]);
```

---

## 3. Generators

### 3.1 ToolGenerator.jsx

```jsx
class ToolGenerator {
  constructor() {
    this.toolTypes = ['Read', 'Edit', 'Bash', 'Grep', 'Glob', 'Write'];
    this.weights = { Read: 0.35, Edit: 0.25, Bash: 0.15, Grep: 0.15, Glob: 0.05, Write: 0.05 };
  }

  generate(fileTree) {
    const type = this.weightedRandom(this.weights);
    return { type, params: this.generateParams(type, fileTree) };
  }
}
```

### 3.2 CodeGenerator.jsx

```jsx
class CodeGenerator {
  constructor() {
    this.codeChanges = [
      {
        oldLines: ['const [state, setState] = useState(null);'],
        newLines: [
          'const [data, setData] = useState(null);',
          'const [loading, setLoading] = useState(false);',
        ],
      },
      // ... more patterns
    ];
  }

  generateCodeDiff() {
    const change = this.codeChanges[Math.floor(Math.random() * this.codeChanges.length)];
    return {
      oldLines: change.oldLines,
      newLines: change.newLines,
      startLine: Math.floor(Math.random() * 30) + 10,
      addedLines: change.newLines.length,
      removedLines: change.oldLines.length,
    };
  }
}
```

---

## 4. Data Models

### 4.1 Simulation State

```typescript
interface SimulationState {
  status: 'idle' | 'running' | 'paused';
  stats: {
    filesRead: number;
    filesModified: number;
    commandsRun: number;
    totalOps: number;
  };
  outputs: OutputItem[];
}

interface OutputItem {
  id: string;
  type: 'tool_call' | 'comment' | 'diff' | 'system' | 'prompt';
  content?: string;
  tool?: string;
  params?: string;
  result?: string;
  diff?: DiffData;
  success?: boolean;
}
```

### 4.2 Tool Call

```typescript
interface ToolCall {
  type: 'Read' | 'Edit' | 'Bash' | 'Grep' | 'Glob' | 'Write';
  params: {
    file_path?: string;
    command?: string;
    pattern?: string;
  };
}
```

---

## 5. File Structure

```
claude-code-simulator/
├── package.json
├── README.md
├── README_CN.md
├── CLAUDE.md
├── bin/
│   └── claude-simulator.tsx    # Entry point
├── src/
│   ├── App.jsx                  # Main app
│   ├── components/
│   │   ├── Header.jsx           # Responsive header
│   │   ├── Footer.jsx           # Status bar
│   │   ├── OutputArea.jsx       # Output display
│   │   ├── TextInput.jsx        # Input field
│   │   ├── Spinner.jsx          # Loading animation
│   │   └── Buddy.jsx            # Cat companion
│   ├── engine/
│   │   └── SimulatorEngine.jsx  # Core logic
│   ├── generators/
│   │   ├── ToolGenerator.jsx    # Tool calls
│   │   ├── CodeGenerator.jsx    # Code content
│   │   └── CommentGenerator.jsx # Comments
│   ├── hooks/
│   │   └── useSimulatorState.jsx
│   └── models/
│       └── FileTree.jsx         # Project structure
└── docs/
    ├── PRD.md
    ├── DESIGN.md
    └── ui.jpeg
```

---

## 6. Key Algorithms

### 6.1 String Width (CJK Support)

```javascript
function stringWidth(str) {
  let width = 0;
  for (const char of str) {
    const code = char.codePointAt(0) || 0;
    if (/* CJK ranges */) {
      width += 2;  // Double-width for CJK
    } else {
      width += 1;
    }
  }
  return width;
}
```

### 6.2 Path Truncation

```javascript
function truncatePath(path, maxLength) {
  if (stringWidth(path) <= maxLength) return path;

  const parts = path.split('/');
  const last = parts[parts.length - 1];

  // Show: ~/…/workspace_dev/claude-code-simulator
  return first.slice(0, available) + '…' + '/' + last;
}
```

---

## 7. Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Memory | < 50MB | ✅ |
| CPU | < 5% | ✅ |
| Output | No flicker | ✅ |
| Resize | Instant | ✅ |

---

**Document Version**: 2.0
**Last Updated**: 2026-04-02
**Status**: MVP Complete