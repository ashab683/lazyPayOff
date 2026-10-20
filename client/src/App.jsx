import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TextWorkspace } from './components/TextWorkspace';
import { ResultCard } from './components/ResultCard';
import { TaskBoard } from './components/TaskBoard';
import { HistoryPanel } from './components/HistoryPanel';
import { DemoSection } from './components/DemoSection';
import { OpenSourceAiSection } from './components/OpenSourceAiSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';

import { useOllamaStatus } from './hooks/useOllamaStatus';
import { useLocalHistory } from './hooks/useLocalHistory';
import {
  summarizeText,
  organizeTasks,
  extractActions,
  createChecklist,
  simplifyText
} from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [inputText, setInputText] = useState('');
  const [activeResult, setActiveResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const resultRef = useRef(null);

  // Custom hooks
  const ollamaStatus = useOllamaStatus(15000);
  const {
    history,
    saveResult,
    deleteResult,
    clearHistory,
    categories,
    loadTasksIntoBoard,
    toggleTaskComplete,
    deleteTask,
    addTask,
    clearAllTasks
  } = useLocalHistory();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /**
   * Main action executor
   */
  const handleRunAction = async (actionId, overrideText = null) => {
    const textToProcess = (overrideText !== null ? overrideText : inputText).trim();
    if (!textToProcess) return;

    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      let res;
      switch (actionId) {
        case 'organize':
          res = await organizeTasks(textToProcess);
          break;
        case 'summarize':
          res = await summarizeText(textToProcess);
          break;
        case 'extract-actions':
          res = await extractActions(textToProcess);
          break;
        case 'checklist':
          res = await createChecklist(textToProcess);
          break;
        case 'simplify':
          res = await simplifyText(textToProcess);
          break;
        default:
          throw new Error(`Unknown action: ${actionId}`);
      }

      setActiveResult({
        type: res.type,
        data: res.data,
        model: res.model,
        durationMs: res.durationMs,
        originalText: textToProcess
      });

      // Auto-save to localStorage if desired or let user click Save
      showToast(`Processed with Gemma 3 in ${(res.durationMs / 1000).toFixed(1)}s!`);

      // Scroll to result card
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Action error:', err);
      let instruction = null;
      if (err.code === 'OLLAMA_UNREACHABLE' || !ollamaStatus.reachable) {
        instruction = 'Run "ollama serve" in your Windows terminal to start the local AI server.';
      } else if (err.code === 'MODEL_NOT_FOUND' || !ollamaStatus.modelAvailable) {
        instruction = `Run "ollama pull ${ollamaStatus.configuredModel || 'gemma3:4b'}" to download the model.`;
      }

      setError({
        title: err.code || 'Inference Error',
        message: err.message || 'Failed to process request.',
        instruction
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send organized tasks to the interactive Task Board
   */
  const handleSendToTaskBoard = (taskCategories) => {
    if (!taskCategories || taskCategories.length === 0) return;
    loadTasksIntoBoard(taskCategories);
    setActiveTab('tasks');
    showToast('Categories and tasks loaded into your Task Board!');
  };

  /**
   * Save active result to Local History
   */
  const handleSaveResult = () => {
    if (!activeResult) return;

    let preview = '';
    let title = 'AI Result';

    if (activeResult.type === 'summary') {
      title = 'Summary';
      preview = activeResult.data.summary || '';
    } else if (activeResult.type === 'organize') {
      title = `Organized Plan (${activeResult.data.categories?.length || 0} Categories)`;
      preview = (activeResult.data.categories || [])
        .map((c) => `${c.name}: ${c.tasks?.length || 0} tasks`)
        .join(', ');
    } else if (activeResult.type === 'actions') {
      title = `Action Items (${activeResult.data.actionItems?.length || 0} Items)`;
      preview = (activeResult.data.actionItems || []).map((a) => a.task).join(' · ');
    } else if (activeResult.type === 'checklist') {
      title = activeResult.data.title || 'Checklist';
      preview = (activeResult.data.checklist || []).map((c) => c.text).join(' · ');
    } else if (activeResult.type === 'simplify') {
      title = 'Simplified Version';
      preview = activeResult.data.simplifiedText || '';
    }

    saveResult({
      type: activeResult.type,
      title,
      preview,
      originalInput: activeResult.originalText || inputText,
      data: activeResult.data
    });

    setIsSaved(true);
    showToast('Saved to local history!');
  };

  /**
   * Reopen item from local history
   */
  const handleReopenHistory = (item) => {
    setInputText(item.originalInput || '');
    setActiveResult({
      type: item.type,
      data: item.data,
      model: ollamaStatus.configuredModel,
      durationMs: null,
      originalText: item.originalInput
    });
    setIsSaved(true);
    setActiveTab('workspace');
    showToast(`Reopened saved ${item.title}`);
  };

  /**
   * Trigger demo example with live model
   */
  const handleTryDemo = (demoText) => {
    setInputText(demoText);
    setActiveTab('workspace');
    handleRunAction('organize', demoText);
  };

  const totalBoardTasks = categories.reduce((sum, c) => sum + (c.tasks?.length || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-lazy-bg selection:bg-lazy-green-light selection:text-lazy-green-dark">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-lazy-brown-deep text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl border border-lazy-brown animate-in slide-in-from-bottom-3 flex items-center gap-2">
          <span>🦥</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        status={ollamaStatus}
        onRefreshStatus={ollamaStatus.refresh}
        taskCount={totalBoardTasks}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Workspace Tab */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <Hero
              onTryExample={() => handleTryDemo("Need to revise DBMS, email the professor, buy groceries, finish README...")}
              onOpenDemo={() => setActiveTab('demo')}
            />

            <TextWorkspace
              text={inputText}
              onChangeText={setInputText}
              onRunAction={handleRunAction}
              isLoading={isLoading}
              error={error}
              ollamaStatus={ollamaStatus}
            />

            {isLoading && <LoadingSpinner />}

            {/* Active Result View */}
            {activeResult && !isLoading && (
              <div ref={resultRef}>
                <ResultCard
                  result={activeResult}
                  originalInput={inputText}
                  onSaveToHistory={handleSaveResult}
                  onSendToTaskBoard={handleSendToTaskBoard}
                  isSaved={isSaved}
                />
              </div>
            )}

            {/* Educational Section on Open-Source AI */}
            <OpenSourceAiSection />
          </div>
        )}

        {/* Task Board Tab */}
        {activeTab === 'tasks' && (
          <TaskBoard
            categories={categories}
            onToggleComplete={toggleTaskComplete}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
            onClearAllTasks={clearAllTasks}
            onOpenWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {/* Live Demo Showcase Tab */}
        {activeTab === 'demo' && (
          <DemoSection
            onTryLiveExample={handleTryDemo}
            isLoading={isLoading}
          />
        )}

        {/* Local History Tab */}
        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onReopenItem={handleReopenHistory}
            onDeleteItem={deleteResult}
            onClearHistory={clearHistory}
            onOpenWorkspace={() => setActiveTab('workspace')}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
