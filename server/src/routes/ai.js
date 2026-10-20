import express from 'express';
import { checkOllamaStatus, callOllamaJson } from '../services/ollama.js';
import { validateTextInput } from '../middleware/validate.js';
import { summarizePrompt } from '../prompts/summarize.js';
import { organizePrompt } from '../prompts/organize.js';
import { extractActionsPrompt } from '../prompts/extractActions.js';
import { checklistPrompt } from '../prompts/checklist.js';
import { simplifyPrompt } from '../prompts/simplify.js';

const router = express.Router();

/**
 * GET /api/ai/status
 * Returns Ollama connectivity and model installation status.
 */
router.get('/status', async (req, res, next) => {
  try {
    const status = await checkOllamaStatus();
    res.json({
      ok: true,
      ...status
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/summarize
 * Summarizes text into short bullet points and executive summary.
 */
router.post('/summarize', validateTextInput, async (req, res, next) => {
  try {
    const prompt = summarizePrompt(req.cleanedText);
    const result = await callOllamaJson(prompt);
    res.json({
      ok: true,
      type: 'summary',
      model: result.model,
      durationMs: result.totalDurationMs,
      data: result.data
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/organize
 * Organizes messy to-do lists/brain dumps into categorized tasks with next steps.
 */
router.post('/organize', validateTextInput, async (req, res, next) => {
  try {
    const prompt = organizePrompt(req.cleanedText);
    const result = await callOllamaJson(prompt);

    // Normalize task IDs and structure if needed
    const categories = (result.data.categories || []).map((cat, catIdx) => ({
      name: cat.name || 'General',
      tasks: (cat.tasks || []).map((task, taskIdx) => ({
        id: task.id || `task-${catIdx + 1}-${taskIdx + 1}-${Date.now().toString(36)}`,
        title: task.title || task.text || 'Untitled Task',
        priority: ['High', 'Medium', 'Low'].includes(task.priority) ? task.priority : 'Medium',
        nextStep: task.nextStep || 'Review task details and begin.',
        completed: Boolean(task.completed)
      }))
    }));

    res.json({
      ok: true,
      type: 'organize',
      model: result.model,
      durationMs: result.totalDurationMs,
      data: {
        categories,
        totalTasks: categories.reduce((acc, cat) => acc + cat.tasks.length, 0)
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/extract-actions
 * Extracts tasks, deadlines, and responsibilities.
 */
router.post('/extract-actions', validateTextInput, async (req, res, next) => {
  try {
    const prompt = extractActionsPrompt(req.cleanedText);
    const result = await callOllamaJson(prompt);

    const actionItems = (result.data.actionItems || []).map((item, idx) => ({
      id: `action-${idx + 1}`,
      task: item.task || 'Action item',
      deadline: item.deadline && item.deadline !== 'null' ? item.deadline : null,
      priority: ['High', 'Medium', 'Low'].includes(item.priority) ? item.priority : 'Medium',
      context: item.context || null
    }));

    res.json({
      ok: true,
      type: 'actions',
      model: result.model,
      durationMs: result.totalDurationMs,
      data: {
        actionItems,
        totalActions: actionItems.length
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/checklist
 * Creates a sequential numbered checklist from notes.
 */
router.post('/checklist', validateTextInput, async (req, res, next) => {
  try {
    const prompt = checklistPrompt(req.cleanedText);
    const result = await callOllamaJson(prompt);

    const checklist = (result.data.checklist || []).map((item, idx) => ({
      step: item.step || idx + 1,
      text: item.text || item.title || 'Checklist item',
      tip: item.tip || null,
      done: false
    }));

    res.json({
      ok: true,
      type: 'checklist',
      model: result.model,
      durationMs: result.totalDurationMs,
      data: {
        title: result.data.title || 'Checklist',
        checklist
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/simplify
 * Rewrites text into concise, plain language ("Make this easier").
 */
router.post('/simplify', validateTextInput, async (req, res, next) => {
  try {
    const prompt = simplifyPrompt(req.cleanedText);
    const result = await callOllamaJson(prompt);

    res.json({
      ok: true,
      type: 'simplify',
      model: result.model,
      durationMs: result.totalDurationMs,
      data: {
        simplifiedText: result.data.simplifiedText || '',
        keyTakeaways: result.data.keyTakeaways || []
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
