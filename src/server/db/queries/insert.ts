import { db } from '../index';
import { InsertRoutine, routines, InsertFriendRequest, friends } from '../schema';

export async function createRoutine(data: InsertRoutine) {
    await db.insert(routines).values(data);
}

export async function createFriendRequest(data: InsertFriendRequest) {
    console.log("Data: ", data);
    await db.insert(friends).values(data);
}