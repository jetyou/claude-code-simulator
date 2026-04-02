# Claude Simulator - Version Plan

## Current Version: v1.0.0

**Release Date**: 2026-04-02
**Status**: MVP Complete

---

## v1.0.0 - MVP (Completed) ✅

### Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| CLI Interface | ✅ | `npm start` / `claude-simulator` command |
| Responsive Header | ✅ | Two-column (≥70 cols) / compact (<70 cols) layouts |
| Tool Simulation | ✅ | Read, Edit, Bash, Grep, Glob, Write operations |
| Diff Rendering | ✅ | Green/red background for code changes |
| Streaming Output | ✅ | Character-by-character display |
| Input Commands | ✅ | start, stop, resume, quit, help, clear |
| Progress Stats | ✅ | Files read, modified, commands run |
| Footer Status | ✅ | Permission mode, keyboard hints |
| Resize Handling | ✅ | Real-time responsive (no debounce) |

### Files Implemented

```
src/
├── App.jsx                 ✅ Main app with state management
├── components/
│   ├── Header.jsx          ✅ Responsive layout
│   ├── Footer.jsx          ✅ Status bar
│   ├── OutputArea.jsx      ✅ Tool calls + diff
│   ├── TextInput.jsx       ✅ User input
│   ├── Spinner.jsx         ✅ Loading animation
│   └── Buddy.jsx           🔲 Cat companion (placeholder)
├── engine/
│   └── SimulatorEngine.jsx ✅ Core simulation loop
├── generators/
│   ├── ToolGenerator.jsx   ✅ Random tool calls
│   ├── CodeGenerator.jsx   ✅ Fake code content
│   └── CommentGenerator.jsx✅ Thinking comments
├── hooks/
│   └── useSimulatorState.jsx ✅ React state hook
└── models/
    └── FileTree.jsx        ✅ Virtual project structure
```

---

## v1.1.0 - Buddy Pet (Next)

### Priority: High

**Theme: 增加猫咪伴侣互动功能**

| Feature | Status | Description |
|---------|--------|-------------|
| Buddy Display | 🔲 | Show cat companion in corner |
| Speech Bubbles | 🔲 | Random comments from buddy |
| Reactions | 🔲 | React to tool calls (happy/confused/working) |
| Animation | 🔲 | Idle animations, blink, tail wag |
| Interaction | 🔲 | Pet the cat, get responses |

### Buddy Features Detail

```
┌──────────────────────────────────────────────────────────╮
│  ...                                                     │
│  ✓ Edit src/components/Header.tsx                       │
│    → Added useMemo optimization                         │
│                                                          │
│  ┌────────────────────┐                                 │
│  │  Great progress!   │                                 │
│  │      🐱            │                                 │
│  └────────────────────┘                                 │
│                                                          │
╰──────────────────────────────────────────────────────────╯
```

### Buddy Reactions

| Event | Reaction | Comment |
|-------|----------|---------|
| File read | 👀 | "Let me see..." |
| Edit success | 😸 | "Nice fix!" |
| Bash test pass | 🎉 | "Tests passing!" |
| Error | 😿 | "Oops, let me fix that..." |
| Long operation | 💤 | *yawn* |
| User pause | 😺 | "Taking a break?" |

### Technical Requirements

- ASCII art cat sprite (multiple frames)
- Speech bubble component with auto-hide
- Event-driven reaction system
- Random comment generator for buddy

---

## Future Versions

### v1.2.0+ (TBD)

| Feature | Priority | Description |
|---------|----------|-------------|
| Scenario Modes | Medium | Refactor, bugfix, testing presets |
| Typing Sounds | Low | Optional keyboard sounds |
| Boss Key | Medium | Quick hide mode |
| npm Package | High | Publish to registry |

---

## Known Issues

| Issue | Status | Fix Target |
|-------|--------|------------|
| Raw mode error in non-TTY | Known | Document limitation |
| Buddy not implemented | Planned | v1.1.0 |

---

## Changelog

### v1.0.0 (2026-04-02)

**New Features:**
- Initial MVP release
- Responsive header with horizontal/compact modes
- Tool call simulation (Read, Edit, Bash, Grep, Glob, Write)
- Diff rendering with colored backgrounds
- Real-time resize handling
- Progress statistics

**Technical:**
- Built with Ink v5.0.1 and React 18
- Claude Code's exact layout algorithm
- No-debounce resize for flicker-free updates

---

## Development Roadmap

```
2026-04 ──────────────────────────────────────────────►
         │
         ├─ v1.0.0 ✅ MVP Complete
         │
         └─ v1.1.0 🔲 Buddy Pet Feature
```

---

**Last Updated**: 2026-04-02
**Maintainer**: Claude Simulator Team