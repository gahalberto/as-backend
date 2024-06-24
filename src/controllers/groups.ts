import { RequestHandler } from "express";
import * as groups from "../services/groups";
import { z } from "zod";

// Get all groups for a specific event
export const getAll: RequestHandler = async (req, res) => {
    try {
        const { id_event } = req.params;
        const items = await groups.getAll(parseInt(id_event));
        if (items) return res.json({ groups: items });

        res.status(404).json({ error: "Groups not found" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching groups" });
    }
}

// Get a single group by ID for a specific event
export const getGroup: RequestHandler = async (req, res) => {
    try {
        const { id, id_event } = req.params;
        const groupItem = await groups.getOne({
            id: parseInt(id),
            id_event: parseInt(id_event)
        });
        if (groupItem) return res.json({ group: groupItem });

        res.status(404).json({ error: "Group not found" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the group" });
    }
}

// Add a new group to a specific event
export const addGroup: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const addGroupSchema = z.object({
        name: z.string()
    });
    const body = addGroupSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid data" });

    try {
        const newGroup = await groups.add({
            ...body.data,
            id_event: parseInt(id_event)
        });
        res.status(201).json({ group: newGroup });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while adding the group" });
    }
}

// Update an existing group in a specific event
export const updateGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;
    const updateGroupSchema = z.object({
        name: z.string().optional(),
    });
    const body = updateGroupSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: "Invalid data" });

    try {
        const updatedGroup = await groups.update({
            id: parseInt(id),
            id_event: parseInt(id_event)
        }, body.data);

        if (updatedGroup) return res.status(200).json({ group: updatedGroup });
        res.status(404).json({ error: "Group not found" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the group" });
    }
}

// Delete a group from a specific event
export const deleteGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;

    try {
        const deletedGroup = await groups.remove({
            id: parseInt(id),
            id_event: parseInt(id_event)
        });

        if (deletedGroup) return res.status(200).json({ group: deletedGroup });
        res.status(404).json({ error: "Group not found" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the group" });
    }
}