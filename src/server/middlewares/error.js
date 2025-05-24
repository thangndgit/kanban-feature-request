export const globalErrorHandler = (err, req, res, next) => {
  const status = err.status || 'INTERNAL_SERVER_ERROR';
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  console.log('RAW ERROR: ', err);
  console.log('READABLE ERROR: ', JSON.stringify(err?.response?.data, null, 2));

  res.status(statusCode).json({
    error: { status, statusCode },
    message,
  });

  next(req, res, next);
};

