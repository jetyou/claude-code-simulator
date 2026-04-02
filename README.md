# Claude Simulator 🐱

**The ultimate slacking tool for pretending to "vibe code" at work!** 

A CLI tool that simulates Claude Code running, generating random tool calls and outputs to create the illusion of productive coding. Perfect for looking busy while doing absolutely nothing. Your boss will think you're deep in AI-assisted development, but you're just watching the pretty output scroll by.

![Demo](docs/ui.jpeg)

## Features

- 🎭 **Realistic UI** - High-fidelity imitation of Claude Code's interface with responsive layout. Looks so real, your coworkers will be impressed by your "productivity"
- 📊 **Responsive Layout** - Adapts to terminal width (horizontal mode for wide terminals, compact mode for narrow)
- 🔧 **Tool Simulation** - Generates realistic Read/Edit/Bash/Grep/Glob/Write operations that look like real work
- 🎨 **Diff Highlighting** - Shows code changes with green/red backgrounds. "Look boss, I'm refactoring!"
- 🐱 **Cat Companion** - ASCII art cat logo (▗ ▗ ▖ ▖ / ▘▘ ▝▝) for maximum vibes
- ⌨️ **Interactive Commands** - Start, stop, pause, and resume your "coding session"

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-simulator.git
cd claude-simulator

# Install dependencies
npm install

# Run the simulator
npm start
```

### Global Installation

```bash
# Install globally
npm link

# Now you can run it from anywhere
claude-simulator
```

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `start` | Begin the vibe coding simulation |
| `stop` | Pause the simulation |
| `resume` | Continue after pausing |
| `quit` / `exit` | Exit the application |
| `help` | Show available commands |
| `clear` | Clear the output area |

### Keyboard Shortcuts

- `Ctrl+C` - Exit the application

## Screenshots

### Horizontal Mode (Wide Terminal, ≥70 columns)

```
╭─── Claude Simulator v1.0.0 ──────────────────────────────────────────────╮
│                                           │ Tips for getting started     │
│       Welcome to Claude Simulator!        │ Type "start" to begin vibe c │
│                                           │ ──────────────────────────── │
│                 ▗ ▗   ▖ ▖                 │ Recent activity              │
│                   ▘▘ ▝▝                   │ No recent activity           │
│                                           │                              │
│      claude-sonnet-4-6 · Vibe Coding      │                              │
│ ~/…/workspace_dev/claude-code-simulator   │                              │
╰──────────────────────────────────────────────────────────────────────────╯
```

### Compact Mode (Narrow Terminal, <70 columns)

```
╭─── Claude Simulator v1.0.0 ──────────────────────────╮

              Welcome to Claude Simulator!

                     ▗ ▗   ▖ ▖
                       ▘▘ ▝▝

            claude-sonnet-4-6 · Vibe Coding
    ~/.openclaw/workspace_dev/claude-code-simulator

╰──────────────────────────────────────────────────────╯
```

## Example Session

```
> start

✓ Read src/components/Header.tsx
  → 156 lines, React component

✓ Edit src/components/Header.tsx
  + const [data, setData] = useState(null);
  + const [loading, setLoading] = useState(false);
  - const [state, setState] = useState(null);
  → Added 2 lines, removed 1 line

✓ Bash npm run test
  → 47 tests passed, 0 failed

[Progress: Read 5 files | Modified 2 files | Ran 1 commands]
```

## Architecture

Built with [Ink](https://github.com/vadimdemedes/ink) (React for CLI):

```
src/
├── App.jsx                 # Main app component
├── components/
│   ├── Header.jsx          # Responsive header (two-column/compact)
│   ├── Footer.jsx          # Status bar with permission mode
│   ├── OutputArea.jsx      # Tool call output with diff rendering
│   ├── TextInput.jsx       # User input field
│   └── Spinner.jsx         # Loading animation
├── engine/
│   └── SimulatorEngine.jsx # Core orchestration
├── generators/
│   ├── ToolGenerator.jsx   # Random tool calls
│   ├── CodeGenerator.jsx   # Fake code snippets
│   └── CommentGenerator.jsx # Thinking comments
└── hooks/
    └── useSimulatorState.jsx # State management
```

## Development

```bash
# Run in development mode with hot reload
npm run dev
```

## Tech Stack

- **Ink** - React for CLI applications
- **React** - UI framework
- **chalk** - Terminal string styling
- **figures** - Unicode symbols
- **tsx** - TypeScript/JSX runtime

## License

MIT

## Disclaimer

This is a parody/entertainment tool and is not affiliated with Anthropic or Claude Code. It simulates the appearance of coding activity for entertainment purposes only.

**Use responsibly!** We are not responsible if:
- Your boss catches you smiling at your terminal for no apparent reason
- You become known as "that person who is always AI coding"
- Your coworkers start asking you to review their actual code
- You forget what real coding feels like

Happy slacking! 🐱💻