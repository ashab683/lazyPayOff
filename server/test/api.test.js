process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/index.js';

let server;
const PORT = 3999;
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

test('GET /api/health returns 200 and healthy status', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.status, 'healthy');
  assert.ok(typeof data.uptimeSeconds === 'number');
});

test('GET /api/ai/status returns Ollama connection status and gemma3:4b', async () => {
  const res = await fetch(`${BASE_URL}/api/ai/status`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.reachable, true);
  assert.equal(data.configuredModel, 'gemma3:4b');
  assert.equal(data.modelAvailable, true);
});

test('POST /api/ai/summarize rejects empty input', async () => {
  const res = await fetch(`${BASE_URL}/api/ai/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '   ' })
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.equal(data.code, 'EMPTY_INPUT');
});

test('POST /api/ai/summarize rejects missing text property', async () => {
  const res = await fetch(`${BASE_URL}/api/ai/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.equal(data.code, 'MISSING_INPUT');
});

test('POST /api/ai/summarize rejects oversized text > 8000 chars', async () => {
  const hugeText = 'a'.repeat(8001);
  const res = await fetch(`${BASE_URL}/api/ai/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: hugeText })
  });
  assert.equal(res.status, 413);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.equal(data.code, 'INPUT_TOO_LARGE');
});
