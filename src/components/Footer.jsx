import React from 'react';
import { Text, Box } from 'ink';
import figures from 'figures';

// KeyboardShortcutHint component - mimics Claude Code's exact style
function KeyboardShortcutHint({ shortcut, action, parens = false, bold = false }) {
  const shortcutText = bold ? <Text bold>{shortcut}</Text> : shortcut;

  if (parens) {
    return <>({shortcutText} to {action})</>;
  }
  return <>{shortcutText} to {action}</>;
}

// Permission mode constants - matching Claude Code exactly
const PERMISSION_MODES = {
  default: {
    symbol: '',
    title: 'Default',
    color: 'text'
  },
  acceptEdits: {
    symbol: '⏵⏵',
    title: 'Accept edits',
    color: 'green'
  },
  bypassPermissions: {
    symbol: '⏵⏵',
    title: 'Bypass Permissions',
    color: 'red'
  },
  plan: {
    symbol: figures.pause, // PAUSE_ICON
    title: 'Plan Mode',
    color: 'yellow'
  }
};

function Footer({ stats, isPaused, isLoading, isSimulating, permissionMode = 'acceptEdits' }) {
  const mode = PERMISSION_MODES[permissionMode] || PERMISSION_MODES.default;

  // Build parts following Claude Code's exact pattern
  // Mode part is NOT dimColor - it has its own color
  const modePart = isSimulating && permissionMode !== 'default' ? (
    <Text color={mode.color}>
      {mode.symbol} {mode.title.toLowerCase()} on
      <Text dimColor>
        {' '}
        <KeyboardShortcutHint shortcut="shift+tab" action="cycle" parens />
      </Text>
    </Text>
  ) : null;

  // Hint parts (all dimColor)
  const hintParts = [];

  // esc to interrupt (when loading)
  if (isLoading) {
    hintParts.push(
      <KeyboardShortcutHint key="esc" shortcut="esc" action="interrupt" />
    );
  }

  // Progress percentage (simulated)
  if (isSimulating) {
    hintParts.push(
      <>0% until auto-compact</>
    );
  }

  // Idle state: "? for shortcuts"
  if (!isSimulating && !modePart) {
    return (
      <Box paddingX={2} height={1} overflow="hidden">
        <Text dimColor>? for shortcuts</Text>
      </Box>
    );
  }

  // Render footer with mode part and hint parts joined by middot
  return (
    <Box paddingX={2} height={1} overflow="hidden">
      <Box flexShrink={0}>
        {modePart}
        {hintParts.length > 0 && <Text dimColor> · </Text>}
      </Box>
      {hintParts.length > 0 && (
        <Text dimColor wrap="truncate">
          {hintParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && ' · '}
              {part}
            </React.Fragment>
          ))}
        </Text>
      )}
    </Box>
  );
}

export default Footer;