import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Box, Text, useInput, useApp, useStdin, useStdout } from 'ink';
import chalk from 'chalk';
import figures from 'figures';
import TextInput from './components/TextInput.jsx';
import OutputArea from './components/OutputArea.jsx';
import Footer from './components/Footer.jsx';
import Buddy from './components/Buddy.jsx';
import Spinner from './components/Spinner.jsx';
import Header from './components/Header.jsx';
import { SimulatorEngine } from './engine/SimulatorEngine.jsx';
import { useSimulatorState } from './hooks/useSimulatorState.jsx';
import { pickComment, getReactionEmoji } from './models/BuddyData.jsx';

const IDLE_PROMPT = 'Type "/start" to begin, "/exit" to leave...';

function App() {
  const { exit } = useApp();
  const { isRawModeSupported } = useStdin();
  const { stdout } = useStdout();
  const [input, setInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const engineRef = useRef(null);
  const loadingStartTimeRef = useRef(Date.now());

  // Get terminal dimensions
  // Try multiple sources: stdout.columns, COLUMNS env, or default to 80
  const getWidth = useCallback(() => {
    if (stdout?.columns && stdout.columns > 0) return stdout.columns;
    if (process.env.COLUMNS && parseInt(process.env.COLUMNS, 10) > 0) {
      return parseInt(process.env.COLUMNS, 10);
    }
    return 80;
  }, [stdout]);

  const [terminalWidth, setTerminalWidth] = useState(getWidth);

  // Update terminal width on resize - NOT debounced!
  // Debouncing causes width mismatch: stdout.columns is new but state is old,
  // leading to double-clear flicker when renders happen during the debounce window.
  useEffect(() => {
    const handleResize = () => {
      const newWidth = getWidth();
      setTerminalWidth(prev => {
        // Skip if same dimension to avoid unnecessary re-renders
        if (prev === newWidth) return prev;
        return newWidth;
      });
    };

    stdout?.on('resize', handleResize);
    return () => {
      stdout?.off('resize', handleResize);
    };
  }, [stdout, getWidth]);

  // Use refs to track running state for the async loop
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);

  const {
    outputs,
    stats,
    buddyState,
    buddyProfile,
    showBuddyCard,
    showBuddyHearts,
    addOutput,
    clearBuddyComment,
    showBuddyComment,
    updateStats,
    clearOutputs,
    hatchBuddy,
    toggleBuddyCard,
    petBuddy,
    hideBuddy,
    unhideBuddy,
  } = useSimulatorState();

  // Auto-hatch buddy on mount
  useEffect(() => {
    hatchBuddy('simulator-default-user');
  }, []);

  // Initialize simulator engine
  useEffect(() => {
    engineRef.current = new SimulatorEngine({
      onOutput: addOutput,
      onStatsUpdate: updateStats,
      onBuddyComment: showBuddyComment,
    });

    return () => {
      engineRef.current?.stop();
    };
  }, []);

  // Sync buddy personality to engine
  useEffect(() => {
    if (buddyProfile && engineRef.current) {
      engineRef.current.setPersonality(buddyProfile.personality);
    }
  }, [buddyProfile]);

  // Run simulation loop - uses refs to properly handle state changes
  useEffect(() => {
    if (!isSimulating || isPaused) {
      isRunningRef.current = false;
      isPausedRef.current = isPaused;
      return;
    }

    isRunningRef.current = true;
    isPausedRef.current = false;

    const runLoop = async () => {
      while (isRunningRef.current && !isPausedRef.current) {
        await engineRef.current?.tick();
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000));
      }
    };

    runLoop();
  }, [isSimulating, isPaused]);

  // Start simulation
  const startSimulation = useCallback(() => {
    isRunningRef.current = true;
    isPausedRef.current = false;
    setIsSimulating(true);
    setIsPaused(false);
    clearOutputs();
    engineRef.current?.start();
  }, [clearOutputs]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    isRunningRef.current = false;
    isPausedRef.current = false;
    setIsSimulating(false);
    setIsPaused(false);
    engineRef.current?.stop();
  }, []);

  // Show summary and exit - defined before handleSubmit
  const showSummaryAndExit = useCallback(() => {
    addOutput({
      type: 'system',
      content: '\n📊 Session Summary:',
    });
    addOutput({
      type: 'system',
      content: `  Files read: ${stats.filesRead}`,
    });
    addOutput({
      type: 'system',
      content: `  Files modified: ${stats.filesModified}`,
    });
    addOutput({
      type: 'system',
      content: `  Commands run: ${stats.commandsRun}`,
    });
    addOutput({
      type: 'system',
      content: `  Total operations: ${stats.totalOps}`,
    });
    addOutput({
      type: 'system',
      content: chalk.gray('\nThanks for vibe coding! 🐱'),
    });
    setTimeout(() => exit(), 500);
  }, [stats, exit, addOutput]);

  // Show help - defined before handleSubmit
  const showHelp = useCallback(() => {
    addOutput({
      type: 'system',
      content: 'Available commands:',
    });
    if (!isSimulating) {
      addOutput({
        type: 'system',
        content: '  /start      - Start vibe coding simulation',
      });
      addOutput({
        type: 'system',
        content: '  /exit       - Exit simulator',
      });
    } else {
      addOutput({
        type: 'system',
        content: '  /stop       - Pause simulation',
      });
      addOutput({
        type: 'system',
        content: '  /resume     - Resume simulation',
      });
      addOutput({
        type: 'system',
        content: '  /exit       - Exit simulator',
      });
    }
    addOutput({
      type: 'system',
      content: '  /help       - Show this help',
    });
    addOutput({
      type: 'system',
      content: '  /clear      - Clear output',
    });
    addOutput({
      type: 'system',
      content: '  /buddy      - Hatch/show your buddy',
    });
    addOutput({
      type: 'system',
      content: '  /buddy pet  - Pet your buddy',
    });
    addOutput({
      type: 'system',
      content: '  /buddy card - Show buddy stats card',
    });
    addOutput({
      type: 'system',
      content: '  /buddy off  - Hide buddy',
    });
    addOutput({
      type: 'system',
      content: '  /buddy on   - Show buddy',
    });
  }, [addOutput, isSimulating]);

  // Handle commands
  const handleSubmit = useCallback((text) => {
    const trimmed = text.trim().toLowerCase();

    // Quit command - always available
    if (trimmed === '/exit' || trimmed === '/退出') {
      if (isSimulating) {
        showSummaryAndExit();
      } else {
        exit();
      }
      setInput('');
      return;
    }

    // Help command - always available
    if (trimmed === '/help' || trimmed === '/帮助') {
      showHelp();
      setInput('');
      return;
    }

    // Start command - only when not simulating
    if ((trimmed === '/start' || trimmed === '/开始') && !isSimulating) {
      startSimulation();
      setInput('');
      return;
    }

    // Commands below only work when simulating
    if (isSimulating) {
      // Stop/pause command
      if (trimmed === '/stop' || trimmed === '/停止') {
        isPausedRef.current = true;
        setIsPaused(true);
        showBuddyComment('Taking a break?', '😺');
        addOutput({
          type: 'system',
          content: '⏸️ Paused. Type "/resume" to continue.',
        });
      } else if (trimmed === '/resume' || trimmed === '/继续') {
        isPausedRef.current = false;
        setIsPaused(false);
        addOutput({
          type: 'system',
          content: '▶️ Resumed...',
        });
      } else if (trimmed === '/clear' || trimmed === '/清屏') {
        clearOutputs();
      }
    }

    // /buddy commands — available at any time
    if (trimmed === '/buddy' || trimmed === 'buddy') {
      if (!buddyProfile) {
        const profile = hatchBuddy('simulator-default-user');
        addOutput({ type: 'system', content: `🥚 Hatching your buddy...` });
        addOutput({ type: 'system', content: `🎉 Meet ${profile.name}! (${profile.species.name} · ${profile.rarity.name})` });
      } else {
        addOutput({ type: 'system', content: `Your buddy: ${buddyProfile.name} (${buddyProfile.species.name} · ${buddyProfile.rarity.name})` });
      }
    } else if (trimmed === '/buddy pet' || trimmed === 'pet' || trimmed === '摸猫') {
      if (buddyProfile) {
        petBuddy();
        const comment = pickComment('pet', buddyProfile.personality);
        showBuddyComment(comment, '❤️');
      }
    } else if (trimmed === '/buddy card') {
      if (buddyProfile) {
        toggleBuddyCard();
      }
    } else if (trimmed === '/buddy off') {
      hideBuddy();
      addOutput({ type: 'system', content: '👋 Buddy hidden. Type "/buddy on" to bring them back.' });
    } else if (trimmed === '/buddy on') {
      unhideBuddy();
      addOutput({ type: 'system', content: '🐾 Buddy is back!' });
    }

    setInput('');
  }, [isSimulating, exit, addOutput, clearOutputs, startSimulation, showSummaryAndExit, showHelp, buddyProfile, hatchBuddy, petBuddy, toggleBuddyCard, hideBuddy, unhideBuddy, showBuddyComment]);

  // Global key handler
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      if (isSimulating) {
        showSummaryAndExit();
      } else {
        exit();
      }
    }
  });

  // Determine mode for spinner
  const spinnerMode = useMemo(() => {
    if (isPaused) return 'paused';
    if (isSimulating) return 'running';
    return 'idle';
  }, [isSimulating, isPaused]);

  // Placeholder text
  const placeholder = isSimulating
    ? 'Type a command (/stop, /resume, /exit, /help)...'
    : IDLE_PROMPT;

  return (
    <Box flexDirection="column" height="100%">
      {/* Header - flexShrink=0 prevents Ink from clipping rows when terminal is short */}
      <Box flexShrink={0}>
        <Header isSimulating={isSimulating} columns={terminalWidth} />
      </Box>

      {/* Main Row */}
      <Box flexGrow={1} flexDirection="row">
        {/* Left Column (90%) */}
        <Box flexDirection="column" width="90%" flexGrow={1}>
          {/* Output area */}
          <Box flexGrow={1} flexDirection="column" paddingX={2} overflow="hidden">
            <OutputArea outputs={outputs} />
          </Box>

          {/* Spinner (when simulating) */}
          {isSimulating && (
            <Box paddingX={2}>
              <Spinner
                mode={spinnerMode}
                loadingStartTimeRef={loadingStartTimeRef}
              />
            </Box>
          )}

          {/* Input area with border */}
          <Box
            borderStyle="round"
            borderColor="gray"
            borderLeft={false}
            borderRight={false}
            paddingX={2}
          >
            <TextInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              placeholder={placeholder}
              focus={true}
            />
          </Box>

          {/* Footer */}
          <Footer
            stats={stats}
            isPaused={isPaused}
            isLoading={isSimulating && !isPaused}
            isSimulating={isSimulating}
            permissionMode="acceptEdits"
          />
        </Box>

        {/* Right Column (Buddy) (10%) */}
        {buddyProfile && buddyProfile.isVisible !== false && (
          <Box width="10%" flexDirection="column" justifyContent="flex-end" alignItems="center">
            <Buddy
              profile={buddyProfile}
              comment={buddyState.comment}
              reaction={buddyState.reaction}
              onHide={clearBuddyComment}
              showCard={showBuddyCard}
              showHearts={showBuddyHearts}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;