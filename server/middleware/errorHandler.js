/**
 * Global Error Handling Middleware
 * Catch-all for unhandled errors in API routes.
 */
const errorHandler = (err, req, res, next) => {
    // Log error details (in a real app, you might use Winston or send to Sentry)
    console.error(`[Error] ${err.name}: ${err.message}`);
    
    // In development mode, we can log the full stack trace for debugging
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }
  
    // Determine status code (default to 500 Internal Server Error)
    const statusCode = err.statusCode || 500;
  
    // Send standardized JSON response instead of a raw HTML stack trace
    res.status(statusCode).json({
        success: false,
        error: {
            name: err.name || 'ServerError',
            message: err.message || 'An unexpected error occurred.',
            // Only expose detailed stack trace in development
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        }
    });
};
  
module.exports = errorHandler;
