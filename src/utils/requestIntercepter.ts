import { RequestHandler } from "express";

// This is a Request Interceptor. Every request to the server
// logs the following details to the console:
// - Status code: 200, 201, 404, 500, etc.
// - Request Method: GET, POST, PUT, DELETE
// - Original URL: /ping, /admin, /site, etc.
// This helps the backend developer to understand the traffic
// and behavior of the application, useful for debugging.

export const requestIntercepter: RequestHandler = (req, res, next) => {
    // Log request details
    console.log(`➡️ ${res.statusCode} ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
}
