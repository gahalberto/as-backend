import { RequestHandler } from "express";
import { z } from "zod";
import * as people from '../services/people'
import { decryptMatch } from "../utils/match";

// Get all people in a specific group and event
export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    try {
        const items = await people.getAll({
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        });

        if (items) return res.json({ people: items });
        res.status(404).json({ error: "No people found" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching people" });
    }
}


// Get a single person by ID in a specific group and event
export const getPerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    try {
        const personItem = await people.getOne({
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        });

        if (!personItem) return res.status(404).json({ error: "Person not found" });
        return res.json({ person: personItem });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the person" });
    }
}


// Add a new person to a specific group and event
export const addPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const addPersonSchema = z.object({
        name: z.string(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    });

    const body = addPersonSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid data" });

    try {
        const newPerson = await people.add({
            ...body.data,
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        });

        if (!newPerson) return res.status(500).json({ error: "An error occurred while adding the person" });
        return res.status(201).json({ person: newPerson });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while adding the person" });
    }
}

// Update an existing person in a specific group and event
export const updatePerson: RequestHandler = async (req, res) => {
    const { id, id_group, id_event } = req.params;

    const updatePersonSchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
        matched: z.string().optional()
    });

    const body = updatePersonSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid data" });

    try {
        const updatedPerson = await people.update({
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        }, body.data);

        if (updatedPerson) {
            const personItem = await people.getOne({
                id: parseInt(id),
                id_event: parseInt(id_event),
            });
            return res.json({ person: personItem });
        }

        res.status(404).json({ error: "Person not found" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the person" });
    }
}

// Delete a person from a specific group and event
export const deletePerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    try {
        const deletedPerson = await people.remove({
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
        });

        if (!deletedPerson) return res.status(404).json({ error: "Person not found" });
        return res.json({ person: deletedPerson });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the person" });
    }
}


// Search for a person by CPF in a specific event
export const searchPerson: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const searchSchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    });

    const query = searchSchema.safeParse(req.query);
    if (!query.success) return res.status(400).json({ error: 'Invalid data' });

    try {
        const personItem = await people.getOne({
            id_event: parseInt(id_event),
            cpf: query.data.cpf
        });

        if (personItem && personItem.matched) {
            const matchedId = decryptMatch(personItem.matched);

            const personMatched = await people.getOne({
                id_event: parseInt(id_event),
                id: matchedId
            });

            if (personMatched) {
                return res.json({
                    person: {
                        id: personItem.id,
                        name: personItem.name,
                    },
                    personMatched: {
                        id: personMatched.id,
                        name: personMatched.name,
                    }
                });
            }
        }

        res.status(404).json({ error: "Person or matched person not found" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while searching for the person" });
    }
}