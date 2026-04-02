import React, { useMemo } from 'react';
import { Text, Box } from 'ink';
import chalk from 'chalk';

// Layout constants - exactly matching Claude Code
const MAX_LEFT_WIDTH = 50;
const BORDER_PADDING = 4;
const DIVIDER_WIDTH = 1;
const CONTENT_PADDING = 2;

// Calculate string width (handles CJK characters)
function stringWidth(str) {
  let width = 0;
  for (const char of str) {
    const code = char.codePointAt(0) || 0;
    // CJK characters are double-width
    if (
      code > 0x1100 && (
        code <= 0x115f ||
        code >= 0x2329 && code <= 0xa4d0 ||
        code >= 0xac00 && code <= 0xd7a3 ||
        code >= 0xf900 && code <= 0xfaff ||
        code >= 0xfe30 && code <= 0xfe6f ||
        code >= 0xff00 && code <= 0xff60 ||
        code >= 0xffe0 && code <= 0xffe6
      )
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

// Truncate string to exact width (for CJK support)
function truncateToWidth(str, maxWidth) {
  let width = 0;
  let result = '';
  for (const char of str) {
    const charWidth = stringWidth(char);
    if (width + charWidth > maxWidth) break;
    result += char;
    width += charWidth;
  }
  return result;
}

// Truncate path in the middle if too long - matching Claude Code algorithm
function truncatePath(path, maxLength) {
  if (stringWidth(path) <= maxLength) return path;

  const separator = '/';
  const ellipsis = '…';
  const ellipsisWidth = 1;
  const separatorWidth = 1;

  const parts = path.split(separator);
  const first = parts[0] || '';
  const last = parts[parts.length - 1] || '';
  const firstWidth = stringWidth(first);
  const lastWidth = stringWidth(last);

  // Only one part, show as much as we can
  if (parts.length === 1) {
    return truncateToWidth(path, maxLength);
  }

  // first is empty (unix root) and last is too long
  if (first === '' && ellipsisWidth + separatorWidth + lastWidth >= maxLength) {
    return `${separator}${truncateToWidth(last, Math.max(1, maxLength - separatorWidth))}`;
  }

  // Has first part, show ellipsis and truncate last
  if (first !== '' && ellipsisWidth * 2 + separatorWidth + lastWidth >= maxLength) {
    return `${ellipsis}${separator}${truncateToWidth(last, Math.max(1, maxLength - ellipsisWidth - separatorWidth))}`;
  }

  // Truncate first and leave last (for 2 parts)
  if (parts.length === 2) {
    const availableForFirst = maxLength - ellipsisWidth - separatorWidth - lastWidth;
    return `${truncateToWidth(first, availableForFirst)}${ellipsis}${separator}${last}`;
  }

  // Calculate available space for middle parts
  let available = maxLength - firstWidth - lastWidth - ellipsisWidth - 2 * separatorWidth;

  // First and last are too long, truncate first
  if (available <= 0) {
    const availableForFirst = Math.max(0, maxLength - lastWidth - ellipsisWidth - 2 * separatorWidth);
    const truncatedFirst = truncateToWidth(first, availableForFirst);
    return `${truncatedFirst}${separator}${ellipsis}${separator}${last}`;
  }

  // Keep as many middle parts as possible
  const middleParts = [];
  for (let i = parts.length - 2; i > 0; i--) {
    const part = parts[i];
    if (part && stringWidth(part) + separatorWidth <= available) {
      middleParts.unshift(part);
      available -= stringWidth(part) + separatorWidth;
    } else {
      break;
    }
  }

  if (middleParts.length === 0) {
    return `${first}${separator}${ellipsis}${separator}${last}`;
  }

  return `${first}${separator}${ellipsis}${separator}${middleParts.join(separator)}${separator}${last}`;
}

// Determine layout mode based on terminal width
function getLayoutMode(columns) {
  return columns >= 70 ? 'horizontal' : 'compact';
}

// Calculate optimal left panel width based on content
function calculateOptimalLeftWidth(welcomeMessage, truncatedCwd, modelLine) {
  const contentWidth = Math.max(
    stringWidth(welcomeMessage),
    stringWidth(truncatedCwd),
    stringWidth(modelLine),
    20, // Minimum for cat art
  );
  return Math.min(contentWidth + 4, MAX_LEFT_WIDTH); // +4 for padding
}

// Calculate layout dimensions - matching Claude Code algorithm exactly
function calculateLayoutDimensions(columns, layoutMode, optimalLeftWidth) {
  if (layoutMode === 'horizontal') {
    const leftWidth = optimalLeftWidth;
    const usedSpace = BORDER_PADDING + CONTENT_PADDING + DIVIDER_WIDTH + leftWidth;
    const availableForRight = columns - usedSpace;

    let rightWidth = Math.max(30, availableForRight);
    const totalWidth = Math.min(
      leftWidth + rightWidth + DIVIDER_WIDTH + CONTENT_PADDING,
      columns - BORDER_PADDING,
    );

    // Recalculate right width if we had to cap the total
    if (totalWidth < leftWidth + rightWidth + DIVIDER_WIDTH + CONTENT_PADDING) {
      rightWidth = totalWidth - leftWidth - DIVIDER_WIDTH - CONTENT_PADDING;
    }

    return { leftWidth, rightWidth, totalWidth };
  }

  // Compact mode
  const totalWidth = Math.min(columns - BORDER_PADDING, MAX_LEFT_WIDTH + 20);
  return {
    leftWidth: totalWidth,
    rightWidth: totalWidth,
    totalWidth,
  };
}

// Main Header component
function Header({ columns }) {
  const cwd = useMemo(() => {
    const fullCwd = process.cwd();
    const home = process.env.HOME || '';
    return fullCwd.replace(home, '~');
  }, []);

  const version = '1.0.0';

  // Calculate layout using Claude Code's algorithm
  const layout = useMemo(() => {
    const mode = getLayoutMode(columns);

    // Content for calculating widths
    const welcomeMsg = 'Welcome to Claude Simulator!';
    const modelLine = 'claude-sonnet-4-6 · Vibe Coding';

    // First truncate cwd with max possible width to get optimal left width
    const tempCwd = truncatePath(cwd, MAX_LEFT_WIDTH - 4);
    const optimalLeftWidth = calculateOptimalLeftWidth(welcomeMsg, tempCwd, modelLine);
    const dimensions = calculateLayoutDimensions(columns, mode, optimalLeftWidth);

    // Now truncate cwd to actual left width
    const cwdDisplay = truncatePath(cwd, dimensions.leftWidth - 4);

    return {
      mode,
      ...dimensions,
      cwdDisplay,
      welcomeMsg,
      modelLine,
    };
  }, [columns, cwd]);

  const titleText = 'Claude Simulator';
  const versionText = ` v${version} `;
  const titleContentLen = titleText.length + versionText.length;

  // Compact mode - single column
  if (layout.mode === 'compact') {
    // Generate borders
    const topBorder = '╭─── ' + titleText + versionText + '─'.repeat(Math.max(1, layout.totalWidth - 5 - titleContentLen - 1)) + '╮';
    const bottomBorder = '╰' + '─'.repeat(Math.max(1, layout.totalWidth - 2)) + '╯';

    // Truncate content to fit
    const maxContentWidth = layout.totalWidth - 4;
    const truncatedWelcome = stringWidth(layout.welcomeMsg) > maxContentWidth
      ? truncateToWidth(layout.welcomeMsg, maxContentWidth)
      : layout.welcomeMsg;
    const truncatedModel = stringWidth(layout.modelLine) > maxContentWidth
      ? truncateToWidth(layout.modelLine, maxContentWidth)
      : layout.modelLine;
    const truncatedCwd = stringWidth(layout.cwdDisplay) > maxContentWidth
      ? truncateToWidth(layout.cwdDisplay, maxContentWidth)
      : layout.cwdDisplay;

    // Helper to center content
    const center = (text) => {
      const textW = stringWidth(text);
      const padding = Math.max(0, Math.floor((layout.totalWidth - textW) / 2));
      return ' '.repeat(padding) + text;
    };

    return (
      <Box flexDirection="column">
        <Text color="magenta">{topBorder}</Text>
        <Text> </Text>
        <Text bold>{center(truncatedWelcome)}</Text>
        <Text> </Text>
        <Text color="magenta">{center('▗ ▗   ▖ ▖')}</Text>
        <Text color="magenta">{center('  ▘▘ ▝▝  ')}</Text>
        <Text> </Text>
        <Text dimColor>{center(truncatedModel)}</Text>
        <Text dimColor>{center(truncatedCwd)}</Text>
        <Text> </Text>
        <Text color="magenta">{bottomBorder}</Text>
      </Box>
    );
  }

  // Horizontal mode - two columns
  const leftColWidth = layout.leftWidth;
  const rightColWidth = layout.rightWidth;

  // Use layout.totalWidth for borders - it's already capped correctly
  const borderTotalWidth = layout.totalWidth;

  // Generate borders using totalWidth
  const topBorder = '╭─── ' + titleText + versionText + '─'.repeat(Math.max(1, borderTotalWidth - 5 - titleContentLen - 1)) + '╮';
  const bottomBorder = '╰' + '─'.repeat(Math.max(1, borderTotalWidth - 2)) + '╯';

  // Truncate tips content to fit right column
  const tipsHeader = 'Tips for getting started';
  const tipsContent = 'Type "start" to begin vibe coding';
  const truncatedTipsContent = stringWidth(tipsContent) > rightColWidth - 2
    ? truncateToWidth(tipsContent, rightColWidth - 2)
    : tipsContent;

  return (
    <Box flexDirection="column">
      {/* Top border */}
      <Text color="magenta">{topBorder}</Text>

      {/* Tips header row */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth}>
          <Text> </Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text bold> {tipsHeader}</Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* Welcome message row */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth} justifyContent="center">
          <Text bold>{layout.welcomeMsg}</Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text dimColor> {truncatedTipsContent}</Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* Separator row */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth}>
          <Text> </Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text dimColor> {'─'.repeat(Math.min(40, rightColWidth - 2))}</Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* Cat logo row */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth} justifyContent="center">
          <Text color="magenta">▗ ▗   ▖ ▖</Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text bold> Recent activity</Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* Cat logo row 2 */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth} justifyContent="center">
          <Text color="magenta">  ▘▘ ▝▝  </Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text dimColor> No recent activity</Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* Empty row */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth}>
          <Text> </Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text> </Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* Model info row */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth} justifyContent="center">
          <Text dimColor>{layout.modelLine}</Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text> </Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* CWD row */}
      <Box flexDirection="row">
        <Text color="magenta">│</Text>
        <Box width={leftColWidth}>
          <Text dimColor> {layout.cwdDisplay}</Text>
        </Box>
        <Text color="magenta">│</Text>
        <Box width={rightColWidth}>
          <Text> </Text>
        </Box>
        <Text color="magenta">│</Text>
      </Box>

      {/* Bottom border */}
      <Text color="magenta">{bottomBorder}</Text>
    </Box>
  );
}

export default Header;