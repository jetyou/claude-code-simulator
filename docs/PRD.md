# Claude Simulator - Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Product Name
**Claude Simulator** - 上班摸鱼神器，假装 vibe coding

### 1.2 Product Vision
一个 CLI 工具，模拟 Claude Code 运行，生成随机工具调用和输出，营造"AI 辅助编程"的假象。让你在老板眼中是全公司最努力的开发者，实际上你只是在看漂亮的代码滚动。

### 1.3 Target Users
- 上班想摸鱼的开发者
- 需要营造"忙碌编程"氛围的人
- 想要模拟 AI 辅助开发的人

---

## 2. Implemented Features

### 2.1 CLI Interface ✅

#### 2.1.1 Global Command
```bash
npm start          # Run simulator
npm run dev        # Run with hot reload
claude-simulator   # After npm link
```

#### 2.1.2 Control Commands
| Command | Description |
|---------|-------------|
| `start` | Begin vibe coding simulation |
| `stop` | Pause simulation |
| `resume` | Continue after pause |
| `exit` | Exit application |
| `help` | Show commands |
| `clear` | Clear output |

### 2.2 UI Components ✅

#### 2.2.1 Responsive Header
- **Horizontal mode** (≥70 columns): Two-column layout with cat logo, tips, and activity panel
- **Compact mode** (<70 columns): Single-column centered layout
- Automatic width detection and real-time resize handling
- Smart path truncation with middle ellipsis

#### 2.2.2 Output Area
- Tool call display with success (✓) / pending (⏳) indicators
- Diff rendering with green/red backgrounds
- Streaming text effect

#### 2.2.3 Footer
- Permission mode indicator: `acceptEdits`, `bypassPermissions`, `plan`
- Keyboard shortcuts: `? for shortcuts`
- Progress stats

#### 2.2.4 Input Field
- Real-time text input
- Placeholder hints based on state
- Command processing

### 2.3 Tool Simulation ✅

| Tool | Output Format |
|------|----------------|
| Read | `✓ Read src/components/Header.tsx → 156 lines, React component` |
| Edit | `✓ Edit src/utils/api.ts → Added useMemo for optimization` |
| Bash | `✓ Bash npm run test → 47 tests passed` |
| Grep | `✓ Grep pattern: "useState" → Found 12 matches in 3 files` |
| Glob | `✓ Glob pattern: "*.tsx" → Found 8 files` |
| Write | `✓ Write src/api/client.ts → Wrote 85 lines` |

### 2.4 Random Content Generation ✅

- **File paths**: Realistic React project structure
- **Tool sequences**: Logical patterns (Read → Edit → Bash)
- **Code diffs**: Fake but realistic code changes
- **Comments**: Claude-style thinking remarks

---

## 3. Technical Implementation

### 3.1 Tech Stack
- **Ink** - React for CLI (v5.0.1)
- **React** - UI framework (v18.3.1)
- **chalk** - Terminal colors (v5.3.0)
- **figures** - Unicode symbols (v6.1.0)
- **tsx** - TypeScript/JSX runtime (v4.19.0)

### 3.2 Architecture
```
src/
├── App.jsx                 # Main app with state management
├── components/
│   ├── Header.jsx          # Responsive two-column layout
│   ├── Footer.jsx          # Permission mode & shortcuts
│   ├── OutputArea.jsx      # Tool calls with diff rendering
│   ├── TextInput.jsx       # User input field
│   └── Spinner.jsx         # Loading animation
├── engine/
│   └── SimulatorEngine.jsx # Core simulation loop
├── generators/
│   ├── ToolGenerator.jsx   # Random tool calls
│   ├── CodeGenerator.jsx   # Fake code content
│   └── CommentGenerator.jsx # Thinking comments
├── hooks/
│   └── useSimulatorState.jsx # React state hook
└── models/
    └── FileTree.jsx        # Virtual project structure
```

### 3.3 Key Design Decisions

1. **Ink over vanilla CLI** - Component-based UI with React patterns
2. **Responsive layout** - Matches Claude Code's exact layout algorithm
3. **No debounce on resize** - Synchronous handling prevents flicker
4. **Async loop with refs** - Proper state management for pause/resume

---

## 4. Future Features (Phase 2+)

### 4.1 Scenario Modes
- Refactor React component
- Fix bug in authentication
- Write unit tests
- Code cleanup

### 4.2 Enhancement Ideas
- Typing sound effects
- Boss key (quick hide)
- Custom scenarios
- Progress persistence

---

## 5. Success Metrics

✅ Works on macOS/Linux
✅ Smooth responsive layout
✅ Realistic tool call sequences
✅ Proper pause/resume/exit
✅ < 50MB memory usage

---

**Document Version**: 2.0
**Last Updated**: 2026-04-02
**Status**: MVP Complete