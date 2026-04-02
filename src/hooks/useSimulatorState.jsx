import React, { useState, useCallback } from 'react';

export function useSimulatorState() {
  const [outputs, setOutputs] = useState([]);
  const [stats, setStats] = useState({
    filesRead: 0,
    filesModified: 0,
    commandsRun: 0,
    totalOps: 0,
  });
  const [buddyComment, setBuddyComment] = useState(null);

  const addOutput = useCallback((output) => {
    setOutputs(prev => [...prev, { ...output, id: Date.now() + Math.random() }]);
  }, []);

  const updateStats = useCallback((newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const showBuddyComment = useCallback((comment) => {
    setBuddyComment(comment);
    // Auto-hide after 3-5 seconds
    setTimeout(() => {
      setBuddyComment(null);
    }, 3000 + Math.random() * 2000);
  }, []);

  const clearBuddyComment = useCallback(() => {
    setBuddyComment(null);
  }, []);

  const clearOutputs = useCallback(() => {
    setOutputs([]);
  }, []);

  return {
    outputs,
    stats,
    buddyComment,
    addOutput,
    updateStats,
    showBuddyComment,
    clearBuddyComment,
    clearOutputs,
  };
}