export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || (err.code === 'INPUT_TOO_LARGE' ? 413 : 500);

  res.status(statusCode).json({
    ok: false,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    error: err.message || 'An unexpected error occurred.',
    details: err.details || null
  });
}
