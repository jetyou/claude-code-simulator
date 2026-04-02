import React from 'react';
import { Text, Box } from 'ink';
import chalk from 'chalk';

// Diff line component with colored background using ANSI codes
function DiffLine({ type, lineNumber, content }) {
  const sigil = type === 'add' ? '+' : type === 'remove' ? '-' : ' ';
  const lineNum = lineNumber ? lineNumber.toString().padStart(4, ' ') : '    ';

  // Background colors for diff
  if (type === 'add') {
    // Green background for added lines
    return (
      <Box>
        <Text backgroundColor="green" dimColor>{lineNum} {sigil} </Text>
        <Text backgroundColor="green">{content}</Text>
      </Box>
    );
  } else if (type === 'remove') {
    // Red background for removed lines
    return (
      <Box>
        <Text backgroundColor="red" dimColor>{lineNum} {sigil} </Text>
        <Text backgroundColor="red">{content}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text dimColor>{lineNum} {sigil} {content}</Text>
    </Box>
  );
}

// Render diff output
export function renderDiff(diffData) {
  const lines = [];
  let lineNum = diffData.startLine;

  // Show removed lines (red background)
  for (const line of diffData.oldLines) {
    lines.push(
      <DiffLine
        key={`remove-${lineNum}`}
        type="remove"
        lineNumber={lineNum}
        content={line}
      />
    );
    lineNum++;
  }

  // Reset line number for added lines
  lineNum = diffData.startLine;

  // Show added lines (green background)
  for (const line of diffData.newLines) {
    lines.push(
      <DiffLine
        key={`add-${lineNum}`}
        type="add"
        lineNumber={lineNum}
        content={line}
      />
    );
    lineNum++;
  }

  return lines;
}

function OutputArea({ outputs }) {
  // Render a single output item
  const renderOutput = (output) => {
    switch (output.type) {
      case 'tool_call':
        return renderToolCall(output);
      case 'diff':
        return (
          <Box key={output.id} flexDirection="column" marginLeft={2}>
            {renderDiff(output.diff)}
          </Box>
        );
      case 'comment':
        return (
          <Box key={output.id}>
            <Text dimColor>{output.content}</Text>
          </Box>
        );
      case 'system':
        return (
          <Box key={output.id}>
            <Text color="yellow">{output.content}</Text>
          </Box>
        );
      case 'prompt':
        return (
          <Box key={output.id}>
            <Text bold color="cyan">{`> ${output.content}`}</Text>
          </Box>
        );
      case 'progress':
        return (
          <Box key={output.id}>
            <Text dimColor>{output.content}</Text>
          </Box>
        );
      default:
        return (
          <Box key={output.id}>
            <Text>{output.content}</Text>
          </Box>
        );
    }
  };

  const renderToolCall = (output) => {
    const icon = output.success ? chalk.green('✓') : chalk.yellow('⏳');
    const toolName = output.tool;

    // Format tool name with color
    const coloredTool = chalk.cyan(toolName);

    return (
      <Box key={output.id} flexDirection="column">
        <Text>
          {icon} {coloredTool} {chalk.gray(output.params)}
        </Text>
        {output.result && (
          <Box flexDirection="column" marginLeft={2}>
            {output.diff ? (
              // Show diff for Edit operations
              <>
                <Text dimColor>{output.result}</Text>
                {renderDiff(output.diff)}
              </>
            ) : (
              <Text dimColor>{`→ ${output.result}`}</Text>
            )}
          </Box>
        )}
      </Box>
    );
  };

  // Only show last 30 outputs to prevent performance issues
  const visibleOutputs = outputs.slice(-30);

  return (
    <Box flexDirection="column">
      {visibleOutputs.map(renderOutput)}
    </Box>
  );
}

export default OutputArea;