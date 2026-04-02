# Claude Simulator - UI Design Document

## 1. UI Overview

### 1.1 Visual Style
Based on ui.jpeg reference:
- Dark terminal background (black/dark gray)
- Left-top: Claude purple cat logo
- Right-bottom: Soup buddy (small robot/cat) with speech bubble
- Streaming text output in terminal style

### 1.2 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ 🐱 Claude Simulator                      [Claude Logo]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Terminal Output Area                                       │
│  (streaming tool calls, comments, progress)                 │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ > User input area                                           │
│                                                             │
│                                    🤖 [Soup buddy]          │
│                                    "Hmm, interesting..."    │
│                                    [speech bubble]          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Design

### 2.1 Claude Logo (Top-Left)

**Position**: Top-left corner, fixed
**Style**: Purple cat emoji + text
**Content**: `🐱 Claude Simulator`

```
┌─────────────────────────┐
│ 🐱 Claude Simulator     │
│ v1.0.0                  │
└─────────────────────────┘
```

**Implementation**:
```javascript
function renderHeader() {
  return chalk.cyan('🐱 Claude Simulator') + chalk.gray(' v1.0.0');
}
```

### 2.2 Terminal Output Area (Main)

**Position**: Full width, scrollable
**Style**: Dark background, streaming text
**Components**:
- Tool calls with icons (✓, ⏳, ✗)
- Comments in gray
- Progress stats in dim color
- User prompts highlighted

**Color Scheme**:
```javascript
const colors = {
  background: '#1a1a1a',      // Dark terminal background
  text: '#ffffff',            // White text
  success: '#22c55e',         // Green for completed
  pending: '#eab308',         // Yellow for pending
  error: '#ef4444',           // Red for errors
  comment: '#6b7280',         // Gray for comments
  highlight: '#a78bfa',       // Purple for prompts
  dim: '#4b5563'              // Dim gray for stats
};
```

### 2.3 User Input Area (Bottom)

**Position**: Bottom of terminal
**Style**: Prompt prefix `> `, user input follows
**Behavior**:
- Accepts commands while simulation runs
- Shows typed text
- Clears after command execution

```
┌──────────────────────────────┐
│ > stop                       │
│ ⏸️ Simulation paused         │
│                              │
│ > _                          │
└──────────────────────────────┘
```

### 2.4 Soup Buddy (Bottom-Right)

**Position**: Bottom-right corner, fixed
**Style**: Small robot/cat emoji + speech bubble
**Content**: Occasional comments in bubble

```
         ┌──────────────────┐
         │ "Hmm, this looks │
         │  complicated..." │
         └──────────────────┘
                🤖
```

**Buddy Comments** (random, occasional):
```javascript
const buddyComments = [
  "Hmm, interesting code...",
  "Looks busy!",
  "Vibe coding mode activated",
  "This is... complex",
  "Keep going!",
  "Nice progress",
  "Wonder what this does...",
  "So many files!",
  "Coding vibes~",
  "Interesting approach"
];
```

**Display Timing**:
- Show bubble every 15-30 operations
- Display for 3-5 seconds
- Fade out smoothly
- Don't overlap with user input

---

## 3. Animation Design

### 3.1 Streaming Text Animation

**Character-by-character display**:
- Speed: 15-25ms per character
- Random variance: ±5ms
- Smooth, no jitter

```javascript
async function streamText(text) {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(15 + Math.random() * 10);
  }
  console.log();
}
```

### 3.2 Spinner Animation

**States**:
- ⏳ Thinking (analyzing)
- ⏳ Reading file...
- ⏳ Running command...
- ⏳ Searching...

**Spinner types** (using ora library):
```javascript
const spinners = {
  thinking: { text: 'Thinking...', spinner: 'dots' },
  reading: { text: 'Reading file...', spinner: 'dots' },
  running: { text: 'Running...', spinner: 'dots12' },
  searching: { text: 'Searching...', spinner: 'line' }
};
```

### 3.3 Buddy Animation

**Speech bubble appearance**:
1. Bubble appears (fade in)
2. Text streams in bubble
3. Hold for 3-5 seconds
4. Fade out smoothly

```
Step 1: Fade in
┌─────────┐
│         │
└─────────┘
    🤖

Step 2: Text stream
┌──────────────┐
│ "Hmm,       │
│  interesting│
└──────────────┘
    🤖

Step 3: Hold
┌──────────────┐
│ "Hmm,       │
│  interesting│
│  code..."   │
└──────────────┘
    🤖

Step 4: Fade out
    🤖
```

---

## 4. Terminal Layout Implementation

### 4.1 Full Screen Layout

```javascript
class TerminalLayout {
  constructor() {
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
    this.headerHeight = 2;
    this.inputHeight = 3;
    this.buddyWidth = 25;
    this.outputHeight = this.height - this.headerHeight - this.inputHeight;
  }

  render() {
    // Clear screen
    console.clear();

    // Render header
    this.renderHeader();

    // Render output area (scrollable)
    this.renderOutput();

    // Render input area
    this.renderInput();

    // Render buddy (positioned)
    this.renderBuddy();
  }

  renderHeader() {
    // Top-left: Claude logo
    const logo = chalk.cyan('🐱 Claude Simulator') + chalk.gray(' v1.0.0');

    // Position at top-left
    process.stdout.write(`\x1b[1;1H${logo}\n`);
  }

  renderOutput() {
    // Main output area
    // Content scrolls naturally
  }

  renderInput() {
    // Bottom input prompt
    const prompt = chalk.cyan('> ');
    process.stdout.write(`\x1b[${this.height - 3};1H${prompt}`);
  }

  renderBuddy() {
    // Position at bottom-right
    const buddyX = this.width - this.buddyWidth;
    const buddyY = this.height - 2;

    // Draw buddy and speech bubble
    this.drawBuddy(buddyX, buddyY);
  }
}
```

### 4.2 Buddy Positioning

```javascript
class BuddyRenderer {
  constructor(layout) {
    this.layout = layout;
    this.visible = false;
    this.currentComment = null;
  }

  show(comment) {
    this.visible = true;
    this.currentComment = comment;

    // Calculate position (bottom-right)
    const x = this.layout.width - 25;
    const y = this.layout.height - 5;

    // Draw speech bubble
    this.drawBubble(x, y, comment);

    // Draw buddy emoji
    this.drawBuddy(x + 10, y + 3);
  }

  hide() {
    this.visible = false;
    this.currentComment = null;

    // Clear buddy area
    this.clearBubble();
  }

  drawBubble(x, y, text) {
    // ANSI escape codes to position cursor
    const lines = this.formatBubble(text);

    lines.forEach((line, i) => {
      process.stdout.write(`\x1b[${y + i};${x}H${line}`);
    });
  }

  formatBubble(text) {
    // Format text in bubble shape
    const maxWidth = 20;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      if (currentLine.length + word.length + 1 <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(`│ ${currentLine.padEnd(maxWidth - 2)} │`);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(`│ ${currentLine.padEnd(maxWidth - 2)} │`);
    }

    // Add bubble borders
    const width = Math.max(...lines.map(l => l.length));
    lines.unshift(`┌${'─'.repeat(width - 2)}┐`);
    lines.push(`└${'─'.repeat(width - 2)}┘`);

    return lines;
  }

  drawBuddy(x, y) {
    // Draw buddy emoji
    process.stdout.write(`\x1b[${y};${x}H🤖`);
  }
}
```

---

## 5. Color Palette

### 5.1 ANSI Color Codes

```javascript
const colors = {
  // Text colors
  white: '\x1b[37m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',

  // Styles
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  reset: '\x1b[0m'
};
```

### 5.2 Theme Configuration

```javascript
const theme = {
  header: {
    logo: colors.cyan + colors.bold,
    version: colors.gray
  },

  output: {
    success: colors.green,
    pending: colors.yellow,
    error: colors.red,
    comment: colors.gray,
    highlight: colors.magenta,
    dim: colors.gray + colors.dim
  },

  input: {
    prompt: colors.cyan,
    text: colors.white
  },

  buddy: {
    bubble: colors.gray,
    text: colors.white,
    emoji: colors.reset
  }
};
```

---

## 6. Responsive Design

### 6.1 Terminal Width Adaptation

```javascript
function adaptToTerminalWidth(width) {
  if (width < 80) {
    // Compact mode
    return {
      showProgress: false,
      buddyPosition: 'hidden',  // No buddy in compact mode
      maxLineWidth: width - 10
    };
  } else if (width < 120) {
    // Normal mode
    return {
      showProgress: true,
      buddyPosition: 'bottom-right',
      maxLineWidth: width - 30
    };
  } else {
    // Wide mode
    return {
      showProgress: true,
      buddyPosition: 'bottom-right',
      showFileTree: true,
      maxLineWidth: width - 40
    };
  }
}
```

### 6.2 Text Wrapping

```javascript
function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
```

---

## 7. Visual States

### 7.1 Normal Operation State

```
┌─────────────────────────────────────────────────────────────┐
│ 🐱 Claude Simulator                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ > Please help refactor this component                       │
│                                                             │
│ ⏳ Analyzing the codebase...                                │
│                                                             │
│ ✓ Read src/components/Header.tsx                            │
│   → 156 lines, React component                              │
│                                                             │
│ ✓ Edit src/components/Header.tsx                            │
│   → Added useMemo optimization                              │
│                                                             │
│ [Progress: Read 5 files | Modified 2 files]                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ > _                                                         │
│                                    ┌──────────────┐         │
│                                    │ "Hmm,        │         │
│                                    │  interesting"│         │
│                                    └──────────────┘         │
│                                         🤖                  │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Paused State

```
┌─────────────────────────────────────────────────────────────┐
│ 🐱 Claude Simulator                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⏸️ Simulation paused                                         │
│                                                             │
│ [Progress: Read 8 files | Modified 3 files]                 │
│                                                             │
│ Type 'resume' to continue...                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ > _                                                         │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Error State (Simulated)

```
┌─────────────────────────────────────────────────────────────┐
│ 🐱 Claude Simulator                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✗ Bash npm run test                                         │
│   → 2 tests failed                                          │
│                                                             │
│ ⏳ Fixing the issues...                                      │
│                                                             │
│ ✓ Read src/utils/helper.ts                                  │
│ ✓ Edit src/utils/helper.ts                                  │
│   → Fixed type error                                        │
│                                                             │
│ ✓ Bash npm run test                                         │
│   → All tests passed                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ > _                                                         │
│                                    ┌──────────────┐         │
│                                    │ "Fixed it!"  │         │
│                                    └──────────────┘         │
│                                         🤖                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Buddy Interaction Design

### 8.1 Buddy Appearance Triggers

| Trigger | Probability | Comment Category |
|---------|-------------|------------------|
| After 10 operations | 30% | Progress comment |
| After error | 50% | Encouraging comment |
| After long pause | 20% | Waiting comment |
| Random | 10% | Random comment |

### 8.2 Buddy Comment Categories

```javascript
const buddyComments = {
  progress: [
    "Nice progress!",
    "Keep going!",
    "Looking good",
    "Good work"
  ],

  encouraging: [
    "Don't worry, fixing it",
    "Almost there",
    "This happens",
    "We'll fix it"
  ],

  waiting: [
    "Waiting...",
    "Ready when you are",
    "Paused mode",
    "Taking a break?"
  ],

  random: [
    "Hmm, interesting",
    "So many files",
    "Vibe coding~",
    "Complex stuff",
    "Wonder what this does"
  ]
};
```

### 8.3 Buddy Animation Sequence

```javascript
async function showBuddyComment(comment) {
  // 1. Clear previous buddy if visible
  if (buddyVisible) {
    await hideBuddy();
    await sleep(500);
  }

  // 2. Show bubble (fade in)
  await fadeInBubble(comment);

  // 3. Stream text in bubble
  await streamBubbleText(comment);

  // 4. Hold for 3-5 seconds
  await sleep(3000 + Math.random() * 2000);

  // 5. Fade out
  await fadeOutBubble();
}

async function fadeInBubble(comment) {
  // Gradually increase opacity
  // Implementation depends on terminal capabilities
  // Simple approach: just show it
  renderBubble(comment);
}

async function fadeOutBubble() {
  // Clear bubble area
  clearBubbleArea();
}
```

---

## 9. Implementation Considerations

### 9.1 Terminal Compatibility

- **Supported**: Modern terminals with ANSI support
- **Best**: iTerm2, Terminal.app, VS Code terminal
- **Limited**: Very old terminals (fallback to simple mode)

### 9.2 Cursor Positioning

Using ANSI escape codes:
```javascript
// Position cursor at (row, col)
function positionCursor(row, col) {
  process.stdout.write(`\x1b[${row};${col}H`);
}

// Clear from cursor to end of line
function clearLine() {
  process.stdout.write('\x1b[K');
}

// Clear from cursor to end of screen
function clearScreenBelow() {
  process.stdout.write('\x1b[J');
}
```

### 9.3 Buddy Positioning Strategy

**Fixed position approach**:
- Buddy always at bottom-right
- Speech bubble above buddy
- Doesn't scroll with content
- Stays visible during output

**Challenge**: Output scrolling can overwrite buddy
**Solution**: Redraw buddy after each output batch

```javascript
class BuddyManager {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.visible = false;
  }

  redraw() {
    if (this.visible) {
      this.render();
    }
  }

  render() {
    // Calculate position based on terminal size
    this.position.x = process.stdout.columns - 25;
    this.position.y = process.stdout.rows - 5;

    // Draw at fixed position
    this.drawAt(this.position.x, this.position.y);
  }
}
```

---

## 10. UI Assets

### 10.1 Emojis and Icons

| Element | Emoji/Icon | Purpose |
|---------|-----------|---------|
| Claude Logo | 🐱 | Brand identity |
| Soup Buddy | 🤖 | Companion character |
| Success | ✓ | Completed operation |
| Pending | ⏳ | In-progress operation |
| Error | ✗ | Failed operation |
| Pause | ⏸️ | Paused state |
| Resume | ▶️ | Resumed state |

### 10.2 Alternative Buddy Characters

If 🤖 doesn't render well:
- 🐱 (cat)
- 🐭 (mouse)
- 🐹 (hamster)
- 🤓 (nerd face)
- 👾 (alien monster)

---

## 11. User Experience Flow

### 11.1 Startup Sequence

```
1. Clear screen
2. Show header (Claude logo)
3. Show welcome message
4. Show initial prompt
5. Start simulation
6. Show buddy (optional)
```

### 11.2 Operation Sequence

```
1. Show spinner
2. Generate tool call
3. Stream tool call output
4. Show result
5. Update progress (every 10 ops)
6. Show buddy comment (occasionally)
```

### 11.3 Pause/Resume Sequence

```
Pause:
1. Stop simulation
2. Show pause icon
3. Show current stats
4. Show "Type 'resume'" message
5. Buddy: "Taking a break?"

Resume:
1. Clear pause message
2. Show resume icon
3. Continue simulation
4. Buddy: "Back to work!"
```

---

## 12. Testing UI

### 12.1 Visual Testing Checklist

- [ ] Header displays correctly
- [ ] Output streams smoothly
- [ ] Spinner animations work
- [ ] Progress stats display
- [ ] Buddy appears at correct position
- [ ] Buddy comments show properly
- [ ] Input area functional
- [ ] Colors display correctly
- [ ] Responsive to terminal width
- [ ] No visual glitches

### 12.2 Buddy Testing

- [ ] Buddy position correct (bottom-right)
- [ ] Bubble text streams smoothly
- [ ] Bubble disappears after timeout
- [ ] Doesn't overlap with input
- [ ] Redraws correctly after scroll

---

**Document Version**: 1.0
**Last Updated**: 2026-04-02
**Reference**: ui.jpeg