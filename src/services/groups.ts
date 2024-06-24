import { Prisma, PrismaClient } from "@prisma/client";
import * as events from '../services/events';

const prisma = new PrismaClient();

export const getAll = async (id_event:number) => {
    try {
        return await prisma.eventGroup.findMany({where: { id_event }});
    } catch (error) { return false }
}

type GetOneFilters = {id: number, id_event?: number; }
export const getOne = async (filters: GetOneFilters) => {
    try {
        return await prisma.eventGroup.findFirst({where: filters});
    } catch (error) { return false }
}

type GroupsCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data'];
export const add = async (data:GroupsCreateData) => {
    try {
        if(!data.id_event) return false;
        
        const eventItem = await events.getOne(data.id_event);
        if(!eventItem) return false;

        return await prisma.eventGroup.create({ data });
    } catch (error) { return false }
}

type GroupsUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data'];
type updateFilters = { id: number; id_event?: number; };
export const update = async (filters: updateFilters, data:GroupsUpdateData ) => {
    try {
          return await prisma.eventGroup.update({where: filters, data});
    } catch (error) { return false }
}

type deleteFilters = {id: number, id_event: number};
export const remove = async (filters:deleteFilters) => {
    try {
        return await prisma.eventGroup.delete({where: filters});
    } catch (error) { return false }
}