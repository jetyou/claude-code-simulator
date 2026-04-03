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
| Input Commands | ✅ | /start, /stop, /resume, /exit, /help, /clear |
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

## v1.1.0 - Buddy Pet (Completed) ✅

### Priority: High

**Theme: 高仿 Claude Code 伴侣互动功能 (Tamagotchi-style)**

| Feature | Status | Description |
|---------|--------|-------------|
| Deterministic Gen | ✅ | Hash from user ID for persistent identity |
| Species & Art | ✅ | 6 species (cat, duck, owl, dragon, ghost, blob), 5-line ASCII |
| Rarity & Hats | ✅ | 5 tiers (Common to Legendary), colors + hat overlays |
| Personality Stats | ✅ | Debugging, Patience, Chaos, Wisdom, Snark |
| Speech Bubbles | ✅ | Personality-driven comments on events |
| Commands | ✅ | `/buddy`, `/buddy pet`, `/buddy card`, `/buddy off` |

### Buddy Features Detail

```
┌──────────────────────────────────────────────────────────╮
│  ...                                                     │
│  ✓ Edit src/components/Header.tsx                       │
│    → Added useMemo optimization                         │
│                                                          │
│  ┌────────────────────┐                                 │
│  │  A wise refactor!  │        👑                       │
│  │      💬            │      /\_/\                      │
│  └────────────────────┘     ( o.o )                     │
│                              > ^ <                      │
│                             /|   |\                     │
│                            (_|   |_)                    │
│                            Stack the Wise               │
╰──────────────────────────────────────────────────────────╯
```

### Buddy Reactions & Personality

- **Event-Driven**: Reacts to `/start` loops (Read, Edit, Bash, Error, Idle).
- **Chaos influence**: High chaos stat increases reaction frequency.
- **Dominant Trait**: Determines the pool of comments (e.g., Snark uses sarcastic comments).
- **Interactions**: `/buddy pet` triggers hearts (❤️) and purr responses.

### Technical Requirements Implemented

- `BuddyData.jsx`: Data model (FNV-1a hash + Mulberry32 PRNG), species registry
- `Buddy.jsx`: Component with 5-line art, rarity coloring, stats card view
- `App.jsx`: Full slash command parser including the `/buddy` suite
- `SimulatorEngine.jsx`: Personality-aware commentary dispatcher

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
| Layout truncates some text | Fixed | Added `flexShrink={0}` in App.jsx |

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

### v1.1.0 (2026-04-03)

**New Features:**
- Added high-fidelity Tamagotchi-style Buddy Pet
- 6 deterministic species with 5 rarity tiers, personality stats, and item overlays (hats)
- Implemented `/buddy`, `/buddy pet`, `/buddy card`, `/buddy off/on` commands
- All standard commands (`start`, `exit`, etc.) now changed to use `/` prefix (`/start`)
- Personality-aware event commentary system

**Technical:**
- Implemented `FNV-1a` + `Mulberry32` for deterministic account-based buddy generation

---

## Development Roadmap

```
2026-04 ──────────────────────────────────────────────►
2026-04 ──────────────────────────────────────────────►
         │
         ├─ v1.0.0 ✅ MVP Complete
         │
         └─ v1.1.0 ✅ Buddy Pet Feature (High Fidelity)
```

---

**Last Updated**: 2026-04-03
**Maintainer**: Claude Simulator Team