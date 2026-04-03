import React, { useState, useCallback } from 'react';
import { generateBuddy } from '../models/BuddyData.jsx';

export function useSimulatorState() {
  const [outputs, setOutputs] = useState([]);
  const [stats, setStats] = useState({
    filesRead: 0,
    filesModified: 0,
    commandsRun: 0,
    totalOps: 0,
  });
  const [buddyState, setBuddyState] = useState({ comment: null, reaction: null });
  const [buddyProfile, setBuddyProfile] = useState(null);
  const [showBuddyCard, setShowBuddyCard] = useState(false);
  const [showBuddyHearts, setShowBuddyHearts] = useState(false);

  const addOutput = useCallback((output) => {
    setOutputs(prev => [...prev, { ...output, id: Date.now() + Math.random() }]);
  }, []);

  const updateStats = useCallback((newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const showBuddyComment = useCallback((comment, reaction = null) => {
    setBuddyState({ comment, reaction });
  }, []);

  const clearBuddyComment = useCallback(() => {
    setBuddyState({ comment: null, reaction: null });
  }, []);

  const clearOutputs = useCallback(() => {
    setOutputs([]);
  }, []);

  // Hatch a new buddy (deterministic from userId)
  const hatchBuddy = useCallback((userId) => {
    const profile = generateBuddy(userId);
    setBuddyProfile(profile);
    setShowBuddyCard(false);
    return profile;
  }, []);

  // Toggle card view
  const toggleBuddyCard = useCallback(() => {
    setShowBuddyCard(prev => !prev);
  }, []);

  // Pet interaction — show hearts
  const petBuddy = useCallback(() => {
    setShowBuddyHearts(true);
    setTimeout(() => setShowBuddyHearts(false), 2500);
  }, []);

  // Hide buddy
  const hideBuddy = useCallback(() => {
    setBuddyProfile(prev => prev ? { ...prev, isVisible: false } : null);
  }, []);

  // Show buddy
  const unhideBuddy = useCallback(() => {
    setBuddyProfile(prev => prev ? { ...prev, isVisible: true } : null);
  }, []);

  return {
    outputs,
    stats,
    buddyState,
    buddyProfile,
    showBuddyCard,
    showBuddyHearts,
    addOutput,
    updateStats,
    showBuddyComment,
    clearBuddyComment,
    clearOutputs,
    hatchBuddy,
    toggleBuddyCard,
    petBuddy,
    hideBuddy,
    unhideBuddy,
  };
}