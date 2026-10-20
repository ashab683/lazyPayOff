const MAX_INPUT_CHARS = parseInt(process.env.MAX_INPUT_CHARS || '8000', 10);

export function validateTextInput(req, res, next) {
  const { text } = req.body;

  if (text === undefined || text === null) {
    return res.status(400).json({
      ok: false,
      code: 'MISSING_INPUT',
      error: 'Please provide text in the request body (e.g. { "text": "..." }).'
    });
  }

  if (typeof text !== 'string') {
    return res.status(400).json({
      ok: false,
      code: 'INVALID_INPUT_TYPE',
      error: 'Input "text" must be a string.'
    });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      ok: false,
      code: 'EMPTY_INPUT',
      error: 'Input text is empty. Please provide notes, tasks, or a messy to-do list.'
    });
  }

  if (trimmed.length > MAX_INPUT_CHARS) {
    return res.status(413).json({
      ok: false,
      code: 'INPUT_TOO_LARGE',
      error: `Input text exceeds the maximum allowed length of ${MAX_INPUT_CHARS} characters (received ${trimmed.length} characters).`
    });
  }

  // Attach cleaned text to request
  req.cleanedText = trimmed;
  next();
}
