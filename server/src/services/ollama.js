import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:4b';
const REQUEST_TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS || '120000', 10);

/**
 * Checks connection to Ollama and verifies if the target model is installed.
 */
export async function checkOllamaStatus() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        reachable: false,
        error: `Ollama returned HTTP ${res.status}: ${res.statusText}`,
        baseUrl: OLLAMA_BASE_URL,
        configuredModel: OLLAMA_MODEL,
        modelAvailable: false,
        availableModels: []
      };
    }

    const data = await res.json();
    const availableModels = (data.models || []).map((m) => m.name);
    // Support matching both "gemma3:4b" and "gemma3:4b-..." or tags
    const modelAvailable = availableModels.some(
      (name) => name === OLLAMA_MODEL || name.startsWith(`${OLLAMA_MODEL}:`) || name.startsWith(OLLAMA_MODEL)
    );

    return {
      reachable: true,
      baseUrl: OLLAMA_BASE_URL,
      configuredModel: OLLAMA_MODEL,
      modelAvailable,
      availableModels,
      setupInstruction: !modelAvailable ? `Run: ollama pull ${OLLAMA_MODEL}` : null
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      reachable: false,
      error: err.name === 'AbortError' ? 'Connection timed out to Ollama' : err.message,
      baseUrl: OLLAMA_BASE_URL,
      configuredModel: OLLAMA_MODEL,
      modelAvailable: false,
      availableModels: [],
      setupInstruction: 'Make sure Ollama is installed and running (`ollama serve`).'
    };
  }
}

/**
 * Calls Ollama API to run prompt through configured model.
 * Enforces JSON mode, handles timeouts, and parses structured output.
 */
export async function callOllamaJson(prompt) {
  // First verify Ollama status
  const status = await checkOllamaStatus();
  if (!status.reachable) {
    const err = new Error(
      `Ollama is not running at ${OLLAMA_BASE_URL}. Please start Ollama with 'ollama serve'.`
    );
    err.code = 'OLLAMA_UNREACHABLE';
    err.details = status;
    throw err;
  }

  if (!status.modelAvailable) {
    const err = new Error(
      `Model "${OLLAMA_MODEL}" is not installed. Please pull it by running: ollama pull ${OLLAMA_MODEL}`
    );
    err.code = 'MODEL_NOT_FOUND';
    err.details = status;
    throw err;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false,
        format: 'json',
        options: {
          temperature: 0.2 // Low temperature for high consistency and factual adherence
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      const err = new Error(`Ollama API error (${response.status}): ${errorText}`);
      err.code = 'OLLAMA_API_ERROR';
      throw err;
    }

    const data = await response.json();
    const rawContent = data?.message?.content || '';

    if (!rawContent.trim()) {
      const err = new Error('Model returned an empty response.');
      err.code = 'EMPTY_RESPONSE';
      throw err;
    }

    // Parse JSON safely
    const parsed = cleanAndParseJson(rawContent);
    return {
      data: parsed,
      model: data.model || OLLAMA_MODEL,
      totalDurationMs: data.total_duration ? Math.round(data.total_duration / 1e6) : null
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(
        `Ollama request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds. The model may be running slowly on local hardware.`
      );
      timeoutErr.code = 'TIMEOUT';
      throw timeoutErr;
    }
    throw err;
  }
}

/**
 * Robust JSON extraction from model string
 */
function cleanAndParseJson(str) {
  let cleaned = str.trim();

  // Strip markdown code fences if present: ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Attempt to locate first { and last } or first [ and last ]
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sub = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(sub);
    }
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const sub = cleaned.substring(firstBracket, lastBracket + 1);
      return JSON.parse(sub);
    }
    throw new Error(`Failed to parse structured model response as JSON: ${e.message}`);
  }
}
