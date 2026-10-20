import { useState, useEffect, useCallback } from 'react';
import { fetchAiStatus } from '../services/api';

export function useOllamaStatus(pollIntervalMs = 15000) {
  const [status, setStatus] = useState({
    reachable: false,
    modelAvailable: false,
    configuredModel: 'gemma3:4b',
    availableModels: [],
    setupInstruction: null,
    error: null
  });
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const checkStatus = useCallback(async () => {
    try {
      const data = await fetchAiStatus();
      setStatus({
        reachable: data.reachable,
        modelAvailable: data.modelAvailable,
        configuredModel: data.configuredModel || 'gemma3:4b',
        availableModels: data.availableModels || [],
        setupInstruction: data.setupInstruction,
        error: data.error || null
      });
      setLastChecked(new Date());
    } catch (err) {
      setStatus({
        reachable: false,
        modelAvailable: false,
        configuredModel: 'gemma3:4b',
        availableModels: [],
        setupInstruction: 'Start backend server on port 3001 and ensure Ollama is running (`ollama serve`).',
        error: err.message
      });
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, pollIntervalMs);
    return () => clearInterval(interval);
  }, [checkStatus, pollIntervalMs]);

  return {
    ...status,
    loading,
    lastChecked,
    refresh: checkStatus
  };
}
