import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  HISTORY: 'the_lazy_payoff_history_v1',
  TASKS: 'the_lazy_payoff_tasks_v1'
};

export function useLocalHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e);
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Save tasks on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [categories]);

  /**
   * Save a result card to history
   */
  const saveResult = useCallback((item) => {
    const newItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type: item.type, // 'summary' | 'organize' | 'actions' | 'checklist' | 'simplify'
      title: item.title || 'Saved Result',
      preview: item.preview || '',
      originalInput: item.originalInput || '',
      data: item.data
    };

    setHistory((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  /**
   * Delete an item from history
   */
  const deleteResult = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history from localStorage', e);
    }
  }, []);

  /**
   * Replace or merge organized categories into active task board
   */
  const loadTasksIntoBoard = useCallback((newCategories, replace = false) => {
    if (replace || categories.length === 0) {
      setCategories(newCategories);
      return;
    }

    // Merge by category name
    setCategories((prev) => {
      const merged = [...prev];
      for (const newCat of newCategories) {
        const existingCat = merged.find((c) => c.name.toLowerCase() === newCat.name.toLowerCase());
        if (existingCat) {
          // Append non-duplicate tasks
          const existingTitles = new Set(existingCat.tasks.map((t) => t.title.toLowerCase()));
          const newTasks = newCat.tasks.filter((t) => !existingTitles.has(t.title.toLowerCase()));
          existingCat.tasks = [...existingCat.tasks, ...newTasks];
        } else {
          merged.push(newCat);
        }
      }
      return [...merged];
    });
  }, [categories.length]);

  /**
   * Toggle task completion status
   */
  const toggleTaskComplete = useCallback((taskId) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        tasks: cat.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    );
  }, []);

  /**
   * Delete a single task
   */
  const deleteTask = useCallback((taskId) => {
    setCategories((prev) =>
      prev
        .map((cat) => ({
          ...cat,
          tasks: cat.tasks.filter((task) => task.id !== taskId)
        }))
        .filter((cat) => cat.tasks.length > 0)
    );
  }, []);

  /**
   * Add a new custom task manually
   */
  const addTask = useCallback((categoryName, taskData) => {
    const newTask = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: taskData.title || 'New Task',
      priority: taskData.priority || 'Medium',
      nextStep: taskData.nextStep || 'Start step 1.',
      completed: false
    };

    setCategories((prev) => {
      const catIndex = prev.findIndex((c) => c.name.toLowerCase() === categoryName.toLowerCase());
      if (catIndex >= 0) {
        const updated = [...prev];
        updated[catIndex] = {
          ...updated[catIndex],
          tasks: [newTask, ...updated[catIndex].tasks]
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            name: categoryName,
            tasks: [newTask]
          }
        ];
      }
    });
  }, []);

  /**
   * Clear all active board tasks
   */
  const clearAllTasks = useCallback(() => {
    setCategories([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
    } catch (e) {
      console.error('Failed to clear tasks from localStorage', e);
    }
  }, []);

  return {
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
  };
}
