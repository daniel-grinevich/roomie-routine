
import { asc, between, count, eq, and,or, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectRoutine, routines, users, SelectUser, SelectGroup, routineGroups, groupUsers, friendships, friendRequests, SelectFriendRequest, groupsToRoutines} from '../schema';
import { NextResponse } from 'next/server';


export async function getAllRoutines(): Promise<SelectRoutine[]> {

  try {
    // Query the 'routines' table using Drizzle ORM's query builder
    const result = await db.select().from(routines).orderBy(routines.resetAt);
    return result;
  } catch (error) {
    console.error('Error fetching routines:', error);
    throw error; // Rethrow the error for handling elsewhere
  }
}

export async function getRoutinesByUser(userId:string): Promise<SelectRoutine[]> {
  try {
    const result = await db.select().from(routines).where(eq(routines.createdBy, userId));
    return result;
  } catch (error) {
    console.error('Error fetching routines by user: ', error);
    throw error;
  }
}

export async function getRoutinesByGroup(groupId:number, groupName:string): Promise<SelectRoutine[]> {
  try {
    const result = await db
      .select({
        id: routines.id,
        name: routines.name,
        description: routines.description,
        intervalValue: routines.intervalValue,
        intervalUnit: routines.intervalUnit,
        createdAt: routines.createdAt,
        resetAt: routines.resetAt,
        lastToDoIt: routines.lastToDoIt,
        assignedTo: routines.assignedTo,
        createdBy: routines.createdBy,
      })
      .from(routineGroups)
      .innerJoin(groupsToRoutines, eq(groupsToRoutines.groupId, routineGroups.id))
      .innerJoin(routines, eq(groupsToRoutines.routineId, routines.id))
      .where(and(eq(routineGroups.id, groupId), eq(routineGroups.name, groupName)));

      return result;

  } catch (error) {
    console.error('Error fetching routines by group: ', error);
    throw error;
  }
}

export async function getUserByEmailName(email:string, name:string): Promise<SelectUser[]> {
  try {
    const result = await db.select().from(users).where(and(eq(users.email,email), eq(users.name,name)));
    return result;
  }
  catch (error) {
    console.error("Error when fetching user:", error);
    throw error;
  }
}

export async function getUsersFriendsList(userId: string): Promise<SelectUser[]> {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
      })
      .from(friendships)
      .innerJoin(
        users,
        or(
          and(eq(friendships.userOne, userId), eq(users.id, friendships.userTwo)),
          and(eq(friendships.userTwo, userId), eq(users.id, friendships.userOne))
        )
      )
      .where(
        and(
          eq(friendships.status, 'active'),
          or(eq(friendships.userOne, userId), eq(friendships.userTwo, userId))
        )
      );

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserGroups(userId: string): Promise<SelectGroup[]> {
  try {
    const userCreatedGroups = await db
      .select()
      .from(routineGroups)
      .where(eq(routineGroups.createdBy, userId));

    const userAddedGroups = await db
      .select({id: routineGroups.id, name: routineGroups.name, createdBy: routineGroups.createdBy })
      .from(groupUsers)
      .innerJoin(routineGroups, eq(groupUsers.groupId, routineGroups.id))
      .where(eq(groupUsers.userId, userId));

    const allGroups: Array<SelectGroup> = [...userCreatedGroups, ...userAddedGroups];

    return allGroups;


  }catch (error) {
    console.error("Error when fetching user's groups", error);
    throw error;
  }
}

export async function getUsersPendingFriendRequests(userId: string): Promise<SelectFriendRequest[]> {
  let res: Array<SelectFriendRequest> = [];

  try {
    res = await db
      .select()
      .from(friendRequests)
      .where(
        and(
          eq(friendRequests.status, 'pending'),
          or(eq(friendRequests.sender, userId), eq(friendRequests.recipient, userId))
        )
      );
  }
  catch(error) {
    console.error("Error when fetching pending friend requests", error);
    throw error;
  }
  return res;
}
