import { Prisma, PrismaClient } from "@prisma/client";
import * as groups from '../services/groups';

const prisma = new PrismaClient();

// Type for filtering all people by event ID and optional group ID
type GetAllFilters = { id_event: number, id_group?: number }

// Function to get all people by filters
export const getAll = async (filters: GetAllFilters) => {
    try {
        return await prisma.eventPeople.findMany({ where: filters });
    } catch (error) {
        console.error("Error fetching people:", error);
        return false;
    }
}

// Type for filtering a single person by ID, event ID, group ID, or CPF
type GetOneFilters = { id?: number, id_event: number, id_group?: number, cpf?: string }

// Function to get a single person by filters
export const getOne = async (filters: GetOneFilters) => {
    try {
        if (!filters.id && !filters.cpf) return false;
        return await prisma.eventPeople.findFirst({ where: filters });
    } catch (error) {
        console.error("Error fetching person:", error);
        return false;
    }
}

// Type for creating people data
type PeopleCreateData = Prisma.Args<typeof prisma.eventPeople, 'create'>['data'];

// Function to add a new person
export const add = async (data: PeopleCreateData) => {
    try {
        if (!data.id_group) return false;

        // Check if the group exists
        const groupItem = await groups.getOne({
            id: data.id_group,
            id_event: data.id_event
        });

        if (!groupItem) return false;

        return await prisma.eventPeople.create({ data });
    } catch (error) {
        console.error("Error adding person:", error);
        return false;
    }
}

// Type for updating people data
type PeopleUpdateData = Prisma.Args<typeof prisma.eventPeople, 'update'>['data'];
type UpdateFilters = { id?: number, id_event: number, id_group?: number }

// Function to update an existing person by filters
export const update = async (filters: UpdateFilters, data: PeopleUpdateData) => {
    try {
        return await prisma.eventPeople.updateMany({ where: filters, data });
    } catch (error) {
        console.error("Error updating person:", error);
        return false;
    }
}

// Type for deleting people by filters
type DeleteFilters = { id: number, id_event?: number, id_group?: number }

// Function to remove a person by filters
export const remove = async (filters: DeleteFilters) => {
    try {
        return await prisma.eventPeople.delete({ where: filters });
    } catch (error) {
        console.error("Error deleting person:", error);
        return false;
    }
}
