import { createRoutine } from '@/server/db/queries/insert';
import { NextResponse } from 'next/server';
import { getAllRoutines, getRoutineById } from '@/server/db/queries/select';
import { routines, users } from '@/db/schema';
import { db } from '@/server/db';
import { start } from 'repl';

export async function POST(request: Request) {
  try {
      const data = await request.json();

      let startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Insert the new routine using the fake user's ID
      await db.insert(routines).values({
          name: data.name,
          description: data.description,
          intervalValue: data.intervalValue,
          intervalUnit: data.intervalUnit,
          createdAt: new Date(),
          resetAt: startOfDay,
          lastToDoIt: 1, // Using the ID of the newly created fake user
          assignedTo: 1, // Using the ID of the newly created fake user
      });

      return NextResponse.json({ message: 'Routine created successfully!' });
  } catch (error) {
      console.error('Error creating routine:', error);
      return NextResponse.json({ error: 'Failed to create routine' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams; 
  const routineId = params.get('routineId');

  try {
    if (routineId) {
      const routine = await getRoutineById(parseInt(routineId)); // Fetch the routine with the given ID
      return NextResponse.json(routine, { status: 200 }); // Return the routine as a JSON response
    } else {
      const routines = await getAllRoutines(); // Fetch all routines using the function
      return NextResponse.json(routines, { status: 200 }); // Return the routines as a JSON response
    }
  } catch (error) {
    console.error('Error fetching routines:', error);
    return NextResponse.json({ error: 'Failed to fetch routines' }, { status: 500 });
  }
}