import { RequestHandler } from "express";
import * as events from '../services/events';
import * as people from '../services/people';
import { z } from "zod";

// Get all events
export const getAll: RequestHandler = async (req, res) => {
    const items = await events.getAll();
    if (!items) return res.json({ error: `An error occurred` });

    res.json({ events: items });
}

// Get a single event by ID
export const getEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const item = await events.getOne(parseInt(id));
    if (!item) return res.json({ error: `An error occurred` });
    res.json({ event: item });
}

// Add a new event
export const addEvent: RequestHandler = async (req, res) => {
    // Define schema for request body validation
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    });

    // Validate request body against schema
    const body = addEventSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Invalid data' });

    // Add new event
    const newEvent = await events.add(body.data);
    if (newEvent) return res.status(201).json({ event: newEvent });

    res.json({ error: 'An error occurred' });
}

// Update an existing event
export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    // Define schema for request body validation
    const updateEventSchema = z.object({
        title: z.string().optional(),
        status: z.boolean().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    });

    // Validate request body against schema
    const body = updateEventSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Invalid data' });

    // Update event
    const updatedEvent = await events.update(parseInt(id), body.data);
    if (!updatedEvent) return res.json({ error: 'An error occurred' });

    // Handle event status
    if (updatedEvent.status) {
        const result = await events.doMatches(parseInt(id));
        if (!result) return res.json({ error: "Impossible to create groups" });
    } else {
        await people.update({ id_event: parseInt(id) }, { matched: '' });
    }
    res.json({ event: updatedEvent });
}

// Delete an event
export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    // Remove event
    const deletedEvent = await events.remove(parseInt(id));
    if (!deletedEvent) return res.json({ error: 'An error occurred' });

    res.json({ event: deletedEvent });
}
