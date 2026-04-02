import React, { useState, useEffect, useRef } from 'react';
import { Text, Box, useInput } from 'ink';
import figures from 'figures';

// Spinner animation frames
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const SHIMMER_COLORS = ['cyan', 'magenta', 'blue', 'cyan'];

function Spinner({ mode, loadingStartTimeRef }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Animation loop
  useEffect(() => {
    if (mode === 'idle' || mode === 'paused') return;

    const animate = () => {
      setFrameIndex(prev => (prev + 1) % FRAMES.length);
      setElapsed(Math.floor((Date.now() - loadingStartTimeRef.current) / 1000));
    };

    const interval = setInterval(animate, 80);
    return () => clearInterval(interval);
  }, [mode, loadingStartTimeRef]);

  // Verbs that change based on what's happening
  const getVerb = () => {
    const verbs = [
      'Analyzing',
      'Processing',
      'Reading',
      'Computing',
      'Thinking',
      'Working',
    ];
    return verbs[Math.floor(elapsed / 3) % verbs.length];
  };

  if (mode === 'idle') {
    return (
      <Box>
        <Text dimColor>{figures.pointer} Ready to vibe code</Text>
      </Box>
    );
  }

  if (mode === 'paused') {
    return (
      <Box>
        <Text color="yellow">{figures.pause} Paused</Text>
      </Box>
    );
  }

  // Running state
  const frame = FRAMES[frameIndex];
  const color = SHIMMER_COLORS[frameIndex % SHIMMER_COLORS.length];

  return (
    <Box gap={1}>
      <Text color={color}>{frame}</Text>
      <Text dimColor>
        {getVerb()}...
        {elapsed > 0 && <Text dimColor> ({elapsed}s)</Text>}
      </Text>
    </Box>
  );
}

export default Spinner;