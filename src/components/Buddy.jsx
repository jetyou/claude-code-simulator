import React, { useEffect, useState, useMemo } from 'react';
import { Text, Box } from 'ink';
import { getFrame, getReactionEmoji } from '../models/BuddyData.jsx';

function Buddy({ profile, comment, reaction, onHide, showCard, showHearts }) {
  const [visible, setVisible] = useState(false);
  const [frameType, setFrameType] = useState('idle');
  const [heartsVisible, setHeartsVisible] = useState(false);

  // If no profile (not hatched), show nothing
  if (!profile) return null;

  const { species, rarity, eyeStyle, hat, isShiny, name } = profile;

  // Animation loop — idle blink/wag cycle
  useEffect(() => {
    const timer = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.1) {
        setFrameType('blink');
        setTimeout(() => setFrameType('idle'), 400);
      } else if (rand < 0.15) {
        setFrameType('sleep');
        setTimeout(() => setFrameType('idle'), 800);
      }
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // React to external events
  useEffect(() => {
    if (reaction) {
      const frameMap = {
        '👀': 'idle',
        '😸': 'happy',
        '🎉': 'happy',
        '😿': 'sad',
        '💤': 'sleep',
        '❤️': 'happy',
        '💬': 'idle',
      };
      setFrameType(frameMap[reaction] || 'idle');
      const timer = setTimeout(() => setFrameType('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [reaction]);

  // Comment visibility with auto-hide
  useEffect(() => {
    if (comment) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onHide?.();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [comment, onHide]);

  // Hearts animation for /buddy pet
  useEffect(() => {
    if (showHearts) {
      setHeartsVisible(true);
      const timer = setTimeout(() => setHeartsVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showHearts]);

  // Get rendered frame
  const frame = useMemo(
    () => getFrame(species, frameType, eyeStyle),
    [species, frameType, eyeStyle]
  );

  // Rarity color
  const artColor = isShiny ? 'yellowBright' : rarity.color;

  // Stats Card view
  if (showCard) {
    const { personality } = profile;
    const bar = (val) => '█'.repeat(val) + '░'.repeat(10 - val);
    return (
      <Box flexDirection="column" alignItems="center" paddingBottom={1}>
        <Box borderStyle="round" borderColor={rarity.color} flexDirection="column" paddingX={1}>
          <Text bold color={artColor}>
            {isShiny ? '✦ ' : ''}{name}{isShiny ? ' ✦' : ''}
          </Text>
          <Text dimColor>{species.name} · <Text color={rarity.color}>{rarity.name}</Text></Text>
          <Text> </Text>
          {frame.map((line, i) => (
            <Text key={i} color={artColor}>{line}</Text>
          ))}
          <Text> </Text>
          <Text dimColor>─── Stats ───</Text>
          <Text>🐛 DBG  <Text color="green">{bar(personality.debugging)}</Text></Text>
          <Text>🧘 PAT  <Text color="blue">{bar(personality.patience)}</Text></Text>
          <Text>🌀 CHS  <Text color="red">{bar(personality.chaos)}</Text></Text>
          <Text>🦉 WIS  <Text color="cyan">{bar(personality.wisdom)}</Text></Text>
          <Text>😏 SNK  <Text color="yellow">{bar(personality.snark)}</Text></Text>
          {isShiny && <Text color="yellowBright">✦ SHINY ✦</Text>}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      paddingBottom={1}
    >
      {/* Speech bubble */}
      {visible && comment && (
        <Box
          borderStyle="round"
          borderColor={rarity.color}
          paddingX={1}
          flexDirection="column"
          alignItems="center"
          marginBottom={0}
        >
          <Text italic>{comment}</Text>
          {reaction && <Text>{reaction}</Text>}
        </Box>
      )}

      {/* Hearts overlay */}
      {heartsVisible && (
        <Box>
          <Text color="red">  ♥ ♥ ♥  </Text>
        </Box>
      )}

      {/* Hat (above art) */}
      {hat && hat.id !== 'none' && (
        <Box>
          <Text color={artColor}>{hat.lines[0]}</Text>
        </Box>
      )}

      {/* 5-line ASCII buddy */}
      <Box flexDirection="column" alignItems="center">
        {frame.map((line, i) => (
          <Text key={i} color={artColor}>{line}</Text>
        ))}
      </Box>

      {/* Name tag */}
      <Box marginTop={0}>
        <Text dimColor>{name}</Text>
      </Box>
    </Box>
  );
}

export default Buddy;