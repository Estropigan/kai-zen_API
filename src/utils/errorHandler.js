export const errorHandler = (res, error, statusCode = 500) => {
  console.error(error.message);
  res.status(statusCode).json({ error: error.message });
};
