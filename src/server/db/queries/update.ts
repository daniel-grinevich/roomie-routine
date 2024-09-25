import { db } from '../index';
import { routines, SelectRoutine } from '../schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function updateRoutine(id: SelectRoutine['id'], data: Partial<Omit<SelectRoutine, 'id'>>) {
  // Log the incoming data
  console.log("Updating routine with ID:", id);
  console.log("Data being updated:", data);

  // Validate and convert date fields as necessary
  if (data.createdAt && !(data.createdAt instanceof Date)) {
    console.log("Invalid date format for createdAt, converting:", data.createdAt);
    data.createdAt = new Date(data.createdAt);
  }

  if (data.resetAt && !(data.resetAt instanceof Date)) {
    console.log("Invalid date format for createdAt, converting:", data.resetAt);
    data.resetAt = new Date(data.resetAt);
  }

  data.createdAt?.toISOString().slice(0, 10)
  data.resetAt?.toISOString().slice(0, 10)

  try {
    const updatedRoutine = await db.update(routines).set(data).where(eq(routines.id, id)).returning();
    console.log("updated routine: ", updatedRoutine[0]);
    return updatedRoutine
    
  } catch (error) {
    console.log('Error in updateRoutine:', error);
  }
}


