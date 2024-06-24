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
type EventsCreateData = Prisma.Args<typeof prisma.event, 'create'>['data'];

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
type EventsUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data'];

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
    // Retrieve the event with the specified ID and check if it is grouped
    const eventItem = await prisma.event.findFirst({ where: { id }, select: { grouped: true } });

    if (eventItem) {
        // Get the list of people for the event
        const peopleList = await people.getAll({ id_event: id });
        if (peopleList && peopleList.length > 1) {
            let sortedList: { id: number, match: number }[] = [];
            let attempts = 0;
            const maxAttempts = peopleList.length;

            // Try matching until successful or max attempts reached
            while (attempts < maxAttempts) {
                attempts++;
                sortedList = [];
                let sortable = peopleList.map(item => item.id);
                let keepTrying = false;

                for (const person of peopleList) {
                    let sortableFiltered = sortable;
                    if (eventItem.grouped) {
                        // Filter out people from the same group
                        sortableFiltered = sortable.filter(sortableItem => {
                            const sortablePerson = peopleList.find(item => item.id === sortableItem);
                            return person.id_group !== sortablePerson?.id_group;
                        });
                    }

                    // Check if matching is possible
                    if (sortableFiltered.length === 0 || (sortableFiltered.length === 1 && person.id === sortableFiltered[0])) {
                        keepTrying = true;
                        break;
                    } else {
                        // Randomly select a match
                        let sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                        while (sortableFiltered[sortedIndex] === person.id) {
                            sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                        }

                        sortedList.push({ id: person.id, match: sortableFiltered[sortedIndex] });
                        sortable = sortable.filter(item => item !== sortableFiltered[sortedIndex]);
                    }
                }

                // Break loop if matching was successful
                if (!keepTrying) break;
            }

            console.log(`ATTEMPTS: ${attempts}`);
            console.log(`MAX ATTEMPTS: ${maxAttempts}`);
            console.log(sortedList);

            // If matching was successful, update people with their matches
            if (attempts < maxAttempts) {
                for (const match of sortedList) {
                    await people.update(
                        { id: match.id, id_event: id },
                        { matched: encryptMatch(match.match) }
                    );
                }
                return true;
            }
        }
    }

    // Return false if matching was not successful
    return false;
}
