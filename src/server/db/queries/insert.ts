import { db } from '../index';
import { InsertRoutine, routines, InsertFriendRequest, friendRequests } from '../schema';

export async function createRoutine(data: InsertRoutine) {
    await db.insert(routines).values(data);
}

export async function createFriendRequest(data: InsertFriendRequest) {
    console.log("Data: ", data);
    await db.insert(friendRequests).values(data);
}