import { createRoutine } from '@/db/queries/insert';
import { NextResponse } from 'next/server';
import { getAllRoutines } from '@/db/queries/select';
import { routines, users } from '@/db/schema';
import { db } from '@/db';

export async function POST(request: Request) {
  try {
      const data = await request.json();

      // Create a fake user for demonstration purposes
      const fakeUser = await db.insert(users).values({
          name: 'Dandelion',
          email: 'dandelion@example.com',
      }).returning();

      // Insert the new routine using the fake user's ID
      await db.insert(routines).values({
          name: data.name,
          description: data.description,
          intervalValue: data.intervalValue,
          intervalUnit: data.intervalUnit,
          createdAt: new Date(),
          lastToDoIt: fakeUser[0].id, // Using the ID of the newly created fake user
          assignedTo: fakeUser[0].id, // Using the ID of the newly created fake user
      });

      return NextResponse.json({ message: 'Routine created successfully!' });
  } catch (error) {
      console.error('Error creating routine:', error);
      return NextResponse.json({ error: 'Failed to create routine' }, { status: 500 });
  }
}
export async function GET() {
  try {
    const routines = await getAllRoutines(); // Fetch all routines using the function
    return NextResponse.json(routines, { status: 200 }); // Return the routines as a JSON response
  } catch (error) {
    console.error('Error fetching routines:', error);
    return NextResponse.json({ error: 'Failed to fetch routines' }, { status: 500 });
  }
}