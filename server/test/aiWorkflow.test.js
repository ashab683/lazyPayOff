process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/index.js';

let server;
const PORT = 3998;
const BASE_URL = `http://localhost:${PORT}`;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test('Real Gemma 3 4B Inference: POST /api/ai/organize organizes messy to-do dump', { timeout: 120000 }, async () => {
  const sampleInput = "Need to revise DBMS, email the professor about the assignment, buy groceries, finish the project README, and review tomorrow's lecture notes.";

  const res = await fetch(`${BASE_URL}/api/ai/organize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: sampleInput })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.type, 'organize');
  assert.ok(data.model.includes('gemma3:4b'));
  assert.ok(Array.isArray(data.data.categories));
  assert.ok(data.data.categories.length > 0);

  // Check categories structure
  const firstCategory = data.data.categories[0];
  assert.ok(firstCategory.name);
  assert.ok(Array.isArray(firstCategory.tasks));
  assert.ok(firstCategory.tasks.length > 0);

  const firstTask = firstCategory.tasks[0];
  assert.ok(firstTask.title);
  assert.ok(['High', 'Medium', 'Low'].includes(firstTask.priority));
  assert.ok(firstTask.nextStep);

  console.log('\n[Verified Live Gemma 3 4B Output]:');
  console.log(`Model: ${data.model} | Duration: ${(data.durationMs / 1000).toFixed(1)}s`);
  console.log(`Generated ${data.data.categories.length} categories:`, data.data.categories.map(c => `${c.name} (${c.tasks.length} tasks)`).join(', '));
});
