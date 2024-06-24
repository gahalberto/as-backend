import { RequestHandler } from "express";

// This is a Request Intercepter, every request to the server
// show an console.log with the ->
// Status code: 200, 201, 404, 500, etc...
// The Request Method: GET, POST, PUT, DELETE
// the Original URL: /ping /admin /site /etc...
// This is just to help the dev backend to know how is going on
// Like a debbuging

export const requestIntercepter: RequestHandler = (req, res, next) => {
    console.log(`➡️ ${res.statusCode} ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
}