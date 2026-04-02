import React, { useEffect, useState } from 'react';
import { Text, Box } from 'ink';

function Buddy({ comment, onHide }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (comment) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onHide?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [comment, onHide]);

  if (!visible || !comment) {
    return null;
  }

  return (
    <Box
      position="absolute"
      right={2}
      bottom={4}
      flexDirection="column"
      alignItems="flex-end"
    >
      {/* Speech bubble */}
      <Box
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
        width={24}
      >
        <Text italic dimColor>
          "{comment}"
        </Text>
      </Box>

      {/* Buddy emoji */}
      <Box justifyContent="flex-end" paddingRight={8}>
        <Text>🤖</Text>
      </Box>
    </Box>
  );
}

export default Buddy;