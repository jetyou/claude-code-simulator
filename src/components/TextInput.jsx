import React, { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';

function TextInput({
  value,
  onChange,
  onSubmit,
  placeholder = '',
  focus = true,
}) {
  const [cursorOffset, setCursorOffset] = useState(value.length);

  // Update cursor when value changes externally
  useEffect(() => {
    setCursorOffset(value.length);
  }, [value]);

  // Handle input
  useInput(
    (input, key) => {
      if (key.return) {
        onSubmit(value);
        return;
      }

      if (key.backspace || key.delete) {
        if (cursorOffset > 0) {
          const newValue = value.slice(0, cursorOffset - 1) + value.slice(cursorOffset);
          onChange(newValue);
          setCursorOffset(cursorOffset - 1);
        }
        return;
      }

      if (key.leftArrow) {
        setCursorOffset(Math.max(0, cursorOffset - 1));
        return;
      }

      if (key.rightArrow) {
        setCursorOffset(Math.min(value.length, cursorOffset + 1));
        return;
      }

      // Regular character input
      if (input && !key.ctrl && !key.meta) {
        const newValue = value.slice(0, cursorOffset) + input + value.slice(cursorOffset);
        onChange(newValue);
        setCursorOffset(cursorOffset + input.length);
      }
    },
    { isActive: focus }
  );

  // Render input with cursor
  const renderValue = () => {
    if (value.length === 0) {
      return (
        <Text dimColor>
          {placeholder}
        </Text>
      );
    }

    const beforeCursor = value.slice(0, cursorOffset);
    const atCursor = value.slice(cursorOffset, cursorOffset + 1);
    const afterCursor = value.slice(cursorOffset + 1);

    return (
      <Text>
        {beforeCursor}
        <Text inverse color="cyan">
          {atCursor || ' '}
        </Text>
        {afterCursor}
      </Text>
    );
  };

  return (
    <Box>
      <Text color="cyan">&gt; </Text>
      {renderValue()}
    </Box>
  );
}

export default TextInput;