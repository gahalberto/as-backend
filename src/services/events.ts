import { PrismaClient, Prisma } from "@prisma/client";
import * as people from "../services/people";
import * as group from "../services/groups";
import { encryptMatch } from "../utils/match";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Function to get all events
export const getAll = async () => {
    try {
        // Retrieve all events
        return await prisma.event.findMany();
    } catch (error) {
        // Return false if an error occurs
        console.error("Error fetching events:", error);
        return false;
    }
}

// Function to get a single event by ID
export const getOne = async (id: number) => {
    try {
        // Retrieve event with the specified ID
        return await prisma.event.findFirst({ where: { id } });
    } catch (error) {
        // Return false if an error occurs
        console.error("Error fetching event:", error);
        return false;
    }
}

// Type for creating events data
type EventsCreateData = Prisma.EventCreateInput;

// Function to add a new event
export const add = async (data: EventsCreateData) => {
    try {
        // Create a new event with the provided data
        return await prisma.event.create({ data });
    } catch (error) {
        // Return false if an error occurs
        console.error("Error adding event:", error);
        return false;
    }
}

// Type for updating events data
type EventsUpdateData = Prisma.EventUpdateInput;

// Function to update an existing event by ID
export const update = async (id: number, data: EventsUpdateData) => {
    try {
        // Update event with the specified ID and data
        return await prisma.event.update({ where: { id }, data });
    } catch (error) {
        // Return false if an error occurs
        console.error("Error updating event:", error);
        return false;
    }
}

// Function to remove an event by ID
export const remove = async (id: number) => {
    try {
        // Delete event with the specified ID
        return await prisma.event.delete({ where: { id } });
    } catch (error) {
        // Return false if an error occurs
        console.error("Error deleting event:", error);
        return false;
    }
}

// Function to perform matching for an event
export const doMatches = async (id: number): Promise<boolean> => {
    const eventItem = await prisma.event.findFirst({ where: { id }, select: { grouped: true } });

    if (!eventItem) return false;

    const peopleList = await people.getAll({ id_event: id });
    console.log(peopleList);
    if (!peopleList || peopleList.length === 0) return false;

    const sortedList: { id: number, match: number }[] = [];
    const maxAttempts = peopleList.length * 2; // Aumentar tentativas para assegurar pareamento

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
        sortedList.length = 0; // Limpar a lista de pareamentos para cada tentativa
        let sortable = peopleList.map(item => item.id);
        let keepTrying = false;

        for (let i = 0; i < peopleList.length; i++) {
            let sortableFiltered = sortable.filter(sortableItem => {
                const sortablePerson = peopleList.find(item => item.id === sortableItem);
                return peopleList[i].id_group !== sortablePerson?.id_group;
            });

            if (sortableFiltered.length === 0) {
                keepTrying = true;
                break;
            }

            const sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
            const matchId = sortableFiltered[sortedIndex];

            sortedList.push({ id: peopleList[i].id, match: matchId });
            sortable = sortable.filter(item => item !== matchId);
        }

        if (!keepTrying && sortedList.length === peopleList.length) {
            console.log(`Successful match after ${attempts + 1} attempts:`, sortedList);
            for (let i = 0; i < sortedList.length; i++) {
                await people.update({
                    id: sortedList[i].id,
                    id_event: id
                },
                { matched: encryptMatch(sortedList[i].match) });
            }
            return true;
        }
    }

    console.log('Failed to find a valid match after max attempts');
    return false;
}
