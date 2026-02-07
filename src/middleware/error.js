function notFound(req, res, next) {
  res.status(404);
  next(new Error(`not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  const message = err?.message || "server error";

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err?.stack } : {}),
  });
}

module.exports = { notFound, errorHandler };
