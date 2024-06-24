import { RequestHandler } from "express";
import { z } from "zod";
import * as auth from '../services/auth';

// Login handler
export const login: RequestHandler = (req, res) => {
    // Define schema for request body validation
    const loginSchema = z.object({
        password: z.string()
    });
    
    // Validate request body against schema
    const body = loginSchema.safeParse(req.body);

    // If validation fails, return 400 Bad Request with error details
    if (!body.success) return res.status(400).json({ error: body.error.errors });
    
    // Validate password & generate token
    if (!auth.validatePassword(body.data.password)) return res.status(403).json({ error: 'Access denied' });
        
    // If validation succeeds, return token
    return res.json({ token: auth.createToken() });
}

// Middleware to validate token
export const validate: RequestHandler = (req, res, next) => {
    // Check for authorization header
    if (!req.headers.authorization) return res.status(403).json({ error: 'Access denied' });
    
    // Extract token from authorization header
    const token = req.headers.authorization.split(' ')[1];
    
    // Validate token
    if (!auth.validateToken(token)) return res.status(403).json({ error: 'Access denied' });

    // Proceed to next middleware/route handler if validation succeeds
    next();
}
