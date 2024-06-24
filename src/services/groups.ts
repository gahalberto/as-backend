import { Prisma, PrismaClient } from "@prisma/client";
import * as events from '../services/events';

const prisma = new PrismaClient();

// Function to get all groups for a specific event
export const getAll = async (id_event: number) => {
    try {
        return await prisma.eventGroup.findMany({ where: { id_event } });
    } catch (error) {
        console.error("Error fetching groups:", error);
        return false;
    }
}

// Type for filtering groups by ID and optional event ID
type GetOneFilters = { id: number, id_event?: number; }

// Function to get a single group by filters
export const getOne = async (filters: GetOneFilters) => {
    try {
        return await prisma.eventGroup.findFirst({ where: filters });
    } catch (error) {
        console.error("Error fetching group:", error);
        return false;
    }
}

// Type for creating group data
type GroupsCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data'];

// Function to add a new group
export const add = async (data: GroupsCreateData) => {
    try {
        if (!data.id_event) return false;

        // Check if the event exists
        const eventItem = await events.getOne(data.id_event);
        if (!eventItem) return false;

        return await prisma.eventGroup.create({ data });
    } catch (error) {
        console.error("Error adding group:", error);
        return false;
    }
}

// Type for updating group data
type GroupsUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data'];
type UpdateFilters = { id: number; id_event?: number; };

// Function to update an existing group
export const update = async (filters: UpdateFilters, data: GroupsUpdateData) => {
    try {
        return await prisma.eventGroup.update({ where: filters, data });
    } catch (error) {
        console.error("Error updating group:", error);
        return false;
    }
}

// Type for deleting group filters
type DeleteFilters = { id: number, id_event: number };

// Function to remove a group
export const remove = async (filters: DeleteFilters) => {
    try {
        return await prisma.eventGroup.delete({ where: filters });
    } catch (error) {
        console.error("Error deleting group:", error);
        return false;
    }
}
