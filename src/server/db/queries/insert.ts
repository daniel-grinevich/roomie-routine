import { db } from '../index';
import { InsertRoutine, routines } from '../schema';

export async function createRoutine(data: InsertRoutine) {
    await db.insert(routines).values(data)
}