import { Router } from 'express';
import * as events from '../controllers/events';
import * as people from '../controllers/people';

const router = Router();

// Health check route
router.get('/ping', (req, res) => res.json({ pong: true }));

// Event routes
// Get a specific event by ID
router.get('/events/:id', events.getEvent);

// Search for a person in a specific event
router.get('/events/:id_event/search', people.searchPerson);

export default router;
